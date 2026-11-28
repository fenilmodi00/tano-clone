# SaaS build research — index and constraints

Research date: 2026-11-28. Scope: the creator dashboard, its client and admin
surfaces, and the stack needed to run them for $0 until roughly 10k users.

## Hard constraints

1. **$0 upfront.** No subscription and no charge. A credit card is available for
   billing verification and free-tier usage (R2, Oracle verification, Heroku
   credit), but every service must stay at $0. A paid tier may be named as a
   later upgrade, never as the starting point.
2. **AI-written code.** Most implementation comes from coding agents. Stack
   choices are judged on reviewability, typed contracts, documentation quality
   and fast local feedback — not on syntax preference.
3. **Astryx is fixed** as the dashboard component system
   ([astryx.atmeta.com](https://astryx.atmeta.com), `meta/astryx`, MIT).
4. **Three surfaces, one domain model.** Creator dashboard first, then client
   and admin dashboards over the same API, auth and database.
5. **Marketing stays as-is.** The existing 44-route static site and its ported
   Tano CSS are not rewritten to fit the dashboard.

## Verified facts (checked 2026-11-28)

| Fact | Evidence |
| --- | --- |
| Astryx is MIT, beta, React 19+, 150+ components, StyleX internals hidden from consumers, themes are CSS-variable overrides | [repo](https://github.com/meta/astryx) 33,586 stars; [getting started](https://astryx.atmeta.com/docs/getting-started) |
| Astryx packages: `@astryxdesign/core@0.7.17`, `@astryxdesign/theme-neutral@0.7.17`, `@astryxdesign/cli@0.7.17`, peer `@stylexjs/stylex ^0.19.0` | `npm view`, 2026-11-28 |
| Astryx charts package is **not published** (only `0.0.0-bootstrap.0`); richtext is published and uses Lexical | `npm view @astryxdesign/charts`, `@astryxdesign/richtext` |
| Astryx `Table` already supports sorting, selection, pagination, column management and fixed-height virtualization | [Table docs](https://astryx.atmeta.com/components/Table) |
| Astryx ships `Command Palette`, `Toast`, `Date Range Input`, `File Input`, `Rich Text Editor`, `App Shell`, `Side Nav`, `Top Nav` | [components](https://astryx.atmeta.com/components) |
| Cloudflare Workers Free: 100,000 requests/day, **10 ms CPU per invocation**, **128 MB memory per isolate** | [limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Cloudflare docs state auth and server-side rendering typically use 10–20 ms CPU — over the Free limit | same page |
| Cloudflare Queues Free includes 10,000 operations/day | [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/) |
| Hyperdrive Free allows 10 configs, ~20 origin connections, 60 s query limit | [Hyperdrive limits](https://developers.cloudflare.com/hyperdrive/platform/limits/) |
| Neon Free: 100 projects, 100 CU-hrs/project/month, 1 GB storage/project, 5 GB object storage, **5 GB public network transfer/project/month**, no card | [Neon pricing](https://neon.com/pricing) |
| Tano's display font is **ABC Whyte** (commercial, Dinamo) with local WOFF2 in `public/sites/tano/fonts` | `src/styles/design-system.css:1563`, `:1881` |
| Tano's motion primitives are `--ground-ms: .6s`, `--ink-ms: .15s`, plus the `--spectrum-*` palette | `src/styles/design-system.css:640`, `:1937` |

## Non-negotiable legal boundary

The dashboard **and the marketing site at public launch** must not ship Tano's
logo, copy, photography or ABC Whyte font. Those remain Tano Limited's property
(see `AGENTS.md`). The clone is a development reference; a public paid launch
requires rebranding `www` too, not only `/app`. Reuse **structural** decisions —
spacing rhythm, radius scale, the spectrum palette idea, the ground swap timing —
behind a new product identity and an open font. Astryx's neutral theme uses
Figtree (OFL); a custom theme can carry the rest.

## Reading order

| Doc | Decision |
| --- | --- |
| `01-frontend.md` | Astryx integration, styling convention, component-gap libraries, motion |
| `02-data.md` | Postgres host, ORM, multi-tenant schema, analytics/storage/search |
| `03-backend.md` | Language, API contract, runtime, monorepo, CI |
| `04-free-tier.md` | Student Pack audit, free-tier limits, claim plan, cost cliffs |
| `05-services.md` | Auth, billing/payouts, email, queues, Redis, observability, uploads |
| `06-ai-tooling.md` | Verified MCP servers, skills, repo-local agent rules, workflow |
| `07-student-benefits.md` | India-eligible student offers, claim steps, commercial-use verdicts |
| `00-decision.md` | The single stack that combines them, with build order and risks |

## Decision rules used across the docs

- A free tier counts only if it survives normal MVP traffic **and** permits
  commercial use. One-time credits are a runway, not a plan.
- Any service that requires a card must be flagged, even when the charge is $0.
- Prefer the boring option that one person can operate. Every extra runtime or
  datastore must earn its place with a concrete failure it prevents.
- Postgres is the system of record. Analytics, search and queues are added only
  when a measured limit is hit.
- One styling system per surface: Astryx for the dashboard, the existing CSS
  system for marketing. No Tailwind in either.
