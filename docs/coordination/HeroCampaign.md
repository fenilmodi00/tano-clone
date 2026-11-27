# HeroCampaign — four home hero reels

Status: complete. Files: `home/hero-campaign.tsx`, `motion/use-hero-campaign.ts`,
`content/hero-campaigns.ts`, `styles/tano/hero.css`, `scripts/capture-hero.mjs`,
this report. No files outside this list were edited. The temporary campaign switcher
was removed from `interactions.tsx` by the orchestrator; this hook is now the only
campaign controller.

## Source evidence

- `docs/research/tano/motion/js-orchestration.md` §4, §8: `HeroCampaignStage`
  (`1wjb414e95an5.js:8051`) advances four reels every **8000 ms**, keeps the outgoing
  `.hp-camp-scene` mounted for **600 ms** with `data-leaving` (`hp-camp-out`), and
  pauses on `useMotionPause`/`usePlayZone` (`rootMargin: 0 0 -40%`, leave at
  ratio < .75). `ref.left` survives pause; the active track button uses
  `data-state="done|live|idle"`, `aria-current`, and a re-keyed
  `.hp-steps-seg-fill[data-paused]`.
- `1wjb414e95an5.js` module 30417 is the authoritative campaign data: brand name,
  logo, backdrop, clip src/poster, creator handle/avatar, product name/image/tint.
  Reel order: Bloom & Wild → NEOM → Peachies → Papier.
- `source.css`: `.hp-camp-scene` enters with `hp-camp-in .6s ease both`;
  `[data-opening]` suppresses that animation; `[data-leaving]` uses `hp-camp-out`;
  `.hp-camp-backdrop[data-live=true]` cross-fades over .7 s; the panel keeps the
  current + next backdrop.
- `docs/research/tano/motion/home-frames/`: 8 s per campaign, 32 s rotation, 600 ms
  scene crossfade, no hero pin at 1568×900, `data-inview` flips at the 200 px margin.

## Data capture

`node scripts/capture-hero.mjs` drives the live page with Playwright (1568×900,
reduced motion off), resets the reel through its own play zone, waits for each
`data-state="live"` index, and reads the settled DOM (creator score included).
It rewrites every asset through `docs/research/tano/asset-map.json` and fails if a
value cannot be mapped to an existing `public/sites/tano/...` file; the generated
module is asserted to contain no remote runtime URL.

| # | Handle | Brand | Product | Video | Poster | Backdrop |
|---|---|---|---|---|---|---|
| 0 | `@lucindachapmanofficial` | Bloom & Wild | The Sunshine Bouquet | `1eabace1….mp4` | `d5a0904e…-432x768.jpg` | `a3d1b3db…-2400x1800.jpg` |
| 1 | `@vickifox_` | NEOM | Real Luxury Candle | `71778a59….mp4` | `3849bf82…-432x768.jpg` | `8ccb7003…-2400x1129.jpg` |
| 2 | `@whiitneylovee` | Peachies | Bamboo Nappies | `95194127….mp4` | `d4f42886…-432x768.jpg` | `309deb12…-2400x1255.jpg` |
| 3 | `@reginafoster.us` | Papier | Wellness Journal | `4f0e11e4….mp4` | `7740af55…-432x768.jpg` | `bcc31f72…-2400x1350.jpg` |

Avatars are distinct per reel (Bloom/Papier reuse `images/tano-81.jpg` and
`images/tano-94.jpg`; NEOM/Peachies use their Sanity originals in `extras/`).
Brand logos, product images, tints, chips, target labels, score rows, chat copy and
both metric paths are in `content/hero-campaigns.ts`. Creator names verified during
capture: Lucinda / Vicki / Whitney / Regina.

## Implementation

`motion/use-hero-campaign.ts` is a thin route-aware hook (`usePathname` dep):
it finds `.hp-camp`, calls `mountHeroCampaign(camp)` once, and returns its cleanup.

`home/hero-campaign.tsx` exports `mountHeroCampaign(root: HTMLElement): () => void`
and reproduces the source DOM for each reel (`.hp-camp-panel` backdrops, `.hp-camp-scene`,
`.hp-camp-post` video/logo, the four `data-slot` cards, the chat turns and metric SVGs).
Behavior:

- Timer: `left` starts at 8000 ms; pausing clears the timeout and subtracts elapsed
  time, resuming keeps the remainder. Leaving the play zone resets to reel 0 (source
  `onLeave` behavior); arriving starts from the preserved/full remainder.
- Scene swap: outgoing gets `data-leaving` + `aria-hidden` and is removed after
  600 ms; incoming is inserted with `data-opening` for one frame, then the source
  `.hp-camp-in` entrance runs. Track fills restart by re-keying the live fill span.
- Track: `.hp-camp-track-button` gets `data-state` done/live/idle, `aria-current`,
  `aria-label` from the data, and the live `.hp-steps-seg-fill` gets
  `data-paused` from the running state. Clicking a button picks that reel and resets
  its timer; no hover listener exists (source has no hover pause).
