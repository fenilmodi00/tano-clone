# Tano clone verification baseline

Generated: **2026-11-27T10:07:56.647Z**

Matrix: **44 routes × 1568 / 1440 / 1024 / 390 px**, viewport height **900 px**, DPR 1, `prefers-reduced-motion: no-preference`.

Source: `https://www.tano.ai` (live). Local: `http://127.0.0.1:3000`.
This is a **baseline**, not a pass/fail gate. Motion and video bands are measured but excluded from the strict static percentage.

## Method

- Both sides are captured in a fresh Chromium context at the matrix width, DPR 1, en-GB/Europe-London, full motion.
- The announcement toast and consent card are removed before hydration settles; both are overlays unrelated to the page design. Fonts are awaited, then the whole page is scrolled in viewport steps to trigger lazy media and reveals.
- The page is returned to scrollY 0. Every direct `main` child is classified by sampling DOM changes over 220 ms, running animations and `<video>` presence: **static**, **motion**, or **video**.
- CSS animations inside static bands are paused/rewound; videos are paused at their first frame; motion bands are left intact and marked nondeterministic.
- Full-page PNGs are compared with pixelmatch (threshold 0.1, AA excluded). `static/overall` in the matrix is **static-band diff % / whole-page diff %**. Static bands are the deterministic surface; motion and video bands are reported separately.
- Per band: `pct` compares both sides at the same document Y; `innerPct` compares each band's own crop, so it isolates content differences from vertical shift.

## Matrix

Cell = `static% / overall%`; `Δh`/`Δw` are local-minus-source captured page size in px; `m<N>` means the local side has more missing `<img>` elements than source. `n/a` static means every band on that route/width was motion or video. `static%` can exceed `overall%` because motion and video bands are excluded from the strict static surface. `ERR` means capture/navigation failed.

Capture window: **2026-11-27T09:31:45.949Z** to **2026-11-27T10:07:17.860Z**. Pairs are captured sequentially over this window; the clone was being edited concurrently.

