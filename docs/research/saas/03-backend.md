# Backend language, API contract, runtime, and monorepo

Checked **2026-11-28**. Constraints: **$0 upfront, no charge** (card available for verification/free tiers), free until ~10k users, one developer supervising AI agents.
Existing deploy: Next.js 16.4.6 on Workers via vinext, 44 static routes, `bun.lock` + `package-lock.json` both present.

## Decision

| Question | Decision |
| --- | --- |
| Language + shape | **TypeScript on Hono**, standalone API Worker; dashboards are a **Vite + React Router SPA** (no SSR, no RSC) sharing `@tano/theme` tokens with marketing. |
| Contract | **oRPC contract-first**, OpenAPI 3.1 from the same contract. Fallback: Hono + `@hono/zod-openapi`. |
| Runtime + jobs | **Workers Free** + **Neon Free over its HTTP driver**; Queues/Cron for light work, GitHub Actions for heavy batch. |
| Layout | **Bun workspaces**, marketing stays at root. No Turborepo/Nx; Workers Paid ($5) is a later upgrade. |

## 1. Language and framework scoring

Scores are 1–5. Weights are chosen for *this* situation: an agent writes most of the code, one human reviews it, and a bad
abstraction is paid for monthly. Syntax familiarity is deliberately excluded; every candidate model knows all four languages.
Route handlers and server actions in the existing marketing app are the same language and stack, so they are decided in §2
(rejected for CPU and coupling), not scored separately.

| Criterion | Weight | TS + Hono | Go + Chi/Echo | Rust + Axum | Python + FastAPI |
| --- | ---: | ---: | ---: | ---: | ---: |
| AI codegen quality + iteration speed (reviewability, blast radius) | 15 | 5 | 4 | 3 | 5 |
| Type sharing with the React frontends (marketing + SPA) | 12 | 5 | 1 | 1 | 2 |
| Workers deployability (native runtime, no sidecar) | 12 | 5 | 1 | 2 | 1 |
| Postgres driver maturity | 8 | 4 | 5 | 4 | 5 |
| Auth ecosystem (sessions, OAuth, orgs/roles) | 8 | 4 | 2 | 1 | 3 |
| Background jobs | 8 | 3 | 5 | 3 | 4 |
| Observability (logs/traces, error grouping) | 7 | 3 | 4 | 3 | 4 |
| Hiring/help availability | 8 | 4 | 4 | 2 | 4 |
| Cold starts | 7 | 5 | 4 | 3 | 1 |
| Long-term maintenance by one person | 15 | 4 | 3 | 2 | 4 |
| **Weighted total (/100)** | **100** | **86.2** | **62.6** | **46.6** | **66.8** |

- **TypeScript** wins on one type graph for contract/server/clients and a native Workers target.
  Dings: Workers quirks (no module-scope DB pool), 10 ms free CPU, thinner server ecosystem.
- **Go** is the best server language here (pgx, goroutines, River) and the worst fit: Workers
  supports Go only through Wasm (`https://developers.cloudflare.com/workers/languages/`), so it
  means a second host, a second deploy, no shared types.
- **Rust** runs on Workers via `workers-rs`, but compile times
  make agent loops slow. **Python/FastAPI** cannot run on Workers at all; container cold starts
  (Render free: ~1 min) break the UX.

**Sensitivity:** if hosting is unconstrained (drop Workers and cold starts), renormalized scores are TS 82.9, Python 77.8, Go 67.4,
Rust 46.4. TypeScript still wins; the result is not an artifact of the Workers weight.

## 2. Service split: one API, one SPA with three role layouts

```
www.example.com/*   marketing (root, existing)  Next build-time render, 0 CPU
app.example.com/*   dashboard Worker            Vite SPA assets + /api/* proxy
  └ /api/*          API Worker (internal)        Hono + oRPC -> Neon (HTTP driver)
```

The dashboard Worker forwards `/api/*` to the API Worker through a service binding; `run_worker_first: ["/api/*"]` means only API
calls invoke a script, and page loads are pure static assets. Browser sees one origin: host-only cookies, relative URLs, no CORS.

1. **Marketing stays build-time rendered.** The 44 routes keep prerendering; no runtime Next code
   is added to that Worker.
2. **The SPA has no server rendering.** On Workers Free, Cloudflare's docs say SSR/auth
   workloads use 10–20 ms CPU against a 10 ms cap
   (`https://developers.cloudflare.com/workers/platform/limits/`). A SPA keeps page loads at 0 ms
   CPU (only `/api/*` invokes a script); API calls pay the CPU.
