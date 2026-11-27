# JS motion orchestration — Tano marketing site

All bundles are deobfuscated Turbopack chunks in `/home/boxd/tano/js/`. Names below are the exact filenames loaded by the 44 captures. Component exports are quoted from the bundles; pseudocode preserves variable names where they carry meaning.

## Bundle roles

| Bundle | Role |
|---|---|
| `0ef8lriq_goox.js` (duplicate `2ar8d4imj4yf_.js`) | page shell: `RevealMotion`, `OffscreenPause`, `GroundTone`, `SmoothScroll` (Lenis), `TalkToUsDrawer`, image decode-fade |
| `0xfhbjw8jumf0.js`, `14f1mrsyfep5c.js`, `3nus2kmyswy7e.js` | reveal constants (`REVEAL_*`, `RELEASE_LINE`) duplicated per route; nav/icon primitives |
| `1wjb414e95an5.js` | `HeroCampaignStage`, `CampaignCards`, process-scene data, hero track |
| `3wa99p2ledxp-.js` | `HomeSteps`, `HomeLoop`, `HomeProblem`, `HomeBrands`, `HomeTrack`, `ProcessScene`, `ProcessPlayer` (desktop `.hp-flow`), pitch-deck scenes |
| `40ntuas79067b.js` / `3878097n9za7t.js` | `Reveal`, `StatCard`, `CountUp`, `CaseStatStrip`, `CaseDeck`, `HomeFaq`, unified `useMotionPause` / `usePlayZone` module (`e.i(9131)`) |
| `0vml9bhf2323s.js` | `Announcement`, `AnnouncementNotification` (`hp-notify`), `useAfterNav` |
| `2i01z-k_rjwvv.js` | `NavBar` four-stage entrance, `MobileNav`, chrome hide |
| `42y6g8l4st9_s.js` / `3odhfznqaqz-h.js` | rendered `TalkToUsDrawer` with `data-phase` open/close |
| `3ax96wsqpo_2k.js` | `useStillness` (reduced motion), ground start style |
| `15c43af_4z9dm.js` | cards / long-form page components; no motion controller of its own |

## 1. Smooth scroll

`SmoothScroll` (`0ef8lriq_goox.js:17400`) lazily loads `ReactLenis` with:

```js
options = { autoRaf:true, lerp:0.14, smoothWheel:true, syncTouch:false,
            anchors:true, stopInertiaOnNavigate:true,
            prevent: () => document.body.style.overflow === 'hidden' }
disabled = matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)')
```

`html.lenis` is the only DOM trace. All scroll-driven code below listens to native `scroll` or uses IntersectionObserver, so it still works when Lenis is disabled.

## 2. Reveal system (`rv-scope`)

Constants (`0xfhbjw8jumf0.js`, module `59379`):

```js
RELEASE_LINE = 0.95
REVEAL_SCOPE_CLASS = 'rv-scope'
REVEAL_IN_CLASS = 'rv-in'
REVEAL_MARK_CLASS = 'rv-mark'
REVEAL_WORD_CLASS = 'rv-word'
REVEAL_DELAY_PROPERTY = '--rv-delay'
REVEAL_WORD_PROPERTY = '--rv-word'
REVEAL_SPLIT_ATTRIBUTE = 'data-rv-split'
```

`RevealMotion` (`0ef8lriq_goox.js:15588`, also `2ar8…`):

```js
scope = document.querySelector('.rv-scope')
if (!scope || matchMedia('(prefers-reduced-motion: reduce)').matches) return
rootMargin = `0px 0px -${Math.round((1 - 0.95) * 100)}% 0px`   // -5%
observer = new IntersectionObserver(entries => {
  reveal(entries.filter(e => e.isIntersecting).map(e => e.target)
                 .sort(documentOrder))
}, { rootMargin, threshold: 0 })
reveal(list) {
  list.forEach((el, i) => {
    el.style.setProperty('--rv-delay', `${70 * Math.min(i, 7)}ms`)
    el.classList.add('rv-in')
    seen.delete(el); observer.unobserve(el)
  })
}
```

