# Architecture and modernization plan

Status: production foundation landed. This document records what the repo uses, what was
removed or restructured, and the remaining route-migration path.

## 1. Current stack

| Layer        | Choice                                                       | Notes                                                                              |
| ------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Framework    | Next.js 16.4 App Router, React 19.3, TypeScript strict       | All 44 routes are static server components.                                        |
| Styling      | Ported Tano design-system CSS, cascade layers, 129 keyframes | Tailwind is not used by the clone; see the decision below.                         |
| Motion       | Small DOM-query hooks + CSS keyframes                        | Lenis for smooth scroll; no GSAP.                                                  |
| Components   | Server components + small client islands                     | Shell, drawer, consent, forms and behaviours are the client surface.               |
| Content      | Typed JSON per route; generated route manifest               | Metadata and the five playbook pages render from JSON.                             |
| Verification | Playwright, pixelmatch, pngjs/sharp                          | Static build assertion + runtime visibility/link/smoke + live-source pixel matrix. |
| Deploy       | `output: "standalone"`, Docker multi-stage                   | Build args carry `NEXT_PUBLIC_SITE_URL` and indexing policy.                       |

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

- `src/content/tano/routes.ts` generated route/SEO manifest; `sitemap.ts` uses it.
- `src/lib/metadata.ts` + per-route JSON metadata; 44/44 pages now have a correct canonical,
  Open Graph, Twitter and robots block.
- `src/app/`: `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`,
  `not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`.
- Production shell: security headers, explicit cache policy per asset class, build-time env,
  font preloads, no-JS reveal fallback, static-output assertion, CI runtime job.
- Shared components: `TanoButton`/`TanoButtonLink` (99 call sites), `FaqRow` (88),
  `ReelCard` (235).
- `PlaybookPage` data-driven template for five routes; the five generated playbook replicas
  were deleted.
- 44 replicated bodies reformatted from one-line files to readable, linted TSX; all internal
  links use `next/link` (313 anchors), and the custom client-nav interceptor was removed.
- Duplicate DOM ids in shell logos, inline SVG charts and comparison sections are now unique.
- Evidence retention: heavy captures are untracked (tracked `docs/` is now ~24 MB); see
  `docs/EVIDENCE.md`.

### Deliberately not done

- **No wholesale Tailwind rewrite.** The captured stylesheet is 91.8% bespoke design-system CSS
  (2,388 rules, 902 classes, 129 keyframes); Tailwind output was 2.4% and one utility. Rewriting
  2.4k rules into utilities would be a second convention with no maintenance payoff and high
  pixel risk. Tailwind and the PostCSS scaffold were removed; new UI primitives reuse the
  existing tokens/classes.
- **No JSON rewrite of all 44 bodies yet.** Per-route JSON covers 37–91% of the captured markup
  and misses 180 replica asset references, forms, some anchors and media hydration. Converting
  all pages without a parity project would silently drop content. The five playbooks proved the
  template path at 0% static diff and the four compare pages at 0.11%; the remaining families are
  staged below.

## 3. Remaining route migration path

Source: route-family audit (JSON coverage, structural duplication, bands per route).

| Family                                      | Routes | JSON coverage | Verdict  | Target                                                               |
| ------------------------------------------- | -----: | ------------: | -------- | -------------------------------------------------------------------- |
| Playbooks                                   |      5 |        49–79% | **done** | `PlaybookPage` from JSON.                                            |
| Guides                                      |     14 |        79–91% | next     | `GuidePage`: hero, prose/list/table blocks, FAQ, brands, closing.    |
| Compare details                             |      4 |        83–87% | **done** | `ComparePage`: hero, prose, comparison table, verdict, FAQ, closing. |
| Career roles                                |      3 |        56–80% | medium   | `CareerRolePage`: role hero, prose sections, apply CTA.              |
| Guide/compare/careers/news/playbook indexes |      6 |        70–79% | medium   | `IndexPage`: hero + card groups from page-level cards.               |
| Privacy / news article                      |      2 |        78–86% | medium   | `LegalPage` / `ArticlePage`.                                         |
| Home, use cases, case studies, for-creators |      9 |        37–67% | bespoke  | Keep captured bodies; extract section components only.               |
| Talk-to-us                                  |      1 |            7% | bespoke  | Keep form-specific body.                                             |

Recommended order: guides → indexes → careers/news/legal → bespoke leaves. For each
family: render from JSON, run `node scripts/verify-all.mjs --routes <family> --widths 1568,390`,
fix static bands above 0.5%, then delete the superseded replicas.

## 4. Component taxonomy

Extracted (keep using):

- `TanoButtonLink` / `TanoButton` — appearance via `data-variant|size|material`, optional chevron.
- `FaqRow` — shared id contract `{id}-question` / `{id}-answer`; delegated interaction stays in
  `interactions.tsx`.
- `ReelCard` — poster, film label, brand mark, optional CTA; runtime selects `data-front` and
  hydrates the clip.

Candidates, in reuse order:

| Pattern           | Uses | Blocker                                                                               |
| ----------------- | ---: | ------------------------------------------------------------------------------------- |
| `hp-band-heading` |   92 | 4 variants (actions, swipe cue); prop API is straightforward.                         |
| `hp-prose-row`    |  131 | 2 variants; blocks can be ReactNode for now.                                          |
| `wire-cases-mark` |  108 | 3 variants (category/read link/hue); outer element alternates link/span.              |
| `hp-stat-bar`     |  162 | self-closing chart SVG with many per-instance data values; needs a typed stats model. |
| `wire-brand-word` |  444 | too small to be worth a component boundary.                                           |

## 5. Maintenance rules

1. Route metadata comes from each route's JSON through `buildPageMetadata`; never re-add literal
   title/description blocks to `page.tsx`.
2. Any new internal link uses `next/link`; do not reintroduce a document-level click interceptor.
3. Any new route must be added to the JSON set; `npm run content:check` validates the manifest.
4. Generated files are format-ignored. Hand edits to the 35 captured bodies are expected; if a
   capture is regenerated, diff it before accepting.
5. CSS changes go through the existing classes/tokens. If a new class is only added at runtime
   (Lenis, JS-built markup, inline SVG strings), put it in `src/styles/tano/runtime.css` so a
   future purge cannot drop it.
6. `npm run check` is the merge gate; `npm run assert:static` must report 44 routes and zero
   dynamic routes.
7. Keep the no-JS reveal fallback when touching `reveal.css` or the reveal hooks.

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
