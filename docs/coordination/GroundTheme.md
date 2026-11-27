# GroundTheme — Lenis + dark↔light ground

Status: complete. Files: `motion/use-lenis.ts`, `motion/use-ground-tone.ts`,
`lib/tano/motion.ts`, `styles/tano/ground.css`, this report (+ `GroundTheme-shots/`).
No files outside this list were edited. `runtime.tsx` already calls both hooks and
its temporary ground block has been removed by the orchestrator.

## Source evidence

- `0ef8lriq_goox.js:35135` — `SmoothScroll`: `{ autoRaf: true, lerp: .14,
  smoothWheel: true, syncTouch: false, anchors: true, stopInertiaOnNavigate: true,
  prevent: () => document.body.style.overflow === "hidden" }`, disabled for
  `(pointer: coarse), (prefers-reduced-motion: reduce)`.
- `0ef8lriq_goox.js:63198` — `GroundShift`: visible `[data-ground-dark]` bands;
  `bottom = data-ground-dark === "open" ? Infinity : top + height`; dark while
  `scrollY + .45 * innerHeight` is inside a band; first application snaps and sets
  `data-ground-ready` in rAF. With a veil: `data-ground-moving`, veil opacity
  `current → .5` with `cubic-bezier(.11,0,.5,0)` over `|Δ| × --ground-ms`, then
  `--ground-t`/`--ink-t` snap to the target, `data-ground-tone` flips when ink ≥ .5,
  `data-ground-swap` for 320 ms with `data-ground-near` on visible
  `main > *, .wire-nav, .wire-footer` text/SVG (max 300), veil flips to the old tone
  and fades `.5 → 0`. Without a veil it tweens the variables (600 ms ground, 150 ms
  ink at 225 ms delay). Route change resets, then re-measures.
- `source.css` already owns the veil, `html` ground mix, `--ground-ms: .6s`,
  `--ground-ease: cubic-bezier(.45,0,.55,1)`, `--ink-ms: .15s`,
  `--ink-ease`, `--ink-delay`, `[data-ground-tone]`, `[data-ground-moving]`,
  `[data-ground-swap]`, `[data-ground-near]` and `.wire-veiled` transparency.
  `ground.css` only adds the reduced-motion veil guard.
- Live checks at 1440×900: source rise 0→.5 over ~327 ms, values snap at ~403 ms,
  fade to 0 and `data-ground-moving` cleared by ~786 ms; tone flips at the snap.

## Implementation

- `useLenisScroll` uses the source options verbatim, `useSyncExternalStore` on the
  source media query (no instance exists before the query is read), adds/removes
  `html.lenis`, and destroys the instance when the query turns disabled or the route
  becomes `/talk-to-us`. It is not recreated on ordinary route changes.
- `useGroundTone` mounts one `.wire-ground-veil` inside `.wire-veiled` (the source
  position), re-collects bands on route change, resize and `ResizeObserver(body)`,
  samples the 45% line on a rAF-throttled native `scroll`, and reproduces the
  veil/swap/near sequence above. Reduced motion (initial, media change) and the
  first application snap; an interrupted swap fades the veil from its current
  opacity instead of jumping.
- `lib/tano/motion.ts` exports `clamp`, `lerp`, `prefersReducedMotion`,
  `onScrollRaf`; the ground hook uses all four.

## Contract for PageFamilies / other workstreams

```ts
window.__tanoGround = {
  readonly tone: "dark" | "light";      // committed tone (flips at the veil midpoint)
  setGroundTone(tone): void;            // pin a tone, animated (snap under reduced motion)
  clearGroundTone(): void;              // release the pin, re-resolve at the 45% line
  refresh(): void;                      // re-measure bands after images/layout settle
};
```

- The hook installs this on mount and after every route change; it is removed on
  unmount.
- `setGroundTone` stays pinned until `clearGroundTone()` or the next route change;
  scrolling does not override a pin. Use markup where possible: put
  `data-ground-dark` on dark bands and `data-ground-dark="open"` on a band that
  extends to the document end (the source contract). Use the API only for routes
  that have no band markup to measure.
- Do not write `data-ground-tone`, `--ground-t` or `--ink-t` directly; the hook owns
  them.

## Measurements

Method: Playwright 1.65 / Chromium, 1440×900, dev server. For each route the first
reachable band boundary was found from `[data-ground-dark]` rects, then the page was
jumped 4 px before and 4 px after `boundary - .45 × 900`, sampling every rAF for 100
frames in both directions. Raw frames: `GroundTheme-shots/measurements.json`.
Times are relative to the first sampled frame; `moving` starts when the scroll event
is dispatched (the source hooks native scroll, not Lenis).

