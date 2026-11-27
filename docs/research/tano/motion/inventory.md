# Motion inventory — Tano marketing site

Source of truth: `/home/boxd/tano/site/css/all.css` (467,902 bytes, 129 `@keyframes`), the inline `<style>` block served on every captured page, and the 26 deobfuscated bundles in `/home/boxd/tano/js/`. Route presence was measured by loading each of the 44 captures at **1568 × 900** in headless Chrome 157, with `all.css` attached and the page's own stylesheet links removed, then running `document.querySelectorAll` for every animation/transition selector (pseudo-elements stripped, state attributes also stripped for a base-presence pass). Components that only mount after hydration (`.hp-flow`, `.hp-scene`, `.hp-pp` internals, `.hp-steps-scene`, drawer sheet) were cross-checked against the component source in the bundles; their route sets are marked accordingly.

## 0. Shared law and tokens

| Token | Value | Used by |
|---|---|---|
| `--rv-duration` | `760ms` | reveal block transform |
| `--rv-fade` | `280ms` | reveal block opacity |
| `--rv-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | reveal block transform |
| `--rv-y` | `1.5rem` (24px) | reveal start offset |
| quint-out | `cubic-bezier(.22, 1, .36, 1)` | 90% of entrances, all scene slides |
| soft-out | `cubic-bezier(.32, .72, 0, 1)` | nav/menu, drawer, label transitions |
| sharp-in-out | `cubic-bezier(.4, 0, .2, 1)` | exits, line draws, leaves |
| overshoot | `cubic-bezier(.34, 1.4, .64, 1)` | dots/markers; wide variant `(.34,1.56,.64,1)` for icon plates |
| `--beat-ms` | `2800ms` (inline on `.hp-flow`) | every flow-diagram delay |
| `--ease` | `cubic-bezier(.22, 1, .36, 1)` | pitch-deck scenes |
| `--state-colour-run` | `0` while the ground colour is moving, else `1` | colour transitions are multiplied by it, so they snap during a ground swap |

Breakpoints that matter: `max-width:767px` (mobile scene/flow switch), `max-width:1023px` (tablet), `min-width:768px` and `min-width:1024px` (desktop-only pitch-deck/flow moves), `(hover:hover)`, `(prefers-reduced-motion:reduce)`.

**Reduced-motion contract:** the site does not merely shorten durations. It removes keyframe loops (`animation:none`), collapses drawers/menus to `1ms`, converts reveal movement to a plain visible state, and replaces the consent entrance with a 150 ms fade. Where a JS timer is decorative (`CountUp`, marquees, flow beats, auto-advance), the JS checks `prefers-reduced-motion` before starting.

**Pause contract:** two IntersectionObservers dominate. `OffscreenPause` sets `data-inview` on `.wire-spectrum-rule, .hp-hero-glow, .hp-camp, .hp-closing-cards, .hp-hero-strip, .hp-scale-window, .hp-convo-agent, .car, .hp-ct-row, .hp-ccar` with `rootMargin: '200px 0px'`. CSS then applies `animation-play-state:paused!important` to their descendants. `useMotionPause` combines reduced-motion, an explicit pause, focus-hold, and `usePlayZone` visibility (`rootMargin:'0px 0px -40% 0px'`; leave when ratio < .75).

## 1. Reveal system (`.rv-scope`)

**Trigger:** `.rv-scope` controller (`RevealMotion`, `0ef8lriq_goox.js`). The 95% release line, 70 ms stagger (capped at index 7), and 46 ms word stagger are enforced in JS; CSS only supplies the transitions/keyframes. `[data-rv-onload]` elements animate immediately instead of waiting for the observer.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `rv-load-word-rise` | `0%{transform:translate3d(0,.34em,0)}to{transform:none}` | 440ms · cubic-bezier(0.2,1.3,0.34,1) · calc(var(--rv-word,0) * 46ms) | load | all 44 | — | — |
| `rv-load-fade` | `0%{opacity:0}to{opacity:1}` | 240ms · linear · calc(var(--rv-word,0) * 46ms)<br>280ms · linear · 70ms | load | all 44 | — | — |
| `rv-load-rise` | `0%{transform:translate3d(0,var(--rv-y),0)}to{transform:none}` | 760ms · cubic-bezier(0.22,1,0.36,1) · 70ms | load | all 44 | — | — |
| `rv-mark-tilt` | `0%{transform:scale(.82)}58%{transform:scale(1.06)}100%{transform:scale(1)}` | 620ms · cubic-bezier(0.34,1.4,0.5,1) · calc(var(--rv-word,0) * 46ms + 260ms) | inview | all 44 | — | — |

## 2. Spectrum rules, ground and footer

The 4 px spectrum rules and the footer/header drift use one 200%-wide gradient translated by `-50%` over 32 s. Hover/focus inside `.wire-spectrum-glow` swaps to a 7 s background-position travel. Both stop when the element's container is marked `data-inview=false` (200 px margin) or while the ground colour is changing (`html[data-ground-moving]`).

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `wire-spectrum-drift` | `0%{transform:translate(-50%)}to{transform:translate(0)}` | 32s · linear · infinite | continuous (auto) | all 44 | none | — |
| `wire-spectrum-travel` | `to{background-position:-100% 0}` | 7s · linear · infinite | hover/focus | all 44 | none | (hover:hover); @supports ((-webkit-hyphens:none)) |

## 3. Hero glow folds

Two stacked SVG/CSS fold layers drift in opposite directions; durations are deliberately co-prime-ish (58 s / 41 s) so the folds never visibly repeat. They pause offscreen and during ground swaps, and are removed under reduced motion.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-fold-drift-a` | `0%{transform:translate(-1600px)}to{transform:translate(0)}` | 58s · linear · infinite | continuous (auto) | 43 | none | — |
| `hp-fold-drift-b` | `0%{transform:translate(0)}to{transform:translate(-1100px)}` | 41s · linear · infinite | continuous (auto) | 43 | none | — |

