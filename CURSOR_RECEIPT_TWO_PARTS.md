# CURSOR_RECEIPT — two parts (30 Sep 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. Pass cut stays 60. Picture rows and hide-English stay as they were.

## What changed

Part 1 is still picture + Korean. English and the hear sound show only after a bad try. Five fails lock that line only and show `Please ask your teacher for help.` The other lines stay open. The unit moves on only when every line is passed or locked.

If any line is locked, the teacher screen lists those lines only (picture + Korean, mic labeled Teacher mic). A teacher pass clears the line and does not replace the student's score. The password box is on this screen only. It skips the stuck lines into part 2. The password is not printed on the page, and it is refused before this screen.

If every line was a student pass, part 1 goes straight to part 2. Final results wait until part 2 stops.

Part 2 is the same sheet, picture + Korean, no English and no hear sound. The limit is 60 seconds, or 90 if the speak targets add up to more than 50 English words (here/there extras, the shared question, and both parts of an ITA or CIPO row). Start runs the clock. Stop, or hitting 0, ends it.

`session.run` is in the classic worker `src/grade-worker.js` (`numThreads = 1`, no COOP/COEP). The page still does the GOP score and the too-short / too-quiet checks. In part 2 the next mic is clickable while a grade is still running. One recording at a time. The check appears when the recording stops. Part 2 grades do not play audio and do not overwrite part 1 student scores.

Progress for this flow is in `day4-pronounce-two-parts-v1`. `day4-pronounce-scores-v2` is not wiped.

## Files

- `src/flow.js`
- `src/grade-worker.js`
- `src/app.js`
- `src/styles.css`
- `index.html`
- `tools/check_two_parts.mjs`
- `CURSOR_RECEIPT_TWO_PARTS.md`

## Tests

```
$ node --check src/app.js
$ node --check src/flow.js
$ node --check src/grade-worker.js
$ node --check tools/check_two_parts.mjs
(exit 0)

$ node tools/check_two_parts.mjs
5 fails lock only that line: A locked, B open
password is not accepted before the teacher screen: true
51 words → 90
50 words → 60
part 2 next-mic is not waiting on grade: true
(exit 0)
```

`node tools/check_hide_en.mjs` still exits 0 (pass cut 60, English hidden until a bad try).

Browser, local sheet: a line with 5 fails showed the help sentence and its English; the next line stayed open with no English and no password box. Refresh kept the fail count and part 1. The teacher screen showed one stuck line, picture and Korean, "Teacher mic", and a password box with the password not on the page. A wrong password stayed there. The real password marked that line skipped, did not store a student pass, and opened part 2 with no results yet. `day4-pronounce-scores-v2` was still present. Part 2 on the 80-word sheet showed Limit 90, a check before any rush grade, and no English. Start counted 90 down to 89 and enabled the mics; Stop showed seconds used and the limit. A clock that had already hit 0 opened results at 90 / 90, with the skipped line marked skipped and not added to the passed count.
