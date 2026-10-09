# CURSOR_RECEIPT — 30 Sep 2026 (Day 4 web)

Workspace: `day4-web/` only. No git push. `models/` not touched. No phone-OS voice. No name box.

## Orders implemented

1. **Pictures** — Copied `image` from `https://raw.githubusercontent.com/mrjkorea/day4-speak/main/content/<book>.json` onto the matching local item `id`. English, Korean, audio, and ids unchanged. Sheet shows an 88px rounded cover picture beside the Korean on every row that has `image`. Existing pictures load from `https://mrjkorea.github.io/day4-speak/` + `item.image`. All 716 items have an image, so `MISSING_PICTURES.txt` was not written.

2. **Here / there** — A pointing unit is at least 7 lines matching `/^where (is|are)\b/i`, and those lines are all but at most one item. That rule finds exactly two units: Basic C **Come Play With Us** and Int 2A **Where is the Teacher?** Sheet order is one `It is here`, one `It is there`, then every original line in order. Each extra row has its own mic and scores at 60 like any other line. Other units, including Numbers and the trap sentences (snakes, cities, burp, Beomjun, cheap), do not gain these rows.

3. **Extra stills and audio** — Two classroom stills drawn with Cursor Generate Image, saved as `images/it-is-here.webp` and `images/it-is-there.webp`. Kokoro Bella (`kokoro_demo_af_bella`) baked to `audio/hear/it-is-here.mp3` and `audio/hear/it-is-there.mp3`. Those two hear paths play from this app. Other answer clips stay on day4-speak.

System `python3` has no `sherpa_onnx`. The bake used the shared-tts venv. Passing `--out` already ending in `.mp3` makes that script write the wav onto the mp3 path, then ffmpeg refuses to read and write the same file. The wav was written to `audio/hear/*.wav` with `--mp3`, which produced the mp3s, and the wavs were removed.

## Files changed

- `content/basic_a.json`
- `content/basic_b.json`
- `content/basic_c.json`
- `content/int2a.json`
- `content/int2b.json`
- `content/int2c.json`
- `content/int3a.json`
- `content/int3b.json`
- `content/int3c.json`
- `src/sheet.js`
- `src/app.js`
- `src/styles.css`
- `images/it-is-here.webp`
- `images/it-is-there.webp`
- `audio/hear/it-is-here.mp3`
- `audio/hear/it-is-there.mp3`
- `tools/check_30sep.mjs`
- `CURSOR_RECEIPT_30SEP.md`

## Tests

```
$ node --check src/app.js
(exit 0)

$ node tools/check_30sep.mjs
image field on 716 items
pointing units: basic_c Come Play With Us; int2a Where is the Teacher?
rule units: basic_c Come Play With Us; int2a Where is the Teacher?
pointing match rule: true
Come Play With Us: It is here | It is there | Where is the slide?
Come Play questions once: true count=10
Come Play full: It is here | It is there | Where is the slide? | Where is the seesaw? | Where is the merry-go-round? | Where is the swing? | Where is the jungle gym? | Where is the sandbox? | Where is the playhouse? | Where is the bumper car? | Where is the maze? | Where is the roller coaster?
Where is the Teacher? Korea line once: true
Numbers here/there added: false
trap units stayed plain: true
original English lines on sheets: 716 of 716
```

Browser check on the local page: Come Play shows 12 rows, 88px pictures, local stills on the two extra lines, and the slide picture from day4-speak. Where is the Teacher? starts `It is here`, `It is there`, then `Where are our classmates?`, and includes `In Korea, students clean their school` once. Numbers 1 to 10 has 10 picture rows and no here/there. Is This a Gayageum? keeps two mics on the row and does not gain here/there. Local hear mp3s return 200 `audio/mpeg`.
