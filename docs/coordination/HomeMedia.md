# HomeMedia

Status: implemented and measured against live at 1568x900. No console errors in the
local page, the live page, or the reduced-motion runs.

## Scope and files

| File | Role |
|---|---|
| `src/components/sites/tano/content/home-marks.ts` | Typed capture of the live `.wire-cases-mark` set: name, local mask, aspect, optical scale, hue, category, case-study link, band caption. |
| `src/components/sites/tano/home/media-sections.tsx` | DOM controllers: mark marquee, case deck geometry, brand tabs, closing-card reveal, tracking copy. |
| `src/components/sites/tano/motion/use-home-media.ts` | `useEffect` entry point called by `SiteRuntime`; returns the cleanup. |
| `src/styles/home-media.css` | `data-copied` feedback and reduced-motion copy transition. |
| `docs/coordination/HomeMedia.md` | This report. |

The SSR markup is treated as content. No replica route, `runtime.tsx`, `layout.tsx`
or `globals.css` was edited. `interactions.tsx` no longer handles `.hp-tm-copy`;
this hook is the sole copy-button owner (confirmed by Main).

## 1. Featured logo marks

Source (`MarkMarquee`, `3878097n9za7t.js:23094`) computes the copy count as

```js
m = Math.max(2, Math.ceil(stripWidth / copyWidth) + 1)
```

and renders `m` identical copies. At 1568 the live page resolves to:

| Band | Unique marks | Copies | `.wire-cases-mark` | Copy width | Run width |
|---|---:|---:|---:|---:|---:|
| Brand band | 11 | 2 | 22 | 3300 px | 6600 px |
| As featured in | 5 | 3 | **15** | 1500 px | 4500 px |

The replica SSR had the same 11 + 5 unique marks but only two copies in the
featured band, i.e. 10 marks. The hook now appends the source's third copy from
the typed five-mark set, so the local page reaches **15** featured marks / **37**
marks total, exactly the live count. No unique brand was duplicated in the data:
the five entries in `HOME_FEATURED_MARKS` are the live AdAge, Campaign, Net
Influencer, Yahoo Finance and ETN marks, all with local `/brand-mark/...` masks.
A generated copy has `aria-hidden="true"` marks and no tab stop, matching the
source's decorative copies. Computed mask sizes at 1568 match live exactly
(48x144, 37.90625x182.34375, 33.59375x205.625, 31.1875x221.421875,
80.015625x86.34375).

Marquee: 26 px/s base speed, 0.9 s exponential speed easing, dt capped at 50 ms,
modulo wrap at the copy width, IntersectionObserver start/stop on the strip, and
focus-hold pause. Measured 130.4 px of travel in 5.0 s (26.1 px/s) and no
movement while the strip is offscreen.

Pointer drag/throw follows the source `MarkMarquee`: offset tracks the pointer
after any left-button press, capture is taken past 6 px, release velocity uses
the 90 ms sample window, and the resulting speed eases back into autoplay. A
drag past 6 px swallows the next click for 300 ms so a mark's case-study link
does not fire. The controller is shared, so every capture band on the home and
use-case routes gets the same behaviour.

## 2. Case deck

Exact source math implemented in `media-sections.tsx`:

```js
cover   = clamp(1 - (nextTick.top - slotTop) / 240, 0, 1)   // --cover, 2 decimals
covered = nextTick.top < slotTop + 2                        // data-covered
depth   = coveredCount - index                              // --covered-depth
ghost   = color-mix(in oklab, prev, next, round(progress*100)%) // 0.6 * innerHeight
```

`--case-h` is the tallest slot (`512px` at 1568), observers watch each next
slot's tick with `rootMargin: -(round(slotTop)+2)px 0 0 0`, scroll updates run in
one rAF, `scrollend` re-checks `data-covered`, and resize re-initialises.

Measured local vs live (same browser, 1568x900, after 800 ms settle):

| scrollY | slot | local `--cover` / covered / depth | live `--cover` / covered / depth |
|---:|---:|---|---|
| 4800 | 0 | `0.00` / false / — | `0.00` / false / — |
| 4800 | 1 | `0.00` / false / — | `0.00` / false / — |
| 5100 | 0 | `0.09` / false / — | `0.09` / false / — |
| 5100 | 1 | `0.00` / false / — | `0.00` / false / — |
| 5250 | 0 | `0.71` / false / — | `0.71` / false / — |
| 5250 | 1 | `0.00` / false / — | `0.00` / false / — |

