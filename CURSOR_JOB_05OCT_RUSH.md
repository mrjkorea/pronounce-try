# Day 4 part 2 — real score, auto-stop, different look

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not git push. Do not touch `models/`. Do not use a browser.
Do not print the teacher password. Pass cut stays 60. Do not add a second scorer.

## Bug

Part 2 shows a green check when the recording stops (`checkHtml` / `got-it` / `rushRecorded`).
That check is not a pronunciation pass. Random noise looks correct.
`gradeRush` already calls `gradeBlob`. The page ignores that result.

## Score

Part 1 and part 2 must use the same function: `gradeBlob`.
Same model id: `wav2vec2-lv-60-espeak-cv-ft-onnx-int8`.
Same rules: score at least 60, not too quiet, not too short, no missing words.
A green check appears only when `rushGrades[id].pass` is true.
A failed grade shows a red mark and the words "Not yet". It must not show a check.
While the grade is still running, show the word "Checking". Do not show a check yet.
Do not play the hear clip in part 2.
A part 2 grade must not overwrite the part 1 student score.
After a grade returns, render again if the student is still on that sheet.
The results block must count part 2 passes from `rushGrades`. Do not call a recording a pass.

## Auto-stop

Stop the timer as soon as the student finishes the recording of the last line that was not recorded yet.
Do not wait for Stop. Do not wait for 0.
Seconds used is that moment.
Keep the Stop button for an early stop.
A failed line can be tried again only while the timer is still running.

## Look

Part 2 must not look like part 1.
Add a banner: `Part 2 · Timer`.
Set `document.body` class `phase-part2` only in part 2, and remove it on other screens.
Part 2 background is blue-gray, not the cream page color.
The clock is larger than the part 1 text.
The sheet has a blue border.
Part 1 and the teacher screen keep the current cream look.

## Cache

Set the style and script query in `index.html` to `v=20261005-rush`.
Keep the language menu, auth scripts, `vendor/ort/ort.wasm.min.js`, and `mrj-scores.js`.

## Tests

Run these and put the real output in `CURSOR_RECEIPT_05OCT_RUSH.md`:

```
node --check src/app.js
node --check src/flow.js
node --check src/grade-worker.js
node tools/check_two_parts.mjs
```

Also confirm `src/app.js` still contains `gradeBlob`, `wav2vec2-lv-60-espeak-cv-ft-onnx-int8`, `fillLangMenu`, and `Teacher mic`.
Confirm the green check is tied to `rushGrades` pass, not only to `rushRecorded`.
If a test fails, fix it.
