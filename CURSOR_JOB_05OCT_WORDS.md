# Day 4 — show the sentence and the word marks after a try

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not git push. Do not touch `models/`. Do not use a browser.
Do not change the pass cut. Do not change the checker. Do not print the teacher password.

## Bug

Jay tried Basic C part 2. A correct line does not show the English sentence.
It also does not show which words were correct.
Part 2 sets `forceHideEnglish` and `hideVerdict`, so the result is hidden.
`rushGrades` stores only pass and score percent. It drops the word scores.

## Rule

Before the first try, keep the English sentence hidden.
After any graded try, pass or fail, show the full English sentence.
Show each word in that sentence.
A word at 60 or more is green. A word under 60 is red.
Do this in part 1 and in part 2.
Do not play the hear clip in part 2.
A part 2 grade must not replace the part 1 student score.

## How

Store the word list from `gradeBlob` on the part 2 grade.
Render those words after the grade returns, including on the results screen.
A pass must not hide the sentence or the word marks.
Set the style and script query in `index.html` to `v=20261005-words`.
Keep the language menu, auth scripts, the checker script, and `mrj-scores.js`.

## Tests

Run these and put the real output in `CURSOR_RECEIPT_05OCT_WORDS.md`:

```
node --check src/app.js
node --check src/flow.js
node tools/check_two_parts.mjs
```

Confirm a pass path can still render `wordChipsHtml` and the English sentence.
If a test fails, fix it.
