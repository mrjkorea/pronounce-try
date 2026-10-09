# Day 4 Pronounce — Jay orders 29 Sep 2026

Work only in this folder: `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`

Do not touch `models/`. Do not copy the 303 MB checker. Do not invent scores. Do not use phone-OS voices. Do not add a name box.

## 1. Same sign-in as the other GitHub apps

At the very start, before any book or mic.

Add to `index.html` head, same tags as Typing Kids:

```html
<link rel="stylesheet" href="https://mrjkorea.github.io/mrj-signin/mrj-auth.css">
<script src="https://mrjkorea.github.io/mrj-signin/mrj-auth.js"></script>
<script src="https://mrjkorea.github.io/mrj-signin/mrj-auth-boot.js" data-mrj-app="pronounce"></script>
```

Hide `#app` until the `mrj-auth-ready` event. No name prompt anywhere. The mic must not ask for a name.

After a graded try, if `window.MRJ_AUTH` has `noteScore` and `student()` matches the signed-in id, post:

```js
auth.noteScore({
  program: "pronounce",
  itemId: itemId,
  scoreValue: Math.round(scorePct),
  scoreMax: 100,
  scorePct: Math.round(scorePct)
});
```

## 2. Mic stops itself, then grades

Tap mic once. When the student has spoken and then goes quiet for about 1.2 seconds, stop and grade automatically. No second tap.

While grading, show a moving bar the student can see. Not a frozen "…" .

Silence watch idea: `~/.hermes/projects/mrj-pronounce/packages/pronounce-web/src/main.js` around the silence timer. Do not copy that whole file.

## 3. Pass at 60

Pass if the average word score is 60 or higher AND the audio is real speech (not silence, not too short). Noise must still fail.

Show the line the way Pronounce does: one chip per word. Green if that word is 60 or higher. Red if it is under 60. No yellow. Chip look can follow `.word-chip.good` / `.word-chip.bad` in `studio-face.css` of that same Pronounce folder.

## 4. One word = say it three times

If the expected English answer is one word, the scorer target is that word three times: `seven seven seven`. Hint on the row: "Say it 3 times."

If the expected line is two or more words, say it once. Do not repeat.

## 5. Question and answer

Look at `content/*.json` and this rule. Do not invent picture answers (here/there, yes/no from a photo).

Shared question — show once at the top, student must say it and pass it once, then each number is only the answer:

- Every Korean line in the unit starts with the same code: HITW? WCYD? WDYW? WIMP? WDIIT? WTII(N)? WTII? WFDYL? WITB? HWIYN? WGAYI? ITA? WFAT? CIPO? WDYH?
- Or the unit title ends with ? and the item English lines do not end with ?

Expand the code from the unit title when the title is the question. Locked extras:

- HITW? = How is the weather?
- WCYD? = What can you draw?
- WDYW? = What do you want?
- WIMP? = Where is my phone?
- WDIIT? = What day is it today?
- WTII(N)? and WTII? = What time is it?
- WFDYL? = What flavor do you like?
- WITB? = What is this bug?
- HWIYN? = How will I yell your name?
- WGAYI? = What grade are you in?
- ITA? = Is this a ...? — this question CHANGES per item. Put "Is this a [thing]?" on that row with the answer. Do not put one ITA question at the top.
- WFAT? = What fruit are these?
- CIPO? = Can I ...? — question changes per item. Put the full question on that row with the answer.
- WDYH? = What do you have?

Changing question — both on that row, both must pass:

- The item English already ends with ? and there is no separate answer in the JSON: score that question only. Do not invent an answer.
- ITA? and CIPO?: question changes, so question and answer are both on that row.

A row with both parts is not passed until both parts pass. One mic per part. Show which part they are saying.

## 6. Fail reads the expected line

If a try does not pass, play the expected English automatically.

- Answer lines already have `audio/hear/` mp3s. Play that file.
- One-word answers: play that mp3 three times.
- Shared questions have no mp3 yet. Bake them with Kokoro Bella, not a phone voice:

```bash
python3 /Users/andreclouthier/.hermes/projects/shared-tts/mrj_tts.py pair --text "How is the weather?" --gender female --out audio/hear/questions/<id>.mp3 --mp3
```

Only the unique shared-question strings. Do not rebake the 716 answer files.

## 7. Done check

- `node --check src/app.js` exits 0
- A small node test prints: pass cut 60, one-word target is three repeats, WGAYI unit has one top question, ITA row has both parts
- Write `CURSOR_RECEIPT_29SEP.md` with files changed and the test output

Do not git push. Do not edit files outside this folder except reading the Pronounce silence/chip files.