| Route | 1568px | 1440px | 1024px | 390px |
|---|---:|---:|---:|---:|
| `/` | 0.12 / 0.95 | 0.16 / 0.80 | 0.33 / 1.06 | 0.07 / 0.25 |
| `/careers` | 0.21 / 0.27 | 0.23 / 0.23 | 0.22 / 0.41 | 0.54 / 0.54 |
| `/careers/product-engineer` | 0.83 / 1.11 | 0.90 / 0.78 | 0.82 / 0.86 | 1.17 / 1.12 |
| `/careers/product-security-engineer` | 1.13 / 1.84 | 1.23 / 1.09 | 1.39 / 1.56 | 2.28 / 1.94 |
| `/careers/senior-account-manager` | 0.77 / 0.69 | 0.84 / 1.05 | 0.93 / 0.97 | 1.49 / 1.37 |
| `/case-studies` | 0.02 / 7.74 | 0.02 / 7.74 | 0.49 / 6.21 | 0.13 / 5.78 |
| `/case-studies/bloom-and-wild` | 0.32 / 3.87 | 0.35 / 4.21 | 0.29 / 4.13 | n/a / 3.03 |
| `/case-studies/hellofresh` | 0.56 / 3.81 | 0.62 / 4.11 | 0.73 / 3.07 | 2.21 / 2.01 |
| `/case-studies/papier` | 0.35 / 3.86 | 0.39 / 4.13 | 0.32 / 3.86 | n/a / 2.52 |
| `/case-studies/skin-and-me` | 0.35 / 3.08 | 0.38 / 3.43 | 0.46 / 2.48 | 1.01 / 1.91 |
| `/compare` | 1.92 / 1.24 | 2.09 / 0.83 | 2.59 / 1.11 | 4.43 / 1.94 |
| `/compare/agentio-vs-tano` | 0.44 / 0.48 | 0.47 / 0.43 | 0.34 / 0.48 | 0.79 / 0.75 |
| `/compare/grin-vs-tano` | 0.22 / 0.24 | 0.23 / 0.26 | 0.14 / 0.25 | 0.30 / 0.47 |
| `/compare/ltk-vs-tano` | 0.44 / 0.43 | 0.48 / 0.44 | 0.43 / 0.50 | 0.94 / 0.88 |
| `/compare/shopmy-vs-tano` | 0.35 / 0.33 | 0.38 / 0.40 | 0.34 / 0.39 | 0.73 / 0.77 |
| `/for-creators` | 7.95 / 11.47 | 7.70 / 10.66 | 8.25 / 10.64 | 6.34 / 7.92 |
| `/guides` | 1.42 / 0.99 | 1.54 / 1.11 | 2.02 / 1.40 | 3.77 / 2.53 |
| `/guides/creator-ads` | 0.69 / 0.78 | 0.75 / 0.69 | 0.82 / 0.77 | 1.87 / 1.59 |
| `/guides/creator-programme-cost` | 0.38 / 0.39 | 0.42 / 0.58 | 0.36 / 0.53 | 0.80 / 0.78 |
| `/guides/influencer-agency-or-platform` | 0.39 / 0.40 | 1.78 / 1.42 | 0.32 / 0.41 | 0.79 / 0.77 |
| `/guides/keep-creators-long-term` | 0.39 / 0.36 | 0.42 / 0.39 | 0.37 / 0.45 | 0.88 / 0.83 |
| `/guides/meta-creator-marketing-hub` | 0.26 / 0.37 | 0.28 / 0.30 | 0.13 / 0.26 | 0.32 / 0.44 |
| `/guides/meta-muse-creator-marketing` | 0.28 / 0.33 | 0.30 / 0.32 | 0.23 / 0.33 | 0.52 / 0.58 |
| `/guides/meta-muse-creators-brief` | 0.38 / 0.37 | 0.41 / 0.44 | 0.35 / 0.41 | 0.84 / 0.81 |
| `/guides/meta-muse-nano-micro-creators` | 0.26 / 0.38 | 0.28 / 0.31 | 0.19 / 0.75 | 0.45 / 0.53 |
| `/guides/outgrown-influencer-agency` | 0.45 / 0.42 | 0.49 / 0.45 | 0.44 / 0.48 | 0.98 / 0.91 |
| `/guides/scale-creator-programme-without-headcount` | 0.49 / 0.46 | 0.53 / 0.46 | 0.37 / 0.46 | 0.87 / 0.81 |
| `/guides/trybe-alternatives` | 0.24 / 0.29 | 0.27 / 0.30 | 0.13 / 0.28 | 0.30 / 0.44 |
| `/guides/ugc-ai-shopping-agents` | 0.40 / 0.40 | 0.44 / 0.41 | 0.35 / 0.39 | 0.83 / 0.81 |
| `/guides/usage-rights-pricing` | 0.49 / 0.46 | 0.54 / 0.48 | 0.45 / 0.51 | 1.08 / 0.99 |
| `/guides/win-on-meta-muse-with-creators` | 0.30 / 0.36 | 0.33 / 0.35 | 0.24 / 0.39 | 0.57 / 0.63 |
| `/news` | 1.82 / 1.16 | 1.98 / 1.06 | 1.63 / 0.97 | 0.17 / 0.70 |
| `/news/tano-raises-4m-seed-round` | 0.08 / 0.18 | 0.08 / 0.37 | 0.12 / 0.29 | 0.29 / 0.38 |
| `/playbooks` | 1.29 / 0.54 | 1.41 / 0.64 | 1.68 / 1.02 | 3.02 / 1.47 |
| `/playbooks/content-analysis-framework` | 0.08 / 0.14 | 1.40 / 2.04 (Δh-4) | 1.64 / 2.26 (Δh-4) | 0.32 / 0.48 |
| `/playbooks/creator-discovery` | 0.07 / 0.15 | 1.45 / 1.98 (Δh-4) | 1.72 / 2.29 (Δh-4) | 0.27 / 0.46 |
| `/playbooks/creator-partnership-ads` | 0.05 / 0.13 | 1.38 / 1.87 (Δh-4) | 1.65 / 2.25 (Δh-4) | 0.18 / 0.43 |
| `/playbooks/rebriefing` | 0.13 / 0.17 | 1.44 / 1.88 (Δh-4) | 1.67 / 2.30 (Δh-4) | 0.48 / 0.54 |
| `/playbooks/self-funding-seeding-affiliate` | 0.05 / 0.14 | 1.44 / 2.06 (Δh-4) | 1.73 / 2.28 (Δh-4) | 0.20 / 0.44 |
| `/privacy-policy` | 0.56 / 0.54 | 0.60 / 0.59 | 0.85 / 0.85 | 1.94 / 1.68 |
| `/talk-to-us` | 0.09 / 0.09 | 0.10 / 0.10 | 0.80 / 0.80 | 0.02 / 0.02 |
| `/use-cases/creative-velocity` | 0.36 / 0.36 | 0.42 / 0.40 | 0.27 / 0.35 | 0.11 / 0.28 |
| `/use-cases/drive-revenue` | 0.37 / 0.41 | 0.49 / 0.44 | 0.27 / 0.35 | 0.14 / 0.30 |
| `/webinars` | 0.19 / 0.35 | 0.21 / 0.46 | 0.28 / 0.51 | 0.65 / 0.64 |

