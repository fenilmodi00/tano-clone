# Frontend stack — creator dashboard

Decided 2026-11-28; revised the same day for a **Vite 8.4 + React Router 8.5 SPA** dashboard. The drivers: Workers
Free's 10 ms CPU budget rules out SSR, and Next 16 `output: 'export'` needs `generateStaticParams` for every dynamic
route. Marketing stays on Next.js 16.4.6 App Router and shares nothing with the SPA but brand tokens. Fixed above this
layer: React 19.3.1 + Astryx. Scope: styling, component-gap libraries, motion, test tooling. Star counts read from
GitHub on **2026-11-28**; package versions read from the npm registry the same day.

## 1. Verdict

| | Choice | Why |
| --- | --- | --- |
| Primary | **Astryx `@astryxdesign/core@0.7.17` + `theme-neutral`, extended by a local `tano` theme; bespoke layout in plain CSS inside one declared cascade layer; Vite 8.4 + React Router 8.5 SPA, shipped as static assets; 7 new libraries; $0** | One component system, one token source, no build plugin, MIT, no SSR to pay for |
| Fallback | Add **Tailwind v4** with Astryx's official bridge (`@astryxdesign/core/tailwind-theme.css`) if the plain-CSS layer drifts | Same components and tokens; only the utility syntax changes, so the switch is mechanical |

Astryx is in **beta (0.7.17)**: 33,586★, MIT, 802 open issues, ~5 commits between 06:21 and 11:00 UTC on
2026-11-28 (github.com/meta/astryx). Pin it exactly and budget one upgrade PR per month — see §10.

## 2. Astryx integration facts (verified 2026-11-28)

| Question | Answer | Source |
| --- | --- | --- |
| License / status | MIT, "Currently in Beta", React 19+ | raw.githubusercontent.com/meta/astryx/main/README.md |
| Peer deps | `react`/`react-dom` `>=19.0.0`; `@stylexjs/stylex` `^0.19.0` **must be installed** | registry.npmjs.org/@astryxdesign%2Fcore/latest |
| Build plugin | **None.** Pre-built CSS + JS; no PostCSS/Babel/StyleX compile step for consumers | astryx.atmeta.com/docs/getting-started |
| CSS order | `reset.css` → `@layer reset`; `astryx.css` → `@layer astryx-base`; `theme.css` → `@layer astryx-theme`; theme `fonts.css` for `@font-face`. Vite inlines CSS `@import`s in place, so the `@layer` statement may sit **above** the imports in the single entry stylesheet — Astryx's own Vite example does exactly this | packages/core/README.md; apps/example-vite-tailwind/src/index.css |
| Runtime model | SPA: everything is a client component; `'use client'` in Astryx source is inert and no RSC/`next/link` wiring is involved | astryx.atmeta.com/components |
| Router | React Router **8.5.3** data mode: `createBrowserRouter` from `react-router`, `<RouterProvider>` from `react-router/dom`, nested layouts via `<Outlet/>`, `useSearchParams` from `react-router`. Peer needs React `>=19.2.7` (repo has 19.3.1) ✔ | reactrouter.com/start/data/installation |
| Link wiring | `<LinkProvider component={AppLink}>`: the component receives Astryx `href` and may also receive `to`, so the adapter maps both onto React Router's `to` | packages/core/src/Link/LinkProvider.doc.mjs |
| URL state | `nuqs/adapters/react-router/v8` exports `NuqsAdapter`; mount it once **inside** `RouterProvider` (it calls router hooks) | unpkg.com/nuqs@2.10.3/dist/adapters/react-router/v8.d.ts |
| Theme API | `<Theme theme={themes[slug]} mode="system"\|"light"\|"dark">`; `defineTheme({extends, tokens, components, motion, adaptations})`; `theme add/build` generate a built module + CSS. Use the built path: a runtime theme injects component overrides client-only, so the first paint can miss them | astryx.atmeta.com/docs/theme |
| CLI `init` | Non-interactive, no prompts; writes the Astryx guide into `AGENTS.md`/`CLAUDE.md`; prints the styles/theme steps. `--all` adds theme + page workflows | astryx.atmeta.com/docs/cli |
| `@astryxdesign/charts`, `/vega` | **Canary only** — `latest` on npm is the placeholder `0.0.0-bootstrap.0` | registry.npmjs.org/@astryxdesign%2Fcharts; README "Packages" note |
| tsconfig | `moduleResolution` `bundler` (or `node16`+) so Astryx subpath imports (`/Button`, `/theme`) resolve — set it deliberately in the new SPA tsconfig | astryx.atmeta.com/docs/migration |

