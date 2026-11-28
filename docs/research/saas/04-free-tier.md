# 04 — Free tier: what actually runs at $0

> **Superseded in three places by `00-decision.md` after cross-check:**
> **D1 → Neon Postgres** (D1's 100k row writes/day, 500 MB per database and single-threaded DO lose
> to Neon for approvals/audit/metrics workloads); **Clerk → Better Auth** (Clerk Hobby caps 100
> monthly retained orgs, which a creator/client marketplace exceeds early); **Stripe India → Paddle
> deferred** (Stripe is invite-only in India). Read the Verdict and cost-model tables below as the
> pre-cross-check analysis; use `00-decision.md` for stack selection. The Pack offer table, free-limit
> audit, expiry calendar and tax notes remain the reference for those services.

> **Card update (2026-11-28):** the owner now has an active credit card and can add it for
> billing verification. Card-required $0 tiers (R2, Oracle verification, Heroku credit) are usable;
> paid subscriptions and monthly minimums are still out of scope.
>
> **India claim plan:** use `07-student-benefits.md` for the current India-eligible offers and
> commercial-use verdicts. Its verdicts supersede the claim list below (Figma Education, Linear
> Education, JetBrains, Azure and GitHub Pages are not usable for the commercial product).

**Checked 2026-11-28.** Scope: one verified student in India, no spend and **no charge** (card available for verification/free tiers). Every limit was read on the linked live page on that date; projections are marked `[INFERENCE]`. Pack entry point: <https://education.github.com/pack>.

Rule used throughout: a one-time credit is not a free tier. It is listed with its expiry and a fallback, and never counted toward the steady-state $0 claim.

## Verdict

| Layer | Choice | Free ceiling (Nov 2026) | Card? | Why this one |
|---|---|---|---|---|
| Host + API | **Cloudflare Workers Free** | 100k requests/day, 10 ms CPU/invocation, 128 MB; static-asset requests free and unlimited | No | No sleep and no expiry, unlike Render/Railway; matches the vinext/Workers deploy target |
| Database | **Cloudflare D1 Free** | 5M rows read/day, 100k rows written/day, 5 GB total, 10 DBs (500 MB each), 7-day Time Travel | No | Same account, SQL, no pause-on-idle |
| Auth | **Clerk Hobby** | 50k MRU, 100 MROs, 3 dashboard seats, 1-day logs | No | Hosted auth keeps password hashing off the 10 ms Worker CPU budget |
| Files | **Cloudflare R2** | 10 GB-month, 1M Class A, 10M Class B/month, **egress free** | **Yes** — R2 requires a subscription checkout | No egress bill on client asset downloads; 10 GB is enough to ~10k MAU at 0.5 MB/MAU |
| Email | **Resend Free** | 3,000 emails/month, **100/day**, 3 domains, 30-day retention | No | Transactional API + React Email; first real cliff |
| Errors | **Sentry education** (pack) | 50k errors, 5 GB logs, 5M spans, 500 replays, 1 GB attachments, $20 Seer credits | No | 1 year, renewable; falls back to Developer free (5k errors) |
| Analytics | **PostHog Free** | 1M events, 5k recordings, 1M flag requests, 1 project | No | Events reset monthly; events drop at cap, no bill |
| Logs | **Axiom Personal** | 500 GB/month ingest, 10 GB-hrs query, 25 GB storage | No | Free tier is 100× the expected log volume |
| CI | **GitHub Actions (Free)** | **$12/month of compute** (≈2,000 Linux minutes at $0.006/min), 500 MB artifacts, 10 GB cache/repo; public repos free | No | Replaces the old "2,000 minutes" allowance; still plenty |
| Payments | **Stripe India** | No monthly fee; 2% domestic/international; $25 pack credit (one-time) | KYC + Indian bank account | **Superseded — Stripe is invite-only in India; Paddle is the v1 choice (see 00)** |
| Domain | **Namecheap .me** or **.TECH** | 1 year free | Not stated on offer page | One year buys time; renewal is a known future cost |
| UI | **Astryx** (`@astryxdesign/core`) | MIT, self-hosted | No | No per-seat or MAU cost |

