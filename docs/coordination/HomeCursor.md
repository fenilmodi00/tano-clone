# HomeCursor — animated cursor in the home ProcessPlayer (`.hp-pp`)

Status: implemented and source-matched. Verified on the dev server at
`http://127.0.0.1:3100`; port 3000 is a `next start` production build and needs a
rebuild before it serves this change. Scope: the home
`Creator programmes / that scale at the speed of AI` player only. Files:
`motion/use-home-info.ts`, `home/info-sections.tsx`, `styles/home-info.css`, this
note.

## Source truth

Captured live at `https://www.tano.ai/`, Chromium 1568x709, scroll 1760
(`.hp-pp` rect `top 92.95`, `1312 x 579.33`), 2026-11-27.

- The source renders `span.hp-pp-cursor` with `<img src="/brand/hero/cursor.svg">`
  inside `.hp-pp-scene[data-scene="inputs"]` only. Probes on the other three
  scenes after manual selection and 0.9–3.2 s settle:
  `source` = 0 cursor spans / 0 `[data-cursor]`; `outreach` = 0 / 0;
  `optimise` = 0 spans / `win-0`, `win-1`, `win-2` markers only. The live
  bundle contains exactly one `<Cursor>` mount: inputs, `objective` at beat 1
  plus the three product tick boxes at beats 2, 2.9, 3.8, all with `click`.
  The frozen handbook agrees: “In step 01 it clicks the objective and the three
  products as their ticks land.” (`handbook/05-motion/components/03-loop.md` §2.)
- Step 1 keyframes (`effect.getKeyframes()`, duration **9000 ms** = 7.5 beats x
  1200 ms, the 3200 ms scene tail is outside the animation; effect easing
  `linear`, fill `forwards`):
  start `translate(370.9, 232)` opacity 0; objective `translate(269.8, 139.3)`
  opacity 1 at 0.100; press `scale(.86)` 0.118, release 0.133; product-0
  0.233 / 0.251 / 0.267; product-1 0.353 / 0.371 / 0.387; product-2 0.473 /
  0.491 / 0.507; hold 1 at 0.573; fade to 0 while drifting +40/+60 px at 0.653;
  hidden to 1.0. Each departure keyframe carries
  `cubic-bezier(0.45, 0, 0.25, 1)`.
- Visual result: objective press 1.06 s, product-0 2.26 s, product-1 3.34 s,
  product-2 4.42 s; fades out 5.16–5.88 s and is absent for the remaining 6.3 s
  of the step.
- Geometry: the source aims the cursor’s **top-left** at
  `target.left + w/2`, `target.top + h*0.55` (relative to the scene), starts
  `12%` of scene width right / `16%` of scene height below the first target,
  travels up to 1000 ms per hop, arrives 160 ms before the click, presses 140 ms.
- `/brand/hero/cursor.svg` sha256
  `1c14488e95aef6853a0779e37529081227c025b79001e7e4869810eaec8d55c5`.
  Both local files `public/sites/tano/images/cursor.svg` and
  `public/sites/tano/images/cursor-2.svg` have the **same** sha256, so the local
  asset is byte-identical; the scene points at `cursor-2.svg`.

## Implementation

`setupSteps` keeps one `cursorAnimation: Animation | null` and the existing
start/stop wiring. `startCursor(frame, stepDuration)` reads every
`[data-cursor]` in the frame, resolves each target’s own beat (`--win` first,
then `--at` on the marker or its nearest row), sorts by beat, and builds the
source path:

- `duration = stepDuration - 3200` (9000 ms on inputs); effect easing `linear`.
- Departure keyframe `1000 ms` before arrival, arrival `160 ms` before the
  press, press at `1200 * beat - 140`, release `+140 ms`; each departure
  keyframe uses `cubic-bezier(0.45, 0, 0.25, 1)`.
- Aim at `center x`, `0.55 * height y`; entry at `+0.12 * scene.width`,
  `+0.16 * scene.height` with opacity 0.
- Hold 600 ms after the last release, then fade to 0 while drifting +40/+60 px
  over the next 8% of the duration; `fill: forwards`.
- Offsets are clamped monotonically, exactly as the source does.
- `stopCursor()` cancels and sets the previous frame’s cursor opacity to 0
  before the frame becomes `data-leaving`; no cursor is injected where the
  payload has none.
- The animation is paused whenever `running()` is false (play/pause, offscreen,
  reduced motion) and the existing `resetOnArrival` remounts step 0 with the
  full `durations[0]` timeline.

Measured keyframes on the clone (identical durations/offsets to the source):

```
0:0 (370.9,232) · .100:1 objective (269.8,139.3) · .118 press · .133 release
.233/.251/.267 product-0 (206.7,222.1)
.353/.371/.387 product-1 (430.9,222.1)
.473/.491/.507 product-2 (206.7,259.3)
.573 hold · .653 opacity 0 (246.7,319.3) · 1 hidden
```

## Verification (Playwright, 1568x709, scroll 1760, dev 3100)

| Check | Result |
|---|---|
| animation | `duration 9000`, `easing linear`, `fill forwards` |
| opacity / transform | 0 at entry, 1 by 0.9 s; matrix translate changes on every 100 ms sample |
| entry | fades in from `(370.9,232)` to `(269.8,139.3)` over the first 900 ms |
| press order | objective → product-0 → product-1 → product-2; 0.86 presses |
| press times | keyframes 1.06 / 2.26 / 3.34 / 4.42 s; 100 ms samples detect 1.04 / 2.18 / 3.33 / 4.36 s |
| fade-out | opacity 1 → 0 between 5.20 and 5.93 s, then hidden until the 9 s animation end |
| offscreen | `playState=paused` at `currentTime 1266.67 ms`; transform frozen for 1.5 s; on re-entry step 0 remounts and animation resumes (`opacity .964`, `currentTime 699.97 ms`) |
| play/pause control | paused at `currentTime 1866.55 ms`, transform frozen for 1.5 s; resume continued from 1866.55 ms (no restart) |
| manual step change | selecting away from inputs leaves 0 cursors; selecting back mounts exactly one, at opacity ~.95 mid-entry; 700 ms after each selection the stage has one frame and the right scene |
| duplicates | a full 47 s autoplay cycle never had more than one `.hp-pp-cursor` span or one visible cursor in `.hp-pp` |
| reduced motion | cursor `display:none`, opacity 0, 0 animations, `data-reduced` set; step still 0 after 4 s |
| console | no page errors |

## Remaining differences / notes

- The live source has a cursor only on `inputs`; `source` and `outreach` have no
  targets and `optimise` has `win-0..2` markers but no cursor element. The clone
  matches that: no cursor is fabricated for steps 2–4. The runner already
  understands `--win`, so enabling optimise later needs only a cursor span in
  its payload (no JS change); steps 2–3 would need invented targets.
- Local image is `/sites/tano/images/cursor-2.svg` (byte-identical to the
  source `/brand/hero/cursor.svg`), not the source URL.
- Port 3000 runs `next start` and still serves the pre-change bundle; rebuild or
  restart it before visual comparison. Port 3100 is the dev server used here.