3. **One authz choke point.** The API resolves `actor` once per request and every procedure checks
   a permission. A dashboard cannot bypass authz because it has no DB credentials and cannot import
   `@tano/db` (enforced by ESLint `no-restricted-imports`).
4. **Client and platform-admin surfaces reuse the same API and session.** Role decides the landing route; the API
   decides what data exists. Route prefixes are UI organization, not a security boundary.
5. **SPA deep links are served by the asset Worker.** `not_found_handling: "single-page-application"` returns `index.html` for
   `/creator/campaigns/:id`; client guards are UX only, the API is the gate.

### Dashboard routing model

| Model | URLs | Runtime cost | Constraint |
| --- | --- | --- | --- |
| (a) Static export + query params | `/campaigns?id=…` | 0 | a prerendered export cannot express `/campaigns/:id` without enumerating ids; weak URLs |
| (b) SSR on Workers Free | real | 10–20 ms/page vs 10 ms cap | 1102 errors under load; needs the $5 plan |
| **(c) Vite + React Router SPA** | real `/campaigns/:id` | 0 (assets only) | second UI toolchain; no RSC |

**Chosen: (c).** The dashboard is authenticated and `noindex`; SSR buys nothing. Vite is already in the repo (vinext builds
through it, Vitest runs on it), Astryx is React 19, and Static Assets serves `index.html` for unmatched navigation requests
(`https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/`). React Router v8.5.3 (2026-11-24)
owns routing and nested layouts. Design tokens and the built Astryx `tano` theme come from the workspace `@tano/theme` package —
one token source for marketing and the SPA — and components come from `@tano/ui`. Tradeoff: two UI toolchains (marketing
unchanged, Vite for the app) and no RSC — accepted; shared React, `@tano/theme`, Astryx and `@tano/contracts` keep them aligned.

Auth/data flow: `POST /api/auth/*` sets a host-only, HttpOnly, `SameSite=Lax` cookie on `app.example.com`; the oRPC client uses
relative `/api/rpc`, so the cookie rides along with no CORS. Each role layout wraps `RequireRole`, which calls `session.get` and
redirects 401 to `/sign-in?next=…`, 403 to the actor's home. TanStack Query (`@orpc/tanstack-query`) caches lists and invalidates on
mutation; the API re-checks every permission, so a stale cache cannot widen access.

### Roles and authz

`memberships.role` is one enum of **eight org roles** (the `org_role` Postgres type in §02): four creator roles and four client
roles. `users.platform_role` is not part of it.

| Org role | Org kind | Representative permissions |
| --- | --- | --- |
| `owner` | creator | everything: `member.invite`, `campaign.*`, `deliverable.*`, `invoice.*`, `payout.*`, `org.billing`, `org.delete`, transfer ownership |
| `admin` | creator | `member.invite`, `campaign.*`, `deliverable.*`, `invoice.*`; no `org.billing`, no `org.delete` |
| `producer` | creator | `campaign.write`, `deliverable.*` (incl. version upload), `approval.request`, `message.write`; no invoice, no invite |
| `editor` | creator | `deliverable_version.upload`, `comment.write`; no `approval.decide`, invoice or invite |
| `finance` | creator | `invoice.*`, `payout.*`; read-only elsewhere |
| `client_admin` | client | `member.invite` (own client org), `approval.decide`, `invoice.read` on invoices addressed to that org |
| `client_reviewer` | client | `approval.decide` on assigned deliverables, `comment.write` |
| `client_viewer` | client | read-only |

`packages/auth/src/policy.ts` exports the `OrgRole` enum (those eight values, shared with the Drizzle `org_role` type and the Zod
enums in `@tano/contracts`) and one pure `can(actor, action, resource)` function with a table-driven policy and table tests.
Procedures declare `requiredPermission`; no ad-hoc role string comparisons in route files. Platform admin is a separate check: the
actor carries `isPlatformAdmin` from `users.platform_role='admin'` (`user|support|admin`), and every `admin.*` procedure runs
`requirePlatformAdmin` before `can(...)` — audited impersonation, metadata only, no standing data access. Same API; a separate
deploy only if a compliance boundary appears.

## 3. API contract