### Install

```bash
# runtime — exact pins, no carets
npm install -E @astryxdesign/core@0.7.17 @astryxdesign/theme-neutral@0.7.17 @stylexjs/stylex@0.19.2
npm install -E react-router@8.5.3 @tanstack/react-query@5.108.4 nuqs@2.10.3 \
  recharts@3.11.2 react-is@19.3.1 \
  react-hook-form@7.92.0 @hookform/resolvers@7.0.9 \
  @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2 date-fns@4.4.0
# zod@4.6.7 is already a dependency — keep it exact when you touch it

# tooling
npm install -D -E vite@8.4.0 @vitejs/plugin-react@6.3.0 \
  @astryxdesign/cli@0.7.17 @playwright/test@1.65.1 @axe-core/playwright@4.14.1

# one-time setup (non-interactive; writes AGENTS.md/CLAUDE.md and src/astryx-themes.ts)
npx @astryxdesign/cli init
npx @astryxdesign/cli theme add neutral
```

`vite.config.ts`: `defineConfig({plugins: [react()], resolve: {alias: {'@': '/src'}}})` — **no Astryx plugin**, the
package ships pre-built CSS and JS (verified against `apps/example-vite-tailwind`).

Add the CLI escape hatch the Astryx README recommends, so agents never guess a path:

```json
"scripts": { "astryx": "node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs" }
```

### Wiring (exact files)

```css
/* src/styles/index.css — imported first from src/main.tsx */
@layer reset, astryx-base, astryx-theme, dashboard;
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/fonts.css';
```

```tsx
// src/main.tsx — index.html only needs <div id="root"> + <script type="module" src="/src/main.tsx">
import './styles/index.css';
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {RouterProvider} from 'react-router/dom';
import {themes, defaultThemeSlug, themeModes} from '@/astryx-themes';
import {AppLink} from './shell/app-link';
import {router} from './shell/router';

createRoot(document.getElementById('root')!).render(
  <Theme theme={themes[defaultThemeSlug]} mode={themeModes[defaultThemeSlug] ?? 'system'}>
    <LinkProvider component={AppLink}>
      <RouterProvider router={router} />
    </LinkProvider>
  </Theme>,
);
```

```tsx
// src/shell/app-link.tsx — Astryx passes `href` (and may pass `to`); React Router wants `to`
import type {AnchorHTMLAttributes} from 'react';
import {Link as RouterLink} from 'react-router';
export const AppLink = ({href, to, ...rest}: {href?: string; to?: string} & AnchorHTMLAttributes<HTMLAnchorElement>) =>
  <RouterLink to={to ?? href ?? '/'} {...rest} />;
```

```tsx
// src/shell/router.tsx — nested layouts are the shell hierarchy (import {createBrowserRouter} from 'react-router')
export const router = createBrowserRouter([
  {path: '/', element: <RootLayout />, errorElement: <RouteError />,  // NuqsAdapter + ScrollRestoration + Outlet
   children: [{path: 'app', element: <DashboardLayout />,             // AppShell + SideNav/TopNav + Outlet
     children: [
       {index: true, element: <Overview />},
       {path: 'campaigns', lazy: () => import('../routes/campaigns')},
       {path: 'campaigns/:campaignId', lazy: () => import('../routes/campaign')},
     ]}]},
]);
```

`root-layout.tsx` is `<NuqsAdapter><ScrollRestoration/><Outlet/></NuqsAdapter>`; `dashboard-layout.tsx` is
`<AppShell …><Outlet/></AppShell>` (`npx @astryxdesign/cli component AppShell` prints the exact subpath). The theme's
`theme.css` arrives from the generated `src/astryx-themes.ts` — later than `index.css` is fine, the layer order is
already fixed. Verify `vite build` emits the theme woff2 files; Astryx's examples omit `fonts.css` and fall back to
system fonts.

Local theme flow: `src/themes/tano/tanoTheme.ts` + `tanoTheme.doc.mjs` →
`npx @astryxdesign/cli theme build --watch` → `theme add tano`. Never hand-edit `src/astryx-themes.ts`.

