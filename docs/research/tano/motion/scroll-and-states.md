# Scroll positions, pins and state attributes

Measured on the 44 captures at 1568×900 and reconciled with the bundles. `data-*` attributes are the contract between JS and CSS; almost no animation is added/removed by JS — attributes change, CSS transitions/keyframes react.

## 1. Scroll geometry that matters

| System | Measurement / rule | Effect |
|---|---|---|
| Reveal release line | `RELEASE_LINE = 0.95`; observer `rootMargin: 0px 0px -5% 0px`, threshold 0; scroll fallback debounced **220 ms** and compares `rect.top < innerHeight * 0.95` (or `1.0` within 2 px of the bottom) | adds `.rv-in`; 70 ms × index (max 7) stagger; word stagger 46 ms |
| Offscreen pause | `rootMargin: '200px 0px'` | `data-inview=true/false` on spectrum, hero glow/camp/strip, closing cards, scale window, conversations, car, tracker rows, `hp-ccar`; CSS pauses descendants |
| Play zone | arrive IO `rootMargin:'0px 0px -40% 0px'`, threshold 0; leave IO threshold `[0,.75]` | arrives when the box enters the top 60% of the viewport; leaves after it had been ≥75% visible and drops out; resets timers/carousels |
| Stat reveal | same 95% line via `Reveal`, or immediate if already on screen | `data-shown` once; starts all `hp-stat-*` keyframes |
| Case deck cover | 240 px of next-tick travel | `--cover` 0→1; `data-covered` when next tick is within **2 px** of slot top |
| Case deck hue | 60% of viewport height (`0.6 * innerHeight`) | ghost hue `color-mix()` |
| Ground tone sample | `scrollY + 0.45 * innerHeight` | `--ground-t` / `--ink-t`, `data-ground-tone`, `data-ground-moving` |
| Chrome hide | sentinel IO threshold 0 → `data-scrolled`; each `[data-chrome-hide]` IO `rootMargin:'0px 0px -50% 0px'` → hidden flag | `data-hidden` = scrolled && any hide section in view |
| Logo marquee | rAF; 26 px/s; `1-e^(-dt/0.9)` velocity smoothing; dt clamp 50 ms | transform translate3d, modulo wrap |
| Counter | IO `rootMargin:'0px 0px -12% 0px'`, threshold 0 | 1900 ms count-up, once |

## 2. Home hero pins / sticky

| Selector | Rule | Distance / breakpoint |
|---|---|---|
| `.hp-hero-pin` | `position:relative`; `--reel-stretch:55svh` | spacer `::after` height `(var(--reel-count,6) - 1) * 55svh`; with the measured `--reel-count:4` that is **165svh** |
| `.hp-hero-pin` ≤1023 px | `--reel-stretch:45svh` | **135svh** for 4 reels |
| `.hp-hero-pin:after` | `display:block` | hidden at ≤767 px, under reduced motion, and when the pin contains `.hp-camp-sticky` (`:has(>.hp-camp-sticky)`) |
| `.hp-hero-stage` | `position:sticky; top:var(--page-navpadding,96px)` | sticks below the nav; relative + `top:auto` at ≤767 px, under reduced motion, and for `.hp-hero-stage.hp-camp-sticky` |
| `.hp-camp-sticky` | `--camp-h: clamp(520px, calc(100svh - var(--camp-clear) - var(--camp-strip) - 64px), 720px)` | clear = nav padding 80px + 24px; strip = 76px; `--camp-post-h:86%`, `--camp-post-top:4%`, `--camp-panel-top:16%` |
| `.hp-camp-sticky` ≤1023 px | `--camp-h:600px` | tablet |
| `.hp-camp-sticky` ≤767 px | `--camp-h:744px`, `--camp-post-top:104px`; `.hp-hero .hp-camp-sticky` `--camp-h:528px`, post top 24px | phone; backdrop/fade/strip row hidden |
| `.hp-camp` | `height:var(--camp-h)` | scene layer is `position:absolute;inset:0` |

**Captured home reality:** `.hp-hero-stage` also has `.hp-camp-sticky`; the pin spacer is `display:none` and the stage is `position:relative`. The hero therefore does **not** occupy a 300vh scroll track on the current home. If the reel-strip variant is restored, 4 reels create 165svh (desktop) / 135svh (tablet) of scroll before the stage unpins.

## 3. Other sticky offsets

