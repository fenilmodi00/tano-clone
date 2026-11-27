# Home page motion frames — tano.ai

Frame-by-frame motion evidence for `https://www.tano.ai/` at **1568 × 900** (DPR 1, `prefers-reduced-motion: no-preference`). Captured **2026-11-27** with Playwright Chromium headless. 143 PNG frames, 10 contact sheets, one `index.json`, and the harness `capture.mjs` live in this directory. No application code was changed.

## 1. What is here

| Scene | Directory | Frames | What it records |
|---|---|---:|---|
| Announcement | `announcement/` | 21 | Page-load frames, exact entry transition states 0/100/200/300/500/800/1200 ms, exact dismissal states, then the removed state |
| Hero campaign, scroll | `hp-camp-scroll/` | 35 | scrollY 0–1600 in 50 px steps, plus the computed release point and the `data-inview=false` point |
| Hero campaign, time | `hp-camp-time/` | 9 | fixed scrollY 350 after leaving/re-entering the hero; 0/250/500/750/1000/1500/2000/3000/5000 ms |
| Ticker / counters | `counters/` | 9 | same time grid at scrollY 944 |
| Conversation thread | `conversations/` | 9 | same time grid at scrollY 3000 |
| Experiment table | `experiments/` | 9 | same time grid at scrollY 4000 |
| Case-study deck | `case-stack/` | 17 | nine time frames at scrollY 4800 + eight scroll probes 4800–5850 |
| Logo marquee | `logo-marquee/` | 9 | same time grid at scrollY 1396 |
| Closing cards | `closing-cards/` | 9 | same time grid at scrollY 12676 |
| Hover states | `hover/` | 16 | before + 0/120/240/400 ms for nav Get started, section Get started, hero send card (requested offsets; stage-card actual wall times are in the index because there is no transition to step); one settled hero library-card frame |

Each directory has `contact-sheet.png` (4-column montage, filename labels). The harness is `capture.mjs`; it removes and recreates only the ten scene directories. `make-contact-sheets.sh` regenerates the sheets in chronological order after a capture.

`index.json` is 6.7 MB. Every sample carries `scene`, `step`, `phase`, `targetMs`, `elapsedMs`, `scrollY`, `pagePerfNowMs`, `capturedAt`, `screenshot`, `tickerText`, `ticker`, `hero`, `cards`, `backdrops`, `activeStates`, `sceneData`, and an `elements` array. Each element entry has `rect` (x/y/width/height/top/right/bottom/left), `opacity`, `transform`, `translate`, `scale`, `rotate`, `position`, `display`, `visibility`, `animation`, `transition`, `vars`, all `data-*` attributes, `aria`, `text`, `backgroundImage`, `boxShadow`, and any `::before`/`::after` state. Hover samples also carry `hoverTransitions`.

## 2. Method

- **Page setup:** Chromium headless, 1568×900, `deviceScaleFactor: 1`, locale en-GB, animations enabled. A warm-up load rejects the cookie consent (`tano_consent=denied`), then the measured page is loaded with that cookie already set. The announcement is captured first and then dismissed, so it does not cover any other scene.
- **Fonts:** `document.fonts.ready` is awaited before the ten scene captures. The announcement opens only after hydration; its detected state reports `fonts: "loaded"`.
- **Scroll:** `document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, y)` followed by two `requestAnimationFrame`s and ~80 ms. The measured `scrollY` is recorded; all requested targets were reached exactly.
- **Time grids:** target offsets 0/250/500/750/1000/1500/2000/3000/5000 ms. `elapsedMs` is sampled **before** the screenshot, so it is the state time; PNG encoding adds roughly 50–250 ms before the screenshot completes. The raw actual times are visible in `elapsedMs`; the target is in `targetMs`.
- **Exact animation stepping (announcement and hover):** screenshot latency would otherwise miss the 320 ms announcement fade. The harness pauses the specific CSS transitions/animations via `document.getAnimations()` and sets `currentTime` to the target. The resulting PNG is the exact transition state; `elapsedMs` is the animation offset, and `note` says so. This is runtime frame extraction, not a page/code modification. The "load" frames are ordinary page-load captures and are labelled with their real `pagePerfNowMs`.
- **Hero campaign reset:** before the time series the page is scrolled to 2000 (hero out of view), then back to 350. The site's `usePlayZone` resets the campaign index on leave, so the time series starts on Bloom & Wild and records the count-up from 0.00.
- **No `prefers-reduced-motion`:** all captures use `no-preference`; this is the full-motion site.