**Prerequisite — one token source, two apps.** A separate bundle means marketing CSS cannot leak in; the risk
inverts to token drift. Put `tanoTheme.ts` and the built theme CSS in a workspace package (`@tano/theme`) that both
the Next marketing app and the SPA import. Never copy `design-system.css` into the SPA: it is a compiled artefact of
Tano's marketing classes, not a token library.

## 3. Styling convention for bespoke layout

| Option | Fits Astryx layers? | Cost | Verdict |
| --- | --- | --- | --- |
| **Plain CSS in `@layer dashboard`** | Yes — you control position; sits after `astryx-theme`, so wrappers can set margin/grid without `!important` | Naming discipline; ~10 files | **Chosen** |
| CSS Modules | **No** — Vite (like Next) injects module CSS **unlayered**, and unlayered beats every layer regardless of specificity, so one `.card { padding: 0 }` silently overrides `astryx-base` | Per-file plumbing | Rejected |
| Tailwind v4 | Yes, with `@tailwindcss/vite` + the canonical order line + `tailwind-theme.css` | One more plugin in the SPA build; duplicates Astryx `Stack/Grid/Layout`; agents drift to `bg-[#1a1815]` | Fallback only |

**Rules (put these in `AGENTS.md`):**

1. Interactive UI = an Astryx component. Bespoke CSS is for layout, grid, and sticky/scroll behaviour only.
2. Dashboard CSS lives in one block per file: `@layer dashboard { .dlv-board { … } }`. One file per route module,
   imported by that route's layout element; never in the entry stylesheet.
3. Dashboard CSS may only target app-owned classes (`dlv-`, `inv-`, `cmp-`, …). Never `.astryx-*` — restyle through
   `xstyle`, `className`, or a theme `components` override. CI greps for `.astryx-` outside `src/themes/`.
4. No literals: colours, spacing, radii, durations come from `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`,
   `var(--duration-*)`. A hex value under `apps/dashboard/src/**` fails review.
5. Hover styling only inside `@media (hover: hover)`; transitions use `--ease-*` tokens (Astryx rule, same reason).

## 4. Tano tokens → Astryx theme

The marketing design system is a *compiled Tailwind v4 artifact whose class vocabulary is Tano's*, not a utility
library. Import it into the dashboard and you get 370 KB of `.wire-*`/`.hp-*` rules and `html`-level veils that fight
Astryx. Instead, **Tano is an input to the theme, never a stylesheet the dashboard loads**. Data flows one way:
Tano values → `tanoTheme` → Astryx tokens → components and dashboard CSS.

The 14 tokens worth carrying (values from `src/styles/design-system.css`):

| Tano token | Value (dark / light) | Astryx theme target | Note |
| --- | --- | --- | --- |
| `--page-primary` | `#0e0d0c` / `#fff` | `--color-background-body` | page ground |
| `--surface-primary-default` | `#1a1815` / `#fff` | `--color-background-card` | cards, panels |
| `--page-secondary` | `#1a1815` / — | `--color-background-surface` | raised chrome |
| `--surface-secondary-default` | `#fbf9f51a` / — | `--color-neutral` | 10 % ink wash |
| `--text-primary` | `#fbf9f5` / `#1a1815` | `--color-text-primary` | |
| `--text-secondary` | `#fbf9f599` / — | `--color-text-secondary` | 60 % ink |
| `--border-primary` | `#fbf9f51a` / `#1a18151a` | `--color-border` | 10 % ink, exact match |
| `--border-strong` | `#fbf9f566` / — | `--color-border-emphasized` | |
| `--zinc-600` / `--zinc-700` | `#78746b` / `#a29e95` | `--color-data-neutral` | chart labels, axes |
| `--tano-button-radius` (sm/md/lg) | `12px / 16px / 24px` | `--radius-element / --radius-container / --radius-page` | `--radius-inner` = `8px` (xs) |
| `--typeface-heading` | `"ABC Whyte"` | `typography.heading.family` | **licence gate — see risk 3** |
| `--size-body-sm` / `--size-body-md` | `14px / 16px` | `typography.scale {base: 14, ratio: 1.2}` | dashboard has no display sizes |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | `--ease-entrance`, `--ease-move` | signature curve; `character: 'crisp'` |
| `--chart-{lime,cyan,teal,orange,amber,rose,magenta,violet}` | e.g. `#89de16`, `#46b7d1`, `#fb751f`, `#ed5263` | `--color-data-categorical-{green,cyan,teal,orange,brown,red,pink,purple}` | 8 series; leave `blue`/`indigo` at Core defaults |

