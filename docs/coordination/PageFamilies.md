# PageFamilies — non-home motion parity

Scope: guides, compare, use-cases, case-studies index, careers, news, webinars,
privacy, for-creators. Routes were measured at **1568 × 900** against
`https://www.tano.ai` (live, hydrated) and `http://127.0.0.1:3000` (local).
Evidence captures: `docs/research/tano/<route>/{page.html,page.json}`; motion
laws: `docs/research/tano/motion/{inventory.md,js-orchestration.md}`.

## Files

| File | Change |
|---|---|
| `src/components/sites/tano/pages/behaviours.tsx` | New: FAQ glyph + no-tab FAQ search, page-rail scrollspy, OffscreenPause, for-creators closing films, ad-loop connector, use-case pitch-deck clock/controls |
| `src/components/sites/tano/motion/use-page-family.ts` | Mounts/cleans `mountPageFamilies()` |
| `src/styles/tano/pages.css` | No new rules needed: every page-family transition/keyframe already exists in `source.css`; all audits below matched computed timing |

No replica component was edited. No global handler was duplicated: FAQ stays in
`interactions.tsx`, category-tab searches in `use-home-info.ts`, marks/deck/brand
tabs in `home/media-sections.tsx` + `use-home-info.ts`.

## DOM/state audit (live vs local, before this change)

### Family heights (body scrollHeight, px)

| Route | live | local | Δ |
|---|---:|---:|---:|
| `/guides` | 4920 | 4920 | 0 |
| `/guides/creator-ads` | 9813 | 9813 | 0 |
| `/compare` | 3063 | 3063 | 0 |
| `/compare/ltk-vs-tano` | 12348 | 12348 | 0 |
| `/use-cases/creative-velocity` | 9747 | 9747 | 0 |
| `/case-studies` | 4819 | 4819 | 0 |
| `/careers` | 4257 | 4257 | 0 |
| `/news` | 2554 | 2554 | 0 |
| `/webinars` | 2716 | 2716 | 0 |
| `/privacy-policy` | 9374 | 9374 | 0 |
| `/for-creators` | 6368 | 6368 | 0 |

Per-section heights also matched on all routes (no diff rows in the audit;
`main > section|div` compared by index and height).

### Interactive state diffs found

| Family / route | Selector | live | local (before) | Action |
|---|---|---|---|---|
| Guides FAQ `/guides/creator-ads` | `.hp-faq-glyph` after opening | `data-expanded="true"` | stayed `false` (glyph never rotated) | Fixed: `MutationObserver` mirrors trigger `aria-expanded` / answer `data-open` |
| Guides/compare FAQ search | `.hp-faq-search-clear` | created while query non-empty | absent | Fixed |
| Guides/compare FAQ search | `.hp-faq-empty` when 0 hits | “No question matches that. Ask the team” | absent; rows only `hidden` | Fixed |
| Guides/compare FAQ search | live region | `3 questions match` / `0 questions match` (no query echo) | `3 questions match "creator"` | Fixed |
| Guides/compare FAQ search | filter semantics | tokens ANDed over question + answer | raw substring of row | Fixed |
| Compare table `/compare/ltk-vs-tano` | `.hp-comparison-scroll` | native horizontal pan, `scrollW=clientW=1312` @1568; `scrollW=832 clientW=375` @375 | identical | No JS needed; source has no pan controller |
| Compare notes | `.hp-table-note` / `.hp-table-info` | 0 nodes on all compare routes | 0 nodes | No source node; nothing to port |
| Use cases | `.hp-adloop-path/.hp-adloop-string/.hp-adloop-dot` | 1 path + 20 dots, `animateMotion` | absent | Fixed: source geometry ported |
| Use cases pitch deck | `.hp-pp` | advances 5 steps (11600/11600/11600/11600/12200 ms), `data-state=done/live/idle`, `--hp-steps-active`, scene swap | static step 1 | Clock/state/controls implemented; stage scene content still static (see gaps) |
| Case studies index | `.wire-figs` drift | 2 runs, 60 s CSS drift | identical | No change |
| Careers | `.hp-role` hover | `background-color .2s`; hover adds `background-color .32s linear…` | same transition; bg token differed only by ground-tween progress at capture time | CSS-only, verified |
| Careers | `.hp-team-print` | reveal transform 36px→0, opacity .28 s | identical | No change |
| News | `.wire-case-banners` | 1 slot @ news, deck style `--case-h:512px; --ghost-hue:#88e7f8` | identical | Owned globally by HomeMedia |
| News | `.wire-cases-marks-run` | 3 copies / 15 marks | 3 copies after HomeMedia mount | Owned by HomeMedia; not duplicated |
| Webinars | `.wire-rail-link` current | first link `aria-current=true` (single section) | same | Rail scrollspy now generic |
| Webinars media | `<video>/<img>` in `main` | none in source | none | No media surface exists; nothing to port |
| Privacy | `.wire-rail-link` after scrolling to 3rd section | 3rd link current | stayed on 1st | Fixed: PageRail port (last section above `innerHeight/3`) |
| Privacy/in-text links | `.wire-contact-link`, `.wire-article-prose a` | transition `color .16s` (source) | same | CSS-only, verified |
| For creators | `.hp-ccar` | `data-inview=true`; 80 s `hp-ccar-slide` running | attribute absent; animation ran unpaused offscreen | Fixed: OffscreenPause (200 px) |
| For creators | `.hp-ct-row` | `data-inview=false` while offscreen | attribute absent | Fixed |
| For creators | `.hp-cl-films` | `data-seen` on arrival; films fade .6/0.76/0.92/0.68 s | never set; all opacity 0 | Fixed |
| For creators FAQ | `.hp-faq` | search/empty/clear/glyph as guides | same gaps | Covered by FAQ workers |
| Guides/compare brand tabs | `.hp-brand-tab` 6 s, fill, 260 ms fade, quote swap | implemented by HomeInfo/HomeMedia | same runtime output | Not duplicated |
| Guides/compare brand stat | `.hp-brand-stat-digits` | counts 0→target over 1500 ms after 260 ms | stays `0` | Remaining gap: SSR has no target value (see below) |

