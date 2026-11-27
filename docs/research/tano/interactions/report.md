# Tano.ai — interaction & state reconnaissance

Read-only capture of the live site (`https://www.tano.ai`) with Playwright/Chromium.

- **Viewports:** desktop `1568×900 @1x`; mobile `390×844 @1x`.
- **Input:** real pointer hover/click, keyboard `Tab`/`Enter`/`Escape`/`ArrowRight`, mouse wheel and horizontal wheel. No DOM/state was injected to make a step “look” done.
- **Fonts:** `document.fonts.ready` awaited before every capture.
- **Consent:** the cookie banner was dismissed with its own **Reject** button on a warm page in each browser context.
- **Forms:** every `/api/contact-update` PATCH and `/api/creator-signup` POST was intercepted with `page.route`; no lead/creator data reached production. The only external page opened is the public booking destination that the site itself redirects to.
- **Timing source:** browser-resolved `transition`/`animation` shorthands, `element.getAnimations()` (`CSSAnimation`/`CSSTransition`), plus `getBoundingClientRect()` before/after.
- **Colours:** values are the exact computed strings (`oklab(...)`, `color(srgb ...)`, `rgba(...)`). Browsers resolve theme variables differently on dark/light grounds, so the raw strings matter more than the familiar token names.

**Artifacts**

- `states.json` — machine-readable map: 11 areas, 77 state records, 103 unique screenshots (105 references), all validated to exist.
- `shots/<slug>/NN-state.png` — screenshots; `header` 18, `announcement` 8, `mobile-nav` 7, `faq` 9, `cards` 8, `home` 17, `tabs` 2, `forms` 16, `forms-mobile` 11, `careers` 3, `news` 4 = 103 unique files.

**Capture caveat:** the site animates a page-wide “ground tone” when sections enter view. A naïve before-shot can catch a card mid-ground-transition (e.g. grey→white) and look like a hover effect. Every before/after below was taken after 1.6–2.2 s of settling with the pointer parked away, except where the transition itself is the object of study.

---

## 1. Header — desktop (1568×900)

Shots: `shots/header/01-default.png` … `18-focus-get-started.png` (see state table). Route: `/`.

### Rest geometry

| Element | Measured |
|---|---|
| `.wire-chrome` | fixed, `(0,4) 1568×87.59`, `z-index:20`, transition `transform .42s cubic-bezier(.22,1,.36,1), opacity .24s ease-out, visibility linear` |
| `.wire-nav-bar` | grid, `(128,16) 1312×67.59`, padding `6px`, border-radius `26px`, background-color transparent; glass = backdrop `blur(14px) saturate(1.4) brightness(1.02) contrast(.97)` + `::before rgba(255,255,255,.01)` opacity .8 + `::after color(srgb .984 .976 .961 / .048)` opacity .8 |
| bar shadow | `inset 0 1px 0 rgba(255,255,255,.063), inset 1px 0 0 rgba(255,255,255,.03), inset 0 -1px 0 rgba(0,0,0,.16), inset -1px 0 0 rgba(0,0,0,.1), inset 0 0 0 1px rgba(255,255,255,.05), 0 1px 2px rgba(26,24,21,.05), 0 8px 24px -14px rgba(26,24,21,.2), 0 24px 56px -26px rgba(26,24,21,.4)` |
| nav links | 16 px ABC Whyte, weight 500, line-height 17.6 px, letter-spacing −.64 px, padding `18px 12px`, radius `20px`, 1px transparent border |
| Get started | `(1295.03,22) 138.97×55.59`, radius `20px`, fill `oklab(.9825…)`, ink `oklab(.2102…)` |
| Creator Login | `(1155.34,22) 135.69×55.59` |

### State table

