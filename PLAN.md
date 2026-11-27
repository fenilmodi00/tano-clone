# Tano.ai — full reverse-engineering + pixel/motion clone plan

Status: executing. Source evidence: `~/tano` (44 captured routes, compiled CSS, JS bundles, 44 full-page screenshots, section maps, videos). Local app: `~/tano-clone` (Next.js 16 / React 19 / TS strict / Tailwind v4 + GSAP).

Non-goal: deploy, publish, or represent the clone as Tano. Brand assets and copy remain Tano Limited's property; this is a local reference rebuild.

## 1. Definition of done

1. All 44 captured routes exist locally at the same pathnames, with the same copy, links, images, video, forms, and responsive structure.
2. Desktop (1568×900) static rendering matches the source with **≤1% pixel difference** per full page and **≤2px geometry drift** on measured elements. Wider (1680) and narrower (1440/1024/768/390) views match the source's own layout rules, not a scaled desktop.
3. Every observable animation is reproduced frame-for-frame: entry reveals, pinned hero campaign (`hp-camp`), counters, marquees, case carousel, chat sequence, experiment transitions, FAQ open, hover/focus states, nav dropdown, mobile menu, closing-card float, footer spectrum.
4. Interactions work: nav menus, mobile menu, announcement dismiss, FAQ search + accordion, carousel/tabs, creator band, comparison horizontal scroll, contact form validation/submission stub, external links preserved.
5. `npm run check` green. No runtime errors, no horizontal overflow, no missing assets, no layout shift from late fonts/images.
6. Motion respects `prefers-reduced-motion`, all auto-playing motion has a pause affordance where WCAG 2.2.2 applies, and no flashing.

Metrics are measured by `scripts/compare-route.mjs` against the live source and stored under `docs/verify/<route>/`.

## 2. Evidence already captured

| Evidence                                                                                | Path                                                       | Use                   |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------- |
| 44 routes, full HTML + desktop/mobile screenshots + section geometry + fonts + CSS vars | `docs/research/tano/<slug>/`                               | build + diff          |
| Route manifest                                                                          | `docs/research/tano/routes.json`                           | scope                 |
| 232 assets (images, video, posters, textures, footer art)                               | `public/sites/tano/` + `docs/research/tano/asset-map.json` | assets                |
| Brand fonts (ABC Whyte Book 350, Medium 500, Semi Mono 400)                             | `public/sites/tano/fonts/`                                 | type                  |
| Compiled source CSS (design tokens, 129 keyframes)                                      | `~/tano/site/css/all.css`                                  | token + motion values |
| Deobfuscated marketing JS                                                               | `~/tano/js/`                                               | interaction logic     |
| Live source                                                                             | `https://www.tano.ai`                                      | pixel/motion oracle   |

## 3. Architecture

```
src/app/<route>/page.tsx              one file per route, static data
src/components/sites/tano/
  shell/                              header, nav dropdown, mobile menu, announcement, footer
  ui/                                 button, band, section-heading, logo-band, closing-cta, faq, cards
  home/                               one component per home band (sections 00–14)
  pages/                              family layouts: article, compare, study, index, contact
src/content/tano/                     extracted, typed content per route + site chrome
src/styles/tano/
  tokens.css                          colors, type, spacing, radii, breakpoints
  base.css                            reset scoped to .tano, typography, utilities
  shell.css, components.css           shell + shared components
  home.css, pages.css                 page-specific
  motion.css                          ported keyframes, timing, states
src/lib/tano/
  motion.tsx                          GSAP helpers: reveal, scroll scene, timeline, ticker
  assets.ts                           URL → local path
scripts/
  capture-source.mjs                  page evidence (done)
  download-assets.mjs                 asset sync (done)
  extract-source-content.mjs          content JSON generator
  capture-state.mjs                   source/clone screenshot at a state
  capture-motion.mjs                  frame sequence at time/scroll
  compare-route.mjs                   pixel + geometry diff report
  verify-all.mjs                      matrix runner
```

Rules: original class names are not required; values are. Local assets only. No remote asset/CDN requests at runtime. GSAP only where sequencing/pinning needs a timeline; CSS keyframes for the source's loop animations.

## 4. Route surface (44)

| Family       | Routes                                         | Layout                                                |
| ------------ | ---------------------------------------------- | ----------------------------------------------------- |
| Home         | `/`                                            | 15 bespoke bands                                      |
| Use cases    | `/use-cases/{drive-revenue,creative-velocity}` | hero + prose/feature rows + proof + FAQ + CTA         |
| Case studies | `/case-studies` + 4 studies                    | index grid; study hero/results/films/prose/others/CTA |
| Guides       | `/guides` + 14                                 | index card groups; article hero/prose/FAQ/brands/CTA  |
| Playbooks    | `/playbooks` + 5                               | resource hero + gated resource card + CTA             |
| Compare      | `/compare` + 4                                 | hero/prose/table/verdict/FAQ/CTA                      |
| Careers      | `/careers` + 3 roles                           | hero/roles/culture; role page                         |
| News         | `/news` + 1 article                            | index/article                                         |
| Company      | `/webinars`, `/privacy-policy`                 | resource/legal                                        |
| Conversion   | `/for-creators`, `/talk-to-us`                 | bespoke hero/form                                     |

## 5. Reverse-engineering method

### 5.1 Static extraction

- Per route: DOM outline, section rectangles, typography, computed styles for every band's key elements, asset list, link graph, meta.
- Breakpoints: 360/390/600/768/900/1024/1200/1440/1568/1680; record container width, section heights, grid columns, type scale, nav state.
- Tokens are authoritative from source CSS: `#0e0d0c` ground, `#fbf9f5` ink, surface `#1a1815`, spectrum `#46b7d1/#cc6add/#fb751f`, radius 10/14/20/28/36/56/72/96, display 80/76 -4%, heading 44/41.8, 30/33, 22/24.2, body 20/28, 16/22.4, mono 14/16.8, page 1312@64 gutters.

