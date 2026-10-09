# Day 4 part 2 — next mic during grading

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not git push. Do not touch `models/`. Do not use a browser.
Do not change part 1. Do not change the pass cut. Do not print the teacher password.

## Bug

In part 2 the student cannot tap the next mic while the first line is being checked.
The page waits 1200 ms of silence before the take ends.
`onMic` returns immediately when `capture` is still set.
`encodeWav` then blocks the main thread, so the next tap lags.

## Rule

Part 2 only.
As soon as the first line starts being checked, the next mic must accept a tap.
The student must be able to start the next recording while the first grade is still running.
One recording at a time. A new tap ends the current take and starts the next take.
Do not wait for the grade. Do not wait for the WAV encode.
Part 1 still waits. The fail sound must not leak into the next part 1 take.
Keep the same checker. A green check still requires a real pass.

## How

In part 2, a tap on another open mic ends the current recording at once and starts the new one.
Move the WAV encode off the tap path. The mic buttons must be clickable before `encodeWav` runs.
Use a shorter silence end for part 2 only. About 400 ms after speech stops. Do not change the part 1 silence times.
Do not disable the other part 2 mics while a grade is running.
Set the style and script query in `index.html` to `v=20261005-nextmic`.
Keep the language menu, auth scripts, checker script, and `mrj-scores.js`.
Cache-bust the `flow.js` import if you change that file.

## Tests

Run these and put the real output in `CURSOR_RECEIPT_05OCT_NEXTMIC.md`:

```
node --check src/app.js
node --check src/flow.js
node tools/check_two_parts.mjs
```

Confirm part 2 `canStartMic` still allows a tap while a grade is running.
Confirm part 1 still refuses a tap while a grade is running.
If a test fails, fix it.
