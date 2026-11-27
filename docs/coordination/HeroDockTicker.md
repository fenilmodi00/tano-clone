# HeroDockTicker — hero bottom ticker float / fade / dock

Status: source behaviour measured; current local implementation verified at 3100 on an
isolated copy of the tree taken 2026-11-27 14:24 UTC (`hero-campaign.tsx` 14:08,
`runtime.tsx` hydration gate 14:20; the shared dev server was down/flapping while other
agents finished). `styles/tano/hero.css` needs no change: every dock rule is already ported in
`styles/tano/source.css` and computes identically. Per `[coord]` from `Main` I did not
edit `home/hero-campaign.tsx`; the deltas below are for its owner.

## Source evidence

- Live component: `js/3wa99p2ledxp-.js`, module `50686` (`HeroStatStrip`); dock state
  hook immediately before `className:"hp-hero-strip-row"`.
- CSS (`site/css/all.css`, mirrored in `src/styles/tano/source.css`):
  - `.hp-hero-strip-dock{width:100%;position:relative}`
  - `[data-floating=true]{bottom:var(--dock-pad);left:var(--dock-left,0);z-index:18;width:var(--dock-width,100%);position:fixed}`
  - `[data-floating=true]:before` full-bleed page-primary backing + top hairline
  - `.hp-hero-strip-dock{transition:opacity .2s}`
  - `[data-aside][data-floating]{opacity:0;pointer-events:none;animation:none}`
  - `[data-intro=true]{animation:.42s cubic-bezier(.22,1,.36,1) both hp-dock-rise}`
  - reduced motion: `[data-intro=true]{animation:.2s ease-out both hp-dock-fade}`
- `--dock-pad` = `--unit-3-00` = **12px** (computed `12px` on `.hp-hero-strip-row`).
- Row's previous sibling is the campaign track `ol.hp-camp-track`; its rect drives
  `data-aside`.

### Source algorithm (decoded)

```
measure()                        // initial call + rAF-coalesced scroll/resize
  rect = row.getBoundingClientRect()
  if (rect.height === 0) { floating = false; return }
  pad = parseFloat(getComputedStyle(row).getPropertyValue("--dock-pad")) || 0
  floating = rect.bottom > innerHeight - pad
  dockH = dock.getBoundingClientRect().height
  prev = row.previousElementSibling?.getBoundingClientRect()   // .hp-camp-track
  aside = floating && prev && prev.top < innerHeight
          && prev.bottom > innerHeight - 2*pad - dockH
  if (!floating) entered = true          // first dock consumes the intro
  metrics = { left: rect.left, width: rect.width }

render
  data-floating = floating
  data-aside    = aside ? "true" : absent
  data-intro    = floating && !entered   // true only before the first dock
  --dock-left / --dock-width = metrics, applied only while floating
```

One passive `scroll` + one `resize` listener, coalesced through a single
requestAnimationFrame; both removed on unmount.

## Live source measurements — 1568×829

Natural row rect at scrollY 0: `x=128 y=1172.781 w=1312 h=40`. Fixed dock:
`x=128 y=777 w=1312 h=40` (829 − 12 − 40); inline
`--dock-left:128px; --dock-width:1312px`. Track natural rect:
`y=1121.781 h=27 bottom=1148.781`.

| scrollY | data-floating | data-intro | data-aside | position | opacity | dock y | note |
|---|---|---|---|---|---|---|---|
| 0 (fresh) | true | **true** | absent | fixed | 0 → 1 / .42s | 777 | `hp-dock-rise` runs once |
| 100 | true | true | absent | fixed | 1 | 777 | |
| 292 | true | true | absent | fixed | 1 | 777 | aside starts at 292.78 |
| 293 | true | true | true | fixed | 0 | 777 | `.2s` opacity fade |
| 300 | true | true | true | fixed | 0 | 777 | |
| 383 | true | true | true | fixed | 0 | 777 | aside ends at 383.78 |
| 390 | true | true | absent | fixed | 0.805 | 784.8 | clearing `[data-aside]` re-applies `[data-intro=true]`; rise/fade replays |
| 395 | true | true | absent | fixed | 0.992 | 777.3 | last floating pixel |
| 396 | false | **false** | absent | relative | 1 | 776.8 | row bottom 816.78 < 817 |
| 600 | false | false | absent | relative | 1 | 572.8 | in flow, 1:1 with scroll |
| 0 (return) | true | **false** | absent | fixed | 1 | 777 | refloats instantly; **no intro replay** |

- Float while `row.bottom > innerHeight − pad`: `1212.781 − scroll > 817` → scroll < **395.78**.
- Aside while floating: `track.top < 829` → scroll > **292.78**; `track.bottom > 765`
  → scroll < **383.78**.
- `style` present only while floating (at 400 `style=""`, later `null`).
- Reduced motion: fixed y=777, vars set, `hp-dock-fade .2s both`; no translate.

`docs/research/tano/motion/home-frames` at 1568×900 agrees: float to 395,
aside 292.78–383.78, dock at 396, relative 1:1 after.

## Live source — 390×844 (mobile)

