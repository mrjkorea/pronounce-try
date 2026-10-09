# CURSOR_RECEIPT — 29 Sep 2026 (Day 4 web)

Workspace: `day4-web/`  
No git push. `models/` not touched.

## Orders implemented

1. **MRJ sign-in** — `index.html` loads `mrj-auth.css`, `mrj-auth.js`, and `mrj-auth-boot.js` (`data-mrj-app="pronounce"`). `#app` hidden until `mrj-auth-ready`. After each graded try, `MRJ_AUTH.noteScore` when `noteScore` and `student()` are available.
2. **Mic auto-stop** — ~1.2 s silence after speech (analyser RMS watch). One tap; no second tap to stop. Moving grading bar while the checker runs (sheet rows and shared unit question).
3. **Pass at 60** — `PASS_SCORE = 0.6`; word chips green ≥60, red &lt;60 (no yellow).
4. **One-word answers** — scorer target is three repeats; row hint “Say it 3 times.”
5. **Question / answer** — shared unit question at top (e.g. WGAYI); ITA and CIPO rows show question + answer with separate mics and part labels; plain `?` lines scored as question only.
6. **Fail playback** — expected English via `HEAR_BASE` + item `audio`, `audio/hear/<slug>.mp3` for answer alts, or `audio/hear/questions/<slug>.mp3` for shared questions (Kokoro bake command in job file).

## Files changed

- `index.html`
- `src/app.js`
- `src/styles.css`
- `CURSOR_RECEIPT_29SEP.md`

## Tests

```
$ node --check src/app.js
(exit 0)

$ node tools/check_29sep.mjs
pass cut 60: true
one-word target is three repeats: true
WGAYI unit has one top question: true
ITA row has both parts: true
```
