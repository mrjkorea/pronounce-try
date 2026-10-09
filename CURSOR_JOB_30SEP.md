# Day 4 Pronounce — Jay orders 30 Sep 2026

Work only in `/Users/andreclouthier/.hermes/projects/mrj-pronounce-app/day4-web`.

Do not touch `models/`. Do not copy the 303 MB checker. Do not invent scores. Do not use phone-OS voices. Do not add a name box. Do not git push. Do not edit files outside this folder except reading GitHub raw content and running the TTS command below.

## 1. Pictures on every Day 4 sentence

The pictures already exist. Do not redraw them.

Source of truth: `https://raw.githubusercontent.com/mrjkorea/day4-speak/main/content/<book>.json`
Each item has `image` like `images/pic_slide.webp`. Those files are already live at `https://mrjkorea.github.io/day4-speak/` + that path.

Local `content/*.json` is missing the `image` field. Copy `image` onto the matching item `id` in every local book file. Do not change english, korean, audio, or ids.

In the sheet, show a small picture on every row that has `image`. About 88px square, rounded, object-fit cover. Not huge. Place it beside the Korean line so the row is easier to see.

Image URL = `https://mrjkorea.github.io/day4-speak/` + `item.image`.
If an item has no image after the merge, list it in `MISSING_PICTURES.txt`. Do not invent a picture for a sentence that already has one in the day4-speak JSON.

## 2. Here / there format

Jay, 30 Sep: in circumstances like this there should be one "It is here" and then one "It is there" and then the rest should just be the questions themselves. Everything on the Day 4 page must show up at least once. Use that same format for the rest of the pointing units.

A pointing unit = at least 7 lines whose English matches `/^where (is|are)\b/i`, and those lines are all but at most one item in the unit.

Known pointing units:
- Basic C unit 07 Come Play With Us (10 Where-is questions)
- Int 2A unit 07 Where is the Teacher? (9 Where-is questions + one other sentence that must still appear)

For each pointing unit, the sheet order is:

1. One row: English `It is here`
2. One row: English `It is there`
3. Then every original Day 4 item, in the original order, as the question (or the original sentence) itself. Do not replace a question with an answer. Do not add "It is here" after each question. Do not drop bumper car, maze, roller coaster, nurse, or any other line.

Do not add here/there to other units. "There are snakes", "How many cities are there?", "Don't burp here", "Is Beomjun there?", and "Everything here is cheap!" are not this format.

The two extra rows are scored like any other line. One mic. Pass at 60. They are not a shared question that unlocks the unit.

## 3. Pictures and audio for the two extra lines

Search first. These files are NOT in day4-speak `images/` (only `is-beomjun-there.webp` and `where-are-you-from.webp`, which are the wrong pictures). Do not reuse those.

Draw exactly two one-off stills with Cursor Ultra Generate Image (Google Nano Banana Pro). Not Grok Imagine. Not FLUX. Not Seedream.

- `images/it-is-here.webp` or `.png`: a simple classroom picture, a hand pointing at an object right in front, close. No words in the picture. Bright, kid-clear.
- `images/it-is-there.webp` or `.png`: the same style, a hand pointing at an object far away. No words.

Show those pictures on the two extra rows. Keep them about 88px in the row.

Bake Kokoro Bella (not a phone voice) for the two lines:

```bash
python3 /Users/andreclouthier/.hermes/projects/shared-tts/mrj_tts.py pair --text "It is here" --gender female --out audio/hear/it-is-here.mp3 --mp3
python3 /Users/andreclouthier/.hermes/projects/shared-tts/mrj_tts.py pair --text "It is there" --gender female --out audio/hear/it-is-there.mp3 --mp3
```

The player currently prefixes every hear path with `https://mrjkorea.github.io/day4-speak/`. That 404s for these new files. Play `audio/hear/it-is-here.mp3` and `audio/hear/it-is-there.mp3` from this app (same origin), not from day4-speak. Existing answer clips stay on day4-speak.

## 4. Done check

- `node --check src/app.js` exits 0
- A small node test prints:
  - image field on 716 items, or the missing list
  - pointing units are exactly the Where-is units found by the rule
  - Come Play With Us sheet order starts `It is here`, `It is there`, then `Where is the slide?` and includes all 10 original questions once
  - Where is the Teacher? includes `In Korea, students clean their school` once
  - a non-pointing unit such as Numbers does not gain here/there
  - all 716 original English lines still appear
- Write `CURSOR_RECEIPT_30SEP.md` with files changed and the test output

Do not git push.