| # | Trigger | Visible result / computed change | Timing | Shots |
|---|---|---|---|---|
| 01 | none | header at rest, fixed over announcement | — | [`01-default`](shots/header/01-default.png) |
| 02 | hover **Use Cases** | dropdown unhidden (`data-open=true`, `hidden` removed), chevron SVG flips to `matrix(0,-1,1,0,0,0)` (−90°). Dropdown `(541.92,91.59) 174.13×127.19`, padding `8px`, gap `16px`, radius `28px`, background `oklab(.210181 .00136 .00645)`, backdrop `blur(12px) saturate(1.2)`, **box-shadow none** | open is a `hidden`/`display` toggle; no transition/animation on the panel; chevron SVG transition resolves to `all` with no duration → instant | [`02-hover-usecases`](shots/header/02-hover-usecases.png) |
| 03 | hover first dropdown link | row gains nav wash `linear-gradient(…, color(srgb 1 1 1 / .141176))`; row geometry unchanged | `background-image .22s` | [`03-dropdown-link-usecases`](shots/header/03-dropdown-link-usecases.png) |
| 04 | hover **Case Studies** | same wash `rgba/color(srgb 1 1 1 / .141176)` on the 118.33×55.59 link; ink stays `oklab(.9825…)` | `background-image .22s, box-shadow .22s, transform .22s cubic-bezier(.22,1,.36,1)` | [`04-hover-casestudies`](shots/header/04-hover-casestudies.png) |
| 05 | hover **Resources** | dropdown `(777.5,91.59) 294×343.16`, same padding/radius/ink/backdrop; chevron −90° | as Use Cases | [`05-hover-resources`](shots/header/05-hover-resources.png) |
| 06 | hover Resources row | row wash; the 240 px description stays `color(srgb .984 .976 .961 / .6)` (muted) | `.22s` | [`06-dropdown-link-resources`](shots/header/06-dropdown-link-resources.png) |
| 07 | hover **For Creators** | link wash only; no dropdown | `.22s` | [`07-hover-forcreators`](shots/header/07-hover-forcreators.png) |
| 08–18 | keyboard `Tab` through nav | every nav item gets `outline: 2px solid oklab(.9825…)` at `2px` offset + the same wash; logo outline offset `6px`. **Get started** gets the sheen + `box-shadow: inset 0 1px 0 rgba(255,255,255,.34), inset 0 -1px 0 rgba(0,0,0,.3)` and a UA `outline: 1px auto rgb(16,16,16)` at `1px` offset (not the 2 px link outline) | outline/background transitions as above | [`08-focus-usecases`](shots/header/08-focus-usecases.png), [`14`](shots/header/14-focus-case-studies.png), [`15`](shots/header/15-focus-resources.png), [`16`](shots/header/16-focus-for-creators.png), [`17`](shots/header/17-focus-creator-login.png), [`18`](shots/header/18-focus-get-started.png) |
| 09 | `Enter` on focused Use Cases | same dropdown opens (`aria-expanded=true`), chevron −90°; focus stays on the button | instant | [`09-keyboard-dropdown-open`](shots/header/09-keyboard-dropdown-open.png) |
| 10 | hover **Get started** | `background-image` becomes the white top-edge sheen `linear-gradient(rgba(255,255,255,.22) 0%, rgba(255,255,255,.06) 36%, rgba(255,255,255,0) 58%, rgba(255,255,255,.08) 100%)`; inset highlight shadow; **no transform**, size unchanged | `background-image .22s` | [`10-get-started-hover`](shots/header/10-get-started-hover.png) |
| 11 | mouse-down **Get started** | measured state is identical to hover (the nav action has no `:active` rule; no press scale). Release outside cancels navigation | no distinct active timing | [`11-get-started-active`](shots/header/11-get-started-active.png) |
| 12 | hover **Creator Login** | same white-14% wash; ink unchanged | `.22s` | [`12-creator-login-hover`](shots/header/12-creator-login-hover.png) |
| 13 | wheel down **300 px** | `.wire-chrome` → `data-scrolled="true"`; announcement fades `opacity 1→0`, `translate 0 → 0 -12px`, becomes `visibility:hidden`. **The header pill does not move, resize, or change background/shadow/backdrop.** `data-hidden` remains `false` at 300/600/1200/3600 px | announcement `opacity .24s ease-out, translate .42s cubic-bezier(.22,1,.36,1)`; chrome hide transition exists but is not triggered | [`13-scrolled-300`](shots/header/13-scrolled-300.png) |

> The brief expected a header size/background change at 300 px; there is none. The only 300 px state change is the `data-scrolled` flag and the announcement hiding. This is recorded as an actual-behaviour deviation, not a missed capture.

---

## 2. Mobile navigation — 390×844

Shots: `shots/mobile-nav/01-closed.png` … `07-closed-after.png`.

| State | Measured result | Timing |
|---|---|---|
| **Closed** | `.wire-nav-bar` `(16,16) 358×68`; desktop links + Creator Login `display:none`; hamburger toggle `(169.03,22) 56×56`, `aria-expanded=false`; panel `data-open=false`, `inert`, `opacity 0`, `visibility:hidden`, background `color(srgb .10196 .09412 .08235 / .97)`, backdrop `blur(32px) saturate(1.5)` | — |
| **Opening, +0 ms** | panel `data-open=true`, `aria-expanded=true`, toggle label becomes “Close menu”; panel is full-screen `(0,0) 390×844`, padding `102px 16px 64px`, `overflow-y:auto`; all panel links `opacity 0`, `translateY(10px)`; body inline `style="overflow: hidden;"` | panel `opacity .26s cubic-bezier(.32,.72,0,1)` + visibility; links `opacity .26s, transform .26s cubic-bezier(.32,.72,0,1)` with delay `calc(90ms + i×45ms)` → 90…405 ms |
| **Settled** | panel `opacity 1`, `visibility:visible`; links settle `opacity 1`, `transform:none` | same |
| **Scroll lock** | wheel 400 px while open: `scrollY` stays `0`; body computed `overflow:hidden` | immediate |
| **Group “Use Cases” click** | **No accordion exists.** Group titles are non-focusable `<span>`s with no `aria-expanded`; after click the two group heights stay `228.4` / `374.0`, all 9 links still visible; `document.activeElement` stays the panel. Only the chevron decoration is present | none |
| **Close** | at +60 ms: `data-open=false`, toggle `aria-expanded=false`, glyph `data-open=false`, body inline overflow removed → `visible`; panel fades out | open `.26s`; close `opacity .32s cubic-bezier(.32,.72,0,1)`, then `visibility:hidden` at .32 s; `body{overflow:hidden}` is released immediately at close, not after the fade |