`arithmeticMatch: true` over the three positions, including the serialized
`--cover`, `data-covered`, `--covered-depth`, computed transforms,
`--case-h: 512px` and ghost hues (`4%`, `60%`, `87%`). Deeper probes also match:
at 5400 slot 0 is `1.00` / true / depth 1 with `matrix(.96,0,0,.96,0,-18)`;
at 5850 slot 0 is `1.00` / true / depth 1 and slot 1 is `0.88` / false.

Note: `home-frames` README records an older probe (5100 = `0.39`, 5250 =
`1.00`). Current live and the replica both place every slot after the first 72 px lower
than that probe, so the current live comparison above is the verification
source. The formula and implementation are unchanged.

## 3. Brand tabs (`.hp-brand-bar`)

HomeMedia is the sole runtime owner. HomeInfo's duplicate brand-tab timer and
listeners were removed; `use-home-media.ts` mounts this controller. Implemented
from `HomeBrands` (`3wa99p2ledxp-.js:41142`):

- arrival via the source two-observer play zone (`rootMargin: 0 0 -40%`,
  ratio threshold 0.75); timer starts on arrival and resets to index 0 on leave;
- 6000 ms auto-advance while in view, not focused and not reduced-motion;
- active tab gets `data-active=true`, `aria-selected=true`, roving tabindex 0;
- the active tab's `.hp-brand-tab-fill` gets `--hp-brand-duration:6000ms`,
  `--hp-brand-count`, `--hp-brand-index`, and `data-paused` follows running/focus;
- 260 ms `data-fading` cross-fade; shots/marks/quote switch after the fade;
- ArrowLeft/Right/Up/Down, Home and End move focus and selection;
- the live blockquote is rebuilt from the active brand's ghost quote with the
  source 40 ms per-word stagger.

Measured on `/compare/agentio-vs-tano` at 1568: active tab 0 on arrival; one
transition to active tab 1 at ~6.0 s from arrival (6.2 s from the first sample,
including setup), with no second advance over 7.5 s; `data-fading=true` during
the 260 ms swap; shot `data-live` and quote index switch 0 -> 1; ArrowRight
moves 0 -> 1, a second ArrowRight returns 1 -> 0; leave resets to 0 and re-entry
restarts the 6000 ms timer; reduced motion stays on tab 0 after 7 s.

Remaining gap: the replica SSR only carries the active study's `.hp-brand-figure`
stat, `.hp-brand-who` and `.hp-brand-foot` action. Tabs 1+ swap the quote, media
shot, media mark, tab state and cross-fade, but those three nodes keep study 0's
content. Selector/state: `.hp-brand-bar [role=tab][data-active=true]` index > 0.
Fixing that needs per-study stat/who/action data that the replica does not ship;
it is not a motion gap.

## 4. Tracking copy buttons

Delegated click on `.hp-tm-copy`, reading `.hp-tm-field-value`:

- writes once via `navigator.clipboard.writeText`;
- sets `data-copied="true"` for 1400 ms (CSS: spectrum-lime fill, dimmed glyph);
- changes `aria-label` to `"<label> copied"` and restores the original label;
- no state change on clipboard rejection; timers cleaned on unmount.

Measured: `data-copied=true` at +120 ms, removed by +1.52 s, original
`aria-label` restored, no console errors. Main removed the duplicate
`interactions.tsx` handler.

## 5. Closing cards

`.hp-closing-cards` gets `data-seen="true"` on the source play-zone arrival
(`rootMargin: 0 0 -40%`), and `data-inview` from the source OffscreenPause
geometry (`200px 0px`). No campaign animation JS is duplicated; the CSS 1 s
stagger and camp loops run untouched (`.hp-camp-card` computed
`animation-play-state: running`). Measured: `data-seen=true` on the first
sample after intersection, opacities 0 -> 1, running loops; reduced motion shows
all four cards at opacity 1.

## 6. Verification setup

- Local: `http://127.0.0.1:3000/` and `/compare/agentio-vs-tano`, Chromium via
  the repo's Playwright, 1568x900 DPR 1, `prefers-reduced-motion: no-preference`
  (plus a separate `reduce` run).
- Live: `https://www.tano.ai/` and `/compare/agentio-vs-tano`, same viewport.
- Console/page errors collected on every run: `[]` local and live.
- Mobile spot check at 390x844: featured band correctly stays at two copies
  (10 marks) under the same `ceil(390/1050)+1` formula; no horizontal overflow.

## Contracts

- `HOME_MARK_BANDS`, `HOME_FEATURED_MARKS`, `findHomeMarkBand(caption)` from
  `content/home-marks.ts`.
- `mountHomeMediaSections(): () => void` from `home/media-sections.tsx`.
- `useHomeMedia()` from `motion/use-home-media.ts`; already invoked once by
  `SiteRuntime`.
