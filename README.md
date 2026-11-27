# Tano.ai — production rebuild

A Next.js 16 rebuild of the Tano marketing site: 44 routes, local media, source-faithful layout, motion and interactions. This is a **reference build**, not a deployment of Tano and not affiliated with Tano Limited. All brand assets and copy belong to their owners; do not publish the clone as Tano or use it for impersonation.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # format + content manifest + lint + typecheck + build + static assertion
```

Production:

```bash
npm run build
npm run start
# or: node .next/standalone/server.js
```

Set `NEXT_PUBLIC_SITE_URL` before a production build; `NEXT_PUBLIC_*` values are inlined at
build time. Search indexing is opt-in via `NEXT_PUBLIC_ALLOW_INDEXING=true`. See `.env.example`.

## What is implemented

- **44 routes**: home, two use cases, case-study hub + four studies, guides hub + 14 data-driven
  guides, compare hub + four data-driven comparisons, playbooks hub + five data-driven playbooks,
  careers hub + three roles, news hub + article, webinars, privacy, for creators, talk to us.
- **Design system** in `src/styles/`: the captured token/keyframe/responsive system, split
  into the purged vendor stylesheet plus a runtime-only stylesheet for Lenis and inline-SVG classes.
  Fonts are the real ABC Whyte files, preloaded with `font-display: swap`.
- **Shell**: fixed glass nav with dropdowns, mobile menu with focus handling, footer, cookie
  consent, and the site-wide `/talk-to-us` drawer. Internal navigation uses `next/link` everywhere.
- **Motion**: Lenis smooth scroll (disabled for coarse pointer / reduced motion / contact page);
  GroundShift dark↔light transitions; RevealMotion word-splitting and stagger reveals; hero
  campaign reels; counters, ticker, logo marquee, case deck, FAQ/tabs, experiments, closing cards,
  case-study films and reels.
- **Forms**: source field sets and validation for talk-to-us, creator signup and the drawer form,
  with local success states (no backend calls).
- **Production shell**: per-route canonical/OG/Twitter metadata, generated OG image, sitemap,
  robots, web manifest, branded 404/error/global-error/loading states, security headers, and a
  no-JS reveal fallback.

## Architecture

```
src/app/<route>/page.tsx          route entry + metadata from the route's JSON
src/app/<route>/_components/      route-local captured body (21 routes)
src/app/_home/                    home body, data and controllers
src/app/_runtime/                 client runtime composition
src/app/guides/_components/       guide template + brands (14 details)
src/app/compare/_components/      compare template (4 details)
src/app/playbooks/_components/    playbook template (5 details)
src/components/ui/                shared button/link and FAQ row
src/components/layout/            header, footer, mobile nav, consent, logo strings
src/components/media/             shared case-study reel card
src/components/status-page.tsx    shared 404/error/loading surface
src/hooks/                        shared client hooks (Lenis, reveal, scroll, observers)
src/lib/                          metadata, site config, motion primitives, form model
src/content/
  routes.ts                       generated route/SEO manifest (single source for sitemap)
  pages/                          route-mirrored JSON content
  types.ts                        content model
src/styles/                       design system, runtime CSS, route shims
scripts/                          capture, generation, verification and CI assertions
docs/ARCHITECTURE.md              current architecture + remaining migration plan
docs/research/, docs/verify/      local evidence (not tracked; see docs/EVIDENCE.md)
```

### Route and content model

- `src/content/routes.ts` is generated from the 44 JSON files by
  `scripts/generate-route-manifest.mjs`. `npm run content:check` fails when it is stale.
- Every route's `page.tsx` imports its own JSON and calls `buildPageMetadata`; there is no second
  title/description copy in the page file.
- The 14 guide details, four compare details and five playbook details render from JSON through
  `GuideTemplate`, `CompareTemplate` and `PlaybookTemplate`. The other 21 routes colocate a
  checked-in captured body at `src/app/<route>/_components/captured-body.tsx` (formatted, linted,
  and componentized where patterns were uniform). The capture generator is now a research tool,
  not a build step: running it overwrites hand edits.
- `SiteRuntime` at `src/app/_runtime/site-runtime.tsx` keeps global Lenis/ground-tone mounts alive
  across navigation and remounts route-scoped behaviours after the App Router commits a route.

### Regenerate captures (research only)

```bash
node scripts/capture-source.mjs            # refresh page/DOM evidence
node scripts/download-assets.mjs           # refresh local assets
node scripts/extract-source-content.mjs    # rebuild content JSON
node scripts/generate-route-manifest.mjs   # rebuild routes.ts
```

`generate-replicas.mjs` recreates the 21 captured route bodies, skips the JSON-template families,
and supports `--dry-run` to print targets without writing. Do not run it on a tree with hand edits
unless you intend to replace them.

## Verification

```bash
npm run check                 # format, content manifest, lint, typecheck, build, static assertion
npm run verify:visibility     # 44 routes: above-fold content, hydration, console errors
npm run verify:client-nav     # 44 routes: client navigation + browser history
npm run verify:links          # internal link/404 audit
npm run verify:smoke          # 44-route status/console/missing-image smoke
npm run verify                # pixel/geometry matrix against the live source
npm run verify:motion         # motion scenes against the live source
```

`npm run assert:static` checks the production build: 44 prerendered route files, zero dynamic
routes, and the generated sitemap/robots/manifest/OG endpoints. CI runs the static gate and a
production-server visibility/link/smoke job.

Latest full matrix baseline: `docs/verify/REPORT.md` (44 routes × 1568/1440/1024/390; median
static-band diff 0.44%). Recent targeted checks after the refactor: 14 guides ≤0.27%, four
compare details ≤0.2%, case studies 0.02%, five playbooks 0% static diff.

### No-JS and reduced motion

Reveal content is hidden until the client adds `.rv-in`. A `@media (scripting: none)` fallback in
`reveal.css` makes the authored content visible when JavaScript is unavailable. Auto-playing
motion respects `prefers-reduced-motion`; the hero and ambient loops have reduced-motion rules.

## Known differences

- **HelloFresh case-study films** are private/signed Mux assets and are not mirrored; the gates
  disclose the missing film.
- Native `<video controls>` replaces Mux's custom player chrome.
- Brand-tab cards 1+ on `/compare` pages swap quote/media/tab but not the secondary stat/who/action
  nodes carried only for study 0 in the capture.
- Use-case pitch-deck scenes 2–5 advance their step state but not every scene asset (`comp-giftbox`
  and two creator portraits were not in the public capture).
- `/talk-to-us` success is local-only instead of redirecting to the booking calendar.
- The source announcement toast is not mounted in the current shell.
- `/for-creators` closing media is a one-shot entrance; the static harness can catch it mid-phase.

## Evidence and assets

Tracked `docs/` is limited to documentation and the small regeneration manifests. Captured HTML,
page JSON, screenshots and verification output stay in the working tree under `docs/research/`,
`docs/verify/` and `docs/coordination/` but are gitignored. See `docs/EVIDENCE.md` for the
retention policy and how to regenerate them. Public assets are limited to files referenced by the
runtime; unreferenced captures are archived under the gitignored `.archive/` directory.

## Tooling

- Playwright + Chromium for capture and verification.
- Prettier is enforced in CI; generated replicas/content/style vendor files are format-ignored so
  a regeneration does not fail the gate.
- Lenis for smooth scroll, matching the source options.
- GSAP is intentionally not used: the source motion is CSS keyframes plus small state machines.