Shots: [`01-closed`](shots/mobile-nav/01-closed.png), [`02-opening-early`](shots/mobile-nav/02-opening-early.png), [`03-opening-mid`](shots/mobile-nav/03-opening-mid.png), [`04-open-settled`](shots/mobile-nav/04-open-settled.png), [`05-group-usecases-click`](shots/mobile-nav/05-group-usecases-click.png), [`06-closing-early`](shots/mobile-nav/06-closing-early.png), [`07-closed-after`](shots/mobile-nav/07-closed-after.png).

> The brief’s “accordion groups” do not exist on the live site; the groups are always-expanded section headings.

---

## 3. Announcement bar

Shots: `shots/announcement/01-entry-partial.png` … `08-dismissed.png`.

### Timeline and geometry

- `data-open=true` is set **~2.5 s after load**, not immediately. The card is server-rendered but hidden (`opacity 0`, `translate -12px`, `visibility:hidden`) until then.
- The 14 `.hp-note-word` spans run `hp-note-word .42s cubic-bezier(.22,1,.36,1)` with `animation-delay: 38ms × index` (0 → 494 ms). They start ~0.55 s after load and finish ~1.05 s — **while the container is still invisible**, so the visible entry is only the card fade.
- On reveal: aside `opacity 0→1` over `.32s ease-out`; `translate -12px→0` over `.42s cubic-bezier(.22,1,.36,1)`.
- Settled aside: `(0,96) 1568×71.98`; card `(584,96) 400×71.98`, radius `20.56px`, background `rgb(255,255,255)`, padding `10px 14px 10px 10px`, shadow `inset 0 1px 0 rgba(255,255,255,.8), 0 12px 32px rgba(0,0,0,.12)`.
- Close button: `24×24` at `(968,88)` (top-right, −8 px outside), radius `384px`, 1 px `rgba(26,24,21,.1)` border, white surface; `opacity 0` at rest, revealed to `1` when the front note is hovered/focused (`opacity .16s ease-out`).

### Interaction table

| State | Result | Timing | Shot |
|---|---|---|---|
| Entry, partial | true screencast frame; card partially transparent, header already visible | see timeline | [`01-entry-partial`](shots/announcement/01-entry-partial.png) |
| Entry, near-settled | card almost opaque; same geometry | `.32s/.42s` reveal | [`02-entry-near`](shots/announcement/02-entry-near.png) |
| Idle | card fully opaque; words all visible | — | [`03-idle`](shots/announcement/03-idle.png) |
| Hover card + “Read here” | chevron `translate(2px)`; CTA ink `color(srgb .984…/.6)` → `oklab(.9825…)`; card background darkens to `color-mix(surface 94%, ink)` | chevron `.2s ease-out`; CTA/card colour no explicit duration on the card (`background-color` from CSS mix) | [`04-readhere-hover`](shots/announcement/04-readhere-hover.png) |
| Hover close | close fades `0→1`; glyph `color` secondary→primary | `.16s ease-out` | [`05-close-hover`](shots/announcement/05-close-hover.png) |
| Click close, +311 ms | layer becomes `data-layer="leaving"`, `hp-notify-leave`: opacity `.76`, matrix scale `.9904`, translateY `−5.76px`; aside height already `0`; hero padding already animating (`146.3px`) | leave `.48s cubic-bezier(.32,.08,.24,1)` | [`06-dismiss-mid-a`](shots/announcement/06-dismiss-mid-a.png) |
| Click close, +363 ms | opacity `.518`, scale `.9807`, translateY `−11.56px`; layer set removed after animation; no second note is promoted | same | [`07-dismiss-mid-b`](shots/announcement/07-dismiss-mid-b.png) |
| Post-dismiss | announcement node removed; hero padding-top `200px → 128px`, hero height `1391.78 → 1319.78` (−72 px); header stays fixed at `y=4` | `padding-top .42s cubic-bezier(.22,1,.36,1)` | [`08-dismissed`](shots/announcement/08-dismissed.png) |

