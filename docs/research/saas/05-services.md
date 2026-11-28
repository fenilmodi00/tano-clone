# 05 — Platform services: auth, billing, email, queues, observability, files

Checked **2026-11-28** against live pricing and docs pages. Budget rule (hard): **$0 upfront, no charge,
no monthly minimum** until roughly 10k users. Every row states the free limit, whether a card is required, whether
credits expire, and whether the free plan is production-usable. Transaction fees are called out separately from
subscriptions. Unverified reasoning is marked **[INFERENCE]**.

Fixed context from `00-decision.md` / `01-frontend.md` / `02-data.md`: marketing stays Next.js
16.4.6 static; dashboards are a Vite + React Router SPA; the API is Hono on Cloudflare Workers Free;
Drizzle + **Neon Free Postgres**, single DB with `org_id`; R2 for assets; Astryx for UI.

## Verdict

| Category | Primary (all $0/mo) | Fallback | Rejected for v1 |
| --- | --- | --- | --- |
| Auth | **Better Auth 1.7.28** self-hosted, MIT | Clerk Hobby (managed, $0 to 50k MRU) | Auth.js, Supabase Auth, WorkOS |
| Client billing | **Paddle** (merchant of record, 5% + 50¢) | Razorpay India-first (2% + GST) | Stripe (invite-only in India), Polar, Lemon Squeezy |
| Creator payouts | **Manual monthly payout run** from a ledger | Razorpay Route (India→India) | Stripe Connect (not obtainable at $0) |
| Email | **Resend Free** + React Email | Postmark (100/mo) | Cloudflare Email, SES (credits expire) |
| Queues / jobs | **Cloudflare Queues + Workflows** | Inngest Free | Trigger.dev, BullMQ, pg-boss |
| Redis | **None** — Postgres/KV only | Upstash Redis Free | Managed Redis as a default |
| Observability | **Sentry Free + PostHog Free + Workers Logs** | Axiom Free | Grafana Cloud, paid Sentry |
| Files / media | **R2 + browser-generated derivatives** (no Cloudflare Images in the path) | Oracle Always Free ARM VM + MinIO (card verification) | Neon/Supabase Object Storage, Stream, Mux paid, virus-scan SaaS |

**Monthly recurring cost of the whole MVP: $0.** The only unavoidable money is per-transaction (Paddle 5% + 50¢)
and a domain (~$10–12/year, not a service). No row requires a card **except R2** (and its Oracle + MinIO fallback,
which asks for card *verification* but no charge), which is the one place the "no card" rule bends (§7).

---

## 1. Auth

### Options