## Implemented behaviour details

- **FAQ glyph**: source rotates `.hp-faq-glyph` from `data-expanded`; a single
  MutationObserver mirrors `aria-expanded`/`data-open` for every FAQ stack
  (guide, compare, for-creators, home). No click handler is added.
- **FAQ search (no-tab stacks)**: source tokens are lower-cased, curly quotes
  normalised, ANDed across row text; clear button/empty state use the source
  markup (`hp-faq-empty`, `hp-faq-empty-link`, `hp-faq-search-clear`); status
  is `n question(s) match`; Escape clears. Stacks with `.hp-faq-tab` are left
  to `use-home-info.ts`.
- **Page rail**: `aria-current` is recomputed on scroll/resize with rAF; the
  active section is the last `getBoundingClientRect().top <= innerHeight/3`.
- **OffscreenPause**: `rootMargin: 200px 0px` on `.hp-hero-glow`, `.hp-ct-row`,
  `.hp-ccar`, `.hp-scale-window`, `.hp-convo-agent`; writes
  `data-inview="true|false"`.
- **Creator closing films**: `data-seen` is set once when `.hp-cl-films`
  enters (25 % bottom margin); CSS supplies the 1 s / .68–.92 s slot delays.
- **Ad loop**: exact source geometry — figure centres, 14 px rounded corners,
  `length/72` s travel, `max(4, round(length/150))` dots, per-dot negative
  `begin`, `mpath`; ResizeObserver rebuild; `pauseAnimations()` outside the
  40 % play zone and under reduced motion.
- **Pitch deck**: durations read from the SSR `--hp-steps-duration`, remaining
  time survives pause; auto-advance, prev/next, segment selection, play/pause,
  `data-state`, `data-live`, `--hp-steps-active`, polite live region, fill
  restart and reduced-motion behaviour match source. Home deck is skipped
  (`#loop-title`) and remains HomeInfo's.

## Remaining diffs (explicit)

1. **Use-case pitch-deck stage scenes (2–5).** The live stage swaps
   `velocity-onboard`, `velocity-recommend`, `velocity-invite`,
   `velocity-licence` (and `revenue-attribute`, `revenue-coach`,
   `revenue-measure`). The SSR replica only contains scene 1 for each route;
   the other scene payloads reference images absent from `public/`
   (`/brand/ochre/comp-giftbox.glass.jpg`, `/brand/creators/bloom.jpg`,
   `/brand/creators/neom.jpg`). Porting them would add runtime assets outside
   this workstream's file ownership, so the stage frame remains scene 1 while
   copy/segments advance. Selector: `.hp-pp-stage > .hp-pp-frame >
   .hp-pp-scene[data-scene]`.
