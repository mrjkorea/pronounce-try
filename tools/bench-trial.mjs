#!/usr/bin/env node
/**
 * Headless Chrome benchmark: Citrinet-only checker.
 * Uses __mrjPronounceBench (WAV fetch) and a fake-mic capture path.
 * Run from repo root: node tools/bench-trial.mjs
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { bootCorePaths } from '../src/trial.js';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wavDir = join(root, 'test', 'bench-wavs');
const TARGET = 'It is here.';
const CHECK_SENTENCE = TARGET;

const CLIPS = [
  { id: 'correct', file: 'correct-it-is-here.wav', target: TARGET },
  { id: 'wrong', file: 'wrong-what-time.wav', target: TARGET },
  { id: 'silence', file: 'silence.wav', target: TARGET },
  { id: 'mumbled', file: 'mumbled-it-is-here.wav', target: TARGET },
];

async function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: opts.quiet ? 'pipe' : 'inherit', ...opts });
    let out = '';
    if (opts.quiet) p.stdout?.on('data', (d) => { out += d; });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error(`${cmd} exit ${code}`))));
  });
}

async function ensureWavs() {
  await mkdir(wavDir, { recursive: true });
  const jobs = [
    ['ffmpeg', ['-y', '-i', join(root, 'audio/hear/it-is-here.mp3'), '-ar', '16000', '-ac', '1', join(wavDir, 'correct-it-is-here.wav')]],
    ['ffmpeg', ['-y', '-f', 'lavfi', '-i', 'flite=text=\'What time is it\':voice=slt', '-ar', '16000', '-ac', '1', join(wavDir, 'wrong-what-time.wav')]],
    ['ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=16000:cl=mono', '-t', '2', join(wavDir, 'silence.wav')]],
    ['ffmpeg', ['-y', '-i', join(wavDir, 'correct-it-is-here.wav'), '-af', 'volume=0.12,lowpass=f=450,highpass=f=180', join(wavDir, 'mumbled-it-is-here.wav')]],
  ];
  for (const [, args] of jobs) {
    const out = args[args.length - 1];
    try {
      await stat(out);
    } catch {
      await run('ffmpeg', args, { quiet: true });
    }
  }
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const pathOnly = req.url.split('?')[0];
      const rel = pathOnly === '/' ? '/index.html' : pathOnly;
      const file = join(root, decodeURIComponent(rel));
      readFile(file).then((buf) => {
        const base = file.split('/').pop() || '';
        const ext = base.includes('.') ? base.split('.').pop() : '';
        const types = {
          html: 'text/html',
          js: 'text/javascript',
          mjs: 'text/javascript',
          css: 'text/css',
          json: 'application/json',
          onnx: 'application/octet-stream',
          wasm: 'application/wasm',
          wav: 'audio/wav',
          mp3: 'audio/mpeg',
          txt: 'text/plain',
        };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(buf);
      }).catch(() => {
        res.writeHead(404);
        res.end('not found');
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, url: `http://127.0.0.1:${port}/` });
    });
  });
}

async function diskBytesForBoot() {
  const paths = bootCorePaths();
  const extras = [
    'vendor/ort/ort.wasm.min.js',
    'vendor/ort/ort-wasm-simd-threaded.asyncify.mjs',
    'vendor/ort/ort-wasm-simd-threaded.asyncify.wasm',
  ];
  let sum = 0;
  for (const rel of [...new Set(paths.concat(extras))]) {
    try {
      const st = await stat(join(root, rel));
      sum += st.size;
    } catch (_) {}
  }
  return sum;
}

function trackablePath(url) {
  const u = String(url);
  return u.includes('/models/') || u.includes('/vendor/ort/');
}

async function benchMode(baseUrl) {
  const fakeWav = join(wavDir, 'correct-it-is-here.wav');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      `--use-file-for-fake-audio-capture=${fakeWav}`,
    ],
  });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.MRJ_AUTH = {
      student: () => ({ id: 'zz_test_bench', email: 'zz_test_bench@example.com' }),
      noteScore: () => {},
    };
    document.body.classList.remove('auth-wait');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(300000);
  const bytesByUrl = new Map();
  let bootBytes = 0;
  page.on('response', async (res) => {
    const url = res.url();
    if (!trackablePath(url)) return;
    try {
      const body = await res.body();
      const prev = bytesByUrl.get(url) || 0;
      if (prev === 0) bootBytes += body.length;
      bytesByUrl.set(url, prev + body.length);
    } catch (_) {}
  });
  const t0 = Date.now();
  await page.goto(`${baseUrl}?bench=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mrjPronounceBench && document.getElementById('modelLabel')?.classList.contains('done'), {
    timeout: 300000,
  });
  const readyMs = Date.now() - t0;
  const boot = await page.evaluate(() => window.__mrjTrialBoot());

  const checkTimes = [];
  const correctUrl = `${baseUrl}test/bench-wavs/correct-it-is-here.wav`;
  for (let i = 0; i < 3; i++) {
    const ms = await page.evaluate(async ({ url, sentence }) => {
      const blob = await fetch(url).then((r) => r.blob());
      const t = performance.now();
      await window.__mrjPronounceBench(blob, sentence);
      return performance.now() - t;
    }, { url: correctUrl, sentence: CHECK_SENTENCE });
    checkTimes.push(Math.round(ms));
  }

  const fakeMicMs = await page.evaluate(async (sentence) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext({ sampleRate: 16000 });
    const src = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    const chunks = [];
    proc.onaudioprocess = (e) => chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    src.connect(proc);
    proc.connect(ctx.destination);
    await new Promise((r) => setTimeout(r, 2500));
    proc.disconnect();
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
    await ctx.close();
    let len = 0;
    for (const c of chunks) len += c.length;
    const pcm = new Float32Array(len);
    let off = 0;
    for (const c of chunks) {
      pcm.set(c, off);
      off += c.length;
    }
    const encodeWav = (samples, sr) => {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);
      const write = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
      write(0, 'RIFF');
      view.setUint32(4, 36 + samples.length * 2, true);
      write(8, 'WAVE');
      write(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sr, true);
      view.setUint32(28, sr * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      write(36, 'data');
      view.setUint32(40, samples.length * 2, true);
      let p = 44;
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        p += 2;
      }
      return new Blob([buffer], { type: 'audio/wav' });
    };
    const t = performance.now();
    const blob = encodeWav(pcm, 16000);
    const graded = await window.__mrjPronounceBench(blob, sentence);
    return { ms: performance.now() - t, pass: graded.result.pass, doorFail: graded.result.doorFail };
  }, CHECK_SENTENCE);

  const accuracy = {};
  for (const passAt of [60, 50]) {
    accuracy[passAt] = {};
    for (const clip of CLIPS) {
      const clipUrl = `${baseUrl}test/bench-wavs/${clip.file}`;
      const out = await page.evaluate(async ({ url, target, passAt }) => {
        const blob = await fetch(url).then((r) => r.blob());
        const graded = await window.__mrjPronounceBench(blob, target, { passAt });
        const words = (graded.result.words || []).map((w) => ({
          word: w.word,
          score: Math.round(w.score || 0),
          pass: (w.score || 0) >= passAt,
        }));
        return {
          doorFail: !!graded.result.doorFail,
          pass: !!graded.result.pass,
          words,
          perf: graded.perf,
        };
      }, { url: clipUrl, target: clip.target, passAt });
      accuracy[passAt][clip.id] = out;
    }
  }

  const samplePerf = accuracy[60].correct.perf || {};
  const diskBootBytes = await diskBytesForBoot();
  await browser.close();
  return {
    mode: 'citrinet-only',
    trialMode: boot.trialMode,
    readyMs,
    checkTimes,
    fakeMic: fakeMicMs,
    downloadBytes: bootBytes,
    downloadMb: Math.round((bootBytes / (1024 * 1024)) * 10) / 10,
    diskBootBytes,
    diskBootMb: Math.round((diskBootBytes / (1024 * 1024)) * 10) / 10,
    perfSample: samplePerf,
    accuracy,
    assets: [...bytesByUrl.entries()].map(([url, n]) => ({ url: url.replace(baseUrl, ''), bytes: n })),
  };
}

async function main() {
  await ensureWavs();
  const { server, url } = await startStaticServer();
  try {
    const report = {
      generatedAt: new Date().toISOString(),
      checkSentence: CHECK_SENTENCE,
      citrinetOnly: await benchMode(url),
    };
    const outPath = join(root, 'test', 'bench-trial-report.json');
    await mkdir(join(root, 'test'), { recursive: true });
    await writeFile(outPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.error('\nWrote', outPath);
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
