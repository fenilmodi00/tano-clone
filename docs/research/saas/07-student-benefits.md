# 07 — Student benefits: claim plan for India (2026-11-28)

Constraints: owner is in **India**, has an Indian education email (`.ac.in` / `.edu.in`), a student
ID card, and an active credit card for billing verification. The card may be used for **$0
free tiers**, never for a subscription or a monthly minimum. The product is a **commercial SaaS**,
so every offer is judged on its commercial-use terms, not just its price.

**Verdict:** claim GitHub Education first; it unlocks the offers that actually reduce this stack's
cost (Copilot, Codespaces, Sentry, 1Password, domains). Six offers are worth the setup; the rest are
either study-only, India-ineligible, or not needed.

## 1. Do this today (ordered)

| # | Action | Why |
| --- | --- | --- |
| 1 | Enable TOTP 2FA on GitHub, add the `.ac.in` email under **Settings → Emails**, then apply at `github.com/settings/education/benefits` | GitHub Pro + the Pack; 2FA is mandatory for contributors |
| 2 | Upload **student ID card with a date + enrollment letter/fee receipt** (school name + at least one date) and allow browser location | Indian `.ac.in` is accepted; manual review is the fallback if the domain is unrecognised |
| 3 | After approval, claim **GitHub Pro**, **Copilot Student**, **Codespaces** | 3,000 Actions min/mo, 180 Codespaces core-hours, Copilot completions/chat/agent |
| 4 | Claim **Sentry Education** | 50k errors/mo, 5 GB logs, overage disabled — replaces the 5k Developer tier |
| 5 | Claim **New Relic Student** (500 GB/mo, 3 users) **or** Datadog Pro (10 hosts, 2 years) — pick one | Optional observability; do not run both |
| 6 | Claim **1Password** (2 years, Individual + CLI/SSH) and **Doppler Team** if available | Founder secrets; app secrets belong in Doppler/Cloudflare, not Notion |
| 7 | Claim a domain: **Namecheap `.me` via the Pack (any country)**, or `.TECH` / Name.com | Disable auto-renew immediately; renewal is the first unavoidable annual cost |
| 8 | Use **Figma Starter** (free) or **Penpot** for UI, **Excalidraw** for diagrams, **Notion Education** (solo docs), **Atlassian Free** (Jira/Confluence, 10 users) or **Linear Free** | Commercial-safe design/docs/issues; **do not use Figma Education or Linear Education for the product** |
| 9 | Claim **Zed Pro** (1 year), **Google AI Plus India** (12 months, cancel reminder), **ChatGPT Go India** (12 months) | AI assistance outside Copilot; personal use only, not embedded in the product |
| 10 | Claim **Codecov**, **ConfigCat/DevCycle**, **Termius**, **Polypane**, **Requestly** only when the need appears | Coverage, flags, SSH to Oracle, responsive/a11y checks, network mocking |

StudentOffers.co is the discovery layer: its full directory is available as JSON at
`https://www.studentoffers.co/api/v1/offers` (591 offers, `github_offer` flag, `location`). Always
re-check the vendor page before claiming; the directory is secondary evidence.

## 2. GitHub Education — exact path for an Indian student

| Step | Detail |
| --- | --- |
| Eligibility | 13+, enrolled in a degree/diploma-granting course; school-issued email **and/or** official, dated proof of enrollment |
| Account prep | Add the `.ac.in` address, make it primary if possible, lowercase, no `+` aliasing; enable TOTP |
| Apply | `github.com/settings/education/benefits` → start an application → select school (or "Other") |
| Proof | School ID **with current enrollment date**, class schedule, transcript, or an affiliation/enrollment letter. It must show the school name and at least one date. A bare ID card without a date is weak; pair it with a fee receipt or enrollment letter |
| School not listed | Open a GitHub Education support ticket with the school's full name, website, and email domain. Indian `.ac.in`/`.edu.in` domains are normally recognised; manual review handles the rest |
| Location | Allow browser location verification, or use a phone if prompted |
| Timing | Applications take a few days (longer at semester start); benefits activate within ~72 h after approval; Copilot activation can lag a few days |
| Validity | Student validation lasts **2 years**, then revalidate; one redemption per offer/account |

