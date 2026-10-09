# CURSOR_RECEIPT — sentence and word marks after a try (5 Oct 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. No browser. Pass cut stays 60. The checker is unchanged. The teacher password is not printed.

## What changed

Before a graded try, the English sentence stays hidden. After a try, pass or fail, the full English sentence shows, and each word is marked. A word at 60 or more is green (`word-chip good`). A word under 60 is red (`word-chip bad`). This is true in part 1 and in part 2, including the results screen.

1. `noteRushGrade` keeps `pass` and `scorePct`, and now stores the word list from `gradeBlob` as `{ word, score }`. It still writes only `rushGrades`. A part 2 grade does not replace the part 1 student score.
2. Part 1 reads the attempt. A pass no longer hides the sentence or the word marks.
3. Part 2 and the results screen read `rushGrades` for that line. The sentence and the word marks render after the grade returns. They stay hidden until that part 2 grade exists. The part 1 verdict block stays off the part 2 sheet.
4. Part 2 still does not play the hear clip. `gradeRush` does not call `playExpectedOnFail`, and that function returns when the sheet is in part 2.
5. `index.html` style and script queries are `v=20261005-words`. The language menu, auth scripts, `vendor/ort/ort.wasm.min.js`, and `mrj-scores.js` stay.

## Files

- `src/app.js`
- `src/flow.js`
- `index.html`
- `CURSOR_RECEIPT_05OCT_WORDS.md`

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
check_exit:0
```

Pass path, Basic C “It is here”, words It 0.90, is 0.59, here 0.60:

- Untried part 1: no `part-text`, no word chips.
- Part 1 pass: `It is here`, chips `good:It bad:is good:here`.
- Part 2 before its own grade: sentence hidden, even when part 1 already passed.
- Part 2 pass: `It is here`, chips `good:It bad:is good:here`. No `Pass ·` block from part 1.
- Results screen, same rush grade: `It is here` and the same chips.
- Part 2 fail: sentence shown, chips `bad:It bad:is bad:here`.
- `studentPassed` stayed true. Part 1 `scorePct` stayed 90. Stored rush words are `It:0.9, is:0.59, here:0.6`.
