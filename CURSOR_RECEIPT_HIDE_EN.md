# CURSOR_RECEIPT — hide English until a bad try (30 Sep 2026)

Workspace: `day4-web/` only. No git push. `models/` not touched. Scoring math, pass cut 60, here/there order, and pictures unchanged.

## What changed

English stays off the sheet until that part fails (`saved` exists and `saved.pass` is false), including a too-short or check-error fail.

Before a try, and after a pass: picture and Korean only. Pass score still shows. The English sentence, the shared question, the Question / Answer labels, and "Say it 3 times" stay hidden. Word chips stay hidden on a pass so the words are not revealed.

After a fail: that part's expected English is shown. A one-word line also shows "Say it 3 times." The existing fail path still calls `playExpectedOnFail`, and a one-word line still plays the hear mp3 three times.

This covers normal rows, here/there extras (`It is here`, `It is there`), the shared question (`plan.question`), and each ITA or CIPO part on its own. `data-grade-text` still holds the sentence for scoring. It is not in a `title` tooltip.

## Files

- `src/app.js`
- `tools/check_hide_en.mjs`
- `CURSOR_RECEIPT_HIDE_EN.md`

## Tests

```
$ node --check src/app.js
(exit 0)

$ node tools/check_hide_en.mjs
untried rows do not include the English sentence: 765
passed rows do not include the English sentence: 765
failed rows include the English sentence: 765
here/there extra rows: 4
shared questions: 25
ITA rows: 10
CIPO rows: 10
one-word parts: 44
untried and passed rows do not include the English sentence, and a failed row does
(exit 0)
```

Browser check on the local sheet: an untried Come Play unit showed 12 pictures and Korean only, including 여기 있어요 and 저기 있어요, with no "It is here", "It is there", or "Say it 3 times." After stored scores, a failed here-row showed "It is here", a passed there-row showed Pass · 91 and not "It is there", a failed "pig" showed the word and "Say it 3 times", a passed "dog" did not, a failed ITA question showed "Question" and "Is this a guitar?" while the passed answer stayed hidden, a failed CIPO answer showed "Answer" and "Put on a dress" while the untried question stayed hidden, and a failed shared weather question showed "How is the weather?" while the passed "It is hot" stayed hidden.