| Option | Typed clients (SPA now, future clients later) | OpenAPI artifact | Agent readability / blast radius | Ecosystem | Workers fit | Verdict |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OpenAPI-first + hey-api/orval | 5 | 5 | 4 | 5 | 5 | Viable, but spec/code drift is manual |
| Hono RPC (`hc<AppType>`) | 4 | 2 | 3 | 5 | 5 | Inference-only; type errors land at call sites |
| **oRPC** | **5** | **5** | **5** | 3 | 5 | **Chosen** |
| tRPC v11 | 5 | 2 | 3 | 5 | 4 | OpenAPI is alpha and needs TS 7.1-beta |
| GraphQL | 4 | 1 | 3 | 5 | 4 | Schema/resolver split, overkill for CRUD |

Verified 2026-11-28 via GitHub API:

| Project | Latest release | Stars |
| --- | --- | ---: |
| Hono | v4.13.23 (2026-11-26) | 33,137 |
| oRPC | v1.16.7 (2026-11-28) | 5,792 |
| tRPC | v11.32.2 (2026-11-27) | 40,902 |
| Zod | v4.6.7 (2026-10-12) | 44,483 |
| hey-api / Orval | — / v8.49.0 (2026-11-22) | 5,608 / 6,663 |
| Drizzle ORM | 0.45.4 (2026-10-08) | 36,431 |
| Better Auth | v1.7.28 (2026-11-24) | 30,911 |

Why oRPC: contracts are explicit values (`oc.input(...).output(...)`), so an agent's diff is reviewable without inferring types; the
same contract serves the RPC handler, an OpenAPI 3.1 document, and a typed client (`https://orpc.dev/docs/contract`,
`https://orpc.dev/docs/openapi`). That file is what agents and future non-TS clients read. tRPC's OpenAPI generator is alpha, "APIs
may change without notice", and needs TypeScript 7.1-beta (`https://trpc.io/docs/openapi`).

```ts
// packages/contracts/src/campaigns.ts
export const campaigns = {
  list: oc.input(z.object({ status: z.enum(["draft","live","done"]).optional() })).output(z.array(CampaignSchema)),
  approveDeliverable: oc.input(z.object({ deliverableId: z.uuid() })).output(DeliverableSchema),
};
```

Mitigation for oRPC's smaller ecosystem (5.8k stars, v1): pin the minor, snapshot OpenAPI in CI, and keep contracts free of
oRPC-only types so Hono `@hono/zod-openapi` conversion stays mechanical.

## 4. Runtime and background jobs

### Workers Free limits that bite

| Limit | Free | Paid | Why it matters here |
| --- | --- | --- | --- |
| CPU per invocation | **10 ms** | 30 s default, 5 min max | Kills SSR and scrypt password hashing; limits JSON-heavy jobs |
| Requests | 100,000/day | 10M/mo included | Ceiling arrives before 10k *active* users |
| Memory | 128 MB/isolate | 128 MB | Keep Zod ≥ 4.5.0; earlier versions use much more memory |
| Subrequests | 50/request | 10,000 | Fine for CRUD, not for fan-out syncs |
| Simultaneous connections | 6 | 6 | Seventh waits; batch external calls |
| Cron Triggers | 5/account | 1,000 | One dispatcher, not one cron per job |
| Queues | 10k ops/day, 24 h retention | 1M ops/mo, 14 days | ~3.3k messages/day; enough for MVP email/webhooks |

Sources: `https://developers.cloudflare.com/workers/platform/limits/`,
`https://developers.cloudflare.com/workers/platform/pricing/`,
`https://developers.cloudflare.com/queues/platform/limits/`. Static assets are free, do not invoke the Worker, and that is why
marketing costs nothing.

**Free-tier ceiling math.** At 30 API calls per active user-day, 100,000 requests/day ≈ **3.3k DAU**. At 10 requests/day, 10k MAU
fits exactly. So "free until 10k users" is true for registered/low-engagement users, false for 10k daily users. Budget the $5
upgrade at ~3k DAU; that is revenue territory anyway.