### 5.2 Motion extraction

Three drivers, three methods:

- **CSS keyframe loops** (129 declared): parse `@keyframes` + `animation` declarations from `all.css`. Port exact name/duration/easing/delay/iteration/direction/fill and state selectors into `motion.css`. Trigger states observed in DOM (`data-inview`, `data-open`, `data-shown`, `data-stage`, `data-turned`, `data-picked`, `data-win`).
- **JS state machines** (hero camp, flow diagrams, steps, case carousel, counters, announcement): recover thresholds and sequences from the marketing bundles (`hp-camp`, `hp-flow`, `rv-scope`) and observe timing at 60fps. Rebuild as a GSAP timeline or React state machine with the same duration/easing.
- **Scroll-linked** (reveal, pin, marquee, parallax): measure pin start/end, scroll distance, progress mapping, reverse behavior. Implement with GSAP ScrollTrigger for multi-element pinning; native `animation-timeline` where a pure progress effect suffices.
- **Media**: hero phone video, case-study films, footer photo; download and use the real media, poster, autoplay/loop/muted state.
- **Hover/focus**: capture before/after computed styles for nav links, buttons, cards, links, form controls; reproduce transitions exactly.

### 5.3 Frame sampling

`capture-motion.mjs` records a named scene as:

- screenshot at t = 0, 1/30…N/30 s (or scroll progress 0…1 in 1% steps),
- a JSON of every descendant's transform/opacity/filter/background-position + `document.getAnimations()` metadata,
- a contact sheet.
  Source and clone are captured with identical viewport, scroll offsets, device scale, fonts ready, and `?freeze=1` (clone only) to freeze counters/random order. Diff per frame with pixelmatch; report first divergence frame and element.

## 6. Execution phases, owners, parallelism

Phase 0 — Toolchain (done/inline): Playwright + Chromium, chrome-devtools MCP entry, GSAP, diff deps, template, fonts, assets, route manifest, baseline screenshot set.

Phase 1 — Research (parallel, read-only/no code edits):

- R1 motion inventory (CSS keyframes + JS orchestration) → `docs/research/tano/motion/`
- R2 content extraction → `scripts/extract-source-content.mjs` + `src/content/tano/`
- R3 interaction/state evidence → `docs/research/tano/interactions.md` + state screenshots
- R4 responsive metrics → `docs/research/tano/responsive.json|md`
- R5 home frame capture → `docs/research/tano/motion/home-frames/`

Phase 2 — Foundation (orchestrator, blocks builders): tokens/base/shell/motion helpers, header/footer/announcement, shared UI (button, band heading, logo band, FAQ, closing CTA, cards, article prose), content loader, comparison harness.

Phase 3 — Page families (parallel builders, disjoint paths):

- B1 home (15 bands) + home motion
- B2 use cases (2)
- B3 case studies (index + 4)
- B4 guides (index + 14) + article shell
- B5 playbooks (index + 5)
- B6 compare (index + 4)
- B7 careers (index + 3) + news (index + 1) + webinars + privacy
- B8 for-creators + talk-to-us + forms

Phase 4 — Motion parity (parallel specialists, files disjoint):

- M1 hero camp + announcement + counters + ticker
- M2 loop/steps/flow diagrams
- M3 conversations + experiments
- M4 case carousel + logos marquees + creator band
- M5 article reveals, FAQ, nav/mobile menu, hover/focus, footer

Phase 5 — Verification (parallel auditors + fixers):

- V1 pixel/geometry matrix all 44 routes × 4 widths
- V2 motion frame audits per scene
- V3 interaction/a11y audit
- V4 build/typecheck/lint + asset/request audit
- Fix loop until gates green.

Phase 6 — Handoff: `docs/HANDOFF.md` with run instructions, route map, residual diffs, asset attribution.

## 7. Subagent contracts

- Every builder owns explicit files; never edits another family's directory or foundation files.
- Shared foundation is read-only for builders; request changes through the orchestrator.
- No builds/lint/tests in subagents. Orchestrator runs `npm run check` after each integrated wave.
- Content text/assets must come from `src/content/tano` + `public/sites/tano`; no invented copy.
- Acceptance per page: source-matched section order, copy, links, asset crops, responsive behavior; interactions listed in the task; measured diff report.
- Corrective pass: a verifier names the file, selector, source value, clone value, delta; a fixer changes only that.

## 8. Quality gates

1. Static gate: `npm run check` green; zero missing assets; no remote asset hosts in rendered HTML except outbound links.
2. Geometry gate: section tops/heights within 2px at 1568; container/gutter match at all widths; no overflow.
3. Pixel gate: median full-page diff ≤1%; no section >2% after excluding media playback.
4. Motion gate: per scene, keyframe transform/opacity within 2% / 2px at matched progress; duration/easing equal; reverse scroll and reduced-motion correct.
5. Interaction gate: every control works with mouse + keyboard; forms validate; no console errors.
6. Accessibility gate: focus visible, labels, aria-expanded, accordion semantics, pause for auto-motion, contrast not regressed.

## 9. Known risks

- **Media nondeterminism** (video frames, live counters) makes raw pixel diff noisy → freeze media in test mode; compare poster frame.
- **Source changes during build** → pin evidence to the capture date; verify against saved snapshots, not only live.
- **Font licensing** → local reference only; do not redistribute.
- **Exact 129-keyframe parity** → only keyframes used by these 44 routes are ported; unused app-only ones are documented, not copied.
- **Interactive hero camp** is the hardest scene → own owner, frame harness, earliest start.
