# Day 4 Pronounce — put the timer part on the student page

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not git push. Do not touch `models/`. Do not use a browser or Playwright.
Do not print the teacher password on the page. Do not invent scores. Pass cut stays 60.

## Why

The two-part timer already exists in this folder (`src/flow.js`, `src/grade-worker.js`, `src/app.js` as of 30 Sep 06:19).
The live student page does not have it.

Live files (read these, do not edit them):
- `/Users/andreclouthier/.hermes/projects/pronounce-pages/src/app.js`
- `/Users/andreclouthier/.hermes/projects/pronounce-pages/src/styles.css`
- `/Users/andreclouthier/.hermes/projects/pronounce-pages/index.html`

Those live files have a later language menu. This folder's `src/app.js` does not.
A blind copy either way would drop a feature. Merge both.

## Keep from the live page

- Header language menu: `LANG_KEY`, `UI_LANGS`, `currentLang`, `applyLangDir`, `fillLangMenu`.
- Cue text: `lineCue`, `questionCue`, `noteCue`, fetch `content/l1.json`.
- Korean selected = the classroom Korean field, not a new translation.
- Other languages = `l1.json`. English the student must say stays hidden until a bad try.
- Score post: `MRJ_SCORES` and `day4-pronounce-scores-v2`. Do not wipe that key.
- Picture + Korean before a try and after a pass. English and the hear clip only after a bad try in part 1.
- Shared question, here/there extras, ITA, and CIPO stay.

## Add from this folder's current two-part code

Copy `src/app.js` to `src/app.two-parts-base.js` before you edit, so you do not lose the timer wiring.

Then make `src/app.js` the live language page plus this flow:

1. Part 1 is one recording at a time. A fail sound must not leak into the next take.
2. Five fails lock only that line. Show `Please ask your teacher for help.` Other lines stay open.
3. Part 1 ends when every line is passed or locked.
4. Stuck lines open a teacher screen on the same page. Picture + Korean. Mic label `Teacher mic`. Teacher must pass by saying the line. That pass does not replace the student score.
5. Password box only on that teacher screen. It skips stuck lines. It is refused during the five tries. Never print the password.
6. If every line was a student pass, go straight to part 2. Do not show final results yet.
7. Part 2 is the same sheet. No English. No hear sound. No sound during the countdown.
8. Timer is 60 seconds. More than 50 English words total = 90 seconds. Count the shared question, here/there extras, and both parts of an ITA or CIPO row.
9. Start starts the clock. Stop, or hitting 0, ends it. Then show seconds used, lines recorded in time, and part 1 pronunciation scores. A teacher skip is not a student pass.
10. In part 2 the next mic is clickable while the previous clip is still grading. One recording at a time. The check mark appears when the recording stops, not when the grade returns.
11. `session.run` stays in `src/grade-worker.js` (`numThreads = 1`, classic worker, no COOP/COEP). Part 2 grades do not overwrite part 1 scores.
12. Progress for this flow stays in `day4-pronounce-two-parts-v1`.

## Files

- Keep `src/flow.js` and `src/grade-worker.js`.
- Merge language CSS from the live `styles.css` into this folder's `src/styles.css`. Keep `.top-row`, `.lang-label`, `.l1-beside`, `.l1-prompt`, and the rush/teacher rules (`.rush`, `#rushStart`, `#rushStop`, `.teacher-gate`, `.ask-teacher`).
- Update `index.html` so it matches the live index structure: language `<select id="langMenu">`, `vendor/ort/ort.wasm.min.js`, `mrj-scores.js`, auth scripts, and `src/app.js`. Do not add the password string to `index.html`.
- Export `speakTargets` and `speakWordCount`. `tools/check_two_parts.mjs` imports them.
- Use `lineCue` / `questionCue` on part 1, the teacher screen, and part 2. Do not drop the language cue when the phase changes.
- The language menu stays in the header, outside `#app`. Do not re-render it away.

## Tests

Run these and put the real output in `CURSOR_RECEIPT_04OCT_TIMER.md`:

```
node --check src/app.js
node --check src/flow.js
node --check src/grade-worker.js
node tools/check_two_parts.mjs
```

Also confirm `src/app.js` still contains all of these strings:
`fillLangMenu`, `lineCue`, `content/l1.json`, `MRJ_SCORES`, `grade-worker.js`, `Teacher mic`, `Please ask your teacher for help.`, `day4-pronounce-scores-v2`.

If a test fails, fix it. Do not claim done on a failed check.