| Surface | Offset / stack |
|---|---|
| `.wire-case-slot` | `position:sticky`; `--stack-step:18px` desktop, `10px` ≤1023 and in mobile blocks; `--stack-shrink:.04`; top `calc(var(--stack-top) + 2*step)`; `--stack-depth:min(--covered-depth,2)`; translate `-depth*step`, scale `1-depth*.04`; transition **.32 s cubic-bezier(.22,1,.36,1)** |
| `.wire-case-tail` | height `min(22vh,200px) + 5*step - section-padding-sm` — trailing room so the last card can unpin |
| `.wire-case-slot` blue backing | `::after` opacity `--cover`; depth color mix `85% - depth*27.5%` |
| Nav bar | sticky/fixed inside `.wire-chrome`; chrome transform hides it by -(100% + spectrum rule) |
| Drawer | fixed `<dialog>`; sheet rise 20px / scale .985 during enter |
| `.hp-notify` | `position:fixed`, top `4px + navpadding + 20px` |

## 4. State attribute law

| Attribute | Values | Set by | What changes | Timing |
|---|---|---|---|---|
| `data-inview` | `true` / `false` | `OffscreenPause` IO, 200 px margin | `animation-play-state:paused!important` on descendants of spectrum, hero glow/camp/strip, scale, conversations, car, tracker, `hp-ccar` | immediate; no transition |
| `data-stage` | `seed` → `drop` → `travel` → `settled` | `NavBar` (`2i01z…:4344`) | nav width/opacity/transform; link + wordmark entrances; `html[data-nav-ready]` when settled | 520 / 1000 / 1140 ms |
| `data-open` | `true` / `false` / absent | announcement, `.hp-notify`, mobile nav panel, FAQ answer | announcement height + line; toast opacity/translate; panel opacity/visibility; FAQ grid rows | .42 s height; .26 s panel; .32 s FAQ |
| `data-shown` | `true` / `false` | `Reveal` (`hp-reveal`), announcement after 420 ms | reveal visible state; all stat animations start; behind layers fade; dash/ct lines clip in; announcement line visible | transition/keyframes as per component |
| `data-seen` | `true` | `ClosingCta` `usePlayZone.onArrive` | closing cards transition in; `.hp-cl-films` visible | 1 s, slot delays .65/.85/1.05/1.25 s |
| `data-picked` | `true`/absent | authored data / `hp-xl` round, `hp-pp` post, `hp-flow` replies | camp chip 6.4 s loop; xl chip colours .32 s; pp post ring/invert .36 s; flow reply invert .2 s | per component |
| `data-win` | `true`/absent | authored campaign stats / pitch-deck results | camp score row 6.4 s loop; pp result keep/ink/lit .36 s | per component |
| `data-turned` | `true` | `.hp-notify` front layer after first turn | `hp-notify-promote` .56 s | .56 s |
| `data-leaving` | `true`/absent | camp scene, steps scene, `hp-scene-layer`, pp frame | exit keyframes; `:not([data-leaving])` = enter | .42–.6 s |
| `data-live` | `true`/false | `hp-track` active card, brand shots, announcement lines | track card visibility/opacity/transform; brand images cross-fade; line opacity | .32/.42 s; brand .62 s |
| `data-covered` | `true`/false | `CaseDeck` per slot | slot pointer-events/box-shadow, cover backing opacity, stack depth | .32 s stack transition |
| `data-paused` | `true`/absent | flow `!running`; brand tab `!running`; steps fill `!running` | `animation-play-state:paused` for flow subtree / tab fill / progress | immediate |
| `data-still` | `true`/absent | flow under reduced motion; scale ticker reduced | removes flow/scale animations | immediate |
| `data-motion` | `paused`/absent | hero camp `useMotionPause`, closing cards | pauses camp card animations | immediate |
| `data-phase` | `opening` / `closing` | `TalkToUsDrawer` | sheet enter/exit; closing waits animationend or 400 ms | .42 s / .22 s |
| `data-direction` | `1` / `-1` | steps + pp navigation | picks forward/back slide keyframes | .42 s |
| `data-state` | `live` / `done` / `idle` | steps segment buttons | `live` runs `.hp-steps-seg-fill` width; others static | 8/11.6–12.2 s |
| `data-reduced` | `true`/absent | ProcessScene | kills `hp-pp`/`hp-scene` animation via CSS | immediate |
| `data-running` | `true`/absent | `CaseStatStrip` | starts mobile `wire-case-stat-turn` | 3.6 s/item |
| `data-intro` | `true` | hero strip dock mount | `hp-dock-rise` .42 s; fade-only reduced | .42 s |
| `data-floating` / `data-aside` | `true` | hero strip dock state | disables dock animation when aside+floating | — |
| `data-fading` | `true`/absent | brand tabs during 260 ms swap | content cross-fade | .26 s |
| `data-lit` | `true`/absent | conversation fact hover | mark background-size/color | .24 s |
| `data-active` | `true` | FAQ tab, problem title | tab visual; problem statement enter | .26 s |
| `data-expanded` | `true`/false | FAQ glyph | icon state (rotation is on `.hp-faq-glyph` transition .32 s) | .32 s |
| `data-hidden` | `true`/false | chrome wrapper | header transform/opacity/visibility | .42/.24 s |
| `data-scrolled` | `true`/false | chrome sentinel | chrome translate compensation with announcement; notify visibility | .42 s |
| `data-ground-tone` | `dark`/`light` | `GroundTone` when `--ink-t` crosses .5 | theme variables | 600 ms tween |
| `data-ground-moving` | present | during ground tween | pauses spectrum/glow; `--state-colour-run:0` snaps colour transitions | 600 ms |
| `data-ground-swap` | present | during 320 ms text-swap window | marks near-text elements via `data-ground-near` | 320 ms |
| `data-ground-ready` | present | first ground application | enables ground veil | — |
| `data-nav-ready` | present | nav settled (or reduced) | page-level nav-ready layout | 1140 ms |
| `data-rv-skip` | present | authored | excludes element/subtree from reveal splitting/observer | — |
| `data-rv-split` | `true` | `RevealMotion` after splitting | prevents double split; words animate with `--rv-word` | — |
| `data-rv-onload` | present | authored (hero copy) | immediate `rv-load-*` entrance instead of observer | 70 ms block delay |
| `data-room` | present | pitch-deck frame | room-making keyframes | .72 s |
| `data-kept` | present/absent | pitch-deck score | keep vs drop .36 s | .36 s |
| `data-solo` | present | flow when creator hidden | window layout / slide-over | .82 s |
| `data-enter` | `from-solo`/`from-hive`/`settle` | flow scene transition | slide-over/scroll-up/arrive choreography | .68–.86 s |
| `data-wakes` / `data-rests` | present | flow windows | wake vs rest content fade | .56 s |
| `data-until` | number | flow authored beat | out animations | beat × 2800 ms |
| `data-zoom` | present | flow hive | 1 s zoom + cell step-back | 1 s / .6 s at .9 s |
| `data-pressed` | present | flow tip CTA | press keyframe | .26 s |
| `data-chosen` | present | flow tree options | win/lose strokes and labels | .26–.42 s |