`.hp-camp-sticky > .hp-hero-strip-row{display:none}` at ≤767px. Row/dock rects are
0×0 and the dock stays `position:relative`, `data-floating=false`,
`data-intro=false`, no `data-aside`, no inline `--dock-*` at scroll
0/100/200/300/400/600/0. **There is no floating ticker on phone.** Source short-circuits
on row height 0.

## Local replica geometry — 1568×829

Current local row `x=128 y=1100.781 w=1312 h=40` (72px higher than source because the
local hero stack is shorter); track `y=1049.781 h=27 bottom=1076.781`; pad 12.
Source-equivalent thresholds on *this* geometry:

- float while scroll < **323.78** (`1140.781 − scroll > 817`);
- aside while floating for **220.78 < scroll < 311.78**;
- expected fixed rect `x=128 y=777 w=1312 h=40`.

## Landed code in `home/hero-campaign.tsx` (Main; not edited by me)

The block at ~621-650 has `syncDock`, an rAF-coalesced scroll/resize pair, and cleanup.
The current version starts with `requestAnimationFrame(syncDock)` and now runs after the
page runtime's hydration gate (`runtime.tsx` mounts `PageHooks` 600ms after `load`), so
the earlier home hydration failure no longer wipes the dock. Verified behaviour below;
remaining source deltas:

1. Hard-coded `scrollY <= 24` (float) / `> 520` (dock) instead of rect thresholds.
   On this layout it fades from 25 (source-equivalent 220.78) and stays fixed until 521
   (source-equivalent 323.78).
2. `dock` is captured once; `syncDock` mutates that node and measures
   `dock.getBoundingClientRect()` (already fixed), so a resize while floating keeps a
   stale `--dock-width`. Source measures the row.
3. `data-intro` is re-set on every refloat (`scrollY <= 24`), replaying the 0.42s rise;
   source sets `data-intro=false` after the first dock and refloats without it.
4. Mobile: row height is 0 but `syncDock` still sets `data-floating=true`,
   `data-intro=true` and `--dock-*:0px`. Source leaves the dock false/relative.
5. On dock it leaves `--dock-left/--dock-width` inline; source removes them.
6. Destroy writes `data-floating=false`/`data-intro=false` instead of restoring the
   captured originals (replica original is false, currently harmless).
7. It does not remove `data-intro` after 0.42s. Source keeps the attribute while first
   floating; the CSS rise replay at scroll 384 depends on that. Removing it after the
   animation loses only the 12px-band replay.

## Verified local result (isolated copy of current tree, port 3100, Chromium)

1568×829, fresh load, foreground, no console/page errors. Mount persists (no hydration
regeneration); `scenes=1`; fixed dock `x=128 y=777 w=1312 h=40`.

| scrollY | data-floating | data-intro | data-aside | position | opacity | dock y | match vs source-equivalent |
|---|---|---|---|---|---|---|---|
| 0 | true | true | absent | fixed | 1 | 777 | yes (intro done by measurement) |
| 25 | true | true | `""` | fixed | 0 | 777 | **no** — should stay visible until 220.78 |
| 100 | true | true | `""` | fixed | 0 | 777 | **no** — source opacity 1 |
| 200 | true | true | `""` | fixed | 0 | 777 | **no** — source opacity 1 |
| 300 | true | true | `""` | fixed | 0 | 777 | yes at this checkpoint |
| 324 | true | true | `""` | fixed | 0 | 777 | **no** — should dock here |
| 400/500/520 | true | true | `""` | fixed | 0 | 777 | **no** — should be relative |
| 521 | false | false | absent | relative | 1 | 579.8 | docks late; vars left inline |
| 600 | false | false | absent | relative | 1 | 500.8 | yes (in flow) |
| 0 (return) | true | **true** | absent | fixed | 1 | 777 | **no** — source intro=false; local replays `hp-dock-rise` |

- Mobile 390×844: row `display:none`; dock `data-floating=true`, `data-intro=true`,
  `position:fixed`, 0×0, `--dock-left:0px; --dock-width:0px`, opacity 0 at scroll 0 and
  300; source is `false`/relative with no vars.
- Reduced motion 1568×829: fixed y=777, `hp-dock-fade 0.2s`, opacity 1, no translate;
  dock/undock logic unchanged. Matches source.
- Listeners: one scroll + one resize add per mount with a destroy stack that removes
  both; `mounted` WeakMap still guards re-entry. No duplicate behaviour observed.
- Screenshots: `/tmp/hero-dock-shots/verified-1568-{top,300,600,backtop}.png`,
  `local2-390-top.png`; source captures `src-1568-*.png`, `src-390-top.png`.

## Gate / contract note

The runtime's hydration gate is required: when `mountHeroCampaign` ran before the page
subtree hydrated, React logged `Hydration failed because the server rendered HTML
didn't match the client` (24 entries in `.next/dev/logs/next-development.log`,
including `HomeReplica`) and regenerated the tree at ~1.4s. That replaced the dock and
camp nodes, leaving `data-floating=false` and detached listeners (scroll no longer
repaired it). With `PageHooks` deferred until `load` + 600ms, the mismatch is gone and
the verified run above is stable. Do not remove that gate without re-testing.
