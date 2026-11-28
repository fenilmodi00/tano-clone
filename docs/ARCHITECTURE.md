# Architecture and modernization plan

Status: production foundation landed. This document records what the repo uses, what was
removed or restructured, and the remaining route-migration path.

## 1. Current stack

| Layer        | Choice                                                                 | Notes                                                                                             |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16.4 App Router, React 19.3, TypeScript strict                 | All 44 routes are static server components.                                                       |
| Styling      | Ported Tano design-system CSS, cascade layers, 129 keyframes           | Tailwind is not used by the clone; see the decision below.                                        |
| Motion       | Small DOM-query hooks + CSS keyframes                                  | Lenis for smooth scroll; no GSAP.                                                                 |
| Components   | Server components + small client islands                               | Shell, drawer, consent, forms and behaviours are the client surface.                              |
| Content      | Typed JSON per route with a Zod page schema; generated route manifest  | Metadata and 23 route bodies render from JSON; 21 captured bodies remain.                         |
| Verification | Vitest/Testing Library, Playwright, pixelmatch, Zod content validation | Unit/contract tests plus static build assertion, runtime audits and live-source pixels.           |
| Deploy       | Cloudflare Workers via vinext; Docker standalone opt-in                | `NEXT_OUTPUT=standalone` for Docker; build args carry `NEXT_PUBLIC_SITE_URL` and indexing policy. |

## 2. What changed in this pass

### Deleted

- Unused scaffold: `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`,
  `lucide-react`, `shadcn`, `tw-animate-css`, `pngjs`, `src/components/ui/button.tsx`,
  `src/lib/utils.ts`, `components.json`.
- Template workflows `star-history.yml` and `token-badge.yml`.
- Debug route `/devtest`.
- 21 one-off probe/remote scripts and their untracked siblings.
- `replica/registry.ts` and `pages/index.ts` barrels; the generator no longer writes them.
- 608 unused CSS classes / 1,330 rules after a static usage purge (~189 KB, 33%).
- Unreferenced public assets (109 files, 130 MB) moved to the gitignored `.archive/` for
  reversibility.

### Added or restructured

- `src/content/routes.ts` generated route/SEO manifest; `sitemap.ts` uses it.
- `src/lib/metadata.ts` + per-route JSON metadata; 44/44 pages now have a correct canonical,
  Open Graph, Twitter and robots block.
- `src/app/`: `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`,
  `not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`.
- Production shell: security headers, explicit cache policy per asset class, build-time env,
  font preloads, no-JS reveal fallback, static-output assertion, CI runtime job.
- Shared components: `Button`/`ButtonLink` (50 call sites), `FaqRow` (14),
  `ReelCard` (235), `LogoBand` (5).
- `PlaybookTemplate` data-driven template for five routes; the five generated playbook replicas
  were deleted.
- 44 replicated bodies reformatted from one-line files to readable, linted TSX; all internal
  links use `next/link` (313 anchors), and the custom client-nav interceptor was removed.
- Page-level reveal/band/video observers were extracted from `runtime.tsx` into
  `src/hooks/use-page-observers.ts`; dead motion helpers were removed.
- Duplicate DOM ids in shell logos, inline SVG charts and comparison sections are now unique.
- Evidence retention: heavy captures are untracked (tracked `docs/` is now ~24 MB); see
  `docs/EVIDENCE.md`.
- Zod page schema + `content:validate` contract tests; `types.ts` re-exports the inferred model
  so runtime validation and compile-time types cannot drift.
- Vitest/Testing Library/jsdom suites for content, forms, motion and FAQ markup, wired into CI.
- Page effects mount inside each page subtree (`PageEffects`) instead of the root layout; the
  600 ms hydration gate is gone. Videos default to `preload="none"` until activation.
- Production CSP, `content:validate`/`npm test` CI gates, Next/Playwright caches and the current
  Node/Action baselines.