**GitHub Pro:** unlimited private repos, **3,000 Actions minutes/month**, **180 Codespaces
core-hours + 20 GB storage**, 2 GB Packages, protected branches/CODEOWNERS, Pages in private repos.
**Copilot Student:** unlimited completions, an allowance of GitHub AI Credits, limited chat/agent
with auto-selected models; it **excludes third-party agents** (so it is not an OpenCode/Claude Code
seat). Commercial use is allowed — GitHub's ToS explicitly contemplates output incorporated into
products — but the seat is personal and code review is not included on Student.

## 3. Verified offers worth claiming

### Core / infrastructure

| Offer | What you get | India | Card | Expiry | Commercial verdict | Use |
| --- | --- | --- | --- | --- | --- | --- |
| **GitHub Pro + Copilot Student** | Pro + 80 partner offers; Copilot completions/chat/agent | ✅ `.ac.in` or ID/letter | No | 2 years | No education-only clause; ToS covers output in products | **Yes — core** |
| **Sentry Education** | 50k errors, 5 GB logs, 5M spans, 500 replays, $20 Seer/mo | ✅ | No | 1 year, renewable | Page frames it as "personal projects"; no commercial ban found. Overage disabled, so no bill risk | **Yes, pre-revenue** |
| **New Relic Student** | 500 GB/mo, 3 full users, 10k synthetic checks | ✅ | No | While student, ≤2 years | No commercial restriction found | **Yes** (choose over Datadog) |
| **Datadog Pro (Pack)** | Pro, 10 servers, 2 years (~$3.6k value) | ✅ | [INFERENCE] | 2 years | No restriction found | Claim as backup; don't run both |
| **1Password** | 2 years Individual + CLI/SSH agent/VS Code | ✅ worldwide | No | 2 years, then 50% | Individual only; no team vault | **Yes** (founder secrets) |
| **Doppler Team (Pack)** | Free Team while student | ✅ | No | While student | Verify at claim; designed for app secrets | **Yes** (app secrets) |
| **Heroku (Pack)** | $13/mo credit for 24 months ($312) | ✅ | Yes | 24 months, then billed | No commercial restriction; no rollover | Optional emergency Node host; not our runtime |
| **MongoDB (Pack)** | $50 credit + $150 cert | ✅ | Yes | Code 90 days | Free cluster is dev-scale; credit needs a paid cluster | Skip (Postgres) |
| **Appwrite (Pack)** | Pro until graduation | ✅ | No | Graduation | No restriction found | Skip (not our auth/BaaS) |

### Domains

| Offer | What you get | India | Card | Expiry | Verdict |
| --- | --- | --- | --- | --- | --- |
| **Namecheap `.me`** | 1 year + SSL | ✅ **Pack route works for any country** | [INFERENCE] | Renews ~$24/yr; cancel 30 days before | **Claim**; disable auto-renew |
| **.TECH** | 1 standard .TECH, 1 year | ✅ | [INFERENCE] | Renews at standard rate | Backup |
| **Name.com** | 1 year, 15 TLDs (no .com), SSL/privacy | ⚠️ country not stated | Yes | Disable auto-renew | Backup only |

### Design / docs / project tools

