# VerifyHarness

Owner: `VerifyHarness`. Report-only workstream: no application files are edited.
Status: harness built; baseline captured 2026-11-27 (`docs/verify/REPORT.md` is the canonical record).

Baseline headline (1568 px, the orchestrator-requested baseline): **44/44** route pairs, **0** errors. Median static-band difference **0.44%**, mean **1.54%**, median whole-page **0.48%**; 31 routes under 1% static, 11 at 1-5%, 2 at >=5%. Missing images: **0** local, **0** source. Six routes have a document-height delta; the largest is `/careers/senior-account-manager` at +64 px. Largest remaining static gaps: `/case-studies` 30.85% (case-card media, `div` band 41.3%), `/for-creators` 8.01% (closing band 32.3% media), `/careers/senior-account-manager` 3.46% (64 px height shift), `/compare` 1.92%, `/news` 1.82%. All other routes are <=1.5% static.

Motion baseline at 1568 (best / median diff; timing divergence local-source): hero campaign **0.02% / 0.31%** (score -97 ms, turn 2 +458 ms, turn 3 -97 ms, metric -99 ms); experiments **0.01% / 0.04%** (round -2 ms, CAC 0 ms); marquee **0.73% / 1.63%** (speed 0 ms); ground theme **0.16% / 0.16%** (tone flip -18 ms); counters **4.93% / 5.09%** (random wall-clock values; tick observation +750 ms; marquee speed -1 ms). Counter values are expected to differ; they are excluded from any pass/fail claim.

## Files

- `scripts/compare-route.mjs` — one route + one width vs the live source. Full-page screenshots after a scroll-through, section geometry, static/motion/video banding, pixelmatch overall + per-band, missing images, diff PNG.
- `scripts/compare-motion.mjs` — named motion scenes on `/`, both sides anchored to the same reset/entry, ±400 ms slide alignment, minimum frame diff, timing signals (hero campaign, counters, experiments, marquee, ground theme).
- `scripts/verify-all.mjs` — 44 routes × 1568/1440/1024/390 matrix, `summary.json`, `REPORT.md`.
- `docs/verify/**` — all outputs. `docs/verify/REPORT.md` and `docs/verify/summary.json` are the headline artifacts.

## Exact commands for the orchestrator

```bash
cd /home/boxd/tano-clone

# Current 1568 baseline (this is what docs/verify/REPORT.md contains)
node scripts/verify-all.mjs --widths 1568 --concurrency 3

# Full 44-route × 4-width matrix (orchestrator's final run)
node scripts/verify-all.mjs --widths 1568,1440,1024,390 --concurrency 3

# Fill only missing/error captures after an interrupted run
node scripts/verify-all.mjs --widths 1568,1440,1024,390 --concurrency 3 --resume

# Motion baseline (already run at 1568; rerun after app changes)
node scripts/compare-motion.mjs --scene all --width 1568

# Regenerate the 1568 REPORT.md from existing JSONs (no browser)
node scripts/verify-all.mjs --widths 1568 --report-only
```

Single-route / single-scene checks:

```bash
node scripts/compare-route.mjs --route /case-studies/papier --width 1440
node scripts/compare-route.mjs --route /careers --width 390 --scroll 0
node scripts/compare-motion.mjs --scene hero-campaign --width 390
```

`compare-route.mjs` also accepts positional `route width`; `--keep-shots` keeps the source/local full-page PNGs (large). `--scroll N` returns to that scrollY before capture. `compare-motion.mjs` supports `--widths 1568,390`, `--window 400`, `--keep-frames`.

## Output contract

```
docs/verify/<slug>/<width>.json      one pair
docs/verify/<slug>/<width>-diff.png  pink = differing pixels
docs/verify/summary.json             matrix rollup
docs/verify/REPORT.md                matrix + worst bands/routes + caveats
docs/verify/motion/<scene>-<width>.json
docs/verify/motion/<scene>-<width>-best{,-source,-local}.png
docs/verify/motion/summary.json      merged across invocations
```

Per-route JSON: `diff.staticPct` (strict deterministic score), `diff.overallPct`, `diff.motionPct`, `diff.videoPct`, `diff.heightDelta`, `diff.bands[]` with `kind`, `pct`, `innerPct`, `delta.{top,height}`, plus `source/local.missingImages[]`, console/bad-response lists, `geometry`, and `artifacts`.

`compare-route.mjs` exports `compareRoute({browser,route,width,...})`, `captureSide`, `diffPages`, `launchBrowser`, `newSideContext`, `scrollThrough`, `installOverlayCleanup`, `pngRGBA`, `cropRGBA`; `verify-all.mjs` uses that shared browser path.

## Method and semantics

- Source origin `https://www.tano.ai`, local `http://127.0.0.1:3000`, viewport height 900, DPR 1, en-GB/Europe-London, no reduced motion.
- Consent cookie (`tano_consent=denied`) is set on the source context; announcement/consent overlays are removed on mount before hydration settles, so both sides share the same layout.
- Fonts awaited; whole page scrolled in viewport steps to trigger lazy images/reveals; then returned to the requested scrollY.
- Bands are direct `main` children. Classification samples DOM text/styles twice (220 ms apart) and running/infinite animations plus `<video>`: `static`, `motion`, `video`.
- CSS animations inside **static** bands are paused/rewound via `document.getAnimations()`; motion bands are left alone and excluded from `staticPct`. Videos are paused at their first frame and reported as `videoPct`, never a static failure.
- Per band `pct` = same document-Y crop; `innerPct` = each band's own crop (isolates content from vertical shift).
- Motion scenes anchor the hero at an actual campaign switch (up to 9 s) so score/chat/metric phases line up; if the clone does not advance, `anchorMode:"timeout"` is recorded. Frames are compared against every frame within ±400 ms using the midpoint of pre/post screenshot timestamps.

## Known caveats (also in REPORT.md)

- Live counters use wall-clock values and random 1.6 s ticks; hero-strip values differ numerically by design. Marquee phase differs; speed is reported separately.
- Video reels are frozen at the first frame; placeholder/local film differences remain large and are labelled `video`.
- The clone is edited concurrently by other workstreams; the baseline is a moving-target record, not a gate.
- Full-page PNGs are ~50–90 MB decoded; keep concurrency ≤3 to stay within memory.

## Blockers

None. If a route fails, its JSON keeps the error and the report records it; rerun with `--resume`.