Everything else in `design-system.css` — display scale, glass, spectrum drift, `--state-colour-run`, veils,
`--section-padding-*`, `--page-width` — is editorial and is **dropped**.

```ts
// src/themes/tano/tanoTheme.ts
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export const tanoTheme = defineTheme({
  name: 'tano',
  extends: neutralTheme,
  typography: {scale: {base: 14, ratio: 1.2}, heading: {family: 'Figtree'}, body: {family: 'Figtree'}},
  motion: {tempo: 0.85, character: 'crisp'},
  tokens: {
    '--color-accent': ['#1a1815', '#fbf9f5'],          // monochrome brand; lime is a highlight, never text
    '--color-background-body': ['#ffffff', '#0e0d0c'],
    '--color-background-card': ['#ffffff', '#1a1815'],
    '--color-background-surface': ['#fbf9f5', '#1a1815'],
    '--color-background-muted': ['#f4f2ee', '#25231e'],
    '--color-text-primary': ['#1a1815', '#fbf9f5'],
    '--color-text-secondary': ['#504d41', '#a29e95'],
    '--color-border': ['#1a18151a', '#fbf9f51a'],
    '--color-border-emphasized': ['#d1cdc7', '#504d41'],
    '--color-data-neutral': ['#78746b', '#a29e95'],
    // remaining series hues (cyan, teal, orange, brown, red, pink, purple) are in the table above
    '--color-data-categorical-green': '#89de16',
    '--radius-inner': '8px',
    '--radius-element': '12px',
    '--radius-container': '16px',
    '--radius-page': '24px',
    '--ease-entrance': 'cubic-bezier(.22,1,.36,1)',
    '--ease-move': 'cubic-bezier(.22,1,.36,1)',
  },
});
```

Unlisted light values come from `neutralTheme`; never hand-write derived tokens like `--color-on-accent` — the palette
API generates them.

## 5. Libraries

All MIT unless noted; "why" is the reason it earns a dependency slot.

| Package | Version | Stars (2026-11-28) | Why |
| --- | --- | --- | --- |
| `@astryxdesign/core` + `theme-neutral` | 0.7.17 | 33,586 (meta/astryx) | Components, theme, tokens |
| `react-router` | 8.5.3 | 56,655 | Routing + nested layouts for the SPA; data mode gives loaders, `lazy` route splitting and `ScrollRestoration` |
| `@tanstack/react-query` | 5.108.4 | 50,690 | Client cache for lists that mutate (approvals, messages, uploads); loaders seed it, Query owns mutations, polling and optimistic updates |
| `react-hook-form` + `@hookform/resolvers` | 7.92.0 / 7.0.9 | 44,931 | Highest-volume, best-known form API — least AI drift; `zodResolver` for zod 4 |
| `zod` | 4.6.7 | 44,482 | Already in the repo; one schema shared by the Workers API and the forms |
| `nuqs` | 2.10.3 | 10,919 | Typed URL state for filters/tabs/pagination; `nuqs/adapters/react-router/v8` is the supported adapter |
| `recharts` | 3.11.2 | 27,780 | Only mature React-19 chart lib with area/bar/line out of the box; tokens feed series colours |
| `date-fns` | 4.4.0 | 36,660 | Date maths (due dates, billing periods) that Astryx `Timestamp` doesn't do |
| `@dnd-kit/core` + `sortable` + `utilities` | 6.3.1 / 10.0.0 / 3.2.2 | 17,839 | Kanban deliverable pipeline and asset ordering; keyboard + screen-reader support |

Deferred — add only when the trigger fires:

| Package | Version | Stars | Trigger |
| --- | --- | --- | --- |
| `@astryxdesign/richtext` (+ `lexical@0.52.0`, 13 `@lexical/*` peers) | 0.7.17 | 33,586 (same repo) | First rich-text surface (campaign briefs, revision notes). Astryx's editor is Lexical-based; **pin `lexical` to `0.52.0`** — the package declares `^0.52.0` and 0.53.0 would warn |
| `motion` | 14.14.0 | 35,692 | Orchestrated list/route transitions CSS can't express; not needed for MVP (§7) |
| `@tanstack/react-virtual` | 3.14.28 | 7,212 | A list Astryx can't window (AST's `Table` virtualizes rows; `List` does not) |
| `uppy` | 6.0.8 | 31,094 | Resumable/multipart video upload. Start with `FileInput` + presigned R2 `PUT` |