| Offer | What you get | India | Card | Expiry | Commercial verdict | Use |
| --- | --- | --- | --- | --- | --- | --- |
| **Figma Starter** (not Education) | Free plan, unlimited drafts, 3 files in teams | ✅ | No | Free | Paid/Starter plans allow commercial work; Education does not | **Yes** for UI exploration; or Penpot |
| **Figma Education** | Professional plan, 3,000 AI credits/mo | ✅ SheerID | No | 1 year, reapply | **NO.** Figma Support: *"the Figma Education Plan is intended for non-commercial use only… content created using an Education Plan should not be sold or otherwise used for commercial purposes"* | **Study-only**; do not design the SaaS with it |
| **Penpot** | Open-source design/prototyping (MPL-2.0) | ✅ | No | Free | Open-source licence; commercial use allowed | **Yes**; commercial-safe Figma alternative |
| **Excalidraw** | MIT whiteboard/diagrams | ✅ | No | Free (Plus paid) | MIT; commercial use allowed | **Yes** for architecture/flows |
| **Notion Education** | Plus plan, one-member workspace, AI trial | ✅ school email in WHED | No | Annual school-email re-verify | One-member, student-tied; no explicit commercial ban found | **Solo specs/ADRs**; not a team system of record |
| **Atlassian Free** | Jira + Confluence, 10 users | ✅ | No | Free forever at limits | Commercial allowed | **Yes** for issues/team docs |
| **Linear Free** | 250 issues | ✅ | No | Free | Commercial allowed on Free | **Yes** if you outgrow GitHub Projects |
| **Linear Education** | Basic/Business 1 year | ✅ proof of enrollment | No | 1 year | **NO.** *"It isn't available for business or commercial use"* | Study-only |
| **Miro Education** | 2 years, unlimited boards | ✅ institution email + public proof | No | 2 years | Education-use framing; new requests paused | Skip; Excalidraw |
| **Lucid Education** | 2 years, 3 docs/boards | ✅ educational email | No | 2 years | Education-scoped | Skip; Excalidraw |
| **Canva Education** | Free via school | ❌ higher ed ineligible | No | — | *"non-commercial, educational purposes"* | Skip; **Canva Free** for social (asset licences apply) |
| **Framer student** | Free Basic, 1,000 AI credits | ⚠️ new customers | No | 1 year | Free/Basic is personal/non-commercial; Pro is the business plan | Skip for product |
| **Webflow student** | Deprecated 2026-02-28 | — | — | — | — | Skip |

### AI / dev tools

| Offer | What you get | India | Card | Expiry | Commercial verdict | Use |
| --- | --- | --- | --- | --- | --- | --- |
| **Zed Pro** | 1 year, $10/mo AI credits, edit predictions | ✅ worldwide; alternate email verification | No | 1 year | No education-only clause found | **Yes** as a second editor |
| **Google AI Plus (India)** | 12 months, Gemini, 400 GB | ✅ SheerID, 18+ | **Yes — auto-charges after 12 months** | Redeem by 31 Dec 2026 | Individual use only; not embeddable/resellable | **Yes** as personal assistant; set cancel reminder |
| **ChatGPT Go (India)** | 12 months free | ✅ India | No [INFERENCE] | 12 months | General terms; personal use | Optional planning/research |
| **Postman** | Free plan + Student Expert cert | ✅ | No | Cert never expires | No education-only clause | API testing |
| **GitKraken** | 6 months Pro, then 80% off | ✅ | No | 6 months | No education-only clause | Optional GUI |
| **Codecov** | Free for public + private repos | ✅ | No | While student | No restriction found | Coverage gate |
| **ConfigCat / DevCycle** | Pro/Starter 1 year | ✅ | No | 1 year | No restriction found | Feature flags if PostHog flags feel heavy |
| **Termius** | Pro/Team while student | ✅ | No | While student | No restriction found | SSH to Oracle VM |
| **Polypane** | Free 1 year | ✅ | No | 1 year | No restriction found | Responsive/a11y checks |
| **Requestly** | Pro 1 year | ✅ | No | 1 year | No restriction found | Network mocking |
| **Testmail** | Essential plan | ✅ | No | While student | No restriction found | Email testing |

## 4. Do not use for the product