2. **Brand stat count-up.** `.hp-brand-stat-digits` starts at `0` in SSR and
   the target is only in the CMS payload; DOM has no target attribute. On
   multi-brand compare pages the second card's stat is injected by HomeInfo's
   `BRAND_CARDS_GZ`; the initial card remains `0%` until that owner wires the
   1500 ms/260 ms counter. Selector: `.hp-brand-stat-digits` /
   `.hp-brand-figure`.
3. **Compare “notes”.** There is no `.hp-table-note`/`.hp-table-info` node in
   any compare capture (only the home comparison has notes, owned by
   HomeInfo). Nothing implemented.
4. **Webinar media.** `/webinars` source renders no `<video>`, `<img>` or
   player; the page is copy + rail. No media behaviour exists to port.
5. **Brand tab duplication risk (peer).** Both `use-home-info.ts` (setupBrands)
   and `home/media-sections.tsx` (mountBrandTabs) attach brand-tab timers and
   click handlers to every `.hp-brand-bar`. They agree on fills/quote swaps but
   both run; this workstream deliberately did not add a third handler.
6. **`rv-word` count.** Local runtime splits h3/h4 too (e.g. `/guides` 153 vs
   17 words), and `data-rv-split` is `""` vs live `"true"`. This belongs to
   `runtime.tsx`/`use-reveal.ts`, outside PageFamilies.

## Verification notes

- Before/after hover measurements used `getComputedStyle` on the element at
  400–450 ms after `hover()`; section/body heights measured after hydration
  and 1.2 s settle.
- Theme flips at light bands were observed through GroundTheme's
  `html[data-ground-tone]` while scrolling each route; no page-family code
  writes `--ground-t`, `--ink-t` or `data-ground-tone`.
- No console errors on the ten audited local routes during the audit runs.

### Post-implementation check (local, 1568 × 900)

| Check | Result |
|---|---|
| `/guides/creator-ads` FAQ open | `aria-expanded=true`, `data-open=true`, glyph `data-expanded=true`, answer height 69 px (live 68.78 px) |
| FAQ search `creator` | clear visible, `3 questions match`, 3 rows |
| FAQ search `zzzz` | `.hp-faq-empty` visible (“No question matches that. Ask the team”), `0 questions match`, 0 rows |
| FAQ Escape | input empty, clear hidden, 3 rows, status empty |
| `/privacy-policy` rail at 3rd section | `aria-current` = `[false,false,true,false,false,false,false]` (live same) |
| `/for-creators` at rest | `.hp-ccar[data-inview=true]`, `.hp-ct-row[data-inview=false]` (live same) |
| `/for-creators` closing films | `data-seen` set after arrival; film opacity tweening (0.07 at 800 ms) |
| `/use-cases/creative-velocity` ad loop | 1 `.hp-adloop-path`, 20 dots, path `d` 256 chars, SVG 1312 × 371 (live 20 dots) |
| Pitch deck next | seg `[false,true,false,false,false]`, states `done/live/idle…`, slide 2 live, `--hp-steps-active=1`, play label `Pause` |
| Body heights after change | all ten routes unchanged (4920, 9813, 12348, 9747, 4819, 4257, 2554, 2716, 9374, 6368) |
| Ground tone flips | dark→light→dark observed on `/compare/ltk-vs-tano`, `/use-cases/creative-velocity`, `/case-studies`, `/careers`, `/news`, `/for-creators`; `/webinars` and `/privacy-policy` contain no light band, so tone stays dark (source layout match) |
| News case card hover | transition `background-color .32s linear, border-color .32s linear, box-shadow .32s linear` (source state rule) |
| Console | 0 errors on all ten routes |

### Integration note

`usePageFamily` is mounted once by `SiteRuntime` (layout level). The workers
initialise the route that is present at mount; a client-side route change
inside the persisted layout will not re-run the effect. Direct loads and
full-page navigations are covered. A route-change remount belongs to the
runtime integration owner.

