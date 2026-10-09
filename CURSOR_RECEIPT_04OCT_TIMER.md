# CURSOR_RECEIPT — timer on the student page (4 Oct 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. No browser. Pass cut stays 60. The teacher password is not printed on the page.

## What changed

The live language page and this folder's two-part timer are now one student page.

Kept from the live page: header language menu (`LANG_KEY`, `UI_LANGS`, `currentLang`, `applyLangDir`, `fillLangMenu`), cues from `content/l1.json` (`lineCue`, `questionCue`, `noteCue`). Korean still uses the classroom Korean field. Other languages use `l1.json`. The English line the student must say stays hidden until a bad try in part 1. Scores still post through `MRJ_SCORES` into `day4-pronounce-scores-v2`. That key is not wiped. Shared question, here/there extras, ITA, and CIPO stay.

Added from the 30 Sep two-part wiring (saved first as `src/app.two-parts-base.js`):

1. Part 1 is one recording at a time. The fail sound finishes before the next take.
2. Five fails lock only that line and show `Please ask your teacher for help.`
3. Part 1 ends when every line is passed or locked.
4. Stuck lines open a teacher screen on the same page. Picture + language cue. Mic label `Teacher mic`. A teacher pass does not replace the student score.
5. The password box is only on that teacher screen. It skips stuck lines. It is refused during the five tries. The password is not on the page.
6. If every line was a student pass, the page goes straight to part 2. Final results wait.
7. Part 2 is the same sheet. No English answer line. No hear sound. No sound during the countdown. The language cue stays.
8. Timer is 60 seconds, or 90 when the English word total is more than 50. The count includes the shared question, here/there extras, and both parts of an ITA or CIPO row.
9. Start starts the clock. Stop, or hitting 0, ends it and shows seconds used, lines recorded in time, and part 1 pronunciation scores. A teacher skip is not a student pass.
10. In part 2 the next mic is clickable while the previous clip is still grading. One recording at a time. The check mark appears when the recording stops.
11. `session.run` stays in `src/grade-worker.js` (`numThreads = 1`, classic worker, no COOP/COEP). Part 2 grades do not overwrite part 1 scores.
12. Flow progress stays in `day4-pronounce-two-parts-v1`.

The language menu stays in the header, outside `#app`. `lineCue` / `questionCue` render on part 1, the teacher screen, and part 2.

## Files

- `src/app.two-parts-base.js` (copy of the timer page before the merge)
- `src/app.js`
- `src/styles.css` (language rules plus rush/teacher rules)
- `index.html` (`langMenu`, `vendor/ort/ort.wasm.min.js`, `mrj-scores.js`, auth scripts, `src/app.js`)
- `src/flow.js` and `src/grade-worker.js` kept
- `CURSOR_RECEIPT_04OCT_TIMER.md`

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
yes  fillLangMenu
yes  lineCue
yes  content/l1.json
yes  MRJ_SCORES
yes  grade-worker.js
yes  Teacher mic
yes  Please ask your teacher for help.
yes  day4-pronounce-scores-v2
```
