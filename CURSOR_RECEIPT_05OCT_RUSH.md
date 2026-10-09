# CURSOR_RECEIPT — part 2 real score, auto-stop, different look (5 Oct 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. No browser. Pass cut stays 60. One scorer: `gradeBlob`. The teacher password is not printed on the page.

## What changed

Part 2 was painting a green check when the recording stopped (`rushRecorded`). That check was not a pronunciation pass. `gradeRush` already called `gradeBlob` and the page ignored the result.

1. Part 1 and part 2 both score with `gradeBlob` and model id `wav2vec2-lv-60-espeak-cv-ft-onnx-int8`. Pass still needs a score of at least 60, speech that is not too quiet, speech that is not too short, and no missing words.
2. The green check (`got-it`) renders only when `rushGrades[id].pass` is true. A failed grade shows a red mark and the words "Not yet". While the grade is running the line says "Checking" and does not show a check. `rushRecorded` no longer draws the check.
3. Part 2 does not play the hear clip. A part 2 grade writes `rushGrades` only. It does not replace the part 1 student score.
4. When a part 2 grade returns, the sheet renders again if the student is still on that unit.
5. The results block counts part 2 passes from `rushGrades` (`Part 2 pronunciation`). A recording is not counted as a pass.
6. The timer stops when the student finishes the recording of the last line that was not recorded yet. Seconds used is that moment. Stop still ends the timer early. Hitting 0 still ends it. A failed line can be tried again only while the timer is still running. A passed line stays closed.
7. Part 2 shows the banner `Part 2 · Timer`. `document.body` has class `phase-part2` only on that screen. The page background is blue-gray, the clock is 84px (larger than the part 1 line text), and the sheet has a blue border. Part 1 and the teacher screen stay cream.
8. `index.html` style and script queries are `v=20261005-rush`. The language menu, auth scripts, `vendor/ort/ort.wasm.min.js`, and `mrj-scores.js` stay.

## Files

- `src/app.js`
- `src/flow.js`
- `src/styles.css`
- `index.html`
- `CURSOR_RECEIPT_05OCT_RUSH.md`

## Tests

```
node --check src/app.js
node --check src/flow.js
node --check src/grade-worker.js
node tools/check_two_parts.mjs
```

Output:

```
app_exit:0
flow_exit:0
worker_exit:0
5 fails lock only that line: A locked, B open
password is not accepted before the teacher screen: true
51 words → 90
50 words → 60
part 2 next-mic is not waiting on grade: true
check_exit:0
```

Strings in `src/app.js`:

```
yes  gradeBlob
yes  wav2vec2-lv-60-espeak-cv-ft-onnx-int8
yes  fillLangMenu
yes  Teacher mic
```

Green check: `rushMark` reads `flow.rushGrades[id]`. `checkHtml('pass')` is the only path that emits `got-it`. That path runs only when `grade.pass` is true. `rushRecorded` is used to know which lines have a take and when the last new line should stop the timer. It does not draw the check.