Word splitting runs once over `HEADLINE_SELECTOR` (`h1/h2` + `.tano-display-*`/`.hp-title`/case titles) and wraps each text node in `.rv-word`, incrementing `--rv-word`; inline icons get `.rv-mark`. It is skipped when the element already has `data-rv-split`.

Two fallbacks:

* **Scroll fallback** — `scroll` listener debounced `220 ms`; line = `innerHeight * 0.95`, or `innerHeight` when within 2 px of the document bottom. Elements whose `getBoundingClientRect().top` is above the line are revealed in document order with the same 70 ms/index stagger. This catches elements the observer misses after layout shifts.
* **Guidelines special case** — on `/guidelines*`, all above-the-fold elements are revealed on the next `requestAnimationFrame` instead of waiting for a scroll.
* A `MutationObserver` re-runs the selector scan for newly added content (rAF-throttled).

`Reveal` (`40ntuas79067b.js:19900`) is the component wrapper used around stats/cards. It checks the nearest scroll container (`overflow-x:auto|scroll` ancestor or itself); if the box already intersects the viewport it sets `data-shown` on the next frame, otherwise it observes with the same -5% root margin, threshold 0, and disconnects after the first hit. It renders `class="hp-reveal" data-shown={shown} style="--hp-reveal-delay:${delay}ms"`.

CSS then does the work: `.rv-in` transitions transform `760ms cubic-bezier(0.22,1,0.36,1)` and opacity `280ms linear`, both delayed by `--rv-delay`; split words use `440ms cubic-bezier(0.2,1.3,0.34,1)` / `240ms` with `--rv-word * 46ms`. `[data-rv-onload]` (hero copy) bypasses the observer: words animate immediately with `rv-load-*`, block children after 70 ms.

`data-rv-skip` is the exclusion mechanism: the reveal selector excludes any element inside `[data-rv-skip], .car, .hp-ticker, .hp-stage, .hp-behind, .hp-logo-strip, .hp-testimonials, .hp-comparison-scroll, .hp-tabbar, .wire-cases-marks-strip, .wire-table-scroll, .wire-drawer, .wire-rail, .wire-footer-card, .wire-visually-hidden, .wire-footer-photo, .hp-hairline, .hp-faq-art, .hp-creator-asset, .hp-objective-ground`.

## 3. Offscreen pause and play zones

`OffscreenPause` (`0ef8lriq_goox.js:14400`):

```js
io = new IntersectionObserver(es => es.forEach(e =>
       e.target.setAttribute('data-inview', e.isIntersecting ? 'true' : 'false')),
     { rootMargin: '200px 0px' })
targets = '.wire-spectrum-rule, .hp-hero-glow, .hp-camp, .hp-closing-cards, ' +
          '.hp-hero-strip, .hp-scale-window, .hp-convo-agent, .car, .hp-ct-row, .hp-ccar'
```

A `MutationObserver` (rAF-throttled) observes new targets. CSS pauses descendants with `animation-play-state:paused!important` when `data-inview=false`.

`useMotionPause` (`e.i(9131)`, `40ntuas79067b.js:25800`):

```js
paused  = explicit === 'paused' ? true : reducedMotion
running = !paused && !focusHeld && inView
focusHold = { onFocus: e => held = e.target.matches(':focus-visible'),
              onBlur: retain held if focus stays inside }
```

`usePlayZone(el, {onArrive,onLeave})` combines two observers:

```js
arriveIO = new IntersectionObserver(([e]) => inside = e.isIntersecting,
           { rootMargin: '0px 0px -40% 0px', threshold: 0 })
ratioIO  = new IntersectionObserver(([e]) => {
             ratio75 = e.intersectionRatio >= 0.75
             inView = inside || ratio75
           }, { threshold: [0, 0.75] })
```

`onArrive` fires once per arrival (`inView` false→true); `onLeave` fires only after the element had been at least 75% visible and drops out. `inView` false→true resets carousels/timers; false→true after a leave bumps a `take` counter to remount scenes.

## 4. Hero (`hp-hero`, `hp-camp`)