Coverage: **176/176** route/width pairs captured; **0** errors; 44 routes.

## Headline

| Metric | Value |
|---|---:|
| Captured pairs | 176 / 176 |
| Median static-band difference | 0.44% |
| Mean static-band difference | 0.86% |
| Median whole-page difference | 0.58% |
| Pairs with static < 1% | 133 |
| Pairs with static 1–5% | 37 |
| Pairs with static ≥ 5% | 4 |
| Pairs with a document-height delta | 10 |
| Routes with more local missing images | 0 |
| Missing images (local) | 0 |
| Missing images (source) | 0 |

### Per-width averages

| Width | Pairs | Mean static | Median static | Mean overall |
|---:|---:|---:|---:|---:|
| 1568 | 44 | 0.63% | 0.37% | 1.19% |
| 1440 | 44 | 0.86% | 0.48% | 1.42% |
| 1024 | 44 | 0.89% | 0.43% | 1.42% |
| 390 | 44 | 1.07% | 0.79% | 1.24% |

## Worst routes by static-band difference

| # | Route | Width | Static | Overall | Δheight | Worst band |
|---:|---|---:|---:|---:|---:|---|
| 1 | `/for-creators` | 1024 | 8.25% | 10.64% | 0 | section.hp-band.hp-closing-band.hp-cl (36.36%) |
| 2 | `/for-creators` | 1568 | 7.95% | 11.47% | 0 | section.hp-band.hp-closing-band.hp-cl (32.33%) |
| 3 | `/for-creators` | 1440 | 7.70% | 10.66% | 0 | section.hp-band.hp-closing-band.hp-cl (31.31%) |
| 4 | `/for-creators` | 390 | 6.34% | 7.92% | 0 | section.hp-band.hp-closing-band.hp-cl (30.89%) |
| 5 | `/compare` | 390 | 4.43% | 1.94% | 0 | section.hp-band (4.43%) |
| 6 | `/guides` | 390 | 3.77% | 2.53% | 0 | section.hp-band (4.12%) |
| 7 | `/playbooks` | 390 | 3.02% | 1.47% | 0 | section.hp-band.tano (4.83%) |
| 8 | `/compare` | 1024 | 2.59% | 1.11% | 0 | section.hp-band (2.59%) |
| 9 | `/careers/product-security-engineer` | 390 | 2.28% | 1.94% | 0 | section.hp-band (2.41%) |
| 10 | `/case-studies/hellofresh` | 390 | 2.21% | 2.01% | 0 | div.wire-legal-body.wire-study-body (2.21%) |
| 11 | `/compare` | 1440 | 2.09% | 0.83% | 0 | section.hp-band (2.09%) |
| 12 | `/guides` | 1024 | 2.02% | 1.40% | 0 | section.hp-band (2.15%) |
| 13 | `/news` | 1440 | 1.98% | 1.06% | 0 | div (1.98%) |
| 14 | `/privacy-policy` | 390 | 1.94% | 1.68% | 0 | div.wire-legal-body (1.94%) |
| 15 | `/compare` | 1568 | 1.92% | 1.24% | 0 | section.hp-band (1.92%) |

## Worst routes by whole-page difference

| # | Route | Width | Overall | Static | Video |
|---:|---|---:|---:|---:|---:|
| 1 | `/for-creators` | 1568 | 11.47% | 7.95% | n/a |
| 2 | `/for-creators` | 1440 | 10.66% | 7.70% | n/a |
| 3 | `/for-creators` | 1024 | 10.64% | 8.25% | n/a |
| 4 | `/for-creators` | 390 | 7.92% | 6.34% | n/a |
| 5 | `/case-studies` | 1568 | 7.74% | 0.02% | 37.30% |
| 6 | `/case-studies` | 1440 | 7.74% | 0.02% | 37.08% |
| 7 | `/case-studies` | 1024 | 6.21% | 0.49% | 33.26% |
| 8 | `/case-studies` | 390 | 5.78% | 0.13% | 39.22% |
| 9 | `/case-studies/bloom-and-wild` | 1440 | 4.21% | 0.35% | 7.44% |
| 10 | `/case-studies/papier` | 1440 | 4.13% | 0.39% | 7.07% |

## Worst static bands

Only bands classified static. `pct` is same-Y comparison; `innerPct` is each band's own crop. A high `innerPct` with zero `Δtop` is a content difference inside a correctly placed band.

