# UseCaseProcess — use-case pitch-deck scene animation

Owner: PageFamilies/UseCaseProcess. Files: `src/components/sites/tano/pages/behaviours.tsx`,
`src/components/sites/tano/motion/use-page-family.ts`, `src/styles/tano/pages.css`,
`docs/coordination/UseCaseProcess.md`. Dev server for verification: `http://127.0.0.1:3000`
(the 3100 instance was replaced; 3000 serves the current dev build).

## Symptom

On `/use-cases/drive-revenue` the `.hp-uc-process` deck matched source step state
(`data-state=live/idle`, `--hp-steps-active`, active `.hp-pp-slide`) but the scene was frozen:
source rendered `.hp-pp-scene[data-running="true"]`, local had no `data-running`. Source CSS
`src/styles/tano/source.css`:

```css
.hp-pp-scene:not([data-running]) * { animation-play-state: paused !important }
```

Same player on `/use-cases/creative-velocity`; both were inert.

## Source contract (frozen bundle `/home/boxd/tano/js/3wa99p2ledxp-.js`, module 20541)

`ProcessPlayer` renders `ProcessScene` with `running: !!current && running` and
`reduced`, and `ProcessScene` maps them to attributes:

```js
jsx("div", { className: "hp-pp-scene", "data-reduced": reduced || void 0,
             "data-running": running || void 0, "data-scene": scene, ... })
```

- `running` comes from `useMotionPause({ inView })`: true only in view, not paused, not reduced.
- Each step gets a fresh frame/scene keyed `${step}-${take}`; the outgoing frame is
  `data-leaving` for 420 ms. The scene therefore replays its authored CSS entrance on every step
  (the fill restarts via key `live-${step}-${take}`).
- Frame carries `data-room` on desktop (window/print room-making animation). Not reproduced
  locally; pre-existing replica gap, noted below.

## Patch (`pages/behaviours.tsx`, `setupPitchDeck`)

Kept the existing minimal attr sync and closed three gaps:

1. **Pause/resume.** `onPlay` now calls `sync()` (not `syncPlay()`), so `data-running` and
   `fill[data-paused]` follow the deck clock. Source pauses/resumes in place.
2. **Scene replay on step change.** `syncScenes(replay)` runs inside `sync()`: when the step
   changes (timer tick, arrow/segment, re-entry) it removes `data-running`, rewinds every
   authored CSS animation with `scene.getAnimations({ subtree: true })` `currentTime = 0`,
   forces a style flush, then re-adds `data-running` when `running()`. `data-running` is only set
   on scenes outside a `[data-leaving]` frame. (Attribute removal alone only pauses; without the
   rewind, steps 2–4 resumed finished animations and stayed static.)
3. **Reduced motion.** Every scene gets `data-reduced="true"` when
   `prefers-reduced-motion: reduce` matches, removed otherwise. Running/reduced sync happens on
   step change, pause, intersection change, media-query change and route remount.

Timers unchanged, from the SSR fills: drive-revenue 11.6 s / 11.6 s / 11.6 s / 10.4 s;
creative-velocity 11.6 s x4 / 12.2 s. `IntersectionObserver` rootMargin
`0px 0px -40% 0px`; `restart` rebuild of the live fill.

## Measurements (1568x709, scroll 1496, Playwright, 500 ms samples over 12.6 s)

Source vs local, both routes, no console errors or page errors in any run.