`HeroCampaignStage` (`1wjb414e95an5.js:8051`):

```js
reduced = useMotionPause()           // paused if reduced / explicit pause
reel = useReel(inView && !paused, count)  // count = 4 on the captured home page
reel: state = 0, take = 0, ref = { key:'', left: 8000 }
  on (index, take) change: ref.left = 8000
  if (!running || count < 2) return
  timer = setTimeout(() => setIndex((i+1) % count), ref.left)
  cleanup: ref.left -= (now - start) // remaining time survives pause/index change
```

* Auto-advance **8000 ms** per campaign (matches each `.hp-steps-seg-fill` inline `--hp-steps-duration:8000ms`).
* `onLeave` resets index to 0 and bumps `take`.
* `{now, before}` state keeps the outgoing campaign mounted for **600 ms**:
  `scenes[data-leaving]` → `hp-camp-out` (0.6 s ease, fill both); new scene has `data-opening` (suppresses its own entrance animation for the first frame).
* The scene video gets its own `IntersectionObserver`; `play()` on intersect, `pause()` otherwise; `paused` prop pauses unconditionally. Autoplay rejection is ignored only for `NotAllowedError`.
* `.hp-camp` gets `data-motion="paused"` when paused; CSS freezes `.hp-camp-card` animations. `data-inview=false` freezes all descendants. The hero stage is `data-rv-skip`.

**No four-stage scroll-progress machine exists for `hp-camp` in the shipped code.** The only four-stage `data-stage` machine is the nav (`seed → drop → travel → settled`). The hero's four “stages” are the four campaign reels, rotated on an 8 s timer. The `.hp-hero-pin::after` spacer exists for the reel-strip variant — `height: (var(--reel-count,6) - 1) * var(--reel-stretch)` with `--reel-stretch:55svh` (45svh ≤1023px), i.e. **165svh for 4 reels** — but the current home renders `.hp-hero-stage.hp-camp-sticky`, and `.hp-hero-pin:has(>.hp-camp-sticky):after{display:none}`; the stage is `position:relative;top:auto`, so there is no pin distance on the current home. Reduced motion also removes the spacer and un-sticks the stage.

## 5. Steps / ProcessPlayer

`HomeSteps` (`3wa99p2ledxp-.js:106800`):

```js
isMobile = matchMedia('(max-width: 767px)').matches
duration[i] = isMobile ? sceneDuration(scene(i)) : F(i)
F(i) = (SCENES[i].beats ?? 3) * 2800 + 700            // 2800ms beat, 700ms tail
timer = setTimeout(advance, remaining[i])              // while running
advance: leaving = false; direction = 1; index = (index + 1) % steps.length
manual select: direction = next < current ? -1 : 1; set index; take++
on leave: remaining time is preserved, timer paused
```

Captured home durations: steps 1–4 = **12200, 11600, 11600, 11600 ms**. Leaving scenes are removed after **420 ms** (`setTimeout(..., 420)`) and rendered with `data-leaving` while the incoming scene is `.hp-steps-scene` without it. Desktop renders `ProcessPlayer` (`.hp-flow`); mobile renders `ProcessScene` (`.hp-pp-stage` + `.hp-scene`) because `isMobile` gates the branch.

ProcessPlayer (`3wa99p2ledxp-.js:114800`) has its own timer computed from `sceneDuration(scene) + extraBeats * HIW_BEAT_MS`, with `HIW_BEAT_MS` observed as **2800 ms** (the `.hp-flow` DOM sets `--beat-ms:2800ms`). It uses `usePlayZone` on the stage; on arrive it resets and bumps `take`, on leave it clears; `useMotionPause` supplies `running`/`reduced`.

Flow CSS is keyed to `--beat-ms`: nearly every `animation-delay` is `calc(var(--beat|--at|--in|--wake|--until|--pick|--swipe|--grow|--press) * 2800ms)`. A few WAAPI tweens also run inside `.hp-flow` (`element.animate`) for brand/creator dimming; they are cancelled/replayed by the `running` effect and finished immediately under reduced motion.

## 6. Nav four-stage machine and mobile menu