## 6. What Astryx does *not* cover

The assumed gap list was too pessimistic. From astryx.atmeta.com/components (checked 2026-11-28):

| Assumed gap | Reality |
| --- | --- |
| Command palette | **Covered** — `CommandPalette`; do not add `cmdk` |
| Toasts | **Covered** — `Toast`; do not add `sonner` |
| Rich text | **Covered** — `RichTextEditor`/`RichTextView` in `@astryxdesign/richtext`; do not add Tiptap |
| Upload | **Partially** — `FileInput` picks and drops; no resumable/chunked transport. MVP: presigned `PUT` to R2 |
| Data grid | **Mostly** — `Table` ships sorting, selection, pagination, column management, expansion and fixed-height row virtualization via plugins. Missing: column pinning, grouping/tree rows, server-side sort/filter (wire yourself) |
| Charts | **Not covered** — `@astryxdesign/charts` is canary-only. This is the real gap |

## 7. Motion

Tano's language is editorial: scroll-driven reveals, ground-tone swaps, glass drift. In a tool used hourly that
language inverts — Astryx's own motion guide names row hovers and list highlights as places animation *hurts*.

| Tano device | Dashboard translation |
| --- | --- |
| 320 ms ground-tone swap | Keep as the light/dark switch: one cross-fade of `--color-background-*`, no travel |
| Section reveal on scroll | First-paint stagger only, once per route, ≤ `--duration-medium`; never on scroll |
| Glass / spectrum drift / veils | Dropped — they cost paint and read as decoration in a data surface |
| `--ease` signature curve | Kept as `--ease-entrance`/`--ease-move`; `tempo: 0.85`, `character: 'crisp'` |
| Hover choreography | `--duration-fast` at most, `@media (hover: hover)` only |

Reduced motion: Astryx themes expose `adaptations: [{when: {motion: 'reduce'}, …}]` and every component already caps at
200 ms with no travel. Write bespoke CSS the same way (no transform, opacity ≤ 200 ms) — one theme adaptation rule
covers the app, so no per-component `prefers-reduced-motion` blocks.

**Lenis: no.** It is already a dependency for marketing pages (`src/hooks/use-lenis.ts`), keep it there. Its own README
lists the disqualifiers for a dashboard: "nested scroll containers require proper configuration", no CSS scroll-snap
without the snap plugin, capped 60 fps on Safari / 30 fps in low-power, and no smooth scroll inside iframes
(github.com/darkroomengineering/lenis#limitations). A dashboard *is* nested scroll containers (sidebar, table body,
drawer, message thread) with snap in the calendar. Also, `.lenis` sits on `<html>` and the marketing runtime must not
mount on `/app`.

## 8. Testing tooling for AI-written UI

Minimum that catches the two failures AI code actually produces — broken cascade and broken interaction:

| Tool | Version | Stars | Role |
| --- | --- | --- | --- |
| Vitest + Testing Library | `^5.1.2` in repo | 17,511 | Component behaviour, schema/form logic |
| `@playwright/test` | 1.65.1 | 101,230 | Route flows + the **foundation smoke test**: assert a primary button's `paddingInline !== '0px'` (the canonical "an unlayered reset ate Astryx" signal), plus the axe scan |
| `@axe-core/playwright` | 4.14.1 | 7,906 (axe-core, MPL-2.0) | Accessibility gate on 5 core routes |

Skip Storybook for MVP: 91,752★, `@storybook/react-vite` 10.6.9 works with this stack, but it is a third build graph
that agents break, and Astryx already publishes a Storybook for its own components. If a design-review surface becomes
necessary, add Storybook + **Chromatic Free**: $0, 5,000 billed snapshots/month, **no credit card**, Chrome only
(chromatic.com/pricing, checked 2026-11-28). Starter is $179/mo — a later upgrade, not a launch cost.

## 9. Do not use

