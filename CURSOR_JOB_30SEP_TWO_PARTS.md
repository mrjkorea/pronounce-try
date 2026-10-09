# Day 4 Pronounce — two parts (30 Sep 2026)

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not touch `models/`. Do not git push. Do not change the pass cut (60), the picture rule, or the hide-English rule.

Jay's order, exact:

## Part 1 — say it, one line at a time

Same sheet as now: picture + Korean only. English and the hear sound appear only after a bad try.

Five bad tries on one line does **not** stop the unit. That line locks. Show exactly: `Please ask your teacher for help.` The student keeps going to the other lines.

A line is finished when it is passed, or it has 5 fails. Part 1 ends only when every line is finished. Untouched lines are not finished.

Then, only if some lines have 5 fails, the teacher screen (end of part 1 only):

- Those stuck lines only. Picture + Korean. A mic labeled for the teacher.
- The teacher must say that line. Same checker. A pass clears that line. Do not replace the student's score with the teacher's pass.
- A password box on this screen only. The password is `MRJ`. It skips the stuck lines so they can enter part 2. Do not print the password on the page. Do not accept it during the five tries.
- When every stuck line is teacher-passed or skipped, go to part 2. Do not show final results yet.

If every line passed with no teacher, go straight to part 2.

Part 1 stays one recording at a time, so the fail sound can play. Do not let them start the next mic while a part 1 grade or fail sound is running.

## Part 2 — fast mic, timed

Same page. Picture + Korean. No English. No hear sound during this part, even on a bad rush recording.

Timer: **60 seconds**. If the lines they must say add up to **more than 50 English words**, **90 seconds**. Count every speak target on the sheet, including here/there extras, the shared question, and both parts of an ITA or CIPO row. A word is a token of letters or numbers.

Start starts the countdown. Stop ends it. Hitting 0 is the same as Stop.

They tap a mic, speak, and the silence stop still ends that recording. The next mic must be clickable **while the previous recording is still grading**. One recording at a time only. A recorded line gets a check as soon as the recording stops, not when the grade returns.

Do this by moving `session.run` off the main thread:

- Keep `numThreads = 1`. Do not turn on multi-thread WASM. Do not require COOP/COEP.
- A classic worker `src/grade-worker.js` loads `vendor/ort/ort.wasm.min.js`, receives the model buffer, creates the session, and returns logits.
- The main thread still does GOP, pass/fail, and the too-short / too-quiet checks.
- Part 2 grades may finish after they press Stop. Do not block the next mic on them. Do not play audio for them.
- Do not overwrite part 1 student scores with part 2 rush grades.

## Results

After Stop (or 0), show:

- Seconds used, and the limit (60 or 90)
- How many lines they recorded in time, out of how many
- Part 1 pronunciation: passed count, and any teacher-skip lines marked as skipped, not as a student pass

A refresh must keep part 1 passes, fail counts, and which part they are in. Use a new localStorage key. Do not wipe `day4-pronounce-scores-v2`.

## Done check

- `node --check` on every js file you add or edit
- A pure test (no browser, no ONNX) prints: 5 fails lock only that line; password is not accepted before the teacher screen; 51 words → 90, 50 words → 60; part 2 next-mic is not waiting on grade
- Write `CURSOR_RECEIPT_TWO_PARTS.md` with that output

Do not git push.