| Offer | Why | What to do instead |
| --- | --- | --- |
| **JetBrains Student Pack** | "Educational licenses can't be used for commercial work"; no JetBrains AI in the pack | VS Code/Neovim/Zed for product code; JetBrains only for coursework |
| **Azure for Students ($100)** | "Expressly for the support of education or teaching, noncommercial research…" and no hosting services for others | Cloudflare/Neon/Oracle free tiers |
| **Perplexity Education Pro** | "Personal, non-commercial use only"; bans commercial exploitation | Don't paste product code/specs; use ChatGPT Go/Google AI Plus personally |
| **GitHub Pages** | Terms forbid using it as free hosting for a commercial SaaS/e-commerce site | Cloudflare Workers static assets for marketing |
| **Google AI Plus / Gemini consumer** | "Individual use only", non-transferable, non-resellable | Use as your assistant; if the product needs AI, call a paid API |
| **Cloudflare Workers Paid student year** | US-only, verified `.edu` billing email | Workers Free; upgrade only at revenue |
| **Cursor student Pro** | Legacy free year ended 2026-06-25; undergrads not eligible | Copilot Student + Zed Pro |
| **OpenAI Codex student credits** | US/Canada only | Copilot Student |
| **Claude student** | No individual plan; campus-wide seats only | Use if your institution is a partner |
| **GitHub Models** | Retired 2026-07-30 | Real provider API |
| **Notion Education as company system of record** | One-member, student-tied, annual re-verify | Keep specs there; product data in Postgres |
| **Figma Education** | Figma Support: *"intended for non-commercial use only… content created using an Education Plan should not be sold or otherwise used for commercial purposes"* | Figma Starter (free) or Penpot for UI |
| **Linear Education** | *"It isn't available for business or commercial use"* | Linear Free (250 issues), GitHub Projects, or Atlassian Free |
| **Canva Education** | Non-commercial and higher-ed ineligible | Canva Free for social/decks (check asset licences) |
| **Miro / Lucid Education** | Education-scoped; Miro is not accepting new education requests | Excalidraw (MIT) for diagrams |
| **Framer student Free/Basic** | Personal/non-commercial; Pro is the business plan | Figma Starter/Penpot or plain HTML/CSS |
| **Google Workspace for Education / Microsoft 365 A1** | Institution-only tenants; A1 retires 2028 | Cloudflare Email/Resend for product mail; personal Google/Microsoft account for docs |

## 5. What this changes in the stack

| Decision | Before | With student benefits |
| --- | --- | --- |
| Error tracking | Sentry Free 5k errors | **Sentry Education 50k**, overage disabled |
| Observability | Sentry + PostHog + Workers Logs | Add **New Relic 500 GB/mo** only if Workers Logs is insufficient; skip Axiom/Datadog |
| Secrets | `.dev.vars` + 1Password notes | **1Password** for founder secrets, **Doppler** for app envs; Cloudflare secrets for runtime |
| GitHub CI | 2,000 min/mo private | **3,000 min/mo** + Codespaces 180 core-h |
| Coding agent | Copilot Free | **Copilot Student** (completions/chat/agent, auto models) + Zed Pro |
| Domain | Buy ~$10–12/yr | **Namecheap `.me` free year** (disable auto-renew) |
| R2 / Oracle | Card required, previously a blocker | Card is available; **R2 10 GB + Oracle verification** now viable |
| Auth | Better Auth self-hosted | Unchanged. Clerk Pro is free while student but caps orgs and locks the model; use only as fallback |
| Billing | Paddle | Unchanged. Stripe's student credit is useless in India (invite-only) |
| Design/docs | Figma free / Notion free | **Figma Starter** or **Penpot** (commercial-safe), **Notion Education** (solo docs), **Atlassian Free** or **Linear Free**; **not** Figma Education / Linear Education |

## 6. Expiry calendar

| When | What lapses |
| --- | --- |
| 30 days | Oracle $300 trial expires (Always Free remains) |
| 90 days | GCP $300 trial; AWS upgrade window closes |
| 6 months | AWS Free plan closes; MongoDB code expires if unapplied |
| 12 months | Azure $100 (if used), Sentry (renew), Namecheap/.TECH/Name.com (paid renewal), Zed, ConfigCat/DevCycle, Polypane, Requestly, Google AI Plus (auto-charge — cancel first) |
| 24 months | GitHub student validation, Heroku credit ends (billed), Datadog Pro, 1Password promo, New Relic |