- Removed probe/one-off scripts, unused content type exports and dead `.hp-notify*` CSS.

### Deliberately not done

- **No wholesale Tailwind rewrite.** The captured stylesheet is 91.8% bespoke design-system CSS
  (2,388 rules, 902 classes, 129 keyframes); Tailwind output was 2.4% and one utility. Rewriting
  2.4k rules into utilities would be a second convention with no maintenance payoff and high
  pixel risk. Tailwind and the PostCSS scaffold were removed; new UI primitives reuse the
  existing tokens/classes.
- **The remaining 21 captured bodies were not rewritten blindly.** Per-route JSON covers 37–67%
  of their markup and misses replica asset references, forms, anchors and media hydration.
  Converting them without the same parity pass would silently drop content. Guides, compare and
  playbooks proved the template path (≤0.27% / ≤0.2% / 0% static diff); the remaining families
  are staged below.

## 3. Remaining route migration path

Source: route-family audit (JSON coverage, structural duplication, bands per route).

| Family                                      | Routes | JSON coverage | Verdict  | Target                                                                   |
| ------------------------------------------- | -----: | ------------: | -------- | ------------------------------------------------------------------------ |
| Playbooks                                   |      5 |        49–79% | **done** | `PlaybookTemplate` from JSON.                                            |
| Guides                                      |     14 |        79–91% | **done** | `GuideTemplate`: hero, prose/list/table/quotes, FAQ, brands, closing.    |
| Compare details                             |      4 |        83–87% | **done** | `CompareTemplate`: hero, prose, comparison table, verdict, FAQ, closing. |
| Career roles                                |      3 |        56–80% | deferred | Captured body kept; template attempt missed callouts/emphasis.           |
| Guides/compare/playbooks indexes            |      3 |        70–79% | deferred | Captured bodies kept; shared template produced 8–96% diffs.              |
| Careers/news indexes                        |      2 |        70–77% | deferred | Captured bodies kept; same index-template attempt.                       |
| Privacy / news article / webinars           |      3 |        78–86% | deferred | Captured bodies kept; template attempt failed compile/parity.            |
| Home, use cases, case studies, for-creators |      9 |        37–67% | bespoke  | Keep captured bodies; extract section components only.                   |
| Talk-to-us                                  |      1 |            7% | bespoke  | Keep form-specific body.                                                 |

The deferred families were attempted in a second wave and reverted after parity/typing
failures; their captured bodies remain. Any retry must start from a clean family backup and pass
the same live-source parity gate before deleting a replica.

Recommended order: guides → compare → playbooks (done); then defer-index/careers/news/legal
until a clean template passes. For each family: render from JSON, run
`node scripts/verify-all.mjs --routes <family> --widths 1568,390`, fix static bands above 0.5%,
then delete the superseded replicas.

## 4. Component taxonomy

Extracted (keep using):

- `ButtonLink` / `Button` — appearance via `data-variant|size|material`, optional chevron.
- `FaqRow` — shared id contract `{id}-question` / `{id}-answer`; delegated interaction stays in
  `global-interactions.tsx`.
- `GuideTemplate` — data-driven guide detail template (hero, prose/list/table/quotes, FAQ, brands,
  closing); 14 routes at ≤0.27% static diff.
- `CompareTemplate` — data-driven compare detail template (prose, comparison tables, verdict, FAQ,
  brands, closing); four routes at ≤0.2%.
- `PlaybookTemplate` — data-driven playbook detail template; five routes at 0% static diff.
- `ReelCard` — poster, film label, brand mark, optional CTA; runtime selects `data-front` and
  hydrates the clip.
- `LogoBand` — caption + typed `LogoMark[]` + ground; renders two SSR copies and mounts a small
  client island for drag, offscreen pause, reduced motion and the `max(2, ceil(strip/copy) + 1)`
  copy math. Used by home (brands + featured), for-creators, news, creative-velocity and
  drive-revenue.