| # | Route | Width | Band | Diff | Inner | Δtop | Δheight |
|---:|---|---:|---|---:|---:|---:|---:|
| 1 | `/for-creators` | 1024 | `section.hp-band.hp-closing-band.hp-cl` | 36.36% | 36.36% | 0 | 0 |
| 2 | `/for-creators` | 1568 | `section.hp-band.hp-closing-band.hp-cl` | 32.33% | 32.33% | 0 | 0 |
| 3 | `/for-creators` | 1440 | `section.hp-band.hp-closing-band.hp-cl` | 31.31% | 31.31% | 0 | 0 |
| 4 | `/for-creators` | 390 | `section.hp-band.hp-closing-band.hp-cl` | 30.89% | 30.89% | 0 | 0 |
| 5 | `/guides/influencer-agency-or-platform` | 1440 | `section.hp-band.hp-brands-band` | 12.12% | 12.12% | 0 | 0 |
| 6 | `/careers/product-engineer` | 1440 | `section.hp-band` | 4.96% | 4.96% | 0 | 0 |
| 7 | `/careers/product-security-engineer` | 1440 | `section.hp-band` | 4.96% | 4.96% | 0 | 0 |
| 8 | `/careers/senior-account-manager` | 1440 | `section.hp-band` | 4.96% | 4.96% | 0 | 0 |
| 9 | `/playbooks` | 390 | `section.hp-band.tano` | 4.83% | 4.83% | 0 | 0 |
| 10 | `/careers/product-engineer` | 1568 | `section.hp-band` | 4.55% | 4.55% | 0 | 0 |
| 11 | `/careers/product-security-engineer` | 1568 | `section.hp-band` | 4.55% | 4.55% | 0 | 0 |
| 12 | `/careers/senior-account-manager` | 1568 | `section.hp-band` | 4.55% | 4.55% | 0 | 0 |
| 13 | `/compare` | 390 | `section.hp-band` | 4.43% | 4.43% | 0 | 0 |
| 14 | `/guides` | 390 | `section.hp-band` | 4.12% | 4.12% | 0 | 0 |
| 15 | `/compare/agentio-vs-tano` | 390 | `section.hp-band` | 3.85% | 3.85% | 0 | 0 |
| 16 | `/guides` | 390 | `section.hp-band` | 3.63% | 3.63% | 0 | 0 |
| 17 | `/guides` | 390 | `section.hp-band` | 3.57% | 3.57% | 0 | 0 |
| 18 | `/compare/ltk-vs-tano` | 390 | `section.hp-band` | 3.40% | 3.40% | 0 | 0 |
| 19 | `/use-cases/drive-revenue` | 390 | `section.hp-band.hp-logo-band` | 2.99% | 2.99% | 0 | 0 |
| 20 | `/playbooks` | 1024 | `section.hp-band.tano` | 2.95% | 2.95% | 0 | 0 |
| 21 | `/playbooks/self-funding-seeding-affiliate` | 1024 | `section.hp-band` | 2.94% | 0.00% | -4 | 0 |
| 22 | `/playbooks/creator-discovery` | 1024 | `section.hp-band` | 2.86% | 0.00% | -4 | 0 |
| 23 | `/` | 1024 | `section.hp-band` | 2.76% | 2.76% | 0 | 0 |
| 24 | `/` | 1024 | `section.hp-band.hp-logo-band` | 2.74% | 2.74% | 0 | 0 |
| 25 | `/playbooks/creator-partnership-ads` | 1024 | `section.hp-band` | 2.73% | 0.00% | -4 | 0 |

## Nondeterministic bands (excluded from static score)

Motion/video bands are diagnostic only. Video bands are frozen at the first frame; marquees, reels, counters and scroll-driven decks retain their own phase.