| Rejected | Why |
| --- | --- |
| Tailwind v4 as the dashboard's styling layer | One more plugin in the SPA build; duplicates `Stack/Grid/Layout`; the layer-order ritual is Astryx's documented #1 adoption failure. Fallback only |
| CSS Modules | Emitted unlayered, so app rules outrank `astryx-base`/`astryx-theme` regardless of specificity |
| shadcn/ui, Radix primitives, MUI, Chakra, Mantine, `styled-components`, Emotion, Sass, Panda | A second component or styling system with its own a11y, theming and token vocabulary; Astryx already ships components and tokens |
| `cmdk` (13,247★, last push 2025-10-29), `sonner` (13,319★), Tiptap (39,156★), `react-dropzone` (11,023★), `react-day-picker` | Astryx owns these surfaces (`CommandPalette`, `Toast`, `RichTextEditor`, `FileInput`, `Calendar`/`DateInput`) |
| `@tanstack/table` (28,643★) for MVP tables | Astryx `Table` already does sorting/selection/pagination/column settings/virtualization. Revisit only for column pinning or tree rows |
| `@astryxdesign/charts`, `@astryxdesign/vega` | Canary-only (`latest` = `0.0.0-bootstrap.0`); pinning a canary in a product is not a risk worth a chart |
| `visx` (21,121★, last push 2026-06-22) | Lower-level than needed; you hand-build axes and a11y for no MVP gain |
| TanStack Form (6,776★) | Viable, but RHF has ~6.6× the corpus, so AI-written forms drift less |
| Day.js (48,640★) | Fine, but two date libs is one too many; date-fns already covers maths + formatting |
| Lenis in the SPA | See §7 |
| `motion` for MVP, Storybook + Chromatic at launch | Astryx tokens + CSS transitions cover panels/toasts/skeletons; Storybook is a third build graph for zero users — the free tier exists when needed. Both are deferrals, not bans |

## 10. Top 5 risks

| # | Risk | Mitigation |
| --- | --- | --- |
| 1 | **Astryx is 0.x and moves daily** — 0.6→0.7 renamed target classes and needed `astryx upgrade` codemods | Pin exact (`-E`), one upgrade PR/month: bump all `@astryxdesign/*` together, `npx @astryxdesign/cli upgrade --from <old> --apply`, then `astryx doctor --built .` + the foundation smoke test. Never `^` |
| 2 | **Cascade-layer breakage is silent** — one unlayered reset or a CSS Module zeroes Astryx padding on every page | `@layer` line at the top of `src/styles/index.css`, imported first in `main.tsx`; CI grep forbids `.astryx-` selectors and hex literals in dashboard CSS; Playwright asserts computed padding on a primary button |
| 3 | **ABC Whyte is a commercial Dinamo licence** — the clone self-hosts `ABCWhyte-*.woff2` scraped from tano.ai; shipping those in a paid product is unlicensed | Ship Figtree (SIL OFL, bundled by `theme-neutral/fonts.css`) as the dashboard face; treat ABC Whyte as a later paid upgrade gated on a licence. Never import `public/sites/tano/fonts` into the SPA |
| 4 | **Two apps drift apart** — separate bundles mean marketing CSS cannot leak in, but the token source can fork into two copies and the brand quietly diverges | One workspace `@tano/theme` package (theme source + built CSS) imported by both apps; CI asserts `design-system.css` and `public/sites/tano/**` never enter the SPA bundle, and `no-restricted-imports` blocks `lenis` and the marketing runtime |
| 5 | **AI-written UI drift** — duplicated bespoke CSS, direct `.astryx-*` overrides, arbitrary colours | `AGENTS.md` rules from §3 + `astryx component <Name>` before writing a component + `astryx doctor --built .` in CI + the one-block-per-file CSS rule |

## 11. What would change this decision

- Astryx publishes a **stable** (1.0 or non-beta) release, or `@astryxdesign/charts` leaves canary → drop Recharts and
  the pinning ritual, and add `@astryxdesign/richtext` when the first rich-text surface ships (`lexical@0.52.0` pinned,
  peer range re-checked on every Astryx bump). The styling verdict does not change.
- A second team starts writing dashboard UI and plain-CSS drift shows up in review → switch to the Tailwind v4 bridge;
  components, theme and tokens stay identical, so it is a syntax migration, not a redesign.
- The first rich-text surface ships → add `@astryxdesign/richtext@0.7.17` with `lexical@0.52.0` pinned.
- `design-system.css` is ever needed on a dashboard screen → stop and re-derive the token bridge instead; importing it
  is the tell that a second styling system is creeping in.