**Two non-obvious blockers.** (1) Better Auth hashes with `scrypt` by default, "memory-hard and CPU-intensive"
(`https://better-auth.com/docs/reference/security`); one hash exceeds 10 ms, so Free means **Google/GitHub OAuth + magic links**
(SHA-256/HMAC) or passkeys (Web Crypto ES256), password login after the $5 upgrade. (2) The DB path needs no TCP and no `nodejs_compat` flag: use the **Neon
serverless HTTP driver** (stateless `fetch`, no connection lifecycle, no 6-connection cap). Better Auth's Cloudflare guide asks for
an HTTP driver rather than a module-scope pool (`https://better-auth.com/docs/guides/cloudflare`). The Worker still enables Node
built-ins by default at compatibility date 2026-11-27, which Better Auth uses for `node:crypto`.

Driver: `@neondatabase/serverless` + `drizzle-orm/neon-http`; single queries and non-interactive `sql.transaction([...])` /
`db.batch([...])`, but **not interactive transactions** (`https://neon.com/docs/serverless/serverless-driver`). Writes are
idempotent statements or one batch; Better Auth tolerates adapters without transaction support. `createDb(env)` reads
`env.DATABASE_URL` (the pooled runtime URL — the unpooled URL is never a Worker binding) and `createAuth(db)` is a per-request
factory — cheap over HTTP, and bindings are request-scoped. Why not Hyperdrive in v1: its Free tier is 100k
queries/day, and a dashboard page costs 3-8 queries, so it saturates at ~12-33k page views/day before background jobs — a second
quota beside Neon's, for a pooling problem the HTTP driver removes. Add Hyperdrive + `pg` with the $5 Workers Paid upgrade (or a
route-scoped Neon WebSocket `Pool` for one invoice+payout flow), when interactive transactions matter.

### Where each thing runs

| Workload | Where | Why |
| --- | --- | --- |
| CRUD, auth, approvals, invoices | API Worker (sync) | sub-100 ms; one query or one `db.batch` |
| Email, webhooks, notifications | Queues consumer | retries + DLQ; 15 min wall, 10 ms CPU per invocation |
| Reminders, invoice due dates | Cron Trigger (5 max) -> enqueue | cron only dispatches, never does the work |
| Nightly metrics sync, digests, backups | GitHub Actions scheduled workflow | no Workers CPU cap; public repo runners are free, private repos include 2,000 min/mo (`https://docs.github.com/en/billing/concepts/product-billing/github-actions`) |

Design jobs as small I/O-bound steps: CPU counts active execution only, so `fetch` and DB waits are free while parsing 500 API
pages is not. Cron and Queue invocations cap at 15 min wall and 10 ms CPU, `waitUntil` is 30 s; nothing long-running belongs in a
request or a queue consumer — that is the GitHub Actions job.

### Host comparison ($0 first)

| Option | Card at signup | Free allowance | Blocking issue |
| --- | --- | --- | --- |
| **Cloudflare Workers Free** | No paid plan; card only for paid add-ons **[INFERENCE — confirm at signup]** | 100k req/day, 10 ms CPU, 128 MB, static assets free | Ceilings shaped the SPA + OAuth design; fine at MVP scale |
| Cloudflare Workers Paid | Yes, $5/mo minimum | 10M req, 30 s CPU default | Not allowed at start |
| Fly.io Free plan | **Yes** (card required) | $5 usage/mo, 3 Machines; Managed Postgres from $4/mo | $9–10/mo for app + DB, exceeds $5 (`https://fly.io/docs/about/pricing/`) |
| Render Free | No | 0.1 CPU / 512 MB, 750 h/mo, spins down after 15 min (~1 min cold start); free Postgres **expires after 30 days** | Cold starts; DB unusable for production (`https://render.com/docs/free`) |
| Oracle Always Free | **Yes** (verification) | 2 OCPU / 12 GB Ampere A1 (1,500 OCPU-h + 9,000 GB-h/mo), 2 micro AMD, 200 GB block | Idle instances may be reclaimed if CPU/network/memory <20% over 7 days (`https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm`) |

**Primary:** Workers Free. **Fallback:** Oracle Always Free ARM VM running Docker (Hono on Node, Postgres, Caddy). Hono's
`@hono/node-server` adapter makes the API portable; only the DB client factory changes. Oracle needs card verification, so it is the
fallback, not the default. Railway Free (2026) is also $0 with no card, but its $1/month usage credit and 5–10 minute sleep make it
a cron runner, not the API (`https://railway.com/pricing`). Render Free is the no-card interim only — never with its free Postgres.
Student-pack credits (DigitalOcean, Azure) are trial balances, not free-forever; do not put production there.

