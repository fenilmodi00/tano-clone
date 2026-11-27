# CaseMedia — case-study films, gates and reels

Owner files: `src/components/sites/tano/media/case-films.tsx`,
`src/components/sites/tano/motion/use-case-media.ts`,
`src/styles/tano/media.css`, `public/sites/tano/media/*`, this file.
No replica, runtime, layout or globals edits (HelloFresh poster URLs in the
replica were localised by Main through `asset-map.json`).

## Inventory (captured source → local)

| Route | `.wire-study-video` figures | Mux playback IDs | Local film | Poster |
|---|---|---|---|---|
| `/case-studies/bloom-and-wild` | 1 | `CriGL9bgQTAkLjSiTI1WZGMPcil5yKMVlLv8XWZS58Q` (104.17 s, 1920×1080) | `media/bloom-and-wild-rebrand.mp4` (49 MB) | `media/bloom-and-wild-film-poster.jpg` (1920×1080) |
| `/case-studies/papier` | 2 | `gd00FjTuyTMsL502r01X6wq2AdcnyrMxAwfT02QCJtilYpw` (230.21 s) | `media/papier-case-study.mp4` (95.9 MB) | `media/papier-case-film-poster.jpg` |
| `/case-studies/papier` | — | `1HgNiMcinQ88H02WOn7knXyGYkDj38pOVCqLPpdpxfME` (145.22 s) | `media/papier-cpa.mp4` (61 MB) | `media/papier-cpa-film-poster.jpg` |
| `/case-studies/hellofresh` | 3, all `data-gated="true"` | `01DdTUelFSpsNr8AETwFidGf4xvGbOcsRnu6WVftAzhs` (CAC, 110.88 s), `Plle4M8YSPKN3SqQt1OjGcoYkiWLuNZmffuM6Dxkzhg` (Process, 74.44 s), `3Na00d8aF00OqBo4eaqWkSCpSyG3O0101hYZcOIa101onvpQ` (AI agents, 83.40 s) — all **signed** | none (private, not mirrored) | `media/hellofresh-{cac,process,ai-agents}-poster.webp` (160×90 source ceiling) |
| `/case-studies/skin-and-me` | 0 (source has no film) | — | — | — |

Film poster URLs are the source Mux thumbnails at `time=0`
(`https://image.mux.com/<playbackId>/thumbnail.jpg?width=1920&time=0`).
Bloom's first frame is intentionally blurred in the film itself, so the poster
matches source rather than looking sharp.

Reel counts (`.wire-study-films .wire-reel`):

| Route | Unique films | Rendered cards | Reel source |
|---|---|---|---|
| bloom-and-wild | 10 | 50 (5 copies) | `/home/boxd/tano/vids/fileassets.json` → `extras/*.mp4`, `*-432x768.jpg`, `*-320x320.jpg` |
| hellofresh | 10 (two Erin clips) | 50 | same |
| papier | 9 | 45 | same |
| skin-and-me | 10 | 50 | same |
| `/case-studies` hub | 8 | 40 | same (hub band, also wired) |

Every one of those 39 brand clips (plus 8 hub clips) already existed in
`public/sites/tano/extras/`; no clip needed downloading. All reel posters and
avatars likewise already existed in `extras/`. The only newly downloaded media
are the five film posters and `papier-case-study.mp4`.

Gates: all three HelloFresh frames keep the source poster, heading, email input,
"Send me Tano's other case studies" checkbox and Watch button. No `<mux-player>`
exists there in the capture.

## Behaviour

- Public films: `<video class="wire-study-video-player" controls playsInline
  preload="none" poster="…" src="…">`, inserted after the shared runtime's
  one-shot autoplay pass so films never autoplay (source does not). Activation
  raises the preload hint to `auto` and starts the load. Paused, unmuted, native
  controls, local mp4 only. `data-video-ready` on metadata, `data-video-error` on failure.
- HelloFresh gates: native email validation; submit is captured and never
  fetches. Valid submit sets `data-gate-state="disclosed"`, hides the form,
  rewrites the promise line and appends a `role="status"` note explaining the
  signed film is not mirrored. Empty/invalid email stays `data-gate-state="locked"`.
- Reels: front card = `2 × unique` (source `floor(2.5) × length`), one
  `data-front="true"`, only that card gets a `src`; the other 4 copies stay
  unloaded. `loop`, `muted`, `playsInline`, `preload="none"`. Plays only while
  in view, not hovered, not manually paused, and not reduced-motion. Hover
  pauses and leave resumes; Play/Pause button and aria-label stay in sync;
  previous/next, card click-to-centre, drag, horizontal wheel and 420 ms snap
  are wired. `data-playing`, `data-ready`, `data-inview`, `data-paused`,
  `data-hover`, `data-reel-ready` expose state to CSS/tests.
- Route changes: `usePathname()` is the effect dependency, so client-side
  navigation into/out of case pages rehydrates (verified Bloom → Papier).
- No timers/marquees added; reduced motion starts reels paused, removes the
  snap animation, and never autoplays them.

## Verification (Chromium via Playwright, 1440×900, dev server 3000)

Run against `/case-studies`, the four brand pages, after load + 1.8 s:

- `<mux-player>` count: **0** on every route; blank count **0**.
- Bloom: `readyState 4`, duration 104.17 s, 1920×1080, controls, playsInline,
  paused, muted=false; `currentTime` advanced 0.77 s under `play()`.
- Papier: both films `readyState 4` at 230.21 s and 145.22 s, 1920×1080;
  both advanced ~0.75 s under `play()`.
- Reels: one front, `loop=true`, `muted=true`, `data-ready=true`, local
  `extras/*.mp4`; scrolled in: playing; hover: paused with `data-playing=false`;
  unhover: resumed; Next: handle changed 0→1; Pause/Play toggles `data-paused`
  and aria-label; reduced-motion context starts paused at `data-paused=true`.
- Gates: invalid submit on all 3 remains `locked` and form visible; valid
  submit on all 3 → `disclosed`, form hidden, disclosure note present, and
  **0 network requests**. No request to `image.mux.com`, `stream.mux.com`,
  `cdn.sanity.io`, `www.tano.ai` or `_next/image` on any route (request log
  filtered non-local hosts: empty).
- Console errors: none.

The only request failures are normal `ERR_ABORTED` range-request cancellations
for local mp4s; metadata and playback succeed.

## Remaining differences / gaps

1. **HelloFresh films are not mirrored.** The three Mux assets are signed. No
   film was fabricated. Posters are the signed 160×90 thumbnails (the token
   clamps width), blurred/upscaled by the source gate CSS. Gate discloses this.
2. Native `<video controls>` replaces the source Mux custom control chrome
   (`mux-player` + `template#tano-player-theme`). That is the requested
   replacement; the source's custom accent/centre-play styling is not replicated
   on native controls.
3. Skin+Me has no main film in the source capture; none was invented.
4. Reel posters/avatars are corrected in the hydration hook, because the
   generated replicas still ship generic `tano/images/tano-*.jpg` placeholders.
   Final DOM matches source; for one frame before hydration the placeholders are
   visible.
5. The source reel's 24 px gap computes to 0 px on these pages because a later
   global `.wire-reel{--reel-gap:0px}` rule wins; geometry was measured against
   that computed value, not the earlier token.