---

## 4. FAQ — `/guides/creator-ads`

Shots: `shots/faq/01-closed.png` … `09-keyboard-open.png`. FAQ section was centered and the page kept at `scrollY 6282` for all pointer measurements (no jump).

| State | Measured before → after | Timing/easing | Shot |
|---|---|---|---|
| Closed | row `490.55×67.19`; answer `height 0`, `grid-template-rows 0px`, `opacity 0`; trigger ink `color(srgb .984 .976 .961 / .6)`; glyph `matrix(1,0,0,1,0,0)`; search pill `490.55×48`, bg `color(srgb .984 .976 .961 / .1)` | — | [`01-closed`](shots/faq/01-closed.png) |
| Open mid (+60 ms) | answer `grid-template-rows 22.39px`, `opacity 0` (opacity has 80 ms delay), row `106.44px` | grid `.32s cubic-bezier(.22,1,.36,1)`; opacity `.26s .08s` | [`02-open-mid`](shots/faq/02-open-mid.png) |
| Open settled | row `135.97px`; answer `68.78px`, `grid-template-rows 68.78px`, `opacity 1`; trigger ink full `oklab(.9825…)`; glyph `matrix(.7071,.7071,-.7071,.7071,0,0)` = 45°; `aria-expanded=true`, answer `data-open=true` | glyph `transform .32s cubic-bezier(.22,1,.36,1)`; trigger colour `.2s` | [`03-open-settled`](shots/faq/03-open-settled.png) |
| Second row opened | single-open behavior: row heights `135.97 / 67.19` → `67.19 / 134.63`; first `aria-expanded=false`, second `true` | same | [`04-second-row-open`](shots/faq/04-second-row-open.png) |
| Search focused | input is transparent, `0` border, no own outline; wrapper `.hp-faq-search` gains `outline: 2px solid oklab(.9825…)` at `outline-offset: 2px`. No layout shift | focus ring immediate | [`05-search-focus`](shots/faq/05-search-focus.png) |
| Type “password” | panel drops from 3 rows to 1 (`Do I need the creator's password?`), clear button appears, `aria-live` announces “1 question matches” | filtering is immediate; no row-height animation on removal | [`06-search-match`](shots/faq/06-search-match.png) |
| Type “zzzz” | all rows removed; panel innerHTML is just `<ul class="hp-faq-rows"></ul>`; no visible empty message, only visually-hidden live text “0 questions match”; card collapses to `227.2px` | immediate | [`07-search-empty`](shots/faq/07-search-empty.png) |
| `Escape` | clears query, clear button disappears, all 3 rows restored | immediate | [`08-search-escape`](shots/faq/08-search-escape.png) |
| Keyboard | native `<button>` opens on `Enter`; focus-visible outline `2px solid` primary at `2px` offset; same geometry as pointer open | same transitions | [`09-keyboard-open`](shots/faq/09-keyboard-open.png) |

---

## 5. Cards, buttons, footer, logo motion

### Guide index card — `/guides`

`shots/cards/01-guide-card-hover.png`

- Card `640×227.6`, padding `40px`, radius `32px`, background `color(srgb .101961 .094118 .082353 / .1)`.
- Hover → background `rgba(26,24,21,.2)` (surface-secondary-hover). Title and “Read the guide →” colour do **not** change; no transform.
- Transition: `background-color .15s`.

### Case card — home case deck

`shots/cards/02-case-card-hover.png`

- Banner `1312×512`, radius `56px`, shadow `0 -6px 16px -8px rgba(26,24,21,.2), 0 0 24px -6px rgba(26,24,21,.1), 0 24px 48px -24px rgba(26,24,21,.2)`.
- Hover: `transform: translateY(-2px)`; `.wire-case-action` opacity `1 → .88`. No colour/shadow change.
- Timing: `transform .24s`; action `opacity .24s`.

### Case-studies film strip — `/case-studies`

`shots/cards/03-case-film-hover.png`

- `.wire-figs-track` runs `wire-figs-drift 96000ms linear`. At rest transform advanced `-173.793 → -206.268 px` in 600 ms (~54 px/s at this point).
- On hovering `.wire-figs` (`data-motion="drift"`), `animation-play-state: paused`; transform froze at `-209.78 px` and `getAnimations()[0].playState === "paused"`.

### Closing CTA — home `Get started`

`shots/cards/04-cta-rest.png`, [`05-cta-hover`](shots/cards/05-cta-hover.png), [`06-cta-press`](shots/cards/06-cta-press.png)

| State | Transform | Fill (theme-mapped) | Timing |
|---|---|---|---|
| Rest | `none` (147×48) | `oklab(.9825…)` (near-white on this dark band) | `transform .18s cubic-bezier(.32,.72,0,1), color .2s` |
| Hover (`data-hover`) | `translateY(-1px)` | `oklab(.8498…)` | `transform .18s`; fill `background-color .2s` |
| Press (`data-press`/`:active`) | `translateY(1px) scale(.985)` → rect `144.8×47.3` | `oklab(.72965…)` | `transform .08s`; press transition-duration drops to `80ms` |