Set calendar reminders at **month 11** for every 12-month offer, and at **month 23** for the 2-year
ones. Domain auto-renew is the most likely surprise charge.

## 7. Claim tracker

| Offer | Claimed | Date | Expiry | Notes |
| --- | --- | --- | --- | --- |
| GitHub Education / Pro / Copilot | ☐ | | 2 years | Do first |
| Sentry Education | ☐ | | 1 year | 50k errors |
| New Relic Student | ☐ | | ≤2 years | Or Datadog |
| 1Password | ☐ | | 2 years | Individual |
| Doppler Team | ☐ | | student | App secrets |
| Namecheap `.me` | ☐ | | 1 year | Auto-renew off |
| Figma Starter / Penpot | ☐ | | free | Commercial-safe UI |
| Notion Education | ☐ | | yearly | One member |
| Atlassian Free / Linear Free | ☐ | | free | Commercial-safe issues/docs |
| Zed Pro | ☐ | | 1 year | Editor |
| Google AI Plus India | ☐ | | 12 months | Cancel reminder |
| ChatGPT Go India | ☐ | | 12 months | Optional |
| Codecov / ConfigCat / Termius | ☐ | | 1 year | As needed |

## Sources

- GitHub Education: [apply](https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student), [troubleshooting](https://docs.github.com/en/education/about-github-education/github-education-for-students/solving-problems-with-your-github-education-access), [Pack terms](https://docs.github.com/en/education/about-github-education/github-education-for-students/github-terms-and-conditions-for-the-student-developer-pack), [Copilot Student](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students), [plans](https://docs.github.com/en/copilot/get-started/plans)
- Offers: [StudentOffers API](https://www.studentoffers.co/api/v1/offers), [GitHub Pack](https://education.github.com/pack)
- Sentry: [education](https://sentry.io/for/education/) · New Relic: [students](https://newrelic.com/students) · Datadog: [Pack](https://education.github.com/pack) · 1Password: [students](https://1password.com/developers/students) · Doppler: [students](https://www.doppler.com/secretsops-for-students) · Heroku: [students](https://www.heroku.com/github-students/)
- Domains: [Namecheap](https://nc.me/), [.TECH](https://get.tech/github-student-developer-pack), [Name.com](https://www.name.com/partner/github-students)
- Design/docs: [Figma Education (non-commercial)](https://forum.figma.com/report-a-problem-6/licensing-question-about-figma-education-plan-56050), [Figma Starter](https://www.figma.com/pricing/), [Penpot](https://penpot.app/), [Excalidraw](https://excalidraw.com/), [Notion Education](https://www.notion.com/help/notion-for-education), [Linear education (non-commercial)](https://linear.app/docs/billing-and-plans#education-program), [Atlassian Free](https://www.atlassian.com/software/free)
- AI/dev: [Zed education](https://zed.dev/education), [Google AI Plus India](https://one.google.com/intl/en_in/about/articles/google-ai-for-students/), [ChatGPT Go India](https://help.openai.com/en/articles/12739021-chatgpt-go-promotion-india), [Postman](https://www.postman.com/pricing/), [Codecov](https://about.codecov.io/for/education/), [ConfigCat](https://configcat.com/student/), [DevCycle](https://devcycle.com/github-education), [Termius](https://termius.com/education), [Polypane](https://polypane.app/github-students/), [Requestly](https://requestly.io/github-student-pack/), [Testmail](https://testmail.app/github-students)
- Restrictions: [Azure terms](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0170p), [JetBrains FAQ](https://sales.jetbrains.com/hc/en-gb/articles/207241195), [Perplexity ToS](https://www.perplexity.ai/hub/legal/terms-of-service), [GitHub Pages terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features), [Cloudflare Students](https://www.cloudflare.com/students/), [Cursor](https://cursor.com/help/account-and-billing/student-discount), [Stripe India](https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india)