- Play zone: IntersectionObservers on `.hp-hero-pin` (`0 0 -40%`, thresholds 0/.75)
  and a 200 px `data-inview` observer on `.hp-camp`, matching `usePlayZone` and
  `OffscreenPause`. Videos play only while the campaign is running and their own
  element is visible; every `<video>` is `muted`, `playsInline`, `loop`,
  `preload="metadata"`, and `play()` is called after each swap. A capture-phase
  `play` guard pauses any video another runtime tries to start while the hero is
  paused/offscreen.
- Reduced motion: `prefers-reduced-motion` sets `data-motion="paused"`, stops the
  timer (preserving the remainder), pauses video, freezes the track fill and writes
  the final creator score. No auto-advance; track buttons still allow manual picks.
- Cleanup: clears both timers, disconnects all observers, cancels count-up rAFs,
  removes scenes/backdrops, pauses video, removes listeners, and unregisters the
  WeakMap mount. The hook re-runs on `pathname`, so client navigation away destroys
  it and returning home mounts a fresh campaign.

`styles/tano/hero.css` only adds video `object-fit/object-position`/poster fallback
and an explicit 600 ms `[data-leaving]` duration (the source already defines the
`hp-camp-in`/`hp-camp-out` keyframes).

No Lenis/scroll events are used, so no contract with GroundTheme was required.
`data-inview` is the only shared DOM signal; `useConversations` sets the same value
with the same 200 px margin, so the two writers agree.

## Verified (local, 1568×900, Playwright)

Evidence run after the final edits (`/` on the dev server, no console errors):

| Observed page time | Live | Handle | Avatar | Video | readyState | currentTime advance (1.2 s) | Track states |
|---|---|---|---|---|---|---|---|
| 1991 ms | 0 | `@lucindachapmanofficial` | `images/tano-81.jpg` | `1eabace1….mp4` | 4 | 1.232 s | live,idle,idle,idle |
| 9473 ms | 1 | `@vickifox_` | `extras/c1912772…jpg` | `71778a59….mp4` | 0→4 | 1.162 s | done,live,idle,idle |
| 17499 ms | 2 | `@whiitneylovee` | `extras/490f56a5…jpg` | `95194127….mp4` | 4 | 1.202 s | done,done,live,idle |
| 25514 ms | 3 | `@reginafoster.us` | `images/tano-94.jpg` | `4f0e11e4….mp4` | 4 | 1.202 s | done,done,done,live |

Intervals: 9473−1991 = 7.48 s (timer started ~0.5 s before the first sample),
17499−9473 = **8.03 s**, 25514−17499 = **8.02 s**. At the swaps there are 2 scenes
(outgoing `data-leaving`, incoming with the 0.6 s `hp-camp-out`/`hp-camp-in`
crossfade); at rest 1 scene. The leaving scene computed `animation-duration: .6s`,
opacity fell 0.96 → 0.29 over ~180 ms and it was removed by 700 ms.

Additional checks:

- Structure: 4 `data-slot` cards, 3 chat turns, 2 chips, 4 score rows, 2 metrics,
  2 targets, 2 backdrops (live + next), 1 logo; the first scene keeps `data-opening`
  and `.hp-camp-scene` computed animation is `none` on load.
- Offscreen: scrolled to 2400 (hero fully out). `data-inview=false`, live stays 0,
  video paused at the same `currentTime`, fill `data-paused=true` for 9 s
  (32004 → 41033 ms, no advancement). Returning at 350 resumes reel 0 and the video
  advanced 1.215 s in 1.2 s.
- Track click: clicking Peachies switched handle/avatar/video and states to
  `done,done,live,idle`; video played (readyState 4, +0.818 s).
- Reduced motion (fresh context, `reducedMotion: reduce`): 18 s apart at 4022 and
  22032 ms still live 0, `@lucindachapmanofficial`, `data-motion="paused"`, video
  `paused` at `currentTime 0`, fill `data-paused=true`, creator score `0.92`.
- Pause preserves remaining time: reducing at ~2 s into a reel for 5 s and resuming
  advanced to the next reel 5.26 s later (not a fresh 8 s).
- Route cleanup: client navigation `/` → `/case-studies` removed `.hp-camp`
  (0 instances after 11.5 s away, no errors); back navigation re-mounted one scene,
  live 0, video playing, readyState 4.

## Remaining differences / notes

- `mountHeroCampaign` resolves the optional `.hp-camp` into a guarded `host`, then
  binds it to `const camp: HTMLElement`, so every nested observer/cleanup closure is
  strictly non-null (the eight `camp` nullability diagnostics Main reported).
- The incoming scene carries `data-opening` for one frame, then the source
  `hp-camp-in` entrance plays; the source keeps `data-opening` only on the initial
  SSR scene (so the visible result matches: the 600 ms crossfade is carried by both
  scenes rather than a hard cut).
- `scripts/build-campaign-data.mjs` is an older generator that still writes the
  `HERO_CAMPAIGNS: string[]` shape to the same content path. It is outside this
  workstream's file set; the orchestrator should delete it, otherwise running it
  would overwrite the typed module. The maintained generator is
  `scripts/capture-hero.mjs`.
- No page reload or HMR must occur during a timed capture; Next dev Fast Refresh
  remounts the hook and restarts the reel at Bloom & Wild, which reads as a false
  early cycle in a long sample.