**$0 verdict.** The stack is genuinely $0 to **~1,500 MAU**. It reaches **10,000 MAU at $0 only if two budgets are respected**: (a) dynamic Worker requests stay at **≤8 per MAU per day** (82k/day at 10k), and (b) email stays at **≤0.3 per MAU per month** by keeping notifications in-app. Both are architecture decisions, not luck. At 10k the two ceilings sit at 82% (Workers requests) and 84% (D1 writes) — thin but real.

**First paid dollar.** Email. Resend's 3,000/month cap breaks at **~1,500 MAU** at 2 emails/MAU. Cheapest fix is $0 (in-app notifications, email only for resets/invites); if that is not acceptable, Resend Pro is **$20/month**. The next is **Cloudflare Workers Paid at $5/month** once dynamic traffic exceeds 100k/day.

## 1. GitHub Student Developer Pack — offers that exist now

| Offer | What you actually get | Limit / duration | Card | Commercial use | Verdict |
|---|---|---|---|---|---|
| **GitHub Pro** | Pro account while verified | Student validation lasts **2 years**, then revalidate | No | Yes | Claim |
| **GitHub Copilot Student** | Unlimited completions + an allowance of GitHub AI Credits; limited chat/agent, auto model selection only | While verified as a student | No | Yes | Claim |
| **Clerk** | Free Pro plan while a student (Hobby baseline is already 50k MRU) | While a student; 50k MRU/app, 100 MROs | No | Not restricted in offer | Claim |
| **Sentry** | 50k errors, 5 GB logs, 5M spans, 500 replays, 1 GB attachments, $20 Seer credits/month, team features | **1 year, can renew**; on-demand disabled | No | Not expressly restricted | Claim |
| **Stripe** | $25 in credits against Stripe fees | One-time credit; expiry shown in dashboard | KYC + bank account | Yes | Claim |
| **Namecheap** | 1-year `.me` domain + 1-year SSL certificate | 1 year; renews at standard rate | Not stated | Yes | Claim one |
| **.TECH** | One standard `.tech` domain | 1 year; renews at standard rate | Not stated | Yes | Alternative to `.me` |
| **Name.com** | One free domain from selected TLDs (`.live`, `.studio`, `.app`, `.dev`, …) | 1 year | No | Yes | Alternative |
| **1Password** | Free 1Password + Developer Tools | **2 years** | No | Yes | Claim |
| **Notion** | Notion Education plan + extra AI responses | While a student | No | Yes | Claim for specs/docs |
| **Microsoft Azure** | $100 credit + 25+ services | **12 months**, renew annually while a student | **No** | **No** — education/non-commercial only (see §6) | Skip for production |
| **Heroku** | $13/month platform credit | **24 months** ($312 total) | **Yes** — card required (<https://www.heroku.com/github-students/>) | Yes | Skip |
| **MongoDB** | $50 Atlas credits + Compass + certification | Credit expiry shown in Atlas billing | No | Yes | Skip (D1) |
| **JetBrains** | Student Pack (all IDEs) | 1 year, renewable while a student | No | **No** — non-commercial educational only | Skip for this product |
| **Datadog** | Pro account, 10 servers | 2 years | No | Not stated | Skip (Axiom) |
| **New Relic** | Free while a student ($300/month value) | While a student | No | Not stated | Skip (Axiom) |
| **Appwrite** | Education plan, 2 projects | **6 months** | No | Not stated | Skip (lock-in) |
| **SimpleAnalytics** | Starter, 100k pageviews/month | 1 year | No | Not stated | Skip (PostHog) |
| **ConfigCat / DevCycle** | ConfigCat 1,000 flags free; DevCycle 1-year Starter (unlimited seats/flags) | ConfigCat no expiry; DevCycle 1 year | No | Yes | Defer |
| **BrowserStack** | Automate Mobile, 1 parallel, 1 user | 1 year | No | Yes | Defer to mobile QA |

Full offer list and exact wording: <https://education.github.com/pack>. Terms: <https://docs.github.com/en/education/about-github-education/github-education-for-students/github-terms-and-conditions-for-the-student-developer-pack>.

### Commonly cited but no longer available

- **DigitalOcean $200 credit** — left the Pack; offer closed **31 July 2026**, remaining credits expired **1 August 2026** (<https://github.com/github-education-resources/Student-Developer-Pack-Current-Partners-FAQ/blob/main/SDP-changelog.md>). Any 2024–25 guide that assumes this is stale.
- **Canva, Auth0, Linode, CodeSandbox, Replit, Gitpod** — all appear under "Removed" in the same changelog; none is a current offer.
- **AWS Educate** — not listed on the Pack page today, despite older guides.
- **Cloudflare, Vercel, Supabase, Neon, Resend, PostHog, Axiom** — **not** Pack offers; their free tiers are independent and are covered in §2.

## 2. Independent free tiers (the ones the stack depends on)

| Service | Free ceiling (live, 2026-11-28) | Card? | At the cap | Verdict |
|---|---|---|---|---|
| [Cloudflare Workers Free](https://developers.cloudflare.com/workers/platform/limits/) | 100k requests/day, 10 ms CPU, 128 MB, 100 Workers, 5 cron triggers; static assets free/unlimited | No | Request 429 / CPU error 1102 | Primary host |
| [Workers Paid](https://developers.cloudflare.com/workers/platform/pricing/) | $5/month minimum: 10M requests + 30M CPU-ms included, then $0.30/M req, $0.02/M CPU-ms | Yes | Billed | Fallback at ~12.5k MAU |
| [D1 Free](https://developers.cloudflare.com/d1/platform/pricing/) | 5M rows read/day, **100k rows written/day**, 5 GB total, 10 DBs × 500 MB, 7-day Time Travel | No | Queries error; inserts blocked at 5 GB | Primary DB **— superseded by Neon (see 00)** |
| [KV Free](https://developers.cloudflare.com/kv/platform/limits/) | 100k reads/day, **1k writes/day**, 1 GB, 1,000 namespaces | No | 429 | Cache/sessions only — writes are a trap |
| [Queues Free](https://developers.cloudflare.com/queues/platform/pricing/) | 10k operations/day, 24-hour retention, up to 10,000 queues | No | Jobs fail | Optional background work |
| [R2 Free](https://developers.cloudflare.com/r2/pricing/) | 10 GB-month, 1M Class A, 10M Class B, **egress free** | **Yes** — R2 subscription checkout (<https://developers.cloudflare.com/r2/get-started/>) | Billed per GB/ops | Primary file store |
| [Images Free](https://developers.cloudflare.com/images/pricing/) | 5,000 unique transformations/month; **no storage** on Free | No | Error 9422 on new transforms | Only with pre-generated thumbs |
| [Stream](https://developers.cloudflare.com/stream/pricing/) | **No free allowance published**; $5/month per 1,000 minutes stored (prepaid), $1 per 1,000 delivered | Yes | Billed | Skip; video via R2 + signed URLs |
| [Neon Free](https://neon.com/pricing) | 100 CU-hrs/project/month, 1 GB storage/project, 20 GB total, 5 GB egress, 100 projects | No | Compute suspended until next month | Backup Postgres |
| [Supabase Free](https://supabase.com/pricing) | 500 MB DB, 1 GB file storage, 5 GB egress, 50k MAU, **2 active projects** | No | **Pauses after 1 week idle** | Fallback storage only |
| [Upstash Redis Free](https://upstash.com/pricing/redis) | 250 MB, 500k commands/month, 10 GB bandwidth/month, 1 DB | No | Rate-limited | Skip (KV/D1) |
| [Resend Free](https://resend.com/pricing) | 3,000 emails/month, **100/day**, 3 domains, 30-day retention | No | 429 on send | Primary email |
| [Sentry Developer Free](https://sentry.io/pricing/) | 1 user, 5k errors, 5 GB logs, 5M spans, 50 replays, 1 uptime, 1 cron | No | Events dropped | Fallback after student year |
| [PostHog Free](https://posthog.com/pricing) | 1M events, 5k recordings, 1M flag requests, 1 project; events retained 1 year | No | Events dropped; flags quota-limited | Primary analytics |
| [Clerk Hobby](https://clerk.com/pricing) | 50k MRU/app, 100 MROs, 3 seats, 1-day logs | No | Upgrade required after 1-month grace | Primary auth **— superseded by Better Auth (see 00)** |
| [Vercel Hobby](https://vercel.com/pricing) | 100 GB fast transfer, 1M invocations, 4 active CPU-hrs, 360 GB-hrs memory | No | Feature pauses up to 30 days | **Skip** — ToS §4 restricts to personal/non-commercial (<https://vercel.com/legal/terms>) |
| [Fly.io](https://fly.io/docs/about/pricing/) | $1 credit with no card; **$5/month usage once a card is added**; max 3 Machines | Card for the $5 | Machines stop | Fallback host |
| [Render](https://render.com/docs/free) | 750 instance-hours/month; spins down after 15 min; free Postgres **expires 30 days after creation** | No | Suspended | Skip (DB expires) |
| [Railway](https://railway.com/pricing) | $1/month usage credit, 0.5 GB RAM, 0.5 GB volume | No | Services stop | Skip |
| [MongoDB Atlas Free](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) | 0.5 GB data, 3-node replica set, 1 free cluster/project | No | Writes fail at 0.5 GB | Skip (D1) |
| [Axiom Personal](https://axiom.co/pricing) | 500 GB/month ingest, 10 GB-hrs query, 25 GB storage | No | Ingestion stops | Primary logs |
| [Grafana Cloud Free](https://grafana.com/pricing/) | 10k active series, 50 GB logs, 50 GB traces, 3 users, 14-day retention | No | Drop/overage | Optional |
| [GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | **$12/month compute** (≈2,000 Linux min), 500 MB artifacts, 10 GB cache/repo | No | Jobs fail | Primary CI |
| [Better Auth](https://github.com/better-auth/better-auth) | MIT, self-hosted, 30,911 stars | No | n/a | Fallback auth only (see §3) |

**Worker CPU is the hidden gate.** Free Workers get **10 ms CPU per invocation**; a Next.js RSC render or a password hash commonly exceeds it. `[INFERENCE]` Test with `wrangler tail` before committing to Workers Free; if p95 CPU >10 ms, either prerender the shell and keep API handlers thin, or budget the $5 Workers Paid from day one.

## 3. Claim plan

**Claim now (9).** Ordered by leverage per minute of setup.

1. **GitHub Student verification** — unlocks everything; validation lasts 2 years.
2. **GitHub Copilot Student** — the coding agent budget; free while verified.
3. **Clerk** — claim the student Pro plan now; it is the auth layer that keeps hashing off Worker CPU. Even after student status, Hobby keeps 50k MRU.
4. **Sentry education** — 50k errors for a year, renewable; activate before the first deploy so launch bugs are captured.
5. **Stripe** — start KYC early (PAN, business details, Indian bank account); the $25 credit is secondary to having the rail ready.
6. **One domain** — Namecheap `.me` (with SSL) or `.TECH`; pick one, not both. Renewal is the only unavoidable annual cost.
7. **1Password** — 2 years; store Stripe/Cloudflare/Clerk recovery codes.
8. **Notion Education** — specs, ERD, runbooks; avoids a docs subscription.
9. **Resend + PostHog + Axiom** (direct sign-up, no card) — the three free tiers that carry email, analytics, and logs at $0.

**Defer until launch.** R2 paid overage, Resend Pro ($20), Sentry Team ($26), Clerk Pro, Workers Paid ($5), BrowserStack, ConfigCat/DevCycle. None is needed before real traffic.

**Skip entirely.**
- **Azure for Students** — terms limit it to education/non-commercial use; hosting a revenue product on it is a terms violation, not a clever hack.
- **Heroku** — $13/month for 24 months sounds generous but requires a card, is a platform mismatch, and ends with a bill.
- **JetBrains** — student licence is non-commercial educational only; do not write paid-product code under it.
- **Appwrite (6 months)**, **Supabase (pauses after 7 days idle)**, **Render Postgres (expires at 30 days)**, **MongoDB (0.5 GB)**, **Datadog/New Relic (2-year cliffs)** — each adds a migration before the MVP is proven.
- **Vercel Hobby** — free limits are fine, but the ToS restricts Hobby to personal/non-commercial use and allows content to be used for AI training. Wrong tool for client assets.
- **Cloudflare Stream** — no free allowance published; a single 60-minute client video costs $0.30/month stored plus delivery.

## 4. Expiry calendar and fallback

| Asset | Starts | Expires / renews | What happens at expiry | Fallback |
|---|---|---|---|---|
| GitHub student verification | Approval date | **2 years** | GitHub Pro and Copilot Student stop; repos unaffected | Revalidate; keep billing owner on a personal account |
| Copilot Student | Verification | While verified | Copilot reverts to free/paid | $0: use the free tier; paid plan only if needed |
| Clerk student Pro | Claim | While a student | Drops to Hobby (still 50k MRU) | No cliff — Hobby is the plan anyway |
| Sentry education | Claim | **1 year**, renewable | Drops to Developer: 5k errors, 1 user | Keep under 5k errors, or $26/mo Team |
| Stripe $25 credit | Claim | One-time, dashboard shows date | Fees return to 2% | Normal unit economics |
| Azure $100 | Signup | **12 months** | Subscription cancelled; deployments decommissioned after 90 days | Do not host production here |
| Heroku $13/mo | Claim | **24 months** | Card charged at list price | Delete the app |
| MongoDB $50 | Claim | Atlas billing shows date `[INFERENCE: promo credits ~12 months]` | Cluster bills to card | Downgrade to M0 (0.5 GB) |
| Namecheap `.me` | Claim | **1 year** | Renewal at standard `.me` rate | Renew, or move to the `.TECH` year |
| `.TECH` | Claim | **1 year** | Renewal at standard `.tech` rate | Renew only if brand sticks |
| 1Password | Claim | **2 years** | Paid subscription | Free tier / Bitwarden |
| Datadog (if used) | Claim | **2 years** | Pro plan billed | Axiom + Grafana free |
| Notion Education | Claim | While a student | Free plan limits | Export to repo docs |
| JetBrains | Claim | 1 year | Paid | VS Code (free) |
| R2 / Resend / PostHog / Axiom / Sentry Free / Neon | Signup | **No expiry** — monthly reset | Usage caps, not account loss | Paid tier or degrade |

## 5. Cost model to 10k MAU

Assumptions, all `[INFERENCE]` usage projections on top of the live limits above:

- MAU mix: **20% creators, 80% clients**.
- **8 dynamic Worker requests per MAU per day** (creators 25, clients 4). Static assets and cached files are free.
- D1: **200 rows read/day** per MAU and **8.4 rows written/day** weighted (creators 30, clients 3).
- R2: **0.5 MB new storage per MAU per month** (creators upload 2.5 MB; 20% are creators).
- Email: **2 per MAU per month**; PostHog 30 events; Sentry 1 error; Axiom 1 MB logs; Images 0 (thumbnails pre-generated at upload).

| Service | 100 MAU | 1,000 MAU | 10,000 MAU | Binding limit at 10k |
|---|---:|---:|---:|---|
| Cloudflare Workers | $0 | $0 | $0 | 82k / 100k requests/day |
| Cloudflare D1 | $0 | $0 | $0 | 84k / 100k writes/day; 2M / 5M reads/day |
| Cloudflare R2 | $0 | $0 | $0 | 5 GB / 10 GB (card required) |
| Clerk | $0 | $0 | $0 | 10k / 50k MRU |
| Resend | $0 | $0 | **$20** | 20k / 3k emails → Pro 50k |
| Sentry (student year 1) | $0 | $0 | $0 | 10k / 50k errors |
| PostHog | $0 | $0 | $0 | 300k / 1M events |
| Axiom | $0 | $0 | $0 | 10 GB / 500 GB |
| GitHub Actions | $0 | $0 | $0 | ~500 / 2,000 Linux min |
| **Total** | **$0** | **$0** | **$0–$20** | |

**First cliff: Resend at ~1,500 MAU.** 3,000 emails ÷ 2 per MAU = 1,500. Cheapest mitigation is $0: move all notifications in-app, keep email for password resets and invites (≈0.2/MAU → 2,000/month at 10k). If product email is non-negotiable, $20/month buys 50k.

**Second cliff: Workers requests at ~12,500 MAU** (100k/day ÷ 8 per MAU/day). The mitigation is $5/month Workers Paid, which also raises D1 writes to 50M/month and removes the 10 ms CPU ceiling. **At the default RSC traffic profile (~30 requests/MAU/day) the cliff moves to ~3,300 MAU**, and the 10k bill becomes **≈$25.30/month** ($5 Workers + $0.30 CPU overage + $20 Resend).

**Third cliff: D1 writes at ~11,900 MAU.** Writes, not storage, are the constraint. Batch audit-log writes, avoid per-page-view writes, and keep KV out of the write path (1k writes/day free).

**Fourth: Sentry free (after the student year) at 5,000 MAU** at 1 error/MAU. Stay under it by sampling, or $26/month Team.

**Images**: if you use on-the-fly transformations at 2/MAU, the 5k cap hits at **2,500 MAU**; pre-generate 3 sizes at upload and serve from R2 to keep this at $0.

## 6. Student-specific cautions

### 6.1 The Pack is personal, time-boxed, and partner-governed

GitHub's terms state student validation lasts **2 years**, offers may **not be redeemed multiple times**, partners may change or withdraw offers, and the agreement for each third-party product is **between the student and that partner** (<https://docs.github.com/en/education/about-github-education/github-education-for-students/github-terms-and-conditions-for-the-student-developer-pack>). DigitalOcean's July 2026 exit is the proof: a credit can disappear mid-build.

### 6.2 Commercial use is not uniform

| Offer | Commercial use | Evidence |
|---|---|---|
| GitHub Pro / Copilot Student | Allowed | No commercial restriction in Pack terms |
| Clerk / Stripe / MongoDB / Heroku / domains / 1Password / Notion | Allowed (partner terms still apply) | Offer pages state no restriction |
| **Azure for Students** | **Not allowed** — "expressly for the support of education or teaching, noncommercial research, or efforts to design, develop, test, and demonstrate software applications for these purposes" | <https://learn.microsoft.com/en-us/azure/education-hub/azure-dev-tools-teaching/program-faq> |
| **JetBrains Student Pack** | **Not allowed** — "non-commercial, educational purposes only" | <https://www.jetbrains.com/legal/docs/toolbox/license_educational/> |
| Sentry education | Not expressly banned; page frames it as "personal projects" | <https://sentry.io/for/education/> — `[INFERENCE]` move to paid Team once revenue starts |

### 6.3 Tax and payouts (India)

- **GST registration threshold**: ₹20 lakh aggregate turnover for services (₹10 lakh in Manipur, Mizoram, Nagaland, Tripura) — GST Council flyer, <https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Registration_under_GST_Law_new.pdf>.
- **Charging Indian customers**: GST applies at the standard **18%** rate on software/SaaS; price inclusive or add it at checkout. Student status is not a tax exemption. Rate reference: <https://stripe.com/in/resources/more/india-vat-tax>.
- **Foreign clients**: export of services is **zero-rated** under IGST §16(1)(a); file a **LUT** to supply without paying IGST upfront (<https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Zero%20ratings%20of%20suplies.pdf>).
- **Stripe India fees**: **2%** domestic and international; domestic debit MDR **0.4% capped at ₹200** (<https://stripe.com/in/pricing>). Stripe charges **18% GST on its fees** (IGST or CGST+SGST), does not charge GST on card transactions up to **₹2,000**, and pays an additional **2% of the monthly invoice** if you provide a TAN, which you must remit as TDS (<https://support.stripe.com/questions/taxes-on-stripe-fees-for-india-based-businesses>).
- **Payouts**: Stripe India settles to an Indian bank account and Standard Chartered issues a payment/credit advice for export payouts — keep these as your FEMA/FIRC-style proof.
- **Entity**: Stripe onboarding needs PAN, business details, and a bank account; a student sole proprietorship is workable, but confirm current KYC requirements in the dashboard before promising clients a payment date. `[INFERENCE]`

### 6.4 Card and forex reality

- R2, Workers Paid, Fly's $5 tier, Heroku, and Stream all require a payment method. An Indian student without an international credit card is locked out of R2 even though the usage is free.
- Fallback with no card: Supabase Storage (1 GB, pauses after 7 days idle) for small assets; Neon (no card) for Postgres. Neither is a real substitute for R2 at 10 GB.
- USD charges attract bank forex markup plus 18% GST on the markup; `[INFERENCE]` budget 3–5% if a charge ever lands, and prefer services that bill in INR or stay under free caps.

### 6.5 Silent conversion to paid

| Service | Trigger | Charge |
|---|---|---|
| Vercel | 14-day Pro trial ends | Card charged unless cancelled; Hobby itself does not auto-charge but pauses features |
| Upstash | Adding a card | Database **immediately** upgrades to pay-as-you-go |
| Fly.io | Usage above $5/month | Card billed automatically |
| Render | Bandwidth overage | Supplementary bill; free Postgres expires at 30 days |
| Railway | Usage above $1/month | Card billed if on file |
| Heroku | 24-month credit ends | List price |
| Azure | 12 months or $100 exhausted | Subscription cancelled, then data decommissioned in 90 days |
| Clerk | >50k MRU | Upgrade required after a one-month grace period |
| Cloudflare | Enabling Workers Paid / R2 overage | $5 minimum + usage |
| MongoDB | Promo credits expire | Cluster bills unless downgraded to M0 |

Sentry's student plan explicitly disables on-demand, so it cannot bill overage — one of the few safe offers.

## 7. What would change the decision

1. **p95 Worker CPU >10 ms** on the real app → $5/month Workers Paid, or ship a static shell with client-side data fetching. This is the most likely reason the $0 plan fails on day one.
2. **No international card** → R2 is out; use Supabase Storage (1 GB) and Neon, and accept 1 GB asset ceiling until revenue.
3. **Email is core to the product** (client approvals, reminders) → budget $20/month Resend Pro from launch; the 100/day cap is otherwise hit by a single batch.
4. **Clerk changes its 50k MRU free tier** → Better Auth (MIT) on D1, but only after moving to Workers Paid, because password hashing exceeds 10 ms CPU.
5. **Video deliverables** → no free video host in this stack; R2 + signed URLs + native `<video>` keeps egress at $0, Stream does not.
6. **GST registration becomes required** → add 18% to Indian pricing, claim input credit on Stripe fees, and file LUT for exports; the free tier is unaffected but margin is.
7. **A Pack offer is withdrawn** (as DigitalOcean was) → the independent tiers in §2 are the actual plan; the Pack only accelerates setup, it is never load-bearing.
