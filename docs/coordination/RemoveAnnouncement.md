# RemoveAnnouncement — announcement toast removed

Scope: delete the home announcement toast and its layout reservation; keep
cookie consent, drawer, header and footer untouched.

## Files

| File | Change |
|---|---|
| `src/components/sites/tano/shell/announcement.tsx` | **Deleted** (component, timers, dismiss logic, markup) |
| `src/app/layout.tsx` | Removed the `Announcement` import/render and the inline `--hp-notify-push:120px` |
| `src/components/sites/tano/replica/HomeReplica.tsx` | Removed the reserved `data-notify=""` attribute from `<main>` (approved by orchestrator) |
| `docs/coordination/RemoveAnnouncement.md` | This note |

`src/components/sites/tano/runtime.tsx` needed no change: it never referenced
the toast. No CSS was added — with the attribute gone, the existing
`main > .hp-band:first-child { padding-top: var(--page-opening) }` rule applies
at rest.

## Verified (dev server `http://127.0.0.1:3100`, Playwright, reduced motion, consent cookie set)

Desktop 1440 × 900:

| Route | `.hp-notify` nodes | `<main>` attrs | first band pad-top | `--hp-notify-push` | hero rect | nav pill | console errors |
|---|---|---|---|---|---|---|---|
| `/` | 0 | `id` only | **128px** | empty | y 4, h **1319.8** | 64,16 1312×67.6 | 0 |
| `/guides` | 0 | `id` only | **128px** | empty | y 4, h 319 | 64,16 1312×67.6 | 0 |
| `/news` | 0 | `id` only | **128px** | empty | y 4, h 399 | 64,16 1312×67.6 | 0 |

Mobile 390 × 844: `/` and `/news` first band = **106px** = `--page-opening`
(`70px + 36px`), no overflow, consent + drawer present, 0 console errors.

Home hero height 1319.8px matches the source's post-dismiss measurement
(`docs/research/tano/interactions/report.md`: 1391.78 → **1319.78px**, hero
padding 200 → **128px**, header y=4). SSR HTML for `/` and `/guides` contains
no `hp-notify`/`data-notify`/`Dismiss announcement` strings.

`/talk-to-us` also loads with no toast and 0 errors (drawer route).

## Residual dead selectors (inert, left to their owners)

No element matches these now; they cannot affect layout. They live outside this
workstream's files and were not edited:

- `src/components/sites/tano/shell/site-header.tsx:77` — loop setting
  `data-scrolled` on `.hp-notify` (no-ops).
- `src/components/sites/tano/motion/use-forms.ts:555` — `.hp-notify` in a
  document-scoped selector list.
- `src/styles/tano/forms.css:78` — `html[data-forms-menu="open"] .hp-notify[data-open]`.
- `src/app/globals.css:35,51` — `.hp-notify-close { pointer-events:auto }` and
  the `.wire-contact .hp-notify` hide rule.
- `src/styles/tano/source.css` — ported `.hp-notify*` styles and `main[data-notify]`
  padding rules (retained; ported stylesheet not stripped).
- `scripts/compare-route.mjs` — strips overlay/attribute from source and clone;
  still valid, needs no change.

Removing those selectors is optional cleanup; the toast cannot render and the
reservation attribute no longer exists in the DOM or markup.
