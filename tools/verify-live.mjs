#!/usr/bin/env node
/** Verify live Citrinet-only boot + bench hook (zz_test IDs only). */
import { chromium } from 'playwright';

const LIVE = process.env.PRONOUNCE_TRY_URL || 'https://mrjkorea.github.io/pronounce-try/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.MRJ_AUTH = {
      student: () => ({ id: 'zz_test_live', email: 'zz_test_live@example.com' }),
      noteScore: () => {},
    };
    document.body.classList.remove('auth-wait');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(300000);
  const t0 = Date.now();
  await page.goto(`${LIVE}?bench=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mrjTrialBoot && window.__mrjPronounceBench && document.getElementById('modelLabel')?.classList.contains('done'), {
    timeout: 300000,
  });
  const readyMs = Date.now() - t0;
  const boot = await page.evaluate(() => window.__mrjTrialBoot());
  const wavUrl = new URL('audio/hear/it-is-here.mp3', LIVE).href;
  const graded = await page.evaluate(async ({ wavUrl, sentence }) => {
    const blob = await fetch(wavUrl).then((r) => r.blob());
    const t = performance.now();
    const out = await window.__mrjPronounceBench(blob, sentence);
    return { ms: performance.now() - t, trialMode: out.trialMode, pass: out.result.pass, grader: out.result.grader };
  }, { wavUrl, sentence: 'It is here.' });
  await browser.close();
  const report = { live: LIVE, readyMs, boot, graded };
  console.log(JSON.stringify(report, null, 2));
  if (boot.trialMode !== 'citrinet-only' || boot.grader !== 'citrinet-trial') {
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