### Footer link — home

`shots/cards/07-footer-link-hover.png`

- “Case Studies” link: padding `4px 8px`, radius `384px`, negative inline margin, text `16px/350`.
- Rest: colour `color(srgb .984 .976 .961 / .6)`, background transparent.
- Hover: colour `oklab(.9825…)`, background `color(srgb 1 1 1 / .141176)`; geometry unchanged.
- Transition: `background-color .16s, color .16s`.

### Logo marquee — home “As featured in”

`shots/cards/08-logo-marquee-hover.png`

- `.wire-cases-marks-run` is moved by JS `transform: translate3d(…)`, no CSS animation (`getAnimations()` empty); cursor `grab`.
- Measured `-13.382 → -28.985 px` in 600 ms (~26 px/s); after hovering the strip another 600 ms it reached `-46.316 px`. **No pause-on-hover and no `data-paused` attribute.**
- Contrast: the case-studies film strip (above) *does* pause on hover.

### Careers role card — `/careers`

`shots/careers/01-role-card-default.png`, [`02-role-card-hover`](shots/careers/02-role-card-hover.png)

- Card `1312×204.2`, padding `40px`, radius `32px`, background `oklab(.999994 …)` (white).
- Hover: background `color(srgb .101961 .094118 .082353 / .1)`; text/arrow geometry and colour unchanged (the circular arrow does **not** slide).
- Transition: `background-color .2s`.
- Second card confirms the same treatment: `shots/careers/03-role-card-2-hover.png`.

### News

- Index has exactly one item, rendered as `.wire-case-banner`. Hover: `translateY(-2px)`, action opacity `1 → .88`, background/shadow unchanged; `transform .24s`, `opacity .24s`. Shots `shots/news/01-list-card-default.png`, [`02-list-card-hover`](shots/news/02-list-card-hover.png).
- Article contents rail `.wire-rail-link`: font 16 px/350, transition `color .16s`. **Measured before/after are identical** (`oklab(.9825…)`) — the base ink already equals the hover ink on this dark article ground; no visible hover change. Shots [`03-article-rail-default`](shots/news/03-article-rail-default.png), [`04-article-rail-hover`](shots/news/04-article-rail-hover.png).

---

## 6. Home interactions

### 6.1 Hero campaign card over 6 s

Shots: [`01-hero-0s`](shots/home/01-hero-0s.png), [`02-hero-1s`](shots/home/02-hero-1s.png), [`03-hero-6s`](shots/home/03-hero-6s.png), [`04-hero-next-campaign`](shots/home/04-hero-next-campaign.png).

| Observation time | Creator score | Product | Video | `data-opening` |
|---|---|---|---|---|
| first sample ~2.8 s | `0.92` (raw earlier probe saw `0.06` immediately after load) | The Sunshine Bouquet | 2.28 s / 8 s, playing, muted, loop | true |
| +1 s (~4.1 s) | `0.92` | same | 3.63 s | true |
| ~9.1 s | `0.92` | same | 0.58 s (video looped at 8 s) | **false** |
| ~9.7 s | `0.85` (counter restarted) | **Real Luxury Candle** | 1.09 s | false |

- The hero is a pinned, scroll-driven 4-reel sequence; at rest it still plays the 8 s vertical video and animates the creator-score counter from `0.00` → `0.92` in roughly the first second.
- The whole campaign (product, creator handle, chat, metric bars) swaps ~6.9 s after the first sample, i.e. shortly after the 8 s video loops; `data-opening` is removed ~0.6 s before the product swap.
- Card panel rect at capture: `(145,579) 339×199`; campaign panel is `aria-hidden=true` (decorative), video `muted loop playsinline`.

### 6.2 Creator-loop carousel (controls, not dots)

Shots: [`05-carousel-step1`](shots/home/05-carousel-step1.png), [`06-carousel-next`](shots/home/06-carousel-next.png), [`07-carousel-paused`](shots/home/07-carousel-paused.png), [`08-carousel-resumed`](shots/home/08-carousel-resumed.png).

- Four steps: “Your setup” → “Find your creators” → “Get them posting” → “Learn what works”.
- The DOM contains four `.hp-steps-seg` items, but **only the live one is displayed**; the other three are `display:none`. So the progress indicator is a single 3 px line, not clickable dots.
- Step durations: `12200ms` for step 1, `11600ms` for steps 2–4 (`--hp-steps-duration`), driven by an animated gradient fill.
- `Next step` advanced `Step 01/Your setup` → `Step 02/Find your creators` (aria-current moves, active slide `data-live=true`).
- `Pause` froze the fill (`data-paused=true`) and the button's `aria-label` became **Play**; clicking Play resumed it and the label returned to **Pause**.
- Buttons: `Previous step`, `Pause/Play`, `Next step` are 40×40 `.hp-arrow-button`s. No dot navigation exists.