| Route | Crossing | Direction | scroll y | tone flip | veil peak | `moving` ends | envelope |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | dark→light, doc y 4671.05 | fwd | 4262 → 4270 | 331 ms | .5 @ 470 ms | 819 ms | **680 ms** |
| `/` | light→dark | back | 4270 → 4262 | 352 ms | .5 @ 383 ms | 742 ms | **711 ms** |
| `/guides` | light→dark, band top 1326 | fwd | 917 → 925 | 322 ms | .5 @ 366 ms | 676 ms | **632 ms** |
| `/guides` | dark→light | back | 925 → 917 | 310 ms | .5 @ 337 ms | 656 ms | **629 ms** |
| `/compare` | light→dark, band top 1222 | fwd | 813 → 821 | 319 ms | .5 @ 388 ms | 747 ms | **678 ms** |
| `/compare` | dark→light | back | 821 → 813 | 333 ms | .5 @ 360 ms | 679 ms | **652 ms** |
| `/use-cases/drive-revenue` | dark→light, doc y 4690.06 | fwd | 4281 → 4289 | 371 ms | .5 @ 455 ms | 802 ms | **718 ms** |
| `/use-cases/drive-revenue` | light→dark | back | 4289 → 4281 | 388 ms | .5 @ 435 ms | 769 ms | **722 ms** |

Nominal: rise `|.5 - current| × 600 ms` = 300 ms, fade 300 ms, total 600 ms.
The 632–722 ms envelope is 600 ms plus one start frame and one finish frame of
scheduling (headless rAF dropped 1–3 frames in some runs); the source live measured
~710 ms for the same sequence. `data-ground-tone` flips in the same frame as the veil
peak, and `--ground-t`/`--ink-t` snap to `0.000`/`1.000` at that midpoint — exactly
the source behaviour (the 600 ms is the veil/ground change, not a gradual
custom-property interpolation).

The 45% line is exact to the pixel on `/`: with the dark band ending at document
y 4671.046875 and `innerHeight = 900`, `scrollY 4265` is dark and `scrollY 4267`
is light; threshold `4266.046875`.

### No flicker

Composite ground = veil colour × veil opacity + `html` background × (1 − opacity),
converted to sRGB via canvas and sampled per frame across all 8 runs:

- `/` forward: luminance **13.1 → 131.3 (veil peak) → 249.1**; 0 non-monotonic frames.
- `/` reverse: **249.1 → 131.3 → 13.1**; 0 non-monotonic frames.
- Same monotonic 0 → 131.3 → 249.1 / reverse pattern on `/guides`, `/compare` and
  `/use-cases/drive-revenue`; 0 reversals > 1/255 in every run.
- The veil colour switch at the midpoint (target tone → old tone) lands in the same
  frame as the variable snap, so the composite is continuous at 131.3 (dark ground +
  .5 light veil before, light ground + .5 dark veil after).
- `data-ground-near` count was 22–72 at these crossings (cap 300); `data-ground-swap`
  clears after 320 ms. The nav's visible text spans transition from cream to dark
  over ~170–220 ms (`oklab(0.982535…) → oklab(0.210181…)`), matching the source's
  .22 s near-text colour rule. Footer link colour resolves to the new theme at the
  same midpoint (it is offscreen at these crossings, so it is not near-marked).

### Lenis matrix

| Context | `html.lenis` | Result |
|---|---:|---|
| `/` `/guides` `/compare` `/use-cases/drive-revenue` | yes | `lenis` class, lerp .14, autoRaf |
| `/talk-to-us` | no | contact sheet is `100svh; overflow:hidden`; native inner scrolling |
| 390×844, `hasTouch: true` (`pointer: coarse`) | no | source query |
| `reducedMotion: "reduce"` | no | source query; ground snaps (veil opacity 0, no moving attr) |
| client nav `/compare` → `/` | yes | one veil, one `__tanoGround`, no duplicate listeners/console errors |

Reduced motion snap was measured across 8 rAF frames after `scrollTo`: frame 0–1
`--ground-t: 1.000`, frame 2+ `0.000`, `data-ground-tone=light`, veil opacity 0,
`data-ground-moving` absent.

## Screenshots

`GroundTheme-shots/<route>-before.png`, `-mid.png`, `-after.png`,
`-reverse-mid.png`, `-reverse-settled.png` for `home`, `guides`, `compare`,
`use-cases-drive-revenue` (1440×900 viewport, cookie banner present as on the live
captures). `home-mid.png` shows the veil crossfade: ground still dark, ink still
cream, ground luminance rising; `home-after.png` shows light ground with dark nav
text and dark footer links. `screenshot-timing.json` records capture latencies
(90–580 ms for the mid shots; the numeric samples above are the precise timing).

## Residual differences / notes

1. The source veil halves are `|Δopacity| × --ground-ms`; the fade-out is 300 ms, not
   600 ms (total 600 ms). This is deliberate and matches the measured live sequence.
2. `--ground-t`/`--ink-t` snap at the veil midpoint, as in the source. The time-based
   change is the veil envelope; only the no-veil fallback tweens the variables.
3. The clone's SSR `<html>` hardcodes `--ground-t:1` / `data-ground-tone="dark"` on
   every route (layout-owned), so `/talk-to-us` hydrates to light. The hook snaps it
   on mount; it is a one-frame flash only when hydration is slow.
4. The SSR markup contains no veil; the hook mounts it inside `.wire-veiled` (the
   source's parent) so the brand ground tokens resolve. One element per document,
   verified after client navigation.
5. Lenis is intentionally absent on `/talk-to-us` (assignment), although the live
   capture has `html.lenis` there; the page does not scroll the document.
6. `--ground-ease` is not read by the source JS; the stylesheet value is left
   untouched. The JS veil uses the source's two veil curves.