## 5. Observed scroll-driven composite states

**Reveal + page load.** `.rv-scope` starts every eligible element at `opacity:0; translate3d(0,24px,0)`. On the first paint after hydration, `RevealMotion` reveals above-the-fold items immediately; below-fold items wait for either the -5% observer or the 220 ms-debounced scroll fallback. Hero copy (`data-rv-onload`) is the exception: it never hides behind the observer. Headlines split into words before reveal; each word gets `--rv-word` 0..n, and inline icons become `.rv-mark` with `rv-mark-tilt` delayed `word*46ms + 260ms`.

**Hero → logo band.** The hero is sticky/relative as described; the logo band is a JS marquee with no reveal. The spectrum rule above the nav is sticky chrome, not part of the hero.

**Case deck.** Slots pin at `--stack-top`; as the next slot’s 1 px `.wire-case-tick` approaches within 240 px, `--cover` fades the coloured backing over the previous card; at 2 px the previous slot gets `data-covered=true` and starts translating/scaling to depth 1 (10–18 px, 4%). Depth is capped at 2, so the third covered card stops moving. The hue cross-fade is continuous over 60% viewport, independent of the stack transition.

**Tracker / brand / experiment sections.** `usePlayZone` on each stage pauses timers when it leaves the top 60%; `useMotionPause` also stops when the tab loses focus-visible or the user explicitly pauses. Auto-advance preserves the remaining interval across pauses (`left -= elapsed`), so a section that is scrolled away and back resumes where it stopped, not from zero.

**Closing band.** `onArrive` sets `data-seen` once; cards enter in slot order after 0.65/0.85/1.05/1.25 s. On leave the campaign cards remount (`take++`), so re-entering replays the 1 s entrance (and resets the camp loops).

## 6. Responsive boundaries

| Query | Motion consequences |
|---|---|
| `max-width:767px` | ProcessPlayer switches from `.hp-flow` to `.hp-scene`; mobile slides (`hp-steps-slide-*`) replace desktop scene logic; hero pin spacer hidden; stage relative; case stat strip starts 3.6 s loops; campaign scene becomes 744 px (hero 528 px) |
| `max-width:1023px` | `--reel-stretch` 45svh; camp height 600px; case stack step 10px |
| `min-width:768px` | pitch-deck room-making animations; desktop-only scene moves |
| `min-width:1024px` | flow slide-over on `from-solo`; hero field padding adjustments when camp-sticky |
| `hover:hover` | spectrum hover travel, flow hover pause, figs hover pause, button rainbow hover, banner lift |
| `prefers-reduced-motion:reduce` | all loops removed, reveal visible without movement, nav/links jump to settled, drawer/nav/menu 1 ms, consent fade .15 s, stat/flow/scene sequences `none!important`, marquee/counters not started in JS |