## 3. Hero pin / release point

At 1568×900 the hero **does not pin**. The class name is misleading:

- `.hp-hero-stage.hp-camp-sticky` computes `position: relative; top: 0px`.
- `.hp-camp` computes `position: relative; top: 0px`.
- The stylesheet override is `.hp-hero-stage.hp-camp-sticky{position:relative;top:auto}`; `.hp-hero-pin:has(>.hp-camp-sticky):after{display:none}` means the `--reel-count:4` spacer is not used.
- Scroll samples confirm 1:1 travel: `.hp-camp.rect.y` falls from 432.78 at scrollY 0 to −688.22 at scrollY 1121.

| Quantity | Measured value |
|---|---:|
| `pinStart` | 0 (first sample; no sticky pin exists) |
| `pinEnd` | `null` (not applicable) |
| Effective hero visibility end (`camp.bottom = 0`) | **1120.78 px** |
| Stage bottom leaves viewport | **1211.78 px** |
| First sampled `.hp-camp[data-inview=false]` | **scrollY 1350** |
| Sample range / total scroll distance | 0–1600 px (1600 px) |
| Frames around the end | 1100 (camp bottom +20.78), 1121 (bottom −0.22), 1150–1600 beyond |

The `data-inview` flag flips later than the geometric release because the site observes the hero pin with intersection thresholds; it is a state flag, not the card's edge. Both sides of the release are in the set. Beyond 1120 the campaign's lower cards are gone and the page has moved into the next bands.

At the loaded state, scrollY 0: hero pin/stage/camp top **432.78**, pin/stage height **779**, camp height **688**. The first scroll frame has the scene fully settled (opacity 1). During the 35-frame sweep the campaign timer advanced on its own; a Bloom & Wild → NEOM crossfade is visible around scroll 700–850 and the scene resets to Bloom & Wild around scroll 1250–1300 as the hero leaves/returns. Those changes are recorded in `activeStates.campScenes`, `activeStates.campStepIndex`, and the hidden brand line.

## 4. Per-scene cycles and measured behaviour

### Announcement (`announcement/`)

The card is an `<aside aria-label="Announcement">` fixed across the top (container 1568 px wide); its centred stack is 400 px wide and 72 px high at top 96 px. It mounts only after hydration:

| Event | Value |
|---|---|
| First `data-open=true` after navigation (this run) | **2464 ms** page time |
| Entry opacity transition | **320 ms** |
| Entry translate transition | **420 ms**, 12 px → 0 |
| Entry at 0 ms | opacity 0, translate `0 −12px` |
| Entry at 100 ms | opacity **0.461518**, translate `−3.05307px` |
| Entry at 200 ms | opacity **0.807978**, translate `−0.559649px` |
| Entry at 300 ms | opacity **0.993098**, translate `−0.0588241px` |
| Entry at 500/800/1200 ms | opacity 1, translate 0 |
| Dismiss leave animation | **480 ms** (`hp-notify-leave`) |
| Dismiss layer opacity at 100/200/300/500 ms | 0.760 / 0.321 / 0.103 / 0 |
| Layer gone | by 800 ms |

The `load-*` frames were requested at 0/100/200/300/500/800/1200 ms from navigation commit, but PNG latency means their actual `pagePerfNowMs` values are **185 / 731 / 1102 / 1501 / 1918 / 2295 / 2632 ms**. The card opens at ~2.46 s, so all but the last show the un-announced page; `load-1200` catches it already at opacity 0.993. The `entry-*` set is the meaningful entry sequence. Copy: “Tano has raised $5m in funding to make creators a true performance marketing channel”, link to `/news/tano-raises-4m-seed-round`, CTA “Read here”.

### Hero campaign time (`hp-camp-time/`)

Fixed scrollY 350; campaign 1 (Bloom & Wild). Requested offsets vs measured state:

| Step | Actual elapsed | Score | Chat turn opacities (1/2/3) | LTV/CAC opacities |
|---|---:|---:|---|---|
| `t-0000` | 0 | 0.00 | 1, 0, 0 | 1, 0 |
| `t-0250` | 356 | 0.06 | 1, 0, 0 | 1, 0 |
| `t-0500` | 691 | 0.73 | 1, 0, 0 | 1, 0 |
| `t-0750` | 1058 | 0.88 | 1, 0.0996, 0 | 1, 0 |
| `t-1000` | 1403 | 0.91 | 1, 0.99995, 0 | 1, 0 |
| `t-1500` | 1746 | 0.92 | 1, 1, 0 | 1, 0 |
| `t-2000` | 2099 | 0.92 | 1, 1, 0 | 1, 0 |
| `t-3000` | 3001 | 0.92 | 1, 1, 0.9381 | 1, 0 |
| `t-5000` | 5002 | 0.92 | 1, 1, 1 | 0, 1 |

Cycle periods: **8,000 ms per campaign**, **32,000 ms per four-campaign rotation** (Bloom & Wild → NEOM → Peachies → Papier). Scene crossfade **600 ms**; backdrop crossfade **700 ms**; score count-up **500 ms delay + 1,600 ms** rAF ease-out-expo; sub-score bars **6,400 ms** (240 ms stagger); chat **7,200 ms** (bubbles at 576 / 2,304 / 4,032 ms nominal); LTV/CAC **9,000 ms** with the second metric at −4,500 ms. The bar `::after` transform is captured: scaleX 0.704 → 0.861 → 0.898 → 0.900, then 0.222 at 5 s as the 6.4 s loop retracts.

The requested 250/500/750 ms offsets overshoot by 100–400 ms because PNG encoding is synchronous with the page and the next wait is computed from the series start. `elapsedMs` is authoritative; the score at actual 356/691/1058 ms is consistent with the campaign having started slightly before the series t0 (the observer fires while the page settles). This does **not** mean the site uses a 250 ms interval.

### Ticker / counters (`counters/`)

Nine frames at scrollY 944. The strip has 7 unique counters (3 duplicated copies for the marquee). The marquee is a **36 s CSS** `hp-strip-slide` translating one 2,001 px copy (≈55.6 px/s). Measured run transform: −1793.74 at 0 ms → −1960.51 at 3,001 ms → loop to −70.34 at 5,001 ms, i.e. the 36 s loop boundary crossed inside the 5 s window.

Counter changes are driven by `setInterval(..., 1600)` in source; each tick picks one of the counters with `perDay > 0` and adds a random step. In this run only **content-active creators** moved: 21,873 → 21,874 (1.5 s) → 21,875 (3.0 s) → 21,876 (5.0 s). Products seeded stayed 82,651, sales-active 5,234, and the four `perDay:0` counters stayed at £14.50 / 8.7 / 14.7 / 3,394. Values are a wall-clock extrapolation from the 2026-10-30 baselines, not a feed; readings differ on every load/day. `tickerText` contains the duplicated full run; `ticker.stats` is the unique seven.

### Conversation thread (`conversations/`)

Nine frames at scrollY 3000. All six `.hp-convo-message` turns are present and opacity **1** in every frame. There is **no per-turn timer, typewriter, or stagger** on desktop; the only entrance is the card-level Reveal (280 ms fade, 760 ms rise) and the only ambient loop is the agent glow at **4.8 s**. The section therefore has no cycle to sample; the nine frames are intentionally identical except for the glow/video/background. `sceneData.messages` records the transcript and `data-from`, so the agent/creator order is verifiable.

### Experiment table (`experiments/`)

Nine frames at scrollY 4000. Round 0 starts when the card enters; the table advances every **4,200 ms**, with a **1,000 ms** result/CAC jitter interval. A full six-round cycle is **25,200 ms**. Captured:

| Step | Actual ms | Rates | CAC | Round/persona |
|---|---:|---|---:|---|
| `t-0000` | 0 | 4.3 / 3.6 / 2.4 | £32.10 | 0, Home and lifestyle |
| `t-0250` | 251 | 4.3 / 3.6 / 2.4 | £32.10 | 0 |
| `t-0500` | 501 | 4.3 / 3.6 / 2.4 | £32.10 | 0 |
| `t-0750` | 751 | 4.3 / 3.6 / 2.4 | £32.10 | 0 |
| `t-1000` | 1000 | 4.4 / 3.5 / 2.4 | £32.21 | 0, jitter 1 |
| `t-1500` | 1501 | 4.4 / 3.5 / 2.4 | £32.21 | 0, jitter 1 |
| `t-2000` | 2001 | 4.4 / 3.5 / 2.3 | £32.29 | 0, jitter 2 |
| `t-3000` | 3000 | 4.4 / 3.7 / 2.5 | £32.08 | 0, jitter 3 |
| `t-5000` | 5003 | 4.9 / 3.9 / 3.1 | £30.40 | 1, New parents |