`NavBar` (`2i01z-k_rjwvv.js:4344`):

```js
if (reduced) { stage = 'settled'; html.dataset.navReady = ''; return }
stage = 'settled'; measure offsetWidth -> --nav-full-width
stage = 'seed';   html.dataset.navReady = ''
requestAnimationFrame(() => requestAnimationFrame(() => {
  stage = 'drop'
  setTimeout(() => stage = 'travel', 520)              // --nav-drop-ms
  setTimeout(() => stage = 'settled', 1140)            // --nav-settle-ms
}))
```

`--nav-drop-ms: 520`, `--nav-travel-ms: 1000`, `--nav-settle-ms: 1140` are set on `.wire-nav-bar`. CSS: seed width `--nav-seed-width`, opacity 0, translateY(-56px); drop animates transform/opacity 520 ms; travel animates width 1000 ms; link groups transition opacity .42 s / transform .46 s cubic-bezier(.22,1,.36,1), both with **240 ms delay**; wordmark fades .38 s at **520 ms**. `data-stage` is the trigger for all of it. Reduced motion jumps straight to settled and sets `data-nav-ready`.

`MobileNav` (`2i01z-k_rjwvv.js:22291`) sets `data-open` on the hamburger glyph and a portal `.wire-nav-mobile-panel`. Open: opacity .26 s; links transition opacity/transform .26 s with `transition-delay: calc(90ms + var(--i) * 45ms)`. Closed: opacity .32 s + visibility `0s linear .32s`. Panel gets `inert` when closed; focus trap and scroll lock are imperative.

Chrome hide/show: `wire-chrome-sentinel` observer sets `data-scrolled` (sentinel out of view); a second observer on every `[data-chrome-hide]` (rootMargin `0px 0px -50% 0px`, threshold 0) sets the internal `hidden` flag. `.wire-chrome` gets `data-hidden={scrolled && hidden}` and `data-scrolled={scrolled}`, transitioning transform .42 s / opacity .24 s.

## 7. Announcements

`useAfterNav` (`0vml9bhf2323s.js`):

```js
show = false
fallback = setTimeout(show, 4000)
rAF: nav = document.querySelector('.wire-chrome [data-stage]')
     if (!nav) setTimeout(show, 250)
     else {
       if (nav.dataset.stage !== 'settled') leftSettled = true
       MutationObserver(stage): if stage === 'settled' && leftSettled -> show after 250ms
       setTimeout(() => { if (!leftSettled) show after 250ms }, 700)
     }
```

Top bar (`Announcement`): after mount, if `documentElement` has the announcement flag, open on the next frame and set `data-shown` **420 ms** later (the height transition finishes before the line fades). Lines rotate every **6000 ms**. Height is measured with `ResizeObserver` and written to `--hp-notify-push` on `<html>`; `.hp-announce` transitions height .42 s cubic-bezier(.22,1,.36,1). Line: opacity .3 s, visible at .12 s when `data-shown`; inactive lines get `visibility 0s linear .3s`.

Toast (`AnnouncementNotification`, `.hp-notify`): `data-open={afterNav}` and `data-scrolled` from the chrome attribute. The previous card is kept as `data-layer="leaving"` and removed on `animationend`; the current card is `data-layer="front" data-turned={turn>0}` and promotes with `hp-notify-promote` (.56 s); rotation every **6000 ms**; scroll makes it invisible via `[data-open=true][data-scrolled=false]` only. Reduced motion removes layer animations and uses the opacity/translate transition.

## 8. Counters / auto-advance tables

