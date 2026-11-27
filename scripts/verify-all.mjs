#!/usr/bin/env node
/**
 * Whole-matrix verification: 44 routes x 1568/1440/1024/390.
 *
 *   node scripts/verify-all.mjs
 *   node scripts/verify-all.mjs --widths 1568,390 --concurrency 2
 *   node scripts/verify-all.mjs --report-only
 *
 * Reuses compare-route.mjs (one browser, fresh context per side/route), writes
 * docs/verify/<slug>/<width>.json + diff PNGs, docs/verify/summary.json and
 * docs/verify/REPORT.md. Motion scenes are run separately with
 * compare-motion.mjs; their docs/verify/motion/summary.json is folded into the
 * report when present.
 *
 * Flags: --widths --routes --out --concurrency --resume --report-only --quiet
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compareRoute, launchBrowser, slugFor, DEFAULT_OUT } from "./compare-route.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WIDTHS = [1568, 1440, 1024, 390];
const REPORT_TITLE = "# Tano clone verification baseline";

async function readRoutes() {
  const raw = await fs.readFile("docs/research/tano/routes.json", "utf8");
  return JSON.parse(raw);
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

function pct(value) {
  if (value == null || Number.isNaN(value)) return "n/a";
  return `${value.toFixed(2)}%`;
}

function cell(result) {
  if (!result) return "—";
  if (result.error && !result.diff) return "ERR";
  if (!result.diff) return "ERR";
  const base = `${result.diff.staticPct?.toFixed(2) ?? "n/a"} / ${result.diff.overallPct?.toFixed(2) ?? "n/a"}`;
  const extras = [];
  if (result.diff.heightDelta)
    extras.push(`Δh${result.diff.heightDelta > 0 ? "+" : ""}${result.diff.heightDelta}`);
  if (result.missingImages && result.missingImages.local > result.missingImages.source) {
    extras.push(`m${result.missingImages.local}`);
  }
  if (result.widthDelta) extras.push(`Δw${result.widthDelta > 0 ? "+" : ""}${result.widthDelta}`);
  return extras.length ? `${base} (${extras.join(", ")})` : base;
}

function flattenResults(results) {
  return results.filter((result) => result?.diff);
}

function worstRoutes(results, key, limit = 15) {
  return flattenResults(results)
    .slice()
    .sort((a, b) => (b.diff?.[key] ?? -1) - (a.diff?.[key] ?? -1))
    .slice(0, limit);
}

function worstBands(results, kinds, limit = 25) {
  const rows = [];
  for (const result of flattenResults(results)) {
    for (const band of result.diff.bands ?? []) {
      if (!kinds.includes(band.kind)) continue;
      if (band.pct == null || band.pct < 0.05) continue;
      rows.push({
        route: result.route,
        width: result.width,
        label: band.label,
        kind: band.kind,
        pct: band.pct,
        innerPct: band.innerPct,
        sourceTop: band.source?.top ?? null,
        deltaTop: band.delta?.top ?? null,
        deltaHeight: band.delta?.height ?? null,
      });
    }
  }
  return rows.sort((a, b) => b.pct - a.pct).slice(0, limit);
}

function countByRoute(results, widths) {
  const byRoute = new Map();
  for (const result of results) {
    if (!byRoute.has(result.route)) byRoute.set(result.route, {});
    byRoute.get(result.route)[result.width] = result;
  }
  return byRoute;
}

function missingImageRows(results) {
  return flattenResults(results)
    .filter(
      (result) =>
        (result.missingImages?.local ?? 0) > (result.missingImages?.source ?? 0) ||
        (result.missingImages?.local ?? 0) > 0,
    )
    .map((result) => ({
      route: result.route,
      width: result.width,
      source: result.missingImages?.source ?? 0,
      local: result.missingImages?.local ?? 0,
      missing: (result.local.missingImages ?? []).slice(0, 4).map((img) => img.src),
    }))
    .sort((a, b) => b.local - a.local || b.source - a.source);
}

function geometryRows(results) {
  return flattenResults(results)
    .filter(
      (result) =>
        (result.diff?.heightDelta ?? 0) !== 0 ||
        (result.diff?.widthDelta ?? 0) !== 0 ||
        (result.geometry?.sectionCount?.delta ?? 0) !== 0 ||
        (result.geometry?.maxSectionShiftPx ?? 0) > 0,
    )
    .map((result) => ({
      route: result.route,
      width: result.width,
      heightDelta: result.diff?.heightDelta ?? 0,
      widthDelta: result.diff?.widthDelta ?? 0,
      sectionDelta: result.geometry?.sectionCount?.delta ?? 0,
      maxShift: result.geometry?.maxSectionShiftPx ?? 0,
    }))
    .sort((a, b) => Math.abs(b.heightDelta) + b.maxShift - (Math.abs(a.heightDelta) + a.maxShift));
}

async function buildReport({ results, routes, widths, outDir }) {
  const motionSummaryAll = await readJson(path.resolve(outDir, "motion", "summary.json"));
  const motionSummary = Array.isArray(motionSummaryAll)
    ? motionSummaryAll.filter((item) => widths.includes(item.width))
    : null;
  const byRoute = countByRoute(results, widths);
  const lines = [];
  const stamp = new Date().toISOString();
  const captured = results.filter((result) => result?.diff).length;
  const errors = results.length - captured;

  lines.push(REPORT_TITLE, "");
  lines.push(`Generated: **${stamp}**`);
  lines.push("");
  lines.push(
    `Matrix: **${routes.length} routes × ${widths.join(" / ")} px**, viewport height **${results[0]?.viewportHeight ?? 900} px**, DPR 1, \`prefers-reduced-motion: no-preference\`.`,
  );
  lines.push("");
  lines.push("Source: `https://www.tano.ai` (live). Local: `http://127.0.0.1:3000`.");
  lines.push(
    "This is a **baseline**, not a pass/fail gate. Motion and video bands are measured but excluded from the strict static percentage.",
  );
  lines.push("");
  lines.push("## Method");
  lines.push("");
  lines.push(
    "- Both sides are captured in a fresh Chromium context at the matrix width, DPR 1, en-GB/Europe-London, full motion.",
  );
  lines.push(
    "- The announcement toast and consent card are removed before hydration settles; both are overlays unrelated to the page design. Fonts are awaited, then the whole page is scrolled in viewport steps to trigger lazy media and reveals.",
  );
  lines.push(
    "- The page is returned to scrollY 0. Every direct `main` child is classified by sampling DOM changes over 220 ms, running animations and `<video>` presence: **static**, **motion**, or **video**.",
  );
  lines.push(
    "- CSS animations inside static bands are paused/rewound; videos are paused at their first frame; motion bands are left intact and marked nondeterministic.",
  );
  lines.push(
    "- Full-page PNGs are compared with pixelmatch (threshold 0.1, AA excluded). `static/overall` in the matrix is **static-band diff % / whole-page diff %**. Static bands are the deterministic surface; motion and video bands are reported separately.",
  );
  lines.push(
    "- Per band: `pct` compares both sides at the same document Y; `innerPct` compares each band's own crop, so it isolates content differences from vertical shift.",
  );
  lines.push("");
  lines.push("## Matrix");
  lines.push("");
  lines.push(
    "Cell = `static% / overall%`; `Δh`/`Δw` are local-minus-source captured page size in px; `m<N>` means the local side has more missing `<img>` elements than source. `n/a` static means every band on that route/width was motion or video. `static%` can exceed `overall%` because motion and video bands are excluded from the strict static surface. `ERR` means capture/navigation failed.",
  );
  const captureTimes = results
    .map((result) => result.generatedAt)
    .filter(Boolean)
    .sort();
  if (captureTimes.length) {
    lines.push("");
    lines.push(
      `Capture window: **${captureTimes[0]}** to **${captureTimes[captureTimes.length - 1]}**. Pairs are captured sequentially over this window; the clone was being edited concurrently.`,
    );
  }
  lines.push("");
  lines.push(`| Route | ${widths.map((width) => `${width}px`).join(" | ")} |`);
  lines.push(`|---|${widths.map(() => "---:").join("|")}|`);
  for (const { route } of routes) {
    const row = byRoute.get(route) ?? {};
    lines.push(`| \`${route}\` | ${widths.map((width) => cell(row[width])).join(" | ")} |`);
  }
  lines.push("");
  lines.push(
    `Coverage: **${captured}/${results.length}** route/width pairs captured; **${errors}** errors; ${routes.length} routes.`,
  );
  lines.push("");

  const measured = flattenResults(results);
  const staticValues = measured
    .map((result) => result.diff.staticPct)
    .filter((value) => value != null);
  const overallValues = measured
    .map((result) => result.diff.overallPct)
    .filter((value) => value != null);
  const median = (values) => {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };
  const average = (values) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const under = (threshold) => staticValues.filter((value) => value < threshold).length;
  lines.push("## Headline");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Captured pairs | ${captured} / ${results.length} |`);
  lines.push(`| Median static-band difference | ${pct(median(staticValues))} |`);
  lines.push(`| Mean static-band difference | ${pct(average(staticValues))} |`);
  lines.push(`| Median whole-page difference | ${pct(median(overallValues))} |`);
  lines.push(`| Pairs with static < 1% | ${under(1)} |`);
  lines.push(`| Pairs with static 1–5% | ${under(5) - under(1)} |`);
  lines.push(`| Pairs with static ≥ 5% | ${staticValues.length - under(5)} |`);
  lines.push(
    `| Pairs with a document-height delta | ${measured.filter((result) => (result.geometry?.documentHeight?.delta ?? 0) !== 0).length} |`,
  );
  lines.push(
    `| Routes with more local missing images | ${new Set(missingImageRows(results).map((row) => row.route)).size} |`,
  );
  const missingLocal = measured.reduce(
    (sum, result) => sum + (result.missingImages?.local ?? 0),
    0,
  );
  const missingSource = measured.reduce(
    (sum, result) => sum + (result.missingImages?.source ?? 0),
    0,
  );
  lines.push(`| Missing images (local) | ${missingLocal} |`);
  lines.push(`| Missing images (source) | ${missingSource} |`);
  lines.push("");
  lines.push("### Per-width averages");
  lines.push("");
  lines.push("| Width | Pairs | Mean static | Median static | Mean overall |");
  lines.push("|---:|---:|---:|---:|---:|");
  for (const width of widths) {
    const rows = measured.filter((result) => result.width === width);
    const sv = rows.map((result) => result.diff.staticPct).filter((value) => value != null);
    const ov = rows.map((result) => result.diff.overallPct).filter((value) => value != null);
    lines.push(
      `| ${width} | ${rows.length} | ${pct(average(sv))} | ${pct(median(sv))} | ${pct(average(ov))} |`,
    );
  }
  lines.push("");

  lines.push("## Worst routes by static-band difference");
  lines.push("");
  lines.push("| # | Route | Width | Static | Overall | Δheight | Worst band |");
  lines.push("|---:|---|---:|---:|---:|---:|---|");
  worstRoutes(results, "staticPct", 15).forEach((result, index) => {
    const worst = (result.diff.bands ?? [])
      .filter((band) => band.kind === "static" && band.pct != null)
      .sort((a, b) => b.pct - a.pct)[0];
    lines.push(
      `| ${index + 1} | \`${result.route}\` | ${result.width} | ${pct(result.diff.staticPct)} | ${pct(result.diff.overallPct)} | ${result.diff.heightDelta ?? 0} | ${worst ? `${worst.label} (${pct(worst.pct)})` : "—"} |`,
    );
  });
  lines.push("");

  lines.push("## Worst routes by whole-page difference");
  lines.push("");
  lines.push("| # | Route | Width | Overall | Static | Video |");
  lines.push("|---:|---|---:|---:|---:|---:|");
  worstRoutes(results, "overallPct", 10).forEach((result, index) => {
    lines.push(
      `| ${index + 1} | \`${result.route}\` | ${result.width} | ${pct(result.diff.overallPct)} | ${pct(result.diff.staticPct)} | ${pct(result.diff.videoPct)} |`,
    );
  });
  lines.push("");

  lines.push("## Worst static bands");
  lines.push("");
  lines.push(
    "Only bands classified static. `pct` is same-Y comparison; `innerPct` is each band's own crop. A high `innerPct` with zero `Δtop` is a content difference inside a correctly placed band.",
  );
  lines.push("");
  lines.push("| # | Route | Width | Band | Diff | Inner | Δtop | Δheight |");
  lines.push("|---:|---|---:|---|---:|---:|---:|---:|");
  worstBands(results, ["static"], 25).forEach((band, index) => {
    lines.push(
      `| ${index + 1} | \`${band.route}\` | ${band.width} | \`${band.label}\` | ${pct(band.pct)} | ${band.innerPct == null ? "—" : pct(band.innerPct)} | ${band.deltaTop ?? 0} | ${band.deltaHeight ?? 0} |`,
    );
  });
  lines.push("");

  const motionBands = worstBands(results, ["motion", "video"], 15);
  if (motionBands.length) {
    lines.push("## Nondeterministic bands (excluded from static score)");
    lines.push("");
    lines.push(
      "Motion/video bands are diagnostic only. Video bands are frozen at the first frame; marquees, reels, counters and scroll-driven decks retain their own phase.",
    );
    lines.push("");
    lines.push("| # | Route | Width | Band | Kind | Diff | Δtop |");
    lines.push("|---:|---|---:|---|---|---:|---:|");
    motionBands.forEach((band, index) => {
      lines.push(
        `| ${index + 1} | \`${band.route}\` | ${band.width} | \`${band.label}\` | ${band.kind} | ${pct(band.pct)} | ${band.deltaTop ?? 0} |`,
      );
    });
    lines.push("");
  }

  const geometry = geometryRows(results);
  if (geometry.length) {
    lines.push("## Geometry differences");
    lines.push("");
    lines.push("| Route | Width | Δheight | Δwidth | Δsections | Max section shift |");
    lines.push("|---|---:|---:|---:|---:|---:|");
    geometry.slice(0, 30).forEach((row) => {
      lines.push(
        `| \`${row.route}\` | ${row.width} | ${row.heightDelta} | ${row.widthDelta} | ${row.sectionDelta} | ${row.maxShift}px |`,
      );
    });
    lines.push("");
  }

  const missing = missingImageRows(results);
  if (missing.length) {
    lines.push("## Missing local images");
    lines.push("");
    lines.push("| Route | Width | Source missing | Local missing | Local examples |");
    lines.push("|---|---:|---:|---:|---|");
    missing.slice(0, 30).forEach((row) => {
      lines.push(
        `| \`${row.route}\` | ${row.width} | ${row.source} | ${row.local} | ${row.missing.length ? row.missing.map((src) => `\`${src.replace(/^https?:\/\/[^/]+/, "").slice(0, 80)}\``).join("<br>") : "—"} |`,
      );
    });
    lines.push("");
  }

  if (motionSummary?.length) {
    lines.push("## Motion scenes");
    lines.push("");
    lines.push(
      "`compare-motion.mjs` output: minimum frame diff within ±400 ms and the median of each local frame's best match. Timing divergence is local minus source at the first observable signal. When content is visually identical across the whole window, the reported best Δt is only the nearest sample, not a latency estimate.",
    );
    lines.push("");
    lines.push("| Scene | Width | Best diff | Median | Best Δt | Timing divergence |");
    lines.push("|---|---:|---:|---:|---:|---|");
    for (const item of motionSummary) {
      const div = (item.timingDivergence ?? [])
        .map((entry) => `${entry.signal} ${entry.deltaMs > 0 ? "+" : ""}${entry.deltaMs}ms`)
        .join("; ");
      lines.push(
        `| ${item.scene} | ${item.width} | ${item.best ? pct(item.best.diffPct) : "ERR"} | ${pct(item.medianBestDiffPct)} | ${item.best?.deltaMs ?? "—"} ms | ${div || "—"} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Artifacts");
  lines.push("");
  lines.push(
    "- Per route/width: `docs/verify/<slug>/<width>.json` and `<width>-diff.png` (pink = differing pixels).",
  );
  lines.push("- Aggregate: `docs/verify/summary.json`.");
  lines.push("- Motion: `docs/verify/motion/<scene>-<width>.json` plus `-best*.png`.");
  lines.push("");
  lines.push("## Reproduce");
  lines.push("");
  lines.push("```bash");
  lines.push("cd /home/boxd/tano-clone");
  lines.push("node scripts/verify-all.mjs --widths 1568,1440,1024,390 --concurrency 3");
  lines.push("node scripts/compare-motion.mjs --scene all --width 1568");
  lines.push("node scripts/verify-all.mjs --report-only");
  lines.push("```");
  lines.push("");
  lines.push("Single route/width:");
  lines.push("");
  lines.push("```bash");
  lines.push("node scripts/compare-route.mjs --route /case-studies --width 1440 --scroll 0");
  lines.push("node scripts/compare-motion.mjs --scene hero-campaign --width 1568");
  lines.push("```");
  lines.push("");
  lines.push("## Known caveats");
  lines.push("");
  lines.push(
    "- Counters use wall-clock extrapolated values and random 1.6 s ticks; the hero strip and live counters cannot match numerically between runs.",
  );
  lines.push(
    "- The live source and the clone both rotate reels/marquees. Motion is compared by sliding ±400 ms, not by exact frame equality.",
  );
  lines.push(
    "- Video assets are frozen at their first frame; different encodings or placeholder films still show large per-band differences and are marked `video`, never counted as static failures.",
  );
  lines.push(
    "- The clone is a moving target while other workstreams edit it. The report is the baseline for the commit/state captured above.",
  );
  lines.push("");

  const reportPath = path.resolve(outDir, "REPORT.md");
  await fs.writeFile(reportPath, lines.join("\n"));
  return reportPath;
}

async function writeSummary({ results, routes, widths, outDir }) {
  const summary = {
    generatedAt: new Date().toISOString(),
    viewportHeight: results[0]?.viewportHeight ?? 900,
    widths,
    routeCount: routes.length,
    pairs: results.length,
    captured: results.filter((result) => result?.diff).length,
    errors: results.filter((result) => !result?.diff).length,
    results: results.map((result) => ({
      route: result.route,
      width: result.width,
      capturedAt: result.generatedAt ?? null,
      status: result.source?.status ?? null,
      sourceHeight: result.source?.height ?? null,
      localHeight: result.local?.height ?? null,
      heightDelta: result.diff?.heightDelta ?? null,
      widthDelta: result.diff?.widthDelta ?? null,
      overallPct: result.diff?.overallPct ?? null,
      staticPct: result.diff?.staticPct ?? null,
      motionPct: result.diff?.motionPct ?? null,
      videoPct: result.diff?.videoPct ?? null,
      missingSource: result.missingImages?.source ?? null,
      missingLocal: result.missingImages?.local ?? null,
      sectionDelta: result.geometry?.sectionCount?.delta ?? null,
      maxSectionShiftPx: result.geometry?.maxSectionShiftPx ?? null,
      error: result.diff
        ? null
        : (result.source?.error ?? result.local?.error ?? result.error ?? "capture failed"),
      artifacts: result.artifacts ?? {},
      worstBands: result.diff?.worstBands ?? [],
    })),
  };
  const summaryPath = path.resolve(outDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  return summaryPath;
}

async function loadExisting(resultsPaths) {
  const results = [];
  for (const item of resultsPaths) {
    const json = await readJson(item.file);
    if (json) results.push(json);
  }
  return results;
}

function parseArgs(argv) {
  const options = {
    widths: WIDTHS,
    routes: null,
    outDir: DEFAULT_OUT,
    concurrency: 2,
    resume: false,
    reportOnly: false,
    quiet: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      return argv[i];
    };
    if (arg === "--widths") options.widths = next().split(",").map(Number);
    else if (arg === "--routes")
      options.routes = next()
        .split(",")
        .map((route) => route.trim())
        .filter(Boolean);
    else if (arg === "--out") options.outDir = next();
    else if (arg === "--concurrency") options.concurrency = Math.max(1, Number(next()));
    else if (arg === "--resume") options.resume = true;
    else if (arg === "--report-only") options.reportOnly = true;
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/verify-all.mjs [--widths 1568,1440,1024,390] [--routes /,/careers] [--concurrency 2] [--resume] [--report-only] [--out docs/verify]",
      );
      process.exit(0);
    } else throw new Error(`Unknown flag: ${arg}`);
  }
  if (!options.widths.every((width) => Number.isFinite(width) && width >= 320)) {
    throw new Error("Invalid --widths");
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const allRoutes = await readRoutes();
  const routes = options.routes
    ? allRoutes.filter((item) => options.routes.includes(item.route))
    : allRoutes;
  if (!routes.length) throw new Error("No routes selected");
  const queue = [];
  for (const width of options.widths) {
    for (const { route } of routes) queue.push({ route, width });
  }
  const results = new Array(queue.length);
  const outDir = path.resolve(options.outDir);

  if (!options.reportOnly) {
    const browser = await launchBrowser();
    let next = 0;
    let done = 0;
    const started = Date.now();
    const worker = async (workerId) => {
      while (true) {
        const index = next;
        next += 1;
        if (index >= queue.length) return;
        const { route, width } = queue[index];
        const file = path.join(outDir, slugFor(route), `${width}.json`);
        if (options.resume) {
          const existing = await readJson(file);
          if (existing?.diff) {
            results[index] = existing;
            done += 1;
            if (!options.quiet) console.log(`[${done}/${queue.length}] resume ${route} ${width}`);
            continue;
          }
        }
        let result;
        try {
          result = await compareRoute({
            browser,
            route,
            width,
            scrollY: 0,
            outDir: options.outDir,
            quiet: true,
          });
        } catch (error) {
          result = {
            generatedAt: new Date().toISOString(),
            route,
            slug: slugFor(route),
            width,
            viewportHeight: 900,
            source: { status: 0, error: String(error?.message ?? error) },
            local: { status: 0, error: null },
            diff: null,
            error: String(error?.stack ?? error).slice(0, 2000),
          };
          await fs.mkdir(path.dirname(file), { recursive: true });
          await fs.writeFile(file, JSON.stringify(result, null, 2));
        }
        results[index] = result;
        done += 1;
        if (!options.quiet) {
          const state = result.diff
            ? `static ${result.diff.staticPct}% overall ${result.diff.overallPct}%`
            : "ERROR";
          const elapsed = Math.round((Date.now() - started) / 1000);
          console.log(
            `[${done}/${queue.length}] w${workerId} ${route} ${width}  ${state}  (${elapsed}s)`,
          );
        }
        await sleep(30);
      }
    };
    try {
      await Promise.all(
        Array.from({ length: Math.min(options.concurrency, queue.length) }, (_, index) =>
          worker(index + 1),
        ),
      );
    } finally {
      await browser.close();
    }
  } else {
    const loaded = await loadExisting(
      queue.map(({ route, width }) => ({
        route,
        width,
        file: path.join(outDir, slugFor(route), `${width}.json`),
      })),
    );
    loaded.forEach((result) => {
      const index = queue.findIndex(
        (item) => item.route === result.route && item.width === result.width,
      );
      if (index >= 0) results[index] = result;
    });
    for (let i = 0; i < results.length; i += 1) {
      if (!results[i]) {
        results[i] = {
          route: queue[i].route,
          width: queue[i].width,
          source: { status: 0, error: "no capture" },
          local: { status: 0, error: null },
          diff: null,
        };
      }
    }
  }

  const summaryPath = await writeSummary({ results, routes, widths: options.widths, outDir });
  const reportPath = await buildReport({ results, routes, widths: options.widths, outDir });
  if (!options.quiet) {
    console.log(`summary ${path.relative(process.cwd(), summaryPath)}`);
    console.log(`report  ${path.relative(process.cwd(), reportPath)}`);
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
