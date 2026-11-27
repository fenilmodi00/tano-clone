<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tano clone — production rebuild

## What this is

A 44-route Next.js 16 rebuild of the Tano marketing site: captured copy/assets, source-faithful
layout, motion and interactions. It is a reference build, not a deployment of Tano.

Read `docs/ARCHITECTURE.md` before changing route structure, styling, metadata or motion, and
`docs/EVIDENCE.md` before touching captures or assets.

## Tech stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript strict.
- **Styling:** the ported Tano design system in `src/styles/tano/` (tokens, layers, keyframes).
  Tailwind utilities and the shadcn scaffold were removed; do not add a second styling convention.
- **Motion:** CSS keyframes plus small DOM-query hooks; Lenis for smooth scroll.
- **Content:** per-route JSON, a generated route/SEO manifest, and data-driven playbook/compare
  templates.
- **Verification:** Playwright, pixelmatch, static-build assertion.

## Commands

- `npm run dev` — dev server on `http://localhost:3000`.
- `npm run check` — format, content-manifest, lint, typecheck, build, static assertion.
- `npm run format` / `npm run format:check` — Prettier.
- `npm run content:check` — fail if `src/content/tano/routes.ts` is stale.
- `npm run typecheck`, `npm run lint`.
- `npm run verify:visibility`, `npm run verify:links`, `npm run verify:smoke`,
  `npm run verify:client-nav` — runtime gates against port 3000.
- `npm run verify` / `npm run verify:motion` — live-source pixel/motion matrix.
- `npm run assert:static` — 44 prerendered routes, zero dynamic routes, SEO endpoints present.

## Code style

- TypeScript strict, no `any`; named exports; PascalCase components; camelCase utilities.
- Use the existing design-system classes and tokens. Avoid inline styles unless the value is
  per-instance data (custom properties, media URLs, chart values).
- Every internal link uses `next/link`; do not add a document-level click interceptor.
- 2-space indentation; Prettier owns formatting.

## Structure

```
src/app/<route>/page.tsx        route wrapper + JSON-derived metadata
src/components/sites/tano/
  replica/                     captured route bodies (35 routes; hand-editable)
  pages/playbook-page.tsx      data-driven template for the 5 playbook details
  pages/compare-page.tsx       data-driven template for the 4 compare details
  ui/                          shared button and FAQ row
  media/                       shared reel card + case-film controllers
  shell/                       header, footer, consent, drawer, logo strings
  motion/                      behaviour hooks composed by SiteRuntime
  home/ pages/ forms/          family controllers
src/content/tano/
  routes.ts                    generated route/SEO manifest
  pages/*.json                 route content
  types.ts
src/styles/tano/               design system, purged CSS, runtime CSS, route shims
scripts/                       capture, generation, verification, assertions
docs/ARCHITECTURE.md           current design + migration plan
```

## Rules

- Metadata lives in each route's JSON and flows through `buildPageMetadata`; never duplicate
  title/description literals in `page.tsx`.
- Add a route by adding its JSON, then regenerate `routes.ts`; `content:check` must pass.
- Generated replicas/content/CSS are format-ignored. Running the capture generator overwrites
  hand edits; diff before accepting.
- Runtime-only classes (Lenis, JS-built markup, inline SVG strings) belong in
  `src/styles/tano/runtime.css`, not the purged vendor stylesheet.
- Keep the `@media (scripting: none)` reveal fallback when changing reveal CSS or hooks.
- Do not add fixed `width`/`height` to absolutely positioned media without checking the CSS
  aspect ratio; this previously distorted the case-study reel cards.
- The five playbooks are the model for further JSON templates; follow the family order in
  `docs/ARCHITECTURE.md` and verify each family against the live source before deleting replicas.