Data: Neon Free is permanent, no card, 1 GB storage/project, 100 CU-h/project/mo, 10 branches, scale-to-zero after 5 min
(`https://neon.com/pricing`). Neon Free also meters **5 GB/project/month of network transfer, shared across Postgres, Object
Storage and Functions**, so keep responses narrow and paginated — 10k MAU is not free on Neon without a payload budget. Keep
blobs out of Postgres: R2 Free is 10 GB-month + 1M Class A + 10M Class B with free egress
(`https://developers.cloudflare.com/r2/pricing/`); enabling R2 may require a payment method **[INFERENCE]**.

## 5. Monorepo

| Tool | Version / stars (2026-11-28) | Fit | Verdict |
| --- | --- | --- | --- |
| **Bun workspaces** | Bun 1.4.4 installed; 96,987 stars | Built in, `--filter`, catalogs, one lockfile; no task graph | **Chosen** |
| Turborepo | v2.11.13; 31,394 stars | Task graph + cache; needs pipeline config and workspace moves | Defer until >5 deployables or CI >10 min |
| Nx | 24.1.0; 29,498 stars | Plugins/generators/graph; largest learning surface for agents | Reject |

Bun is already the lockfile in this repo and **Workers Builds preinstalls Bun 1.4.4**, selecting it from `packageManager`
(`https://developers.cloudflare.com/workers/ci-cd/builds/build-image/`). So the manager switch does not break the Cloudflare build.

```
tano-clone/                      # root package = marketing app (44 routes, untouched)
  package.json                   # private, workspaces, packageManager, catalog
  bun.lock                       # single lockfile
  next.config.ts  worker/  src/  # marketing, unchanged
  apps/
    dashboard/                   # Vite SPA; layouts creator|client|admin; wrangler SPA fallback
    api/                         # Hono + oRPC Worker (wrangler.jsonc)
  packages/
    contracts/                   # @tano/contracts: oRPC contracts + Zod schemas (no server imports)
    db/                          # @tano/db: Drizzle schema, migrations, repositories
    auth/                        # @tano/auth: Better Auth factory, actor resolver, policy.ts
    theme/                       # @tano/theme: Tano tokens + Astryx tano theme (no React)
    ui/                          # @tano/ui: Astryx wrappers + dashboard primitives
    config/                      # @tano/config: tsconfig bases, ESLint, env schemas
```

Root `package.json` additions:

```json
{ "packageManager": "bun@1.4.4", "workspaces": ["apps/*", "packages/*"],
  "catalog": { "next": "16.4.6", "react": "19.3.1", "zod": "4.6.7",
               "drizzle-orm": "0.45.4", "better-auth": "1.7.28", "@orpc/server": "1.16.7" } }
```

Package rules that keep blast radius small:

- `@tano/contracts` depends only on `zod` + `@orpc/contract`; safe in browser bundles. `@tano/db` is
  imported only by `apps/api` and scripts — the SPA gets a lint error if it tries.
- `@tano/theme` owns the token source and the built Astryx theme; `@tano/ui` is the SPA's only
  Astryx component entry point (marketing keeps its ported CSS). Both stay framework-neutral
  (no `next/*`), so they can be reused if marketing later adopts Astryx.
- Apps use `workspace:*`; shared versions live in `catalog:`.

### Migration sequence (no 44-route breakage)

0. Baseline: `bun run build && bun run assert:static` green; note the route count.
1. **Infra:** add `packageManager`, `workspaces`, `catalog`; create `packages/config` only; run
   `bun install`, `bun run build:vinext`, `bun run assert:static`. No app code moves.
2. **CI:** switch to `oven-sh/setup-bun@v2` + `bun install --frozen-lockfile`, keep script names;
   delete `package-lock.json` only after green. Rollback = restore it.
3. **Data:** `packages/db` + first Drizzle migration + `db:check` job. No runtime wiring.
4. **API:** `apps/api` health + auth + one read procedure; deploy behind the service binding; snapshot OpenAPI.
5. **Dashboard:** `apps/dashboard` layouts with fixtures; `vite build`; deploy to `app.`.
6. **Slice:** campaigns list/detail end-to-end through oRPC; then clone the pattern.

Explicitly rejected: moving marketing to `apps/marketing` — it rewrites the Workers root, watch paths, scripts, docs, and the static
assertion for zero product benefit.