| Route | Probe | Source | Local (patched) |
|---|---|---|---|
| drive-revenue | scene at entry | `data-running=true` after ~666 ms; score opacity 0 -> 1 by 1.17 s, transform `translateY(6.57px)` -> 0; bars `scaleX(0)` -> 1 | `data-running=true`; score 0 -> 1 by 1.21 s; same transforms |
| drive-revenue | fill | 5.4 px at t0 -> 408.0 px at 11.06 s (`hp-steps-fill`, running) | 6.0 px -> 409.8 px at 11.10 s |
| drive-revenue | step advance | step 1 at 11.56 s; new scene `revenue-attribute` with `data-running=true` | step 1 at 11.60 s; same scene replays from frame 0 |
| drive-revenue | arrow/next click | new scene `revenue-coach`, fresh entrance | score opacity 0, transform `translateY(6.57px)` at +400 ms -> animates back |
| creative-velocity | scene at entry | `data-running=true` after ~657 ms; score 0 -> 1 by 1.17 s | `data-running=true`; score 0 -> 1 by 1.13 s |
| creative-velocity | fill / step | 7.2 -> 408.0 px; step 1 at 11.51 s, new `velocity-onboard` scene | 6.7 -> 405.6 px; step 1 at 11.48 s; replay |
| both | pause | `data-running` removed, score `animation-play-state: paused`, fill `data-paused=true`, width frozen | same; measured 136.2 px constant over 1.5 s, resumes from 136.2 px |
| both | offscreen | no `data-running`, fill `data-paused=true`, play label stays Pause | same at scroll 4000 and 0 |
| both | reduced motion | `data-reduced="true"`, no `data-running`, step stays 0 after 12 s, score animation `none`, fill `animation:none` full width, label Play | identical attributes/state on both routes |

JSON captures: `/tmp/cap-{drive-revenue,creative-velocity}-{source,local}-final.json` (normal
run); the reduced-motion run wrote `/tmp/cap-*-local.json`.

Route change: clicking `a[href="/use-cases/creative-velocity"]` then back remounted
`PageRuntime` (`runtime.tsx` keys page hooks by `usePathname`), so `usePageFamily` re-runs
`mountPageFamilies` against the new DOM; no extra route listener was needed in
`use-page-family.ts` (left unchanged). Each new deck entered at frame 0 with
`data-running=true`, and the 11.6 s timer advanced to step 1 after navigation (measured
`step: 1` at +12 s). No console errors.

## Screenshots

`docs/coordination/UseCaseProcess-shots/`

- `drive-revenue-source-t0.png` / `drive-revenue-local-t0.png` — first frame, identical geometry.
- `drive-revenue-source-t3.png` / `drive-revenue-local-t3.png` — 3 s in, identical revealed state.
- `creative-velocity-source-t3.png` / `creative-velocity-local-t3.png`.
- `drive-revenue-local-t9.png`, `creative-velocity-local-t9.png` — fill near completion.

## Remaining difference (not a frozen state)

The generated replicas ship only the step-01 scene markup (`revenue-source`,
`velocity-source`). Source swaps a distinct frame per step; the live variants were captured
at 1568x709 and measured during this pass:

| Route | Step scenes (source) | Local step-01 scene reused |
|---|---|---|
| drive-revenue | `revenue-source` (Sourcing), `revenue-attribute` (Onboarding), `revenue-coach` (Incentivisation), `revenue-measure` (Tracking and measurement) | all steps |
| creative-velocity | `velocity-source` (Sourcing), `velocity-onboard` (Onboarding), `velocity-recommend` (Post recommendation), `velocity-invite` (Invitations), `velocity-licence` (Whitelisting and licence) | all steps |

The controller replays the available scene on every step with the source's motion timing, so
nothing is frozen; step 2+ copy (`.hp-pp-slide`) does switch, but the stage content stays the
step-01 variant. Per coordinator decision, porting the step-2+ frame content (typed scene module
plus stage swap) is deferred; it needs the captured frame markup and its scene images
(`/brand/ochre/*.glass.jpg`, `/brand/creators/*.jpg` were not part of the frozen asset set).
The frame also lacks source's desktop `data-room` attr, so the window/print "make room" entrance
is absent; the scene's own entrance, bar growth and cursor are unaffected.

Exact remaining gap if addressed later: `.hp-pp-stage > .hp-pp-frame` without `data-room`, and
`.hp-pp-scene[data-scene="revenue-source"]` / `velocity-source` reused for later steps instead of
the variants above.