| # | Route | Width | Band | Kind | Diff | Δtop |
|---:|---|---:|---|---|---:|---:|
| 1 | `/case-studies` | 390 | `section.hp-band.wire-films-band` | video | 39.22% | 0 |
| 2 | `/case-studies` | 1568 | `section.hp-band.wire-films-band` | video | 37.30% | 0 |
| 3 | `/case-studies` | 1440 | `section.hp-band.wire-films-band` | video | 37.08% | 0 |
| 4 | `/case-studies/skin-and-me` | 1440 | `section.wire-study-films` | video | 34.22% | 0 |
| 5 | `/case-studies` | 1024 | `section.hp-band.wire-films-band` | video | 33.26% | 0 |
| 6 | `/case-studies/papier` | 1440 | `section.wire-study-films` | video | 33.04% | 0 |
| 7 | `/case-studies/hellofresh` | 1440 | `section.wire-study-films` | video | 31.89% | 0 |
| 8 | `/case-studies/skin-and-me` | 1568 | `section.wire-study-films` | video | 31.43% | 0 |
| 9 | `/case-studies/bloom-and-wild` | 1440 | `section.wire-study-films` | video | 30.71% | 0 |
| 10 | `/case-studies/papier` | 1568 | `section.wire-study-films` | video | 30.34% | 0 |
| 11 | `/case-studies/hellofresh` | 1568 | `section.wire-study-films` | video | 29.28% | 0 |
| 12 | `/case-studies/skin-and-me` | 1024 | `section.wire-study-films` | video | 28.26% | 0 |
| 13 | `/case-studies/bloom-and-wild` | 1568 | `section.wire-study-films` | video | 28.21% | 0 |
| 14 | `/case-studies/papier` | 1024 | `section.wire-study-films` | video | 27.27% | 0 |
| 15 | `/case-studies/hellofresh` | 1024 | `section.wire-study-films` | video | 26.44% | 0 |

## Geometry differences

| Route | Width | Δheight | Δwidth | Δsections | Max section shift |
|---|---:|---:|---:|---:|---:|
| `/playbooks/content-analysis-framework` | 1440 | -4 | 0 | 0 | 4px |
| `/playbooks/creator-discovery` | 1440 | -4 | 0 | 0 | 4px |
| `/playbooks/creator-partnership-ads` | 1440 | -4 | 0 | 0 | 4px |
| `/playbooks/rebriefing` | 1440 | -4 | 0 | 0 | 4px |
| `/playbooks/self-funding-seeding-affiliate` | 1440 | -4 | 0 | 0 | 4px |
| `/playbooks/content-analysis-framework` | 1024 | -4 | 0 | 0 | 4px |
| `/playbooks/creator-discovery` | 1024 | -4 | 0 | 0 | 4px |
| `/playbooks/creator-partnership-ads` | 1024 | -4 | 0 | 0 | 4px |
| `/playbooks/rebriefing` | 1024 | -4 | 0 | 0 | 4px |
| `/playbooks/self-funding-seeding-affiliate` | 1024 | -4 | 0 | 0 | 4px |

## Motion scenes

`compare-motion.mjs` output: minimum frame diff within ±400 ms and the median of each local frame's best match. Timing divergence is local minus source at the first observable signal. When content is visually identical across the whole window, the reported best Δt is only the nearest sample, not a latency estimate.

| Scene | Width | Best diff | Median | Best Δt | Timing divergence |
|---|---:|---:|---:|---:|---|
| hero-campaign | 390 | 5.99% | 6.60% | -20 ms | — |
| counters | 1568 | 4.93% | 5.09% | -226 ms | counterChangeMs +750ms; marqueeSpeedPxPerSec -1ms |
| experiments | 1568 | 0.01% | 0.04% | 18 ms | roundChangeMs -2ms; cacChangeMs 0ms |
| ground-theme | 1568 | 0.16% | 0.16% | -9 ms | toneFlipMs -18ms |
| hero-campaign | 1568 | 0.02% | 0.31% | 95 ms | scoreChangeMs -97ms; turn2Ms +458ms; turn3Ms -97ms; metricSwitchMs -99ms |
| marquee | 1568 | 0.73% | 1.63% | 14 ms | marqueeSpeedPxPerSec 0ms |

## Artifacts

- Per route/width: `docs/verify/<slug>/<width>.json` and `<width>-diff.png` (pink = differing pixels).
- Aggregate: `docs/verify/summary.json`.
- Motion: `docs/verify/motion/<scene>-<width>.json` plus `-best*.png`.

## Reproduce

```bash
cd /home/boxd/tano-clone
node scripts/verify-all.mjs --widths 1568,1440,1024,390 --concurrency 3
node scripts/compare-motion.mjs --scene all --width 1568
node scripts/verify-all.mjs --report-only
```

Single route/width:

```bash
node scripts/compare-route.mjs --route /case-studies --width 1440 --scroll 0
node scripts/compare-motion.mjs --scene hero-campaign --width 1568
```

## Known caveats

- Counters use wall-clock extrapolated values and random 1.6 s ticks; the hero strip and live counters cannot match numerically between runs.
- The live source and the clone both rotate reels/marquees. Motion is compared by sliding ±400 ms, not by exact frame equality.
- Video assets are frozen at their first frame; different encodings or placeholder films still show large per-band differences and are marked `video`, never counted as static failures.
- The clone is a moving target while other workstreams edit it. The report is the baseline for the commit/state captured above.