### 6.3 Case deck — scroll-driven, no controls/dots

Shots: [`09-case-deck-start`](shots/home/09-case-deck-start.png), [`10-case-deck-scrolled`](shots/home/10-case-deck-scrolled.png).

- At start: slot 0 `data-covered=false`, `--cover:0.00`, rect `1312×512`; slot 1 stacked below; no control buttons found (`controls: []`).
- After wheel +900 px: slot 0 `data-covered=true`, `--cover:1.00`, scaled to `1260×492` at `(154,194)`; slot 1 becomes the active `1312×512` at `(128,212)`; slot 2 begins below. Slot ticks remain decorative.
- The “Don’t take it from us” deck is a sticky stacked-card sequence; there are **no prev/next buttons or dots** for it. The carousel controls in §6.2 belong to the creator-loop section.

### 6.4 FAQ topic tabs (home)

Shots: [`13-faq-tab-getting-started`](shots/home/13-faq-tab-getting-started.png), [`14-faq-tab-creators`](shots/home/14-faq-tab-creators.png).

- Three tabs: `Getting started` (active, `aria-selected=true`, `tabindex=0`, bg `color(srgb .984 .976 .961 / .2)`, ink `oklab(.9825…)`) → `Creators` (after click: active/selected/tabindex 0; the old tab becomes inactive, bg transparent, ink `color(srgb .984 .976 .961 / .6)`) → `Content and results`.
- Panel contents swap (6 questions each); `#faq-panel` `aria-labelledby` changes `faq-tab-start` → `faq-tab-creators`; scroll position stays fixed at `scrollY 11788`.
- Inactive tabs `tabindex=-1`; active tab only is in the tab order. This is the only multi-tab tablist on the home page.

### 6.5 Creator/brand testimonial bar (guide)

Shots: `shots/tabs/01-testimonial-brand-1.png`, [`02-testimonial-hover`](shots/tabs/02-testimonial-hover.png).

- On `/guides/creator-ads` the “In their words” band renders a `role="tablist"` with **exactly one tab** (`tabCount=1`, `--hp-brand-count:1`) — the Bloom & Wild creator testimonial.
- The 6 s progress line (`hp-brand-fill`, `6000ms linear`) fills 0 → 100 % and then stops. No brand change occurred within ~10 s and there are no other tabs/dots/arrows.
- Hover only re-applies `opacity 1` / `grayscale(0)` to the single active tab; no visible change.
- The home “Are you a creator?” band contains **no tabs** — it is an email + consent form. So “creator band tabs” as a multi-tab control does not exist in the live site; the closest tab UIs are the home FAQ tablist (§6.4) and this single-tab testimonial progress bar.

### 6.6 Comparison table — horizontal scroll affordance

Shots: [`11-comparison-start`](shots/home/11-comparison-start.png), [`12-comparison-scrolled`](shots/home/12-comparison-scrolled.png), [`17-comparison-390-cue`](shots/home/17-comparison-390-cue.png), [`15-comparison-390-start`](shots/home/15-comparison-390-start.png), [`16-comparison-390-scrolled`](shots/home/16-comparison-390-scrolled.png).

- At **1568 px** the table fits exactly: region `clientWidth 1312 = scrollWidth 1312`, table `1312`; the “Swipe to see how they compare →” cue has zero size and there is no overflow. Horizontal wheel does nothing (max scroll 0).
- At **390 px** the table has `min-width:800px` inside a `390px` region (`scrollWidth 832`, max `scrollLeft 442`). The cue is visible `(16,222.98) 206×16.8`. Horizontal wheel moved `scrollLeft 0 → 442` (the end).
- The region has `overflow-x:auto` but `tabindex=-1` (not keyboard-reachable); programmatic focus draws a `2px` inset primary outline. ArrowRight did not scroll it.
- The affordance is therefore **responsive/mobile-only**, not present at desktop width. It has no arrow buttons or dots; the cue text is the affordance.

### 6.7 Closing CTA

Covered in §5 (hover −1 px, press scale .985, fill lightens/darkens). Shots `shots/cards/04-cta-rest.png` … `06-cta-press.png`.

---

## 7. Forms

### Network interception (both forms)

