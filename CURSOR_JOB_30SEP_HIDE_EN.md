# Day 4 Pronounce — hide English until a bad try (30 Sep 2026)

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.
Do not touch `models/`. Do not git push. Do not change scoring math, pass cut 60, here/there order, or pictures.

Jay: do not show the English at the start. Show only the picture and the Korean. If the pronunciation is bad, then show the English and play its pronunciation. Fix every line, not just one unit.

## Show / hide

Before any try: picture + Korean only. No English sentence. No shared English question. No "Question" / "Answer" English text. No "Say it 3 times" until the English is revealed.

After a pass: still no English sentence. Pass score is fine. Do not reveal the words.

After a fail (`saved` exists and `saved.pass` is false), including a too-short or check-error fail: show that part's expected English, and the existing fail path must still play the hear mp3. One-word lines still play three times.

This applies to:
- every normal row
- here/there extra rows (`It is here`, `It is there`)
- shared question at the top (hide `plan.question` until that shared try fails)
- ITA and CIPO rows (each part stays hidden until THAT part fails)

Do not put the English in a `title` tooltip. `data-grade-text` may keep it for scoring. It must not be visible.

Unit titles and the Mic button can stay. Those are not the answer line.

## Done check

- `node --check src/app.js` exits 0
- A small test or a comment-free assert in `tools/check_hide_en.mjs` prints that untried and passed rows do not include the English sentence, and a failed row does
- Write `CURSOR_RECEIPT_HIDE_EN.md` with the test output

Do not git push.