Candidates, in reuse order:

| Pattern           | Uses | Blocker                                                                               |
| ----------------- | ---: | ------------------------------------------------------------------------------------- |
| `hp-band-heading` |   92 | 4 variants (actions, swipe cue); prop API is straightforward.                         |
| `hp-prose-row`    |  131 | 2 variants; blocks can be ReactNode for now.                                          |
| `hp-stat-bar`     |  162 | self-closing chart SVG with many per-instance data values; needs a typed stats model. |
| `wire-brand-word` |  444 | too small to be worth a component boundary.                                           |

## 5. Maintenance rules

1. Route metadata comes from each route's JSON through `buildPageMetadata`; never re-add literal
   title/description blocks to `page.tsx`.
2. Any new internal link uses `next/link`; do not reintroduce a document-level click interceptor.
3. Any new route must be added to the JSON set; `npm run content:check` and
   `npm run content:validate` must both pass.
4. Generated files are format-ignored. Hand edits to the 21 captured bodies are expected; if a
   capture is regenerated, diff it before accepting.
5. CSS changes go through the existing classes/tokens. If a new class is only added at runtime
   (Lenis, JS-built markup, inline SVG strings), put it in `src/styles/runtime.css` so a
   future purge cannot drop it.
6. `npm run check` is the merge gate; it runs the Zod content validation and Vitest suites, and
   `npm run assert:static` must report 44 routes and zero dynamic routes.
7. Keep the no-JS reveal fallback when touching `reveal.css` or the reveal hooks.
8. Client navigation owns the scroll position: `useRouteScrollReset` commits every pathname
   change at the top (Lenis-aware, hash links excepted). Do not remove it or re-add a
   document-level click handler; Next's default "maintain offset when the page is visible"
   behavior is what landed deep-scrolled visitors in the shared footer.
9. The root `loading.tsx` fallback must stay at least viewport height. The header hides when the
   footer enters the top half of the viewport, so a short transition shell would pull the footer
   in, animate the nav away and leave the visitor at the bottom of the page.
10. Menus live in the persistent shell. Any new shell menu must close on a committed pathname
    change and on its own item click; component state otherwise survives navigation.
11. Do not enable Cloudflare features that rewrite HTML at the edge (Email Address Obfuscation,
    Rocket Loader) for this zone. The dev tunnel was observed serving `__cf_email__` /
    `data-cfemail` attributes in place of `mailto:` anchors. Wrapping addresses in
    `<!--email_off-->` markers is not a safe workaround: Cloudflare strips the markers from
    React-managed HTML, which itself produces a hydration attribute mismatch. Keep the zone
    rewriters off; React hydration must receive the bytes the server rendered.
12. Cloudflare builds go through vinext; do not set `NEXT_OUTPUT=standalone` for them.
    `output: "standalone"` is Docker-only because vinext's standalone emitter looks for `dist/`
    while the Cloudflare plugin writes `.cloudflare/output/`. See `docs/CLOUDFLARE.md`.
13. Page effects stay inside the page subtree (`PageEffects`). Do not move them back to the root
    layout: they must run after the page's server markup hydrates, not against DOM React owns.

## 6. Modern web notes

- Native `<dialog>.showModal()` is already used for the drawer; focus return and Escape are
  handled. Do not replace it with a custom portal.
- `@media (scripting: none)` covers the reveal system; keep it alongside the client observer.
- `next/link` provides prefetch and App Router navigation; dense footer/listing links can set
  `prefetch={false}` if the prefetch volume becomes a problem.
- Images are captured markup; `loading="lazy"`/dimensions were applied conservatively. Do not add
  fixed `width`/`height` to absolutely-positioned media without checking the CSS aspect ratio.
- The legacy-pattern scan (`modern-web-guidance legacy-scan src`) reports zero findings; it does
  not cover image weight, client boundaries or CSS payload, which are tracked here instead.