- `/talk-to-us` submit: `PATCH https://www.tano.ai/api/contact-update`, JSON `{name,email,brandWebsite,companyType,monthlyAdSpendBand,sellsPhysicalProducts,creatorActivity,role,phoneNumber,message,sourcePage,hearAboutUs,…}`.
  - HTTP 500 → generic inline failure.
  - HTTP 200 `{qualified:true, route:"Booking", redirectUrl:"https://calendar.superhuman.com/book/11WCFvT5ULNv2tcGKD/w8Iva"}` → `window.location.assign` to the public Superhuman booking page (it resolves to `https://superhuman.com/book/11WCFvT5ULNv2tcGKD/w8Iva`). **There is no in-app thank-you screen.**
- `/for-creators` submit: `POST https://www.tano.ai/api/creator-signup` `{email,source:"For Creators page"}`; success is inline.
- Every one of these requests was fulfilled by Playwright `route`, so no production lead/signup was created. The screenshots of the external booking page are the site's own success destination after an intercepted response.

### Talk to us — desktop (1568×900)

Shots: `shots/forms/01-talk-desktop-default.png` … `10-talk-desktop-success-destination.png`.

| State | Result |
|---|---|
| Default step 1 | Fixed glass sheet on the right; `.wire-contact-card` `512×652.56` at `(528,167.7)`, padding `24px 32px`; step 2 fields `display:none`; one full-width “Continue” |
| Field focus | Input border `1px solid rgba(26,24,21,.1)`, bg white; focus → UA `outline: 1px auto rgb(16,16,16)`, no custom border/shadow change |
| Empty submit | Name/email `aria-invalid=true`, borders `rgb(237,82,99)` (rose-500); errors `.wire-contact-error` in `rgb(176,51,69)` (rose-700): “Enter your name”, “Enter your work email”; `aria-describedby` points to error ids |
| Filled step 1 | Errors clear, `aria-invalid` removed, borders back to `rgba(26,24,21,.1)`; card grows to fit |
| Step 2 | `data-current-step=2`; step 1 fields `display:none`; step 2 fields `display:flex`; actions become **Back** (secondary) + **Get started** (primary, full width); group label “Step 2 of 2” |
| Company type = Agency | Reveals two required conditional fields `onBehalfOfClientBrand` + `clientBrandWebsite` (72.8 px each); choosing DTC hides them again. Select loses `data-empty`, placeholder ink secondary→primary |
| Selects / consent | Native `<select>` dressed as 48 px control (`1px` border, radius `20px`, custom chevron, padding-right `16px+24px`); checkbox `18×18`, radius `4px`, `accent-color` zinc-900. The OS select popup itself cannot be screenshotted headlessly |
| Submitting | Submit disabled, `data-disabled=true`, label **“Sending…”**; 48 px high, full width `352.55px` |
| Server 500 | Values stay; rose line “That didn’t send. Try again, or email team@tano.ai.” at `(560,787.5) 448×16.8`; button back to “Get started”, enabled |
| Success | Page navigates to `https://superhuman.com/book/11WCFvT5ULNv2tcGKD/w8Iva` (title “Superhuman Mail | Scheduling”); screenshot is the destination page |

### Talk to us — mobile (390×844)

Shots: `shots/forms-mobile/01-talk-mobile-default.png` … `09-talk-mobile-server-error.png`.

- Card/sheet `358×651.4` at `(16,135.3)`, padding `24px 32px`, transparent card/0 radius over the sheet; no horizontal overflow; `document.body.scrollHeight` 844 (sheet scrolls internally).
- Same state sequence: default → empty-submit rose errors → filled → step 2 → ready/consent → **Sending…** → rose server error. Error card grows and the sheet remains scrollable; `shot 04` is the full card crop.
- Phone country selector stacks full width below 768 px.

### For Creators — desktop (1568×900)

Shots: `shots/forms/11-creator-desktop-default.png` … `16-creator-desktop-success.png`.

- Form row: 520 px wide; email input + primary “Sign up to Tano”; consent checkbox + status line.
- Focus: UA `1px auto` outline, border unchanged.
- Empty submit: native browser validation focuses the email input (bubble is OS UI, not in DOM); status stays empty.
- 500 response: status line “That didn’t go through. Try again, or email hello@tano.ai.” in the **body ink** (`oklab(.9825…)`, not rose) on the dark band; input and submit stay enabled.
- 200 response: inline “You’re on the list. We’ll be in touch when a programme fits.” in `color(srgb .984 .976 .961 / .6)`; email input and submit become `disabled` (button also `data-disabled=true`); no navigation.

### For Creators — mobile (390×844)

Shots: [`10-creator-mobile-default`](shots/forms-mobile/10-creator-mobile-default.png), [`11-creator-mobile-success`](shots/forms-mobile/11-creator-mobile-success.png).

- `.hp-cl-row` switches to `flex-direction:column`; input and button each `340px` wide; form sits `(16,599.3) 358×225.4`.
- Success: same inline confirmation and disabled field/button as desktop.

---

## 8. Careers and news