## 4. Hero camp (`.hp-camp`)

The hero campaign stage rotates four campaign scenes. Scene entry is `.hp-camp-scene` opacity (0.6 s ease, fill both); exit is `data-leaving` → `hp-camp-out` plus a 600 ms React cleanup. The inner brief/chat/metric panels run independent infinite loops anchored to CSS variables. `data-motion=paused` and `data-inview=false` freeze all descendants. The closing CTA reuses the same campaign cards.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-camp-in` | `0%{opacity:0}` | .6s · ease | continuous (auto) | 1 | none | — |
| `hp-camp-out` | `to{opacity:0}` | .6s · ease · 0s · 1 | state: leaving | 1 | none | — |
| `hp-camp-chip-pick` | `0%,10%,94%,to{border-color:var(--camp-rule);color:var(--text-secondary);background-color:#0000}16%,88%{border-color:var(--text-primary);background-color:var(--text-primary);color:var(--page-primary,#0e0d0c)}` | 6.4s · ease · infinite | state: picked | 28 | — | — |
| `hp-camp-score-win` | `0%,40%,92%,to{color:color-mix(in srgb,var(--camp-dark-ink) 60%,transparent);background-color:#0000}48%,86%{background-color:color-mix(in srgb,var(--camp-dark-ink) 8%,transparent);color:var(--camp-dark-ink)}` | 6.4s · ease · infinite | state: win | 28 | — | — |
| `hp-camp-turn-1` | `0%,2%{opacity:0}8%,88%{opacity:1}94%,to{opacity:0}` | 7.2s · ease · infinite | continuous (auto) | 28 | none | — |
| `hp-camp-turn-2` | `0%,26%{opacity:0}32%,88%{opacity:1}94%,to{opacity:0}` | 7.2s · ease · 0s · infinite | continuous (auto) | 28 | none | — |
| `hp-camp-turn-3` | `0%,50%{opacity:0}56%,88%{opacity:1}94%,to{opacity:0}` | 7.2s · ease · 0s · infinite | continuous (auto) | 28 | none | — |
| `hp-camp-metric-turn` | `0%,44%{opacity:1}50%,94%{opacity:0}to{opacity:1}` | 9s · ease · infinite | continuous (auto) | 28 | none | — |
| `hp-camp-metric-draw` | `0%,4%{clip-path:inset(-20% 100% -20% 0)}32%,50%{clip-path:inset(-20% 0)}50.1%,to{clip-path:inset(-20% 100% -20% 0)}` | 9s · cubic-bezier(.22, .61, .36, 1) · infinite | continuous (auto) | 28 | none | — |
| `hp-camp-bar-fill` | `0%,6%{transform:scaleX(0)}26%,90%{transform:scaleX(var(--share,1))}96%,to{transform:scaleX(0)}` | 6.4s · cubic-bezier(.22, .61, .36, 1) · infinite | continuous (auto) | 28 | — | — |

## 5. Announcement bar and notification toast

There are two announcement surfaces: the top `hp-announce` bar (height transition .42 s, line cross-fade .3 s/.12 s delay) and the floating `hp-notify` toast (opacity .24 s, translate .42 s, layer promote/leave keyframes). Both are gated by `data-open`/`data-shown` and are disabled for reduced motion (opacity only / no animation).

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-note-word` | `0%{opacity:0;transform:translateY(.24em)}to{opacity:1;transform:translateY(0)}` | .42s · cubic-bezier(.22,1,.36,1) | continuous (auto) | 1 | none | — |
| `hp-notify-promote` | `0%{opacity:.7;transform:translateY(var(--unit-2-00)) scale(.94)}to{opacity:1;transform:none}` | .56s · cubic-bezier(.22,1,.36,1) | announcement turn | 1 | none | — |
| `hp-notify-leave` | `to{opacity:0;transform:translateY(calc(-1 * var(--unit-6-00))) scale(.96)}` | .48s · cubic-bezier(.32,.08,.24,1) | continuous (auto) | 1 | none | — |

## 6. Logo / case-mark marquee

No CSS keyframes: `wire-cases-marks-run` is a rAF marquee. Speed 26 px/s, velocity smoothing `1-e^(-dt/0.9)`, dt capped at 50 ms, translate3d with modulo wrap. Drag adds velocity; IntersectionObserver stops the rAF offscreen; `useMotionPause().paused` sets speed 0.


## 7. Loop and steps (`.hp-steps`, hero campaign track)

The hero campaign track and the ProcessPlayer share `.hp-steps-seg` progress bars. Hero campaigns use 8000 ms each; ProcessPlayer step durations are computed as `beats × 2800 ms + tail` (observed 11600–12200 ms). `.hp-steps-fill` is a linear width 0→100% with `forwards`; `data-paused` pauses it. Mobile scene changes use 420 ms slide/leave transitions; desktop/flow scenes use the beat-driven `hp-flow-*` animations.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-steps-fill` | `0%{width:0%}to{width:100%}` | 8000ms (hero) / 11600-12200ms (steps); fallback 7s · linear | continuous (auto) | 3 | none | — |
| `hp-steps-leave` | `to{opacity:0;transform:scale(.985)}` | .42s · cubic-bezier(.4,0,.2,1)<br>.42s · cubic-bezier(.4,0,.2,1) · 0s · 1 | state: leaving, reduced-motion override | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-in` | `0%{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) | state: entering | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-out` | `to{transform:translate(-100%)}` | .42s · cubic-bezier(.4,0,.2,1) · 0s · 1 | state: leaving | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-in-back` | `0%{transform:translate(-100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: entering | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-out-back` | `to{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: leaving | 3 | 1 ms, none | (max-width:767px) |

## 8. Flow diagrams (desktop ProcessPlayer, `.hp-flow`)

Desktop ProcessPlayer (`P`) renders `.hp-flow` with `--beat-ms: 2800ms` set inline. Every reveal is delayed by an authored beat index × 2800 ms; the whole tree pauses via `data-paused` (offscreen/held) and becomes `data-still` under reduced motion. Entry/exit choreography uses the shared `cubic-bezier(.22,1,.36,1)`; wipes/lines use the sharper `cubic-bezier(.4,0,.2,1)`. Durations cluster at .16–.56 s, with .82 s window slides and .86 s creator arrival.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-flow-wake` | `to{--flow-content:1;transform:none}` | .56s · cubic-bezier(.22, 1, .36, 1) · calc(var(--wake) * 2800ms) | flow beat | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-rest` | `to{--flow-content:.4}` | .56s · cubic-bezier(.22, 1, .36, 1) · calc(var(--wake) * 2800ms) | flow beat | 3 | — | (max-width:767px); (min-width:1024px) |
| `hp-flow-in` | `0%{opacity:0;transform:translateY(calc(var(--u) * .8))}to{opacity:1;transform:none}` | .48s · cubic-bezier(.22, 1, .36, 1) · calc(var(--beat) * 2800ms) | continuous (auto), state: picked | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-chip-on` | `to{box-shadow:inset 0 0 0 1.5px var(--flow-active);background-color:#fbf9f51a}` | .24s · ease · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-fill` | `0%{transform:scaleX(0)}` | .9s · cubic-bezier(.22, 1, .36, 1) · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-focus` | `to{box-shadow:inset 0 0 0 1.5px var(--flow-active)}` | .22s · ease · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-count-in` | `0%{opacity:0;transform:translateY(40%)}to{opacity:1;transform:none}` | .2s · ease · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-count-out` | `to{opacity:0;transform:translateY(-40%)}` | .16s · ease · calc(var(--until) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-tip-out` | `to{opacity:0;visibility:hidden}` | .16s · ease · calc(var(--until) * 2800ms)<br>.2s · ease · calc(var(--until) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-check-on` | `to{background-color:var(--flow-active);box-shadow:none}` | .2s · ease · calc(var(--beat) * 2800ms) | continuous (auto), state: picked | 3 | — | — |
| `hp-flow-live` | `to{opacity:1}` | .24s · ease · calc(var(--beat) * 2800ms + .14s) | continuous (auto) | 3 | — | — |
| `hp-flow-dim` | `to{opacity:.4}` | .3s · ease · calc(var(--beat) * 2800ms + .12s) | state: picked | 3 | — | — |
| `hp-flow-show` | `to{opacity:1}` | .3s · ease · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | (max-width:767px) |
| `hp-flow-draw` | `to{stroke-dashoffset:0}` | .42s · cubic-bezier(.4, 0, .2, 1) · calc(var(--beat) * 2800ms)<br>calc(2800ms * 1.8) · linear · calc(2800ms * .1) | continuous (auto) | 3 | — | — |
| `hp-flow-node-win` | `to{stroke:url(#hp-flow-tree-run);stroke-width:2px}` | .26s · ease · calc(var(--decide) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-node-lose` | `to{opacity:.35}` | .3s · ease · calc(var(--decide) * 2800ms) | continuous (auto) | 3 | — | (max-width:767px) |
| `hp-flow-option-win` | `to{border-color:var(--app-soft)}` | .26s · ease · calc(var(--decide) * 2800ms) | continuous (auto) | 3 | — | (max-width:767px) |
| `hp-flow-option-run` | `to{transform:scaleX(1)}` | .42s · cubic-bezier(.4, 0, .2, 1) · calc(var(--decide) * 2800ms) | continuous (auto) | 3 | — | (max-width:767px) |
| `hp-flow-row-pick` | `to{box-shadow:inset 0 0 0 2px var(--flow-active);background-color:#1211100f}` | .22s · ease · calc(var(--pick) * 2800ms) | state: picked | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-hide` | `0%{opacity:1}to{opacity:0}` | .16s · ease · calc(var(--gone) * 2800ms)<br>.16s · ease · calc(var(--hide) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-reply-invert` | `to{background-color:var(--app-ink);box-shadow:none;color:var(--app)}` | .2s · ease · calc(var(--beat) * 2800ms) | state: picked | 3 | — | — |
| `hp-flow-slide-over` | `0%{translate:36.5%}to{translate:0}` | .82s · cubic-bezier(.22,1,.36,1) | flow enter | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-scroll-up` | `0%{opacity:0;transform:translateY(30%)}to{opacity:1;transform:none}` | .76s · cubic-bezier(.22,1,.36,1) · .16s<br>.68s · cubic-bezier(.22,1,.36,1) · 80ms | flow enter | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-arrive` | `0%{--flow-content:1;opacity:0;transform:translate(70%)}to{--flow-content:1;opacity:1;transform:none}` | .86s · cubic-bezier(.22,1,.36,1) · .26s | flow beat | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-ruled-out` | `to{filter:grayscale();opacity:.4}` | .48s · ease · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-slide-over-offset` | `0%{translate:39.1%}to{translate:0}` | .82s · cubic-bezier(.22,1,.36,1) · 0s · 1 | flow enter | 3 | none!important | (max-width:767px); (min-width:1024px) |
| `hp-flow-campaign-press` | `45%{opacity:.85;transform:scale(.94)}to{opacity:1;transform:none}` | .3s · ease · calc(var(--press) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-zoom` | `to{transform:scale(1.3)}` | 1s · cubic-bezier(.22,1,.36,1) · .15s | continuous (auto) | 3 | — | — |
| `hp-flow-step-back` | `to{opacity:.45}` | .6s · .9s | continuous (auto) | 3 | — | — |
| `hp-flow-product-pick` | `to{box-shadow:inset 0 0 0 2px var(--flow-active)}` | .2s · ease · calc(var(--beat) * 2800ms) | state: picked | 3 | — | — |
| `hp-flow-swipe` | `0%{transform:none}to{transform:translate(-50%)}` | .76s · cubic-bezier(.65, 0, .35, 1) · calc(var(--swipe) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-print-in` | `0%{opacity:0}` | .6s | continuous (auto) | 3 | — | — |
| `hp-flow-grow` | `to{grid-template-rows:1fr}` | .42s · cubic-bezier(.22, 1, .36, 1) · calc(var(--grow) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-shrink` | `0%{grid-template-rows:1fr}to{grid-template-rows:0fr}` | .32s · cubic-bezier(.22, 1, .36, 1) · calc(var(--shrink) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-unfold` | `to{max-height:calc(var(--u) * 40);margin-top:calc(var(--u) * 1)}` | .42s · cubic-bezier(.22, 1, .36, 1) · calc(var(--beat) * 2800ms) | continuous (auto) | 3 | — | — |
| `hp-flow-lift` | `0%,to{z-index:6}` | calc((var(--hide) - var(--show)) * 2800ms + .2s) · linear · calc(var(--show) * 2800ms) | state: picked | 3 | — | — |
| `hp-flow-page-out` | `to{opacity:0}` | .6s · ease · calc(var(--swipe) * 2800ms) | continuous (auto) | 3 | — | — |

## 9. Process scene (mobile, `.hp-scene`)

Mobile ProcessScene (max-width 767 px) replaces the flow with layered scenes (`.hp-scene-layer`). Scene exit: 560 ms dissolve + 560 ms lift. Bubbles .42 s, words .36 s, cards .52 s, chips .4 s, each delayed by `--d` / `--wd` assigned per element. All children are disabled under reduced motion.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-scene-dissolve` | `0%{opacity:1}to{opacity:0}` | .56s · cubic-bezier(.32,.72,0,1) | state: leaving | 3 | none | — |
| `hp-scene-lift` | `0%{transform:none}to{transform:translateY(-22px)}` | .56s · cubic-bezier(.32,.72,0,1) | state: leaving | 3 | none, none!important | — |
| `hp-scene-word-in` | `0%{opacity:0;transform:translateY(.22em)}to{opacity:1;transform:none}` | .36s · cubic-bezier(.22, 1, .36, 1) · var(--wd,0s) | continuous (auto) | 3 | — | — |
| `hp-scene-bubble-in` | `0%{opacity:0;transform:translateY(10px)scale(.94)}to{opacity:1;transform:none}` | .42s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |
| `hp-scene-card-in` | `0%{opacity:0;transform:translateY(18px)scale(.97)}to{opacity:1;transform:none}` | .52s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |
| `hp-scene-chip-in` | `0%{opacity:0;transform:translate(-14px)}to{opacity:1;transform:none}` | .4s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |
| `hp-scene-rise` | `0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}` | .42s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |

## 10. Invoice scene

The invoice scene (inside mobile ProcessScene) draws lines in .38 s, results rise .42 s, and the result bar wipes .9 s after a +.26 s offset. Delays are inline `--d`.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-invoice-result-fill` | `0%{transform:scaleX(0)}` | .9s · cubic-bezier(.22, 1, .36, 1) · calc(var(--d,0s) + .26s) | continuous (auto) | 3 | none | — |
| `hp-invoice-line-in` | `0%{opacity:0;clip-path:inset(0 0 100%);transform:translateY(-6px)}to{opacity:1;clip-path:inset(0);transform:none}` | .38s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |

## 11. Scale scene

The scale scene (inside mobile ProcessScene) ticks a 20 s linear loop (translateY -50%), draws a sparkline in 1.1 s, and pops cards/bars in .42–.62 s. `data-still` removes the ticker.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-scale-card-in` | `0%{opacity:0;transform:translateY(12%)scale(.9)}to{opacity:1;transform:none}` | .62s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |
| `hp-scale-tick` | `0%{transform:translateY(0)}to{transform:translateY(-50%)}` | 20s · linear · infinite | continuous (auto) | 3 | — | — |
| `hp-scale-draw` | `to{stroke-dashoffset:0}` | 1.1s · cubic-bezier(.4, 0, .2, 1) · calc(var(--d,0s) + .12s) | continuous (auto) | 3 | — | — |
| `hp-scale-bar-in` | `0%{opacity:0;transform:scaleY(0)}to{opacity:1;transform:none}` | .42s · cubic-bezier(.22, 1, .36, 1) · var(--d,0s) | continuous (auto) | 3 | — | — |

## 12. Step transitions (`.hp-steps-scene`)

Segment progress uses `.hp-steps-fill` (width). Mobile scene transitions: enter 420 ms cubic-bezier(.22,1,.36,1) both, leave 420 ms cubic-bezier(.4,0,.2,1) forwards, direction-aware ±100% slides. Reduced motion removes the fill and shortens the leave.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-steps-fill` | `0%{width:0%}to{width:100%}` | 8000ms (hero) / 11600-12200ms (steps); fallback 7s · linear | continuous (auto) | 3 | none | — |
| `hp-steps-leave` | `to{opacity:0;transform:scale(.985)}` | .42s · cubic-bezier(.4,0,.2,1)<br>.42s · cubic-bezier(.4,0,.2,1) · 0s · 1 | state: leaving, reduced-motion override | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-in` | `0%{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) | state: entering | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-out` | `to{transform:translate(-100%)}` | .42s · cubic-bezier(.4,0,.2,1) · 0s · 1 | state: leaving | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-in-back` | `0%{transform:translate(-100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: entering | 3 | 1 ms, none | (max-width:767px) |
| `hp-steps-slide-out-back` | `to{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: leaving | 3 | 1 ms, none | (max-width:767px) |

## 13. Hero strip and dock

The hero strip dock rises 0.42 s on intro and cross-fades in 0.2 s under reduced motion; the logo strip itself is a 36 s linear -33.3333% loop. The dock is excluded from reveal splitting.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-dock-rise` | `0%{opacity:0;transform:translateY(100%)}to{opacity:1;transform:none}` | .42s · cubic-bezier(.22,1,.36,1) | load / intro | 1 | fade only | — |
| `hp-dock-fade` | `0%{opacity:0}` | .2s · ease-out | reduced-motion override | 1 | fade only | — |
| `hp-strip-slide` | `0%{transform:translate(0)}to{transform:translate(-33.3333%)}` | 36s · linear · infinite | continuous (auto) | 1 | none | — |

## 14. Case-study brand tabs

Case-study brand tabs auto-advance every 6000 ms while running. Each tab’s fill is a 6 s linear width animation; inactive changes debounce 260 ms (the `data-fading` cross-fade). Words inside a quote enter with a 260 ms fade and per-word 40 ms `--d` stagger (JS-assigned).

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-brand-word-in` | `0%{opacity:0}to{opacity:1}` | .26s · ease · var(--d,0s) | continuous (auto) | 22 | — | — |
| `hp-brand-fill` | `0%{width:0%}to{width:100%}` | 6000ms · linear | continuous (auto) | 18 | none | — |

## 15. Counters and stat graphics

`.hp-reveal` sets `data-shown` once when the reveal line (95% viewport, or already on screen) is crossed. Stats then draw: lines 1.1 s, area .7 s at .54 s, bars .62 s, dots .42–.48 s with per-index stagger; markers pop at 1 s. Hover reverses these animations at 0.9×/2× and replays at 0.7×/1.35× (creatorMap 2×/1.35×), with a 180 ms hold for non-creatorMap. Numeric counters run 1900 ms ease-out-cubic.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-stat-draw` | `to{stroke-dashoffset:0}` | 1.1s · cubic-bezier(.22,.61,.36,1) · .12s<br>1.1s · cubic-bezier(.22,.61,.36,1) | inview (data-shown), continuous (auto) | 7 | none | — |
| `hp-stat-fade` | `to{opacity:1}` | .7s · ease-out · .54s<br>.5s · ease-out · .12s | inview (data-shown), continuous (auto) | 7 | none | — |
| `hp-stat-run` | `to{transform:scaleX(1)}` | .9s · cubic-bezier(.22,.61,.36,1) · .18s | inview (data-shown) | 2 | none | — |
| `hp-stat-grow` | `to{transform:scaleY(1)}` | .62s · cubic-bezier(.22,.61,.36,1) | inview (data-shown), continuous (auto) | 5 | none | — |
| `hp-stat-pop` | `to{opacity:1;transform:scale(1)}` | .42s · cubic-bezier(.34,1.4,.64,1) · 1s<br>.48s · cubic-bezier(.34,1.4,.64,1) | inview (data-shown) | 3 | none | — |
| `hp-stat-pop-faint` | `to{opacity:.16;transform:scale(1)}` | .48s · cubic-bezier(.34,1.4,.64,1) · calc(.14s + var(--hp-stat-step,0) * 34ms) · 1 | inview (data-shown) | 2 | none | — |

## 16. Conversations

The agent glow breathes on a 4.8 s ease-in-out infinite loop. Chips/facts/paths are hover-driven only: color/background .2 s, path opacity/stroke .24 s, `data-lit`/background-size .24 s. Paused offscreen; glow removed under reduced motion.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-convo-glow` | `0%,to{opacity:.45;transform:translate(-50%,-50%)scale(.88)}50%{opacity:.85;transform:translate(-50%,-50%)scale(1.08)}` | 4.8s · ease-in-out · infinite | continuous (auto) | 1 | none | — |

## 17. Experiments (`.hp-xl`)

No keyframes. The experiment loop advances every 4200 ms and a one-second interval updates the elapsed clock; `usePlayZone` resets on leave. Bars animate by transition (transform .64 s cubic-bezier(.22,1,.36,1)); chips cross-fade background/color .32 s. Reduced motion removes the bar/chip transitions.


## 18. Case carousel and case deck

Two carousels: (1) for-creators `.hp-ccar-run` is an 80 s linear marquee of a duplicated set (−50%); (2) the home/case `.wire-case-banners` is a sticky deck: `--cover` progresses over 240 px, slots get `data-covered` when the next tick passes within 2 px, `--covered-depth` stacks them at 18 px/4% (10 px at mobile), and the ghost hue blends over 60% viewport. Slot transitions .32 s cubic-bezier(.22,1,.36,1).

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-ccar-slide` | `0%{transform:translate(0)}to{transform:translate(-50%)}` | 80s · linear · infinite | continuous (auto) | 1 | none | — |

## 19. Case stat strip counter

`CountUp` parses a numeric run out of the text, sets the value to 0, then animates for 1900 ms with `1-(1-r)^3` when its IO (threshold 0, rootMargin `0px 0px -12% 0px`) fires — once. `CaseStatStrip` cycles stats on a 3.6 s `--hold` per item while `data-running`, using `hp-case-stat-turn`.


## 20. Tracker (`.hp-track`, `.hp-tm`)

`.hp-track-card` is a 5 s auto-advancing card stack when running and >1 card. Active card: opacity .32 s + transform .42 s (.22,1,.36,1), 80 ms delay; inactive cards reverse visibility with `visibility 0s linear .42s`. Swipe and play/pause are JS. `hp-tm` copy buttons only flash for 1600 ms.


## 21. Creator band

No keyframes on the band itself: it is a standard `.hp-reveal` (delay 80 ms) with a glass image behind (`.hp-behind` fades over .6 s after the reveal). The form has no animation beyond button states.


## 22. FAQ accordion

Answers are grid-template-rows accordions: .32 s cubic-bezier(.22,1,.36,1), opacity .2 s closed / .26 s at 80 ms open; glyph rotates .32 s. One answer open at a time (`null` or key). Category tabs use arrow-key tab semantics. All accordion/glyph transitions are removed under reduced motion.


## 23. Closing cards

Closing CTA cards are hidden (opacity 0, translateY 14 px) and revealed when the `.hp-closing-cards` play zone arrives (`data-seen`). Transition is opacity/translate 1 s cubic-bezier(.22,1,.36,1) with slot delays .65/.85/1.05/1.25 s. `data-motion=paused` freezes campaign card animations; `data-inview=false` does too. Reduced motion removes the transition.


## 24. Navigation, mobile menu, drawer

Four-stage nav entrance: `seed` (width seed, opacity 0, translateY -56 px) → `drop` (520 ms) → `travel` (width to full, 1000 ms) → `settled` (nav-ready at 1140 ms). Link groups fade/slide in after 240 ms; wordmark after 520 ms. Mobile panel opens .26 s with 90 ms + 45 ms/index stagger. The CRM drawer uses .42 s in / .22 s out.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `wire-drawer-in` | `0%{transform:translateY(var(--wire-drawer-rise)) scale(var(--wire-drawer-scale));opacity:0}60%{opacity:1}to{opacity:1;transform:translateY(0)scale(1)}` | .42s · cubic-bezier(.32, .72, 0, 1) | continuous (auto) | all 44 | — | — |
| `wire-drawer-out` | `to{transform:translateY(calc(var(--wire-drawer-rise) / 2)) scale(var(--wire-drawer-scale));opacity:0}` | .22s · cubic-bezier(.4, 0, 1, 1) | continuous (auto) | all 44 | — | — |
| `wire-drawer-fade` | `0%{opacity:0}` | .42s · ease-out<br>.22s · ease-in | continuous (auto) | all 44 | — | — |

## 25. Buttons and cards

Rainbow buttons run a 3 s linear edge travel plus a 2.4 s glow pulse, only while hovered (`data-hover` or `:hover`). Base hover lifts 1 px over .18 s; fill cross-fade .26 s; press shortens to 80 ms. Reduced motion kills all three.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `tano-rainbow-travel` | `to{background-position:200%}` | 3s · linear · infinite | continuous (auto), hover/focus | all 44 | 1 ms | (hover:hover) |
| `tano-rainbow-pulse` | `0%,to{opacity:.22}50%{opacity:.48}` | 2.4s · ease-in-out · infinite | continuous (auto), hover/focus | all 44 | 1 ms | (hover:hover) |

## 26. Consent banner

Cookie consent opens .32 s cubic-bezier(.22,1,.36,1) both (opacity + 16 px rise); under reduced motion it uses a .15 s fade. Closing is a class/removal, not a keyframe.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `wire-consent-open` | `0%{opacity:0;transform:translateY(var(--unit-4-00))}` | .32s · cubic-bezier(.22,1,.36,1) | continuous (auto) | all 44 | fade only | — |
| `wire-consent-fade` | `0%{opacity:0}` | .15s | reduced-motion override | all 44 | fade only | — |

## 27. Mobile case stat strip

Mobile-only case stat strip: each stat’s opacity is an infinite `wire-case-stat-turn` of `--n × 3.6 s`, with per-item negative delay `(i-n)×hold`; `data-running` starts it, `:only-child` and reduced motion disable it.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `wire-case-stat-turn` | `0%,28%{opacity:1}33%,95%{opacity:0}to{opacity:1}` | calc(var(--n) * var(--hold)) · ease-in-out · infinite | continuous (auto) | 5 | none | (max-width:767px) |

## 28. Case-study figures marquee

The case-study results figures tray drifts horizontally at 60 s per -50%-gap loop; hover pauses, `data-paused` pauses, and offscreen `data-inview=false` pauses.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `wire-figs-drift` | `0%{transform:translate(0)}to{transform:translateX(calc(-50% - var(--figs-gap) / 2))}` | 60s · linear · infinite | continuous (auto) | 1 | — | (hover:hover) |

## 29. Pitch deck (`.hp-pp`)

Home/use-cases pitch deck uses a 2800 ms beat (`--beat`). Nearly every child animation is delayed by an authored beat index; entry .52 s, exit/leave .42 s, bars .7 s, small ticks .2–.36 s. Mobile uses ±100% slides (.42 s); desktop uses room-making + scene crossfades. `data-reduced` removes all of it.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-pp-make-room` | `0%{translate:var(--room) 0}` | .72s · cubic-bezier(.22,1,.36,1) · var(--room-delay) | continuous (auto) | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-print-make-room` | `0%{left:calc(3% + var(--room))}` | .72s · cubic-bezier(.22,1,.36,1) · var(--room-delay) | continuous (auto) | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-print-in` | `0%{opacity:0}` | .6s · .52s<br>.6s · ease · .52s | continuous (auto) | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-leave` | `to{opacity:0;transform:scale(.985)}` | .42s · cubic-bezier(.4,0,.2,1) | state: leaving | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-arrive` | `0%{opacity:0}` | .42s · cubic-bezier(.22,1,.36,1) | state: entering | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-dot` | `0%,to{opacity:.35}50%{opacity:1}` | .9s · ease-in-out · infinite | continuous (auto) | 3 | — | — |
| `hp-pp-gone` | `to{opacity:0;max-height:0;margin-bottom:calc(var(--u) * -.6);overflow:hidden}` | .2s · ease · calc(var(--until,0) * var(--beat)) | continuous (auto) | 3 | — | — |
| `hp-pp-in` | `0%{opacity:0;transform:translateY(calc(var(--u) * .6))}` | .52s · cubic-bezier(.22,1,.36,1) · calc(var(--at,0) * var(--beat))<br>.3s · cubic-bezier(.22,1,.36,1) · calc(var(--at,0) * var(--beat)) | continuous (auto), state: picked | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-grow` | `0%{transform:scaleX(0)}to{transform:scaleX(var(--share,1))}` | .7s · cubic-bezier(.22,1,.36,1)<br>.7s · cubic-bezier(.22,1,.36,1) · 0s · 1 | continuous (auto), state: win | 3 | — | — |
| `hp-pp-pick` | `to{box-shadow:inset 0 0 0 1px var(--ink);background-color:var(--ink);color:var(--seat)}` | .3s · cubic-bezier(.22,1,.36,1) | state: picked | 3 | — | — |
| `hp-pp-ink` | `to{color:var(--ink)}` | .3s<br>.36s | continuous (auto), state: win | 3 | — | — |
| `hp-pp-show` | `to{opacity:1}` | .2s<br>.36s · ease · calc(var(--keep) * var(--beat)) | continuous (auto), state: win | 3 | — | — |
| `hp-pp-keep` | `to{background-color:var(--chip)}` | .36s · ease · calc(var(--keep) * var(--beat))<br>.36s | continuous (auto), state: win | 3 | — | — |
| `hp-pp-drop` | `to{opacity:.4}` | .36s · ease · calc(var(--keep) * var(--beat))<br>.36s · ease · calc(var(--tag) * var(--beat)) | continuous (auto), state: picked | 3 | — | — |
| `hp-pp-lit` | `to{background-color:var(--lit)}` | .36s · ease · calc(var(--win) * var(--beat)) | state: win | 3 | — | — |
| `hp-pp-hide` | `to{opacity:0}` | .36s · ease · calc(var(--gone) * var(--beat)) | continuous (auto) | 3 | — | — |
| `hp-pp-ring` | `to{outline-color:var(--app-ink)}` | .36s · ease · calc(var(--tag) * var(--beat)) | state: picked | 3 | — | — |
| `hp-pp-press` | `50%{scale:.95}` | .3s · cubic-bezier(.22,1,.36,1) | continuous (auto) | 3 | — | — |
| `hp-pp-dot-lit` | `to{border-color:var(--lit);background-color:var(--lit)}` | .36s | continuous (auto) | 3 | — | — |
| `hp-pp-reach` | `to{opacity:1}` | .36s | continuous (auto) | 3 | — | — |
| `hp-pp-slide-in` | `0%{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) | state: entering | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-slide-out` | `to{transform:translate(-100%)}` | .42s · cubic-bezier(.4,0,.2,1) · 0s · 1 | state: leaving | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-slide-in-back` | `0%{transform:translate(-100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: entering | 3 | none!important | (max-width:767px); (min-width:768px) |
| `hp-pp-slide-out-back` | `to{transform:translate(100%)}` | .42s · cubic-bezier(.22,1,.36,1) · 0s · 1 | state: leaving | 3 | none!important | (max-width:767px); (min-width:768px) |

## 30. Creator tracker (`.hp-ct`, `.hp-ccar`)

For-creators creator tracker: horizontal dotted rule travels 2.4 s linear (96 px background-size), vertical version on mobile; the creator carousel `.hp-ccar-run` is separate (80 s). Both pause when their rows get `data-inview=false`.

| Keyframe | Normalized body | Duration · easing · delay | Trigger | Routes | Reduced motion | Responsive |
|---|---|---|---|---|---|---|
| `hp-ct-travel` | `0%{background-position:0 0}to{background-position:var(--ct-dot-gap) 0}` | 2.4s · linear · infinite | continuous (auto) | 1 | none | (max-width:767px) |
| `hp-ct-travel-down` | `0%{background-position:0 0}to{background-position:0 var(--ct-dot-gap)}` | 2.4s · linear · infinite | continuous (auto) | 1 | none | (max-width:767px) |

## 31. Unused in scope (8 of 129 all.css keyframes)
These names are declared in `all.css` but no captured route can display the selector that references them. The separate `unused` array in `keyframes.json` carries the same records.
| Keyframe | Body | Why unused |
|---|---|---|| `car-bob` | `0%,to{transform:translateY(calc(var(--lift,4px) * -1)) rotate(calc(var(--sway,1deg) * -1))}50%{transform:translateY(var(--lift,4px)) rotate(var(--sway,1deg))}` | .car/.car-float is absent from all 44 captures and from every bundle (legacy car figure) || `hp-problem-statement-in` | `0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}` | HomeProblem section (.hp-problem) is absent from all 44 captures; bundle still defines the component || `hp-rise` | `0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1}` | .hp-stage is absent from all captures; only survives in the reveal skip-list, never as markup || `hp-flow-reply-pick` | `to{box-shadow:inset 0 0 0 1.5px var(--flow-active);background-color:#fbf9f51a}` | declared but no selector references it anywhere in all.css or the bundles || `hp-flow-press` | `35%{background-color:#d9d6d0;transform:scale(.93)}to{transform:none}` | .hp-flow-tip-cta is absent from captures and bundles || `hp-camp-bar-grow` | `0%{transform:scaleX(0)}` | declared but no animation declaration references it || `hp-pp-draw` | `0%{clip-path:inset(-10% 100% -10% 0)}to{clip-path:inset(-10% -2%)}` | .hp-pp-trend is absent from captures and bundles || `hp-cc-drift` | `0%{translate:0 -3px}to{translate:0 4px}` | .hp-cc-creator is absent from captures and bundles; for-creators uses .hp-ccar instead |
All other 121 `all.css` keyframes are used, plus four inline `rv-*` keyframes that exist only in the per-page `<style>` block. Totals: **121 + 8 = 129** all.css keyframes accounted; **125 used** entries in `keyframes.json` including the 4 inline reveal keyframes.

## 32. Transition-only behaviour worth preserving (no keyframes)

| Surface | Declaration | Timing |
|---|---|---|
| Header hide/show | `.wire-chrome` transform/opacity/visibility | `.42s cubic-bezier(.22,1,.36,1)` / `.24s ease-out` / visibility `0s linear .42s`; driven by `data-hidden` + `data-scrolled` |
| Nav mobile panel | opacity/visibility | closed `.32s` + visibility `.32s`; open `.26s`; links `90ms + i×45ms` |
| Tano button | transform / colour / layers | `.18s cubic-bezier(.32,.72,0,1)`; fill `.26s`; press `80ms` |
| Case banner | banner lift / action opacity | `.24s`; hover translateY(-2px), action opacity .88 |
| Case mark | plate/image/category/read | `.3s` / `.26s`; read delay `60ms`; image translateY(-2px) |
| Tracker cards | opacity/transform/visibility | `.32s` / `.42s cubic-bezier(.22,1,.36,1)` / visibility `0s linear .42s`; live adds `80ms` |
| FAQ | grid rows / opacity / glyph | `.32s cubic-bezier(.22,1,.36,1)`; opacity `.2s` closed, `.26s 80ms` open; glyph `.32s` |
| Brand tab | opacity/filter | `.26s ease-out`; content fade debounce `260ms` |
| Closing cards | opacity/translate | `1s cubic-bezier(.22,1,.36,1)`; delays `.65/.85/1.05/1.25s` |
| Spectrum glow | opacity/filter/inset | `.24s` |
| Conversation wires | opacity/stroke-width/colour | `.24s`; chips `.2s`; fact background-size `.24s` |
| Objective/creator/FAQ cards | reveal only | no hover transform; `.hp-reveal` handles arrival |
| Footer links | colour/background | `calc(.16s * var(--state-colour-run)) ease` |
| Stat card | background colour | `calc(.26s * var(--state-colour-run)) ease` |
| Consent | height / line | `.42s cubic-bezier(.22,1,.36,1)`; line `.3s` with `.12s` open delay |
| Drawer | fade / sheet | enter `.42s`, exit `.22s`; animationend or 400ms fallback |
| Ground swap | `--ground-t` / `--ink-t` + veil | 600ms (`--ground-ms`) / 150ms (`--ink-ms`); 320ms text-swap window; CSS animations pause |