Deploy topology: marketing Worker unchanged on `www`; `tano-dashboard` (Workers Builds root `apps/dashboard`) on `app.example.com/*`
with `run_worker_first: ["/api/*"]`, SPA fallback and a service binding `API` -> `tano-api`; `tano-api` is internal (root
`apps/api`), exposed publicly only as `api.example.com` for webhooks. Same origin: host-only cookies, no CORS.
Better Auth: `baseURL=https://app.example.com`, `basePath=/api/auth`, `trustedOrigins=["https://app.example.com"]`
(`https://better-auth.com/docs/reference/security`). The API also gets `api.example.com` only for third-party webhooks, which never
use cookies.

## 6. Local dev and CI

| Concern | Command / mechanism |
| --- | --- |
| Task runner | `bun run --filter './apps/*' <script>` and `--filter @tano/api`; no extra tool |
| Fast loop | `bun run check:fast` = contracts typecheck + API unit tests (PGlite) + OpenAPI snapshot diff, target <60 s |
| Env validation | `packages/config/src/env.ts`: Zod `serverEnv`/`clientEnv`; parsed at Worker entry; `NEXT_PUBLIC_*` (marketing) and `VITE_*` (SPA) validated at build; `.env.example` per app; CI uses dummy values |
| DB URLs | `DATABASE_URL` = pooled runtime URL, set with `wrangler secret put DATABASE_URL` (`.dev.vars` locally); `DATABASE_URL_UNPOOLED` = migrations/CI only, from GitHub secrets, never a Worker binding |
| Migrations | `drizzle-kit generate` in PR; `drizzle-kit migrate` in a deploy job over `DATABASE_URL_UNPOOLED` with an advisory lock; never at runtime |
| Schema drift | `db:check`: generate then `git diff --exit-code drizzle/` |
| Preview | PR workflow: Neon branch `pr-<n>` (10-branch Free cap), migrate with `DATABASE_URL_UNPOOLED`, `wrangler versions upload` for both Workers, comment URLs; delete branch on close |
| Seed | `packages/db/src/seed.ts`, idempotent upserts with fixed UUIDs: 8 actors (one per org role) + 1 platform admin, 2 campaigns, 4 deliverables, 1 invoice per state |
| API tests | PGlite (`@electric-sql/pglite`, 16,390 stars) applies the same migrations in-process; one nightly job hits a real Neon branch for planner/extension differences |

`.github/workflows/ci.yml` jobs after migration: `marketing` (existing steps, Bun install), `api` (typecheck, unit, contract
snapshot), `web` (Vite build + route smoke), `db` (drift), `deploy` (main only: `drizzle-kit migrate` over `DATABASE_URL_UNPOOLED`,
then `wrangler deploy` with the `DATABASE_URL` binding; `workflow_dispatch` rollback). Cache `~/.bun/install/cache` and
`.next/cache`; cancel superseded runs.

Agents get one command per task, deterministic fixtures, no Docker for unit tests, and a failing diff when the public contract
changes.

## 7. Cost and risks

| Item | Now | At ~3k DAU | Card |
| --- | ---: | ---: | --- |
| Workers Free -> Paid | $0 | $5/mo | Paid only |
| Neon Free -> Launch | $0 | $0–15/mo (only past 1 GB / 100 CU-h) | No |
| R2 | $0 (10 GB) | ~$0.02/GB overage | May be required to enable |
| **Total** | **$0** | **~$5–20/mo** | — |

Risks and triggers:

1. **10 ms CPU** — SSR, PDF generation, image processing, or password hashing fails on Free.
   Upgrade when such a feature lands, or when p95 CPU approaches 8 ms.
2. **100k req/day** — ~3.3k DAU; upgrade at sustained 70k/day or a polling feature.
3. **vinext is young** (created 2026-02-24; 9,417 stars; 797 open issues) — pin it, keep
   `next build` green, keep Docker/Node as an exit.
4. **Neon 1 GB, no interactive transactions** — batch writes; assets to R2; retention for
   revisions and attachments.
5. **oRPC maturity** — contract snapshot + mechanical fallback to Hono `@hono/zod-openapi`.
6. **Oracle reclamation** — idle instances can be reclaimed after 7 days below 20%
   CPU/network/memory; a health job plus traffic avoids it, but it is not an SLA.

What would change the decision: sustained >3k DAU (Workers Paid); a non-TS client (OpenAPI becomes primary; oRPC still emits it);
>30 s CPU or websockets (API to Oracle/Fly, Hono unchanged); a second developer (Turborepo earns its config).