The 4.2 s boundary is crossed between 3,000 and 5,000 ms; the 5 s frame is the next round. `sceneData.experiment.rows` includes the full row text (message/incentive/content/result), `persona`, and `cac`; `activeStates` does not have a tab state because the four labels are a static header, not tabs.

### Case-study deck (`case-stack/`)

This is **not a time-driven carousel**. It is a three-card scroll-driven sticky stack (Skin+Me → Bloom & Wild → HelloFresh): no autoplay timer, arrows, drag, snap, or track transform. The nine time frames at scrollY 4800 are flat after entry; the eight scroll probes show the real motion:

| scrollY | Covered flags | Depth transform slot 0 | `--cover` slot 0 |
|---:|---|---|---:|
| 4800 | false, false, – | identity | 0.00 |
| 5100 | false, false, – | identity | 0.39 |
| 5250 | **true**, false, – | `scale(.9605) translateY(−17.77)` | 1.00 |
| 5400 | true, false, – | `scale(.96) translateY(−18)` | 1.00 |
| 5700 | true, false, – | `scale(.96) translateY(−18)` | 1.00 |
| 5850 | **true, true**, – | `scale(.9203) translateY(−35.86)` | 1.00 |

Depth transition is **320 ms**; the wipe band is **240 px** of scroll; the ghost-hue morph spans **0.6 × 900 = 540 px**. The first card's stat count-up is **1,400 ms** (easing `1−(1−a)^4`, from the shipped component; the frames show it in progress but the index does not separately instrument the stat text). The deck's card tops are 212 / 658.64 / 1218.64 at scrollY 4800 and pin at 212 once covered.

### Logo marquee (`logo-marquee/`)

Nine frames at scrollY 1396. This is a **JS `requestAnimationFrame` marquee**, not CSS: target speed **26 px/s**, exponential speed easing with a 0.9 s time constant, only while the strip intersects. The copy is **3,300 px** wide, so one copy cycle is ≈**127 s**. Measured transform: −328.835 at 0 ms → −457.959 at 5,002 ms (129.12 px / 5.002 s ≈ 25.8 px/s). `sceneData.marksRun.copies` records the copy rects and the first brand marks.

### Closing cards (`closing-cards/`)

Nine frames at scrollY 12676 after `data-inview=true`. Four decorative `.hp-camp-card`s fade/rise in with 1 s opacity + 1 s translate transitions and delays **0.65 / 0.85 / 1.05 / 1.25 s** (send/library/metric/code). Measured card opacities:

| Step | Actual ms | send / library / metric / code |
|---|---:|---|
| `t-0000` | 0 | 0 / 0 / 0 / 0 |
| `t-0250` | 252 | 0 / 0 / 0 / 0 |
| `t-0500` | 501 | 0 / 0 / 0 / 0 |
| `t-0750` | 751 | 0.2207 / 0 / 0 / 0 |
| `t-1000` | 1183 | 0.8852 / 0.6825 / 0.2952 / 0 |
| `t-1500` | 1615 | 1 / 0.9835 / 0.9064 / 0.7273 |
| `t-2000` | 2076 | 1 / 1 / 1 / 0.9943 |
| `t-3000` | 3002 | 1 / 1 / 1 / 1 |
| `t-5000` | 5001 | 1 / 1 / 1 / 1 |

After the reveal the cards run the same camp CSS loops (chip 6.4 s, chat 7.2 s, metrics 9 s). The section has no separate 1 s+ cycle; the only time structure is the stagger + those camp loops.

### Hover (`hover/`)

Targets and measured transitions:

- **Nav Get started** (`.wire-nav-action`, fixed at top): its own `background-image` transition is declared at 0.22 s, but gradients do not interpolate; the visible change is the **`::before` glow opacity** on the parent `.wire-spectrum-glow`, which runs **240 ms**: 0 before → **0.802403 at 120 ms** → **1 at 240/400 ms**. The pseudo-element paints the five-stop spectrum gradient and an inset white/black box shadow. Seven fresh animations were paused for the frames (inset top/right/bottom/left, filter, opacity, and a 7,000 ms spectrum travel); `hoverTransitions` in the index records them. The nav action itself has `transform: none` throughout.
- **Section Get started** (the mid-page `.tano-button`, captured at scrollY 8480): transform transition **180 ms**, fill background-color **200 ms**. Exact states: translateY 0 at 0 ms → **−0.984791 px at 120 ms** → **−1 px at 240/400 ms**.
- **Hero stage cards** (`.hp-camp-card[data-slot=send]` and `library`): **no hover rule exists**. Transition property is `0s`; transform (the static ±1–1.5° rotation), opacity, and box-shadow are unchanged across all frames. The `hover` frames are still evidence that the card artwork is inert.

## 5. Sequence order

The capture order was: announcement → hero scroll → hero time → counters → conversations → experiments → case time + scroll → logo marquee → closing cards → hover. That is a test order, not page order. Page (scroll) order is: hero/campaign (0–1396), logo band (1396), process loop, conversations (~3000), experiments (~4000), case deck (~4800–6900), attribution, stats, two paths, comparison, creator band, logo band, FAQ, closing (~12676).

Content orders that matter:

- **Hero campaigns:** Bloom & Wild → NEOM → Peachies → Papier → repeat (8 s each). The scroll sweep caught a Bloom & Wild → NEOM crossfade around scroll 700–850 and a reset to Bloom & Wild around 1250–1300; the time series starts at Bloom & Wild.
- **Case deck:** Skin+Me → Bloom & Wild → HelloFresh (three sticky slots).
- **Experiment rounds:** six hard-coded rounds, R0 Home and lifestyle → R1 New parents → …; the 5 s frame catches R0→R1.
- **Counters:** `ticker.stats` preserves the seven unique values in DOM order; the marquee repeats them three times.
- Contact sheets use chronological order even where filenames sort differently: `load → entry → dismiss`, `scroll 0…1600 → release → inview-off`, `case time → case scroll`, `hover before → 0/120/240/400`.

## 6. Randomness / nondeterminism

- **Campaign phase** is not reset by a normal load: the 8 s timer advances from page mount. The 35-frame scroll sweep spans >8 s, so it captures at least one brand crossfade; the exact brand at each scroll step is in `activeStates.campScenes`, not assumed. The time series is reset by leaving/re-entering the hero, but the series t0 is still a few hundred ms after the observer starts.
- **Counter values** are wall-clock extrapolations from a fixed 2026-10-30 baseline plus a random 1.6 s ticker; values differ by day and by load. The four `perDay:0` counters are stable. The marquee phase depends on when the page loaded.
- **Creator videos** are playing inside the campaign; the captured stills are whatever video frame was current. This is the largest source of pixel variation between runs.
- **Announcement open time** depends on hydration/network (2464 ms in this run; 2.5–2.6 s in earlier probes). Load frames are not the entry animation; the exact `entry-*` frames are.
- **Screenshot latency:** time grids use measured `elapsedMs`; PNG encoding lands after that state. Announcement/hover frames are exact because their animations were paused and stepped. Do not read `t-0500.png` as exactly 500 ms of wall clock in the time scenes; read `elapsedMs` in `index.json`.
- **Case stack** depends on scroll position and the viewport's sticky offset. The covered flags/transforms were sampled after two rAF + ~120 ms; the 320 ms transition is visible in the index values at 5250/5850.
- **Lenis** smooth scrolling is active in the page; the harness forces `scroll-behavior:auto` and uses programmatic scrolls, so no wheel easing is involved.
- **Consent and announcement** were dismissed before scene captures. The cookie banner is absent from all scene images; the announcement is present only in `announcement/`.

## 7. Acceptance check

- Hero scroll: **35** samples at 50 px steps 0–1600, including 1100/1121 around the release and 1150–1600 beyond it. The actual release is **1120.78 px**; there is no sticky pin (`pinEnd: null`).
- Time scenes: **9** time samples each for hero, counters, conversations, experiments, case deck, logo marquee, closing cards; case deck additionally has **8** scroll probes.
- Contact sheet or montage for every scene: 10 `contact-sheet.png` files generated from the final frames.
- `index.json` contains 143 samples with scrollY, elapsedMs, element arrays (rect/opacity/transform/data), ticker text, and active states.
- No app code changed: writes are confined to `docs/research/tano/motion/home-frames/`.
