# CURSOR_RECEIPT — part 2 next mic during grading (5 Oct 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. No browser. Pass cut stays 60. Part 1 still waits for the grade and the fail sound. The teacher password is not printed on the page.

## What changed

Part 2 kept the mic closed until 1200 ms of silence, `onMic` returned while `capture` was set, and `encodeWav` ran on the main thread before the next tap could land.

1. In part 2, a tap on another open mic ends the current take immediately and starts the next take. One recording at a time. The same mic does not restart itself.
2. Part 2 ends a take about 400 ms after speech stops (`PART2_SILENCE_MS`). Part 1 still uses 1200 ms of silence after the 1600 ms grace.
3. Part 2 WAV encode runs in `src/wav-worker.js` after the mic buttons are rendered and the tap handler has yielded. The next mic does not wait for that encode or for the grade.
4. Other open part 2 mics stay enabled while a grade is running and while another line is recording. Part 1 still disables the other mics and still refuses a tap while a grade (including the fail sound) is running.
5. The green check still comes only from a real `gradeBlob` pass. The checker and the pass cut are unchanged.
6. `index.html` style and script queries are `v=20261005-nextmic`. The language menu, auth scripts, `vendor/ort/ort.wasm.min.js`, and `mrj-scores.js` stay. `flow.js` was not changed.

## Files

- `src/app.js`
- `src/wav-worker.js`
- `index.html`
- `tools/check_two_parts.mjs`
- `CURSOR_RECEIPT_05OCT_NEXTMIC.md`

## Tests

```
node --check src/app.js
node --check src/flow.js
node tools/check_two_parts.mjs
```

Output:

```
app_exit:0
flow_exit:0
5 fails lock only that line: A locked, B open
password is not accepted before the teacher screen: true
51 words → 90
50 words → 60
part 2 next-mic is not waiting on grade: true
part 1 mic waits during grade: true
check_exit:0
```

`canStartMic` for part 2 with `grading: true` and `recording: false` is true. `canStartMic` for part 1 with `grading: true` is false. A part 2 tap while `recording: true` is still false until that take is ended.