| Controller | File | Clock | Reduced-motion |
|---|---|---|---|
| `CountUp` | `40ntuas…:90487` | IO `threshold:0, rootMargin:'0px 0px -12% 0px'`; **1900 ms**, value `target * (1-(1-r)^3)`, prefix/suffix/decimals preserved | returns before animating |
| `CaseStatStrip` | `40ntuas…:28696` | `--n` items × `--hold:3.6s`; `data-running` toggles | CSS `animation:none` |
| `HeroCampaignStage` | `1wjb…:8051` | 8000 ms/reel | `useMotionPause().paused` |
| `HomeSteps` | `3wa99…:106800` | per-step 11.6–12.2 s | still advances, scenes snap |
| `HomeBrands` tabs | `3wa99…:41142` | **6000 ms**; content swap debounced **260 ms**; fill 6000 ms | reduced: active tab immediate (`C = h`), no fill |
| `HomeTrack` | `3wa99…:123400` | **5000 ms**/card; remaining time survives pause | transitions 1 ms |
| Experiment loop (`.hp-xl`) | `3wa99…:27532` | **4200 ms**/step; 1000 ms clock interval | `reduced ? 0 : step` |
| `CaseDeck` | `3878097…:80056` | scroll-driven, no timer | transitions none |
| Logo marquee | `3878097…:16000` | rAF, 26 px/s | `useMotionPause` stops rAF |
| `hp-ccar` | CSS only | 80 s linear infinite | `animation:none` |

## 9. Carousels, accordions, other interactions

**CaseDeck** (`3878097n9za7t.js:80056`): observes the deck with `rootMargin:'50% 0px'`. On scroll (rAF, passive): sets `--case-h` to the tallest slot; for each slot, `cover = clamp(1 - (nextTick.top - slotTop)/240, 0, 1)` → `--cover`; `data-covered = nextTick.top < slotTop + 2`; `--covered-depth = coveredCount - index`; ghost hue blends `color-mix(in oklab, prev, next, round(progress*100)%)` across `0.6 * innerHeight`; `scrollend` and resize recompute. No animation JS — CSS transitions the 0.32 s stack.

**FAQ** (`3878097n9za7t.js:24800`): `open` is a single key or `null`; clicking the open item closes it (`b(r ? null : key)`). Answer gets `data-open`, `inert` when closed; CSS grid-row transition .32 s. Search filters by lower-cased substring across question+answer, tokens ANDed; category tabs use `useTabList` (roving tabindex, arrow keys). No timer.

**Brand tabs** (`3wa99…:41142`): `usePlayZone` resets index on leave; timer only when `running`, 6000 ms; previous content kept 260 ms as `data-fading` for the cross-fade; `data-live` on the active shot/mark.

**Track** (`3wa99…:123400`): 5000 ms auto-advance with remaining-time preservation; arrows and `PlayPauseButton` call `pick`/`toggle`; `useStepSwipe` adds touch swipe; active card `data-live`, inactive `inert`.

**Case deck vs case “carousel”**: home uses the sticky deck (`.wire-case-slot`), not a horizontal scroller. `/for-creators` uses the 80 s `.hp-ccar-run` marquee (CSS only).

**Pitch deck** (`.hp-pp`, `3wa99…:114000+`): authored scene objects carry `beats`, `focus`, `at`, `until`, `win`, `keep`, `tag`, `swipe` indices; all are multiplied by `--beat` (2800 ms). JS advances frames when running, sets `data-leaving`/`data-direction`, and mobile slides use CSS; no scroll-progress math.

**Talk-to-us drawer** (`42y6…`/`3odh…`): native `<dialog>`; `data-phase="opening"` or `"closing"`. Closing waits for `animationend` on the sheet or a **400 ms** timeout, then calls `dialog.close()`. CSS enter .42 s, exit .22 s.

## 10. What is CSS-only

* all 129 `@keyframes` plus the inline `rv-*` set;
* spectrum drift, nav spectrum hover travel, hero glow folds;
* camp brief/chat/metric/score loops, camp scene fade;
* stat draw/pop/grow/fade sequences (JS only flips `data-shown` once);
* rainbow button loops, strip marquee, case-stat strip, `hp-ccar`, trackers;
* every state transition (`data-open`, `data-picked`, `data-win`, hover, etc.);
* reduced-motion and pause overrides.

JS only supplies classes/attributes (`rv-in`, `data-shown`, `data-inview`, `data-stage`, `data-open`, `data-picked`, `data-win`, `data-seen`, `data-live`, `data-paused`, `data-phase`, …), timers for auto-advance, and the scroll math for the case deck, marquee, ground tone and hero reel.