| State | Result | Timing | Shots |
|---|---|---|---|
| Careers role card hover | White card → `color(srgb .101961 .094118 .082353 / .1)`; no transform, no title/arrow change | `background-color .2s` | [`01-role-card-default`](shots/careers/01-role-card-default.png), [`02-role-card-hover`](shots/careers/02-role-card-hover.png), [`03-role-card-2-hover`](shots/careers/03-role-card-2-hover.png) |
| News index card hover | `.wire-case-banner` `1312×512`; `translateY(-2px)`; action pill opacity `1 → .88`; background/shadow unchanged; headline link unchanged | `transform .24s`, `opacity .24s` | [`01-list-card-default`](shots/news/01-list-card-default.png), [`02-list-card-hover`](shots/news/02-list-card-hover.png) |
| News article rail hover | `.wire-rail-link` 16 px/350, `transition: color .16s`; measured colour before and after are the same `oklab(.9825…)` — no visible change on this dark ground | `.16s` (no net change) | [`03-article-rail-default`](shots/news/03-article-rail-default.png), [`04-article-rail-hover`](shots/news/04-article-rail-hover.png) |

---

## 9. Deviations from the brief / notable gotchas

1. **Header at 300 px does not shrink or change background.** Only `.wire-chrome[data-scrolled]` flips and the announcement hides. `data-hidden` never became true up to 3600 px.
2. **Nav dropdowns have no shadow and no open animation.** They toggle `hidden` (`display:none`), with glass background `oklab(.2102…)`, `backdrop-filter: blur(12px) saturate(1.2)`, radius 28 px. Chevron rotation is instant (no transition duration).
3. **Get started has no distinct pressed style** in the header; hover and mouse-down measure identically. The shared `.tano-button` press scale applies to content CTAs, not this nav `<a>`.
4. **Announcement word stagger is invisible.** Words animate while `data-open=false`/`visibility:hidden`; the visible reveal ~2.5 s after load is only a 0.32 s card fade + 0.42 s slide.
5. **Mobile “accordion groups” do not exist.** Group titles are static spans; both groups stay expanded, all 9 links visible. Body scroll lock is real (`overflow:hidden`) and released immediately on close.
6. **No case carousel dots or deck controls.** The case deck is a scroll-driven sticky stack with decorative ticks. The creator-loop carousel has prev/pause/next + one active progress line; the other three segment items are `display:none`.
7. **No “creator band tabs” on home.** The home creator band is a form. The guide “In their words” bar is a single-tab testimonial with a once-through 6 s progress line. The only multi-tab control is the home FAQ topic tablist.
8. **Comparison table does not overflow at 1568 px**; the swipe cue is zero-size. The horizontal affordance appears at ≤600 px (table min-width 800). It has no arrow buttons/dots and is not keyboard-focusable (`tabindex=-1`).
9. **Talk-to-us success is an external redirect, not an in-app success screen.** The page fires GA4 `generate_lead` then assigns the Superhuman booking URL.
10. **Native `<select>` popups are OS-rendered**, so only the closed/selected state and the custom chevron are captured; the popup itself is not in the DOM.
11. **Ground-tone transitions can mislead before/after snapshots.** Card surfaces on careers/news/CTA animate between theme surfaces when a section enters view; all final measurements here were taken after settling with the pointer parked.

---

## 10. Coverage → artifacts

| Brief item | Primary state IDs | Where |
|---|---|---|
| 1 Header hover/focus/dropdowns/CTA/scroll | `header-01…09`, `header-focus-14…18` | `states.json.areas.header`; `shots/header/` |
| 2 Mobile menu | `mobile-01…05` | `states.json.areas["mobile-nav"]`; `shots/mobile-nav/` |
| 3 Announcement | `announcement-01,02,03,word-build,05,06,07,08` | `states.json.areas.announcement`; `shots/announcement/` |
| 4 FAQ | `faq-01…08` | `states.json.areas.faq`; `shots/faq/` |
| 5 Cards/buttons/footer/marquee | `cards-01…05,07` | `states.json.areas.cards`; `shots/cards/` |
| 6 Home hero/carousel/deck/tabs/comparison/CTA | `home-01…06`, `tabs-01`, `cards-04` | `states.json.areas.home/tabs`; `shots/home/`, `shots/tabs/` |
| 7 Forms | `forms-talk-*`, `forms-creator-*`, `forms-talk-mobile-*`, `forms-creator-mobile-01` | `states.json.areas.forms/["forms-mobile"]`; `shots/forms/`, `shots/forms-mobile/` |
| 8 Careers/news | `careers-01,02`, `news-01,02` | `states.json.areas.careers/news`; `shots/careers/`, `shots/news/` |

`states.json` preserves the full computed before/after objects (rect, opacity, transform, background, colour, border, shadow, filter, transition, animations, attributes) for every record above; the screenshot paths there are validated.