| Option | Free tier | Card / expiry | Why / why not |
| --- | --- | --- | --- |
| **Better Auth 1.7.28** — MIT, **30,911★** ([repo](https://github.com/better-auth/better-auth), [npm](https://www.npmjs.com/package/better-auth)) | Framework free forever, self-hosted. Optional hosted infra: Starter free (10k audit logs/mo, **1-day** retention), Pro $20/mo | No card for the framework. No credits. MIT → commercial use allowed | Email+password, **passkey**, **email OTP**, magic link, OAuth, organizations (invitations, roles, teams), admin plugin (impersonation, ban, session revocation). **Documents Next.js 16 proxy** explicitly ([Next integration](https://www.better-auth.com/docs/integrations/next#nextjs-16-proxy)). Code lives in the repo → AI agents can read the source. Cost is schema/ops work, not money |
| **Auth.js / NextAuth** — **28,392★** ([repo](https://github.com/nextauthjs/next-auth)) | Free, MIT | None | **Now part of Better Auth** ([banner](https://authjs.dev/)). `next-auth@5` is still `5.0.0-beta.32`; `latest` is `4.24.15` ([npm](https://registry.npmjs.org/next-auth)). No built-in orgs/invitations/roles/impersonation — you build them. Choosing it in 2026 means choosing the predecessor of the recommended option |
| **Clerk** | Hobby $0: **50,000 MRU**, 100 monthly retained orgs, **5 impersonations/mo**, 3 dashboard seats; no card ([pricing](https://clerk.com/pricing)) | No card; no credits. Commercial use allowed on free plan | Best managed UX and the only credible "don't build auth" option. But orgs/memberships/invitations are Clerk's model, not ours; impersonation is capped at 5/mo on free; Pro is $25/mo ($20 annual) once you pass 50k MRU or 100 orgs. Data leaves your DB |
| **Supabase Auth** | Free: 50k MAU, 1 GB DB, 2 projects, pauses after 7 days idle ([pricing](https://supabase.com/pricing)) | No card | Solid email/OAuth, but **no organization, invitation, role or impersonation primitives** — you build all of it on `auth.users` + custom tables. Only rational if Supabase were also the DB; it is not (Neon is) |
| **WorkOS AuthKit** | User Management free to **1M MAU**; no card until production ([pricing](https://workos.com/pricing)) | No card | Genuinely cheap B2B auth, but SSO/SCIM/Directory Sync are billed per connection (from $125/mo), Audit Logs is a separate product, and it puts the org model in WorkOS. Revisit only when a client demands SAML SSO |

### Recommendation: Better Auth, self-hosted, with the organization + admin plugins

Nothing else gives orgs, invitations, roles, impersonation and session revocation at $0 while keeping the data in
Neon. The paid Better Auth infrastructure is **not** used: its free audit log keeps **1 day**, which is useless for
support; we write our own `audit_log` (already in `02-data.md`).

**Two hard integration constraints** (both verified in the official guide): Workers needs Node compatibility
(`nodejs_compat`, default from `2026-08-04`), and the auth instance must **not** hold a module-scope client with
open connections — not even a `pg`/`mysql2` pool through Hyperdrive. **Use the Neon HTTP driver for auth and the
app.** The old `neon-http` transaction failure ([#4747](https://github.com/better-auth/better-auth/issues/4747)) was
fixed in **1.3.12** (closed 2025-09-18); current 1.7.28 is fine. A per-request `neon-serverless` WebSocket pool
(`max: 2`) is a tested exception only if a specific flow later proves it needs interactive transactions
([guide](https://www.better-auth.com/docs/guides/cloudflare#database-connections)).

### Tables Better Auth expects, and the mapping to `02-data.md`

**Duplication verdict: yes, by default.** `member` is a second membership table and `invitation` is a second
invite store. Remap `member` onto `memberships`, let Better Auth own `invitation`, and delete the duplicate path.

The organization plugin expects `organization`, `member`, `invitation` (+ optional `team`, `teamMember`,
`organizationRole`); core expects `user`, `session`, `account`, `verification`. It supports renaming models and
columns per plugin (`schema.modelName` / `schema.fields`) ([example](https://www.better-auth.com/docs/plugins/organization#schema)).
Map, do not duplicate:

| Better Auth model | Actual table | Field mapping | Change to `02-data.md` |
| --- | --- | --- | --- |
| `organization` | `orgs` | `name→name`, `slug→slug`, `createdAt→created_at`; `additionalFields.kind` → `orgs.kind` (`creator\|client`), `currency` | none (add `kind` to the plugin's additionalFields) |
| `member` | `memberships` | `organizationId→org_id`, `userId→user_id`, `role→org_role`, `createdAt→created_at` | **This is the membership table**; no second table |
| `invitation` | **new `invitation`** | native (`email`, `role`, `status`, `expiresAt`, `inviterId`) | **Drop `memberships.status='invited'`**; Better Auth owns token hashing, expiry, accept/reject. Keep `active\|suspended\|revoked` |
| `user` | `users` | `name→display_name`, `email→email`, `emailVerified→email_verified` (new), `image→avatar_url` (new), `createdAt→created_at` | Add `email_verified`, `avatar_url`, and **`platform_role text`**; drop `is_platform_admin` (the admin plugin reads `role`) |
| `session`, `account`, `verification` | new | native | Auth-only tables; nothing domain-specific |
| `rateLimit` (optional) | new | native | Set `rateLimit.storage: "database"`; the default is in-memory, which is wrong on Workers ([docs](https://www.better-auth.com/docs/concepts/rate-limit#storage)) |

**Roles.** Better Auth's defaults are `owner`, `admin`, `member`. Our eight-role enum maps 1:1 (`owner`, `admin`,
`producer`, `editor`, `finance`, `client_admin`, `client_reviewer`, `client_viewer`) and is declared with
`createAccessControl` so server checks and UI share one definition. `member` is unused; `creatorRole: "owner"` on
create. Invitations carry the role and land in `memberships` on accept. **`memberships.status` is ours alone** —
Better Auth ignores it, so `authz.ts` must reject any non-`active` row before an org check.

**Platform admin** is not an org role. It is `users.platform_role = 'admin'` + the admin plugin's `adminUserIds`
as a bootstrap. Platform admins get **no standing tenant access**: every read is an explicit, audited support
action.

**Impersonation** uses the admin plugin (`POST /admin/impersonate-user`): default **1 hour**, configurable to 30
minutes; the session carries `impersonatedBy`; every start writes `audit_log(action='impersonation.start')`.
Billing mutations return 403 while impersonating. Ban/revoke-all-sessions also come from the plugin
([admin docs](https://www.better-auth.com/docs/plugins/admin)).

**Audit trail.** Better Auth's own audit log is a paid-infra feature; the free Starter tier keeps 1 day. Do not buy
it. Insert into `audit_log` from database `after` hooks for auth events (sign-in, invite, role change,
impersonation) and from the domain mutation path for approvals, invoice/payout state changes and asset deletes —
same transaction where the driver supports it, otherwise the next statement with a retry, never silently dropped.

**What would change this decision:** a hard requirement for SAML SSO before revenue (→ WorkOS AuthKit, still $0 at
our scale) or a team that refuses to own auth schema/ops (→ Clerk Hobby). Neither is true at launch.

---

## 2. Billing and creator payouts

### The India constraint that decides this section

- **Stripe is invite-only in India.** New accounts cannot sign up; platforms may add connected accounts **by
  invite only** ([Stripe support](https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india)).
  India→India Connect direct charges work, but India→abroad with an application fee does **not**
  ([marketplace restrictions](https://support.stripe.com/questions/stripe-india-support-for-marketplaces)).
- **Polar cannot pay out to India.** Payouts use Stripe Connect Express; India is absent from the supported-country
  list ([Polar docs](https://polar.sh/docs/merchant-of-record/supported-countries)).
- **Lemon Squeezy is closed to new sign-ups and shuts down 2027-03-31** ([banner](https://www.lemonsqueezy.com/pricing)).
- **Paddle supports India** (only sanctioned countries are excluded), pays via wire or Payoneer with a **$100
  minimum**, and a **$15 SWIFT fee may apply** ([countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle), [payouts](https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid)).
  Individuals/sole traders skip the business-verification step ([verification](https://www.paddle.com/help/start/account-verification/what-is-business-verification)).

### Options

| Option | Pricing (live) | India / KYC | Why / why not |
| --- | --- | --- | --- |
| **Paddle** (MoR) | **5% + 50¢** per checkout, no monthly, no setup; chargeback **$20** ([pricing](https://www.paddle.com/pricing), [chargebacks](https://www.paddle.com/help/manage/risk-prevention/understanding-chargebacks-with-paddle)) | India supported; individual/sole trader accepted; domain review; payout to own bank/Payoneer, $100 min | **Recommended.** Paddle is merchant of record: it handles global sales tax/VAT/GST, fraud, chargebacks and buyer support. No card, no monthly, no credit expiry. Fees are transaction-only. Downside: Paddle is the seller on the client's statement; marketplace split payouts are not its job |
| **Stripe + Connect Express** | India: **2%** domestic cards, **3%** international (+2% conversion); Connect **$2/active account/mo + 0.25% + 25¢ per payout** ([IN pricing](https://stripe.com/in/pricing), [Connect pricing](https://stripe.com/connect/pricing)) | **Invite-only**; Connect onboarding restricted; cross-border with app fee unsupported | Right long-term product (real split payouts, 1099s for US accounts, Billing). Not obtainable at $0 today. Revisit if invited or after incorporating in the US/SG |
| **Polar** | Starter **5% + 50¢**; Pro $20/mo (3.8% + 40¢) ([pricing](https://polar.sh/#pricing)) | **No India payout** (Stripe Express list) | Rejected. Great DX, wrong country coverage |
| **Lemon Squeezy** | 5% + 50¢ | Closing | Rejected: no new sign-ups; shutdown 2027-03-31 |
| **Razorpay** (India) | **2% + GST** domestic (2.36% effective), **3%** international export; 90-day 0% PG offer; Route transfers **0.1%** limited-time / 0.25% regular [INFERENCE: third-party] ([pricing](https://razorpay.com/pricing/), [international](https://razorpay.com/blog/international-payment-gateway-cost-india/)) | Indian entity/sole proprietor; current account; Route linked-account KYC per creator | **Fallback** for an India-only launch (Indian creators + Indian clients). Not MoR: you handle GST on exports, TDS on creator payouts, and international card acceptance. Also the only realistic **split-payout** rail for Indian creators at $0 |

### Recommendation: Paddle for client money, manual payouts for creators, Route/Connect later

- Clients pay Paddle Checkout (subscription or one-time); Paddle invoices and remits tax. Net-30 clients are a
  **manual invoice + bank transfer** reconciled into `invoices` — no AR automation at MVP.
- Creators are **not** Paddle sellers. You collect, keep the platform fee, and pay creators monthly from
  `payouts`, one batched run with a creator statement. Legitimate at low volume; avoids Connect onboarding.
- **Fee math** on a $2,000 invoice: Paddle takes $100.50 → $1,899.50 net. A 70% creator share is $1,400; platform
  gross is $499.50 before Indian tax. One $15 SWIFT fee is 0.8% of that payout — batch monthly, never per deliverable.
- **Webhooks:** the repo-local skill is `paddle-webhooks` (not `stripe-webhooks` — Stripe is not the v1 provider).
  It verifies `Paddle-Signature` before parsing: HMAC-SHA256 over `{ts}:{raw body}` with the notification secret, a
  5-minute timestamp tolerance, constant-time compare; missing/invalid → **401 and no DB write**. Idempotency is
  Paddle's `event_id`, and the raw body must be read before any JSON parsing or the HMAC will not match.
- **Tax:** Paddle remits sales tax/VAT/GST in buyers' jurisdictions; your payout is an export of services from
  India (zero-rated with GST registration + LUT; confirm the threshold with a CA) **[INFERENCE: fact-specific]**.
  Paddle issues no 1099 (not a US payer). Creator payments attract Indian TDS (194J/194C) and possibly GST — store
  PAN/GSTIN per creator and withhold in the ledger.
- **Liability:** Paddle is seller of record to the client; you remain liable to Paddle for refunds/chargebacks
  (clawback) and carry the creator contract. With Stripe Connect, creators are sellers of record and the platform
  carries negative-balance and onboarding liability.
- **Migration path:** India-only + volume → Razorpay Route (split at capture); invited by Stripe or offshore entity
  → Stripe Connect Express + Billing. Keep `invoices`/`payouts` provider-agnostic (`provider`, `provider_ref`).

**What would change this decision:** Paddle rejects the creator-services category at review, or payout to an
Indian sole proprietor stalls. Then launch Razorpay-only (India), or incorporate and use Stripe.

---

## 3. Email

| Option | Free tier | Card / expiry | Why / why not |
| --- | --- | --- | --- |
| **Resend** | **3,000/mo, 100/day**, 3 domains, 3 inboxes, 30-day retention, 10k automation runs; free forever ([pricing](https://resend.com/pricing)) | **No card**, no credits | **Recommended.** Best DX, React Email native, webhooks, idempotency keys. 100/day is the first real cliff |
| **Postmark** | **100/mo** free forever, no expiry ([pricing](https://postmarkapp.com/pricing)) | No card | Best deliverability reputation; 100/mo is a demo tier, not a product tier. Paid starts at 10k/mo |
| **Cloudflare Email Service** | Free plan sends **only to verified destination addresses**; customer sending needs Workers Paid | Card needed for Workers Paid ($5/mo minimum) | Rejected: free tier cannot email customers; paid is $5 + 3,000 emails, then $0.35/1k ([pricing](https://developers.cloudflare.com/email-service/platform/pricing/)) |
| **AWS SES** | **$200 credits for 6 months**, then **$0.10–0.16 per 1,000** ([pricing](https://aws.amazon.com/ses/pricing/)) | **Card required**; credits **expire** | Cheapest at scale, but not free forever and no templates/UX. Rejected for launch; the volume escape hatch later |

**Recommendation: Resend Free + React Email 6.11.17** (MIT, **20,017★**, [repo](https://github.com/resend/react-email)).
Templates live in `src/emails/*.tsx`, rendered with `@react-email/components`, sent through `resend` 6.41.0.

**DNS:** publish the exact MX/SPF/DKIM records Resend issues for a **subdomain** (`send.example.com`), plus
`_dmarc` at `p=none` → `quarantine`. Never send transactional mail from the root domain; a creator's spam
complaint must not poison the marketing domain.

**Deliverability:** the free plan uses shared IPs; warm up on engaged recipients only, wire bounce/complaint
webhooks into a suppression list, and keep the first 1,000 sends low-volume. Postmark wins on reputation but its
100/mo cap makes it a fallback, not a primary.

**Abuse, not usage, is what exhausts 100/day.** One scripted loop of OTP requests for a single address burns the
whole global allowance and locks every real user out of sign-in. So abuse controls are part of the email design,
not a later hardening pass:

- **Cloudflare Turnstile** (free) on signup and on every OTP / magic-link request, verified server-side with
  `siteverify` (token + `remoteip`, 5-minute freshness, single use). No valid token → no send.
- **Per-email and per-IP send caps** enforced in the Worker before Resend is called: **3/hour per email,
  10/hour per IP, 50/day per IP**, plus Better Auth's `rateLimit` (`storage: "database"`) on `/api/auth/*` keyed by
  `cf-connecting-ip`. Counters in Postgres — no Redis, no KV race.
- **Resend usage alerts at 70% and 90%** of the 100/day and 3,000/mo allowances, wired to a `notifications` row and
  Sentry. At 90%, non-auth mail stops (in-app only) and OTP is served from the same remaining budget under a
  stricter cap.
- **OTP shape:** 6 digits, 10-minute expiry, 5 verification attempts, single use; the send response never reveals
  whether an address exists.
- A single abuser can therefore spend at most ~50 of 100 daily sends; the other ~50 still serve real sign-ins.

**Email budget (a design constraint):** 100/day = 3,000/mo; at 3 emails per active user that is **~1,000 MAU**.
So **passkeys + Google OAuth are the primary login** (no password on Free, per `00-decision.md`), OTP and magic link
are opt-in, and **all non-critical notifications stay in-app** (`notifications`). Email is reserved for
verification, reset, magic link, invitation, approval decision, and invoice issued/paid. At ~700 MAU, upgrade
Resend Pro ($20/mo) or move auth mail to SES ($0.10/1k, card).

---

## 4. Queues and background work

| Option | Free tier | Card | Why / why not |
| --- | --- | --- | --- |
| **Cloudflare Queues** | **10,000 operations/day**, 10k queues; 3 ops per message (write/read/delete) → **~3,300 messages/day** ([pricing](https://developers.cloudflare.com/queues/platform/pricing/)) | No card (Workers Free) | **Primary.** Native to the app's runtime, retries + dead-letter queue, batching, `wrangler dev` local queues. Consumer is the same Worker — no second deploy target |
| **Cloudflare Workflows** | **3,000 steps/day**, 1 GB-month state, 3-day instance retention ([pricing](https://developers.cloudflare.com/workflows/reference/pricing/)) | No card | **Primary for multi-step flows** (dunning, approval reminders, onboarding). Durable steps, retries, wait-for-event. 3k steps/day is plenty at MVP |
| **Trigger.dev** | $0: **$5/mo free credits**, **20 concurrent runs**, no card ([pricing](https://trigger.dev/pricing)) | No card | Best for long/CPU-heavy Node jobs (ffmpeg, AI). Adds a second platform and a run-durability model; **defer** until video transcode exists |
| **Inngest** | **50,000 executions/mo**, no card ([pricing](https://www.inngest.com/pricing)) | No card | Excellent event/step DX and the best fallback if Workflows' 3k steps/day or 3-day retention binds. Adds a vendor; not needed now |
| **BullMQ + Upstash Redis** | BullMQ free (MIT, **9,638★**); Upstash 250 MB / 500k commands ([pricing](https://upstash.com/pricing/redis)) | No card for Upstash | Requires an always-on Node worker; Workers cannot host BullMQ's blocking connections. New host + new runtime for no MVP gain. **Reject** |
| **pg-boss** | Free (MIT, **4,168★**) | — | Postgres-native and attractive *if* a Node service already exists. It does not; a separate always-on worker host is a paid/card resource. **Defer** until a Node service exists for video |

**Recommendation: Cloudflare Queues for webhook and email fan-out + Workflows for multi-step state machines.**
Job types:

| Job | Mechanism | Idempotency key |
| --- | --- | --- |
| Paddle webhook (`paddle-webhooks` skill) | Queue consumer | Paddle `event_id` after `Paddle-Signature` verification |
| Email send | Queue consumer | `email:{template}:{entity_id}:{attempt}` + Resend `Idempotency-Key` |
| Metrics sync (one batch, all campaigns) | GitHub Actions `schedule` → direct Neon/API calls | `(campaign_id, channel, day)` upsert |
| Invoice dunning / reminders | Workflow | `dunning:{invoice_id}:{step}` |
| Asset verification (HEAD size/type, checksum, quota) | Inline in `/api/uploads/complete` | `asset:{version_id}` (unique index) |

**Metrics fan-out is the only job that can blow the queue by itself.** The free plan is 10,000 operations/day at
3 operations per message → **3,333 messages/day total**, shared with webhook and email traffic. One message per
campaign **per channel** at 1,000 creators × 3 campaigns × 6 channels = 18,000 messages = **54,000 ops/day**, 5.4×
the cap before a single webhook; the same shape at 10,000 creators is 540,000 ops/day. One message per campaign with
every channel in the payload fixes the shape but not the budget: 1,000 × 3 = 3,000 messages = **9,000 ops/day**,
leaving ~330 messages for webhooks and email — a coincidence, not headroom. So:

- **Primary: a GitHub Actions scheduled workflow, no queue at all.** Actions' own `schedule` starts it; the job
  reads campaigns due for a sync from Neon over HTTP, calls the platform APIs and upserts `metrics_daily`. Actions
  Free includes 2,000 min/mo on private repos — a 10-minute daily job is ~300 min/mo. (A Cloudflare Cron Trigger
  could `repository_dispatch` instead, but it needs a GitHub PAT secret for no gain.) This is what
  `00-decision.md` means by "cron only dispatches; heavy sync runs in GitHub Actions".
- **Fallback inside Workers, low volume only:** one message per campaign per day with every channel in the payload,
  key `metrics:{campaign}:{day}`, upserting `metrics_daily` on `(campaign_id, channel, day)`. Safe while
  campaign-days/day × 3 leaves room; switch to the Actions batch once campaign-days exceed ~500/day (1,500 ops).

**Consumers are at-least-once, so the event row is a state machine — not a claim ticket.** `processed_events`
(`provider`, `event_id`, `state`, `attempts`, `lease_until`, `last_error`) moves `received → processing → done`,
with `failed` after N attempts:

1. `INSERT … ON CONFLICT (provider, event_id) DO NOTHING` with `state='received'`.
2. Claim it:
   `UPDATE … SET state='processing', attempts=attempts+1, lease_until=now()+interval '2 min'
   WHERE state IN ('received','failed') OR (state='processing' AND lease_until < now()) RETURNING *`.
   No row returned → another consumer owns it or it is `done`: **ack, do nothing**.
3. Run the side effects, each idempotent on its own natural key: upsert on `(org_id, provider, provider_ref)`;
   `metrics_daily` on `(campaign_id, channel, day)`; email with `email:{template}:{entity_id}` plus Resend's
   idempotency key; for Paddle, re-read the subscription/invoice and apply the **current** provider state instead of
   applying a delta, so a redelivery or an out-of-order event converges rather than double-applying.
4. `state='done'` only after the last write commits. On error, store `last_error`, return the row to `received`, and
   let the queue retry; after N attempts set `failed`, alert, and stop.

Inserting the id **before** the work is the bug this replaces: a crash between the insert and the side effect looks
exactly like success, the message is acked, and the work is never redone. A lease makes a crashed attempt
reclaimable, which is only safe because every side effect above is repeatable — that condition is the design, not a
detail. Never ack before `done`; never write `done` before the side effect commits. Configure a DLQ and alert on
depth > 0.

**Do not run yet:** a separate queue vendor, a Node worker host, video transcode, or per-event workflows. The
Actions batch owns metrics; Queues own webhooks and email; Workflows handle only flows with waits.

---

## 5. Redis: what actually needs it

**Nothing at MVP.** Postgres and the runtime already cover every usual Redis job:

| Option | Free tier | Verdict |
| --- | --- | --- |
| **Postgres (Neon)** | Included | Sessions (Better Auth `session`), rate limits (`rateLimit.storage: "database"`), idempotency keys, dashboard rollups — **use** |
| **Workers KV** | 100k reads/day | Public, non-tenant cache only; eventually consistent, no atomic ops — **use sparingly** |
| **Upstash Redis** | 250 MB, 500k commands/mo, 10 GB, no card ([pricing](https://upstash.com/pricing/redis)) | Only for strict cross-region rate limits; one job, not a default cache — **defer** |
| **Cloudflare Rate Limiting binding** | Included on Workers (plan not stated on the docs page) **[INFERENCE]** | Per-location abuse limits; approximate — **use if abuse appears** |

---

## 6. Observability, analytics, flags, support

| Option | Free tier | Card | Why / why not |
| --- | --- | --- | --- |
| **Sentry** | Developer: **1 user, 5k errors/mo, 5 GB logs, 5M spans, 50 replays** ([pricing](https://sentry.io/pricing/)) | No card | **Errors.** `@sentry/cloudflare` instruments Workers; stack traces, release tagging, alerts. 5k errors is enough if noise is filtered |
| **PostHog** | **1M events/mo, 5k replays, 1M flag requests**, 1 project, 1-year retention (replays 1 month); no card, resets monthly ([pricing](https://posthog.com/pricing)) | No card | **Analytics + replays + flags + surveys** in one. Free plan drops events past the cap and flags return quota-limited defaults — set a billing limit and a fallback |
| **Axiom** | Always Free: **500 GB/mo load compute**, 10 GB-hrs query, **25 GB storage, 30-day retention** ([pricing](https://axiom.co/pricing)) | No card | Good searchable logs; redundant with Workers Logs at MVP. Defer |
| **Grafana Cloud** | 10k active series, 14-day retention, no card ([pricing](https://grafana.com/pricing/)) | No card | Infra metrics we do not have yet. Defer |
| **Workers Logs** | **200k events/day, 3-day retention**, both plans ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)) | No card | **Built-in first responder.** `console.log` + request id; 3 days is enough for deploy regressions, not for audit |
| **Feature flags** | PostHog 1M requests/mo | No card | Do not add GrowthBook/LaunchDarkly. Flags: `checkout_live`, `payouts_enabled`, `video_uploads`, `new_dashboard`; default off on quota exhaustion |
| **Support** | Shared inbox (Resend inbound inbox) + in-app `notifications` + PostHog surveys | No card | No helpdesk at MVP. Crisp/Intercom are later; support volume is the signal to buy one |

**Smallest set that catches production failures: Sentry (errors) + PostHog (product + flags + replays) + Workers
Logs (request logs).** Initialise Sentry per request (`Sentry.withSentry`), tag hashed `org_id`/`user_id`, scrub
emails and asset URLs, `tracesSampleRate: 0.05`. Do not buy Axiom or Grafana until they answer a question these
three cannot.

---

## 7. File upload and media

| Option | Free tier | Card | Why / why not |
| --- | --- | --- | --- |
| **Cloudflare R2** | **10 GB-month, 1M Class A, 10M Class B, free egress** ([pricing](https://developers.cloudflare.com/r2/pricing/)) | **Card required to enable** (metered service; free allowance, not a cardless plan) | **Primary.** S3 API, presigned URLs, zero egress. The one card-on-file exception; $0 as long as usage stays under the allowance. **The 10 GB is per account, not per org** — §7.1 derives the org quota and the org ceiling from it |
| **Cloudflare Images** | **5,000 unique transformations/mo** free, including images stored in R2; past the cap the API errors, it does not bill ([pricing](https://developers.cloudflare.com/images/pricing/)) | No card on Free | **Not in the primary path.** 5,000/month ≈ **1,666 assets × 3 sizes**, counted per source+params; pre-generating at upload does not create a new allowance, it just spends the same 5,000 sooner, and the failure mode is missing thumbnails. Server-side derivatives are a deliberate paid step ($0.50/1k transformations) with a two-width cap |
| **Cloudflare Stream** | None; **$5/mo per 1,000 min stored**, $1/1,000 min delivered ([pricing](https://developers.cloudflare.com/stream/pricing/)) | Card | Rejected at launch: monthly minimum, prepaid storage. Defer until video is a paid feature |
| **Mux** | Free: **10 videos stored, 100k delivery min/mo**, on-demand only, no card ([pricing](https://www.mux.com/pricing)) | No card for Free | Demo only (10 videos total). Useful to validate playback UX; not a platform tier |
| **Oracle Always Free + MinIO** | Ampere A1 ~2 OCPU / 12 GB, 200 GB block, no charge ([free tier](https://www.oracle.com/cloud/free/)) | **Card verification** (no charge) | The only path to >5 GB of media without paying for storage: MinIO on one ARM VM behind Cloudflare, 200 GB ⇒ ~4,000 orgs at the 50 MB/org model. One VM to operate, no SLA — a documented fallback, not the default |
| **Neon Object Storage** | **5 GB/project**, S3-style, **sharing Neon's 5 GB egress** ([pricing](https://neon.com/pricing)) | No card | **Rejected as an R2 fallback.** The 5 GB is not a media budget: it is project storage whose reads bill against the database's single egress allowance, with **no CDN**. At 2 MB previews that is ~2,500 assets total — a few hundred orgs, every download competing with DB traffic. The card-free path is **previews-only** (this section's 50 MB/org model); anything larger needs Oracle + MinIO and card verification |
| **Virus scanning** | No free managed scanner | — | Design around it (§7.3) |

### 7.1 Launch-grade upload path

1. Browser calls `/api/uploads/presign` with the campaign id and source file name. The Worker checks membership and
   the org's remaining bytes, builds immutable keys `org/{org_id}/campaign/{campaign_id}/{uuid}/{width}.webp`
   (one object per derivative), and returns **three 15-minute PUTs** (one for a PDF), each signed for exactly one key
   and the `Content-Type` it will carry.
2. Browser generates the 320/768/1600 px derivatives itself (§7.2) and PUTs each **directly to R2** (no Worker body
   streaming, no CPU limit), then calls `/api/uploads/complete` with the key list and the source file's `sha256`.
   The Worker `HEAD`s every object, verifies `Content-Length` against the per-object cap (2 MB image, 5 MB PDF) and
   the `Content-Type` that was signed, records the `ETag`, sums `byte_size` into the org quota, and writes
   `deliverable_versions`.
3. Downloads use a 5-minute signed GET (public bucket only for non-sensitive thumbnails). Never expose raw keys,
   never make the bucket listable.

**Bucket CORS is part of the upload path, not a footnote.** A presigned `PUT` from `https://app.example.com` to
`https://<account>.r2.cloudflarestorage.com` is cross-origin, and an explicit `Content-Type` is a non-safelisted
header, so the browser sends an `OPTIONS` preflight first. Without a matching rule the upload dies at the preflight
and the console reports a CORS error that reads like a bad signature. The bucket needs:

```json
[{
  "AllowedOrigins": ["https://app.example.com"],
  "AllowedMethods": ["PUT", "GET", "HEAD"],
  "AllowedHeaders": ["content-type"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}]
```

`ETag` must be exposed or the browser cannot read the checksum R2 returns; `x-amz-*` request headers are not needed
because the signature is in the query string. Never use `"*"` for origins — preview deployments get a second explicit
rule (`https://*.preview.example.com`), and the marketing origin gets none. Test it with a real presigned PUT from the
deployed origin before trusting the upload flow; localhost needs its own rule.

**Quota model, derived from R2's 10 GB (per account, not per org).** Store previews, not raw media: **≤2 MB per
derivative, ≤50 MB per org** — roughly 25 derivatives at the cap, i.e. two or three campaigns' worth. Then
10 GB ÷ 50 MB = **200 orgs** is the arithmetic ceiling of the $0 tier; a 100 MB/org quota would halve it to 100 orgs
for no product gain. Backups come out of the same bucket: 42 full dumps (30 daily + 12 monthly, ~200 MB compressed
each ⇒ ~8 GB) would eat almost the whole allowance, so the bucket keeps **7 daily + 4 weekly** (~2 GB) and the monthly
set waits for paid storage. With 2 GB reserved for dumps, the practical ceiling is **~160 orgs**.

- **Previews stay cheap past the ceiling, but not free.** R2 bills $0.015/GB-month: 10k orgs × 50 MB ≈ 500 GB ≈
  **$7.35/mo** (490 GB billable after the allowance). That is the honest price of previews at 10k orgs — a paid
  step, not the free tier.
- **Raw media at 10k orgs is impossible for $0.** One 200 MB video per org is 2 TB; 300 MB of raw stills per org is
  3 TB. No free object store pairs that with egress, and R2's own bill for 3 TB is ~$45/mo before operations. So the
  product stores **derivatives only** and links to the source file; the creator remains the system of record.
- Enforcement: quota is summed from `deliverable_versions.byte_size` inside the presign and complete procedures
  (never a client counter), `/complete` rejects the batch that would cross the cap, and presign returns 413 with the
  remaining bytes at ≥100%.

### 7.2 Images and video

- **Derivatives are generated in the browser, not by Cloudflare Images.** OffscreenCanvas downscales to three widths
  (320/768/1600 px, WebP, quality ~0.8) before upload, and each width is its own immutable R2 object. Images' free
  tier is **5,000 unique transformations/month ≈ 1,666 assets × 3 sizes**, counted per source+params — generating at
  upload still spends that same allowance, it only moves the cliff earlier, and past it the API returns errors rather
  than billing. So Images is out of the path; server-side generation is a deliberately paid feature
  ($0.50/1k transformations, two widths) added only if no-JS or PDF-preview uploads appear.
- **No `format=auto`** — that is an Images feature. Store WebP (every target browser accepts it) and keep JPEG only
  for poster frames. Reject animated GIF and SVG.
- Images in: JPEG/PNG/WebP, ≤10 MB at the source, read locally and never uploaded; derivatives ≤2 MB each.
- **PDFs are the one non-image object:** one file per upload, ≤5 MB, signed with `application/pdf`, no derivatives,
  always served as `Content-Disposition: attachment` (briefs, contracts, rate cards).
- **Video is a link plus a poster frame.** The deliverable carries `source_url` (Drive, Frame.io, unlisted YouTube);
  the browser extracts a poster (≤300 KB WebP), and that is the only video byte in R2. Hosted play from R2
  contradicts the 50 MB/org budget — one 40 MB clip would eat 80% of an org — so it waits for Stream or paid R2 and a
  paying client. Adaptive streaming, trimming and 4K are later still.

### 7.3 Virus scanning without a budget

No free managed scanner exists at this scale. Reduce the attack surface instead: magic-byte sniffing on `complete`
(not just `Content-Type`), allowlist JPEG/PNG/WebP/PDF, **reject SVG/HTML/JS/archives and any file whose bytes do not
match its declared JPEG/PNG/WebP/PDF signature**, re-encode in the browser (canvas drops EXIF and embedded payloads)
while assuming a client can bypass that path, serve PDFs with `Content-Disposition: attachment`, cap size, and withhold
new uploads from public delivery until the org is verified. Add ClamAV only when unverified external uploads become a
real flow.

---

## 8. MVP service list and monthly cost

| Service | Plan | Monthly | Card on file | Free limit (the cliff) | First paid step |
| --- | --- | --- | --- | --- | --- |
| Cloudflare Workers (app) | Free | **$0** | No | 100k req/day, 10 ms CPU | Workers Paid $5/mo |
| Neon Postgres | Free | **$0** | No | 1 GB, 100 CU-h | ~$15/mo usage |
| Better Auth | Self-hosted, MIT | **$0** | No | none (code) | none (skip hosted infra) |
| Paddle | Pay-as-you-go | **$0** + 5% + 50¢/txn | No | no monthly minimum | none; fee scales |
| Resend | Free | **$0** | No | 3k/mo, 100/day | Pro $20/mo |
| Cloudflare Queues + Workflows | Free | **$0** | No | 10k ops/day; 3k steps/day | Workers Paid $5/mo |
| Cloudflare R2 | Free allowance | **$0** | **Yes** (to enable) | 10 GB **≈160 preview orgs at 50 MB/org**, 1M A, 10M B | $0.015/GB-mo |
| Cloudflare Images | **Not in the path** (browser-generated derivatives) | **$0** | No | 5k transforms/mo ≈ 1,666 assets × 3 sizes | $0.50/1k transforms |
| Sentry | Developer | **$0** | No | 5k errors/mo, 1 user | Team $26/mo |
| PostHog | Free | **$0** | No | 1M events, 5k replays, 1M flags | PAYG, no minimum |
| Workers Logs | Included | **$0** | No | 200k events/day, 3 days | Workers Paid |
| **Total** | | **$0/mo** | | | |

Excluded: domain (~$10–12/year), Indian CA/tax prep, and transaction fees (only exist when revenue exists). No
listed service has a monthly minimum. **Commercial use:** Better Auth and React Email are MIT; Cloudflare, Neon,
Resend, Sentry, PostHog and Paddle free tiers are production plans with no non-commercial clause; SES and Mux free
tiers are trial/demo-shaped **[INFERENCE]**. Rejected for credit expiry: SES ($200/6 months), Sentry replays (3
months), Mux (10 videos), and every lapsed Student Pack cloud credit (DigitalOcean, per `02-data.md`).

## 9. Defer list

| Defer | Why | Trigger to add |
| --- | --- | --- |
| Redis (Upstash) | Nothing at MVP needs it; Postgres covers sessions, idempotency, rate limits | Strict multi-region rate limits or cache hit-rate problem |
| Dedicated queue vendor (Trigger.dev/Inngest) | Queues + Workflows are free and native | Video transcode, >3.3k msgs/day, or >3k workflow steps/day |
| Video transcode / Stream / Mux paid | $5/mo minimum and no free platform tier | Paying client requires adaptive streaming or >10 demo videos |
| Virus scanning service | No free option; mitigations cover launch | Unverified external uploads become a real flow |
| Log analytics (Axiom) / Grafana Cloud | Workers Logs + Sentry answer launch questions | Need >3-day retention or cross-service queries |
| Feature-flag vendor (GrowthBook/LaunchDarkly) | PostHog flags are free to 1M requests | Experiment volume or SDK needs exceed PostHog |
| WorkOS / SAML SSO | Nobody asks at $0 MRR | An enterprise client makes SSO a contract term |
| Stripe Connect / Billing | Invite-only in India; $2/active account/mo | Invite obtained or offshore entity |
| Dedicated helpdesk | Shared inbox + in-app notifications | >50 support threads/week |

## 10. The five riskiest integration points

1. **Paddle onboarding and India payouts.** Domain review, KYC and the first payout can take weeks; $100 minimum
   and a possible $15 SWIFT fee make small months lumpy. **Mitigate:** apply in week 1; verify bank + Payoneer; run
   a live $1 charge and a payout before onboarding creators; promise no payout date until the first one clears;
   keep Razorpay as the documented fallback. **Watch:** payout status, reserve/clawback notices.
2. **Creator payouts and Indian tax.** Manual payouts create TDS/GST, PAN collection and statement work; there is
   no 1099 safety net. **Mitigate:** `payouts` rows with `provider_ref`, PAN/GSTIN per creator, monthly batched
   NEFT/UPI, a dispute holdback, and a CA-reviewed policy before the first rupee moves. **Watch:** creators crossing
   GST/TDS thresholds, unmatched payouts.
3. **Auth schema mapping and Workers DB access.** The plugin's models must map onto `orgs`/`memberships`/`users`
   without drift (role enum, `status`, invitation ownership), and a module-scope pool silently breaks on Workers.
   **Mitigate:** `nodejs_compat`; Neon HTTP driver for auth **and** app; no module-scope pool; an integration test
   for sign-up → org → invite → accept → impersonate; the §1 mapping reviewed against `02-data.md` (new
   `invitation`, `platform_role`, `email_verified`, `avatar_url`); `authz.ts` rejects non-active memberships.
   **Watch:** schema-check failures after plugin upgrades, `nodejs_compat` removal, mapping drift.
4. **Webhook idempotency and ordering.** Paddle retries and can deliver out of order; Queues is at-least-once; a
   double-processed activation or invoice creates duplicate entitlements. **Mitigate:** `Paddle-Signature`
   verification at the edge (raw body, 5-minute tolerance), the `received → processing → done` state machine with a
   lease from §4 (never "insert the id then work"), unique `processed_events(provider, event_id)`, side effects that
   are upserts on natural keys and re-read the provider's current state, DLQ + replay, and a daily
   Paddle-vs-local reconciliation. **Watch:** DLQ depth, duplicate rate, stale watermark, `failed` rows.
5. **Free-tier cliffs and the R2 card.** Resend's 100/day, Queues' 10k ops/day, Sentry's 5k errors, PostHog's 1M
   events and R2's card-on-file are one spike away from breaking a workflow. **Mitigate:** usage metric at
   70%/90%, Turnstile plus per-email/per-IP send caps so OTP abuse cannot drain Resend, graceful degradation (in-app
   instead of email, drop analytics before auth, fewer preview derivatives), an R2 spending cap with the 50 MB/org
   quota holding the ~160-org ceiling, and an upgrade order: Resend Pro → Workers Paid → Sentry Team.
   **Watch:** sends/day, queue ops, error quota, R2 billing alerts.

## Sources (all checked 2026-11-28)

- Auth: [Better Auth pricing](https://www.better-auth.com/pricing), [Next.js integration](https://www.better-auth.com/docs/integrations/next), [organization plugin](https://www.better-auth.com/docs/plugins/organization), [admin plugin](https://www.better-auth.com/docs/plugins/admin), [Cloudflare guide](https://www.better-auth.com/docs/guides/cloudflare), [rate limiting](https://www.better-auth.com/docs/concepts/rate-limit), [GitHub](https://github.com/better-auth/better-auth); [Auth.js](https://authjs.dev/getting-started/installation), [next-auth npm](https://registry.npmjs.org/next-auth); [Clerk](https://clerk.com/pricing); [Supabase](https://supabase.com/pricing); [WorkOS](https://workos.com/pricing)
- Billing: [Stripe India](https://stripe.com/in/pricing), [Connect pricing](https://stripe.com/connect/pricing), [India invite-only](https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india), [India marketplaces](https://support.stripe.com/questions/stripe-india-support-for-marketplaces); [Paddle pricing](https://www.paddle.com/pricing), [countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle), [payouts](https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid), [chargebacks](https://www.paddle.com/help/manage/risk-prevention/understanding-chargebacks-with-paddle); [Polar](https://polar.sh/#pricing), [supported countries](https://polar.sh/docs/merchant-of-record/supported-countries); [Lemon Squeezy](https://www.lemonsqueezy.com/pricing); [Razorpay](https://razorpay.com/pricing/), [international costs](https://razorpay.com/blog/international-payment-gateway-cost-india/), [Route](https://razorpay.com/route/)
- Email: [Resend](https://resend.com/pricing), [Postmark](https://postmarkapp.com/pricing), [Cloudflare Email Service](https://developers.cloudflare.com/email-service/platform/pricing/), [Turnstile](https://developers.cloudflare.com/turnstile/), [SES](https://aws.amazon.com/ses/pricing/), [React Email](https://github.com/resend/react-email)
- Queues/Redis: [Queues](https://developers.cloudflare.com/queues/platform/pricing/), [Workflows](https://developers.cloudflare.com/workflows/reference/pricing/), [Trigger.dev](https://trigger.dev/pricing), [Inngest](https://www.inngest.com/pricing), [Upstash Redis](https://upstash.com/pricing/redis), [QStash](https://upstash.com/pricing/qstash)
- Observability: [Sentry](https://sentry.io/pricing/), [PostHog](https://posthog.com/pricing), [Axiom](https://axiom.co/pricing), [Grafana Cloud](https://grafana.com/pricing/), [Workers pricing/logs](https://developers.cloudflare.com/workers/platform/pricing/)
- Files: [R2](https://developers.cloudflare.com/r2/pricing/), [Images](https://developers.cloudflare.com/images/pricing/), [Stream](https://developers.cloudflare.com/stream/pricing/), [Mux](https://www.mux.com/pricing), [Oracle Always Free](https://www.oracle.com/cloud/free/), [Neon](https://neon.com/pricing), [Supabase storage](https://supabase.com/pricing)
