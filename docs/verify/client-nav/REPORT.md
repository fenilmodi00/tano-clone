# Client-navigation audit

Run: **2026-11-27T12:08:34.901Z** (finished 12:11:18Z, 163 s) · Base
`http://127.0.0.1:3000` · 1440 × 900 · DPR 1 · `prefers-reduced-motion:
no-preference` · Chromium (Playwright).

Command:

```sh
cd /home/boxd/tano-clone
node scripts/audit-client-nav.mjs --base http://127.0.0.1:3000 \
  --label baseline --json docs/verify/client-nav/baseline.json
```

## Result

| Metric | Result |
|---|---:|
| Routes audited | 44 |
| Passed | 44 |
| Failed | 0 |
| Hidden (no visible first heading and no `.rv-in`) | 0 |
| Back/Forward + direct-load steps | 7 |
| Steps failed | 0 |
| Exit code | 0 |

**Failure list: empty.** At run time the client-side reveal fix was already
present: `src/components/sites/tano/runtime.tsx` (mtime 12:07:09Z, 85 s
before this run started) keys `PageRuntime` by `pathname`, so the page hooks —
including `useReveal` — remount after the router commits a new route. This
baseline therefore measures the fixed tree, not the broken one.

The audit is not vacuously green: `negative-control.json` records a real
client navigation to `/careers` that passes, then the same page with `.rv-in`
removed and the first heading/word opacity forced to 0, which the audit's
predicate rejects. The audit exits 1 whenever any route fails (see
`summary.exitCode` in the JSON).

## Method

For each route, in one reused browser context:

1. Load `/` fresh and wait for hydration, fonts and network quiet.
2. Choose the best real internal anchor for the route: pointer-click it when
   visible/actionable, DOM-click it when it lives in a closed menu, or dispatch
   a click on a temporary anchor when no real link exists on `/`. The
   temporary anchor is inside the document for the dispatch and removed
   immediately; its click bubbles to the delegated `useClientNav` handler.
3. Wait for the expected pathname, then for in-flight requests to go quiet
   (500 ms idle, 8 s cap), fonts, a 1000 ms settle, and scroll to reach the top
   (3 s cap).
4. Assert: pathname, `main` text > 20 chars, first `main h1/h2` opacity > 0 with
   its split words visible (or `.rv-in` present inside `.rv-scope main`), no
   `pageerror`/`console.error`, horizontal overflow ≤ 1 px, `scrollY` ≤ 5.
5. Screenshot the viewport (JPEG) on failure and write the record to JSON.

`/` is audited as the initial load. `/talk-to-us` is audited by direct load:
`useClientNav` deliberately leaves unmodified `/talk-to-us` clicks to the
site-wide drawer (the URL does not change), so there is no client-side anchor
path to that route.

History section: client-push `/guides` → `/case-studies` → `/news`, then two
Back steps, one Forward step, and a direct load of `/news`. Back/Forward assert
path, text, heading/reveal, console errors and overflow; scroll position is
recorded but not asserted because restoring it is browser behaviour. The direct
load also asserts scroll at top.

## Per-route results

`Via`: `anchor` = real internal anchor, pointer click; `anchor-dom` = real
anchor clicked through the DOM (parked in a closed menu); `temp` = temporary
anchor dispatching through `useClientNav`; `direct` = direct load (see above);
`initial` = `/` itself. `H1/RV` is first-heading opacity / `.rv-in` count.

| Route | Result | Via | Main text | H1/RV | scrollY | Overflow | Errors |
|---|---|---|---:|---:|---:|---:|---:|
| `/` | PASS | initial | 10910 | 1 / 5 | 0 | 0 | 0 |
| `/careers` | PASS | anchor | 1276 | 1 / 5 | 0 | 0 | 0 |
| `/careers/product-engineer` | PASS | temp | 4011 | 1 / 3 | 0 | 0 | 0 |
| `/careers/product-security-engineer` | PASS | temp | 5562 | 1 / 5 | 0 | 0 | 0 |
| `/careers/senior-account-manager` | PASS | temp | 9388 | 1 / 5 | 0 | 0 | 0 |
| `/case-studies` | PASS | anchor | 4969 | 1 / 226 | 0 | 0 | 0 |
| `/case-studies/bloom-and-wild` | PASS | anchor | 5585 | 1 / 2 | 0 | 0 | 0 |
| `/case-studies/hellofresh` | PASS | anchor | 2978 | 1 / 2 | 0 | 0 | 0 |
| `/case-studies/papier` | PASS | temp | 5890 | 1 / 2 | 0 | 0 | 0 |
| `/case-studies/skin-and-me` | PASS | anchor | 5857 | 1 / 2 | 0 | 0 | 0 |
| `/compare` | PASS | anchor | 2162 | 1 / 9 | 0 | 0 | 0 |
| `/compare/agentio-vs-tano` | PASS | anchor | 11324 | 1 / 6 | 0 | 0 | 0 |
| `/compare/grin-vs-tano` | PASS | anchor | 13158 | 1 / 8 | 0 | 0 | 0 |
| `/compare/ltk-vs-tano` | PASS | anchor | 16541 | 1 / 9 | 0 | 0 | 0 |
| `/compare/shopmy-vs-tano` | PASS | anchor | 17547 | 1 / 9 | 0 | 0 | 0 |
| `/for-creators` | PASS | anchor | 4456 | 1 / 85 | 0 | 0 | 0 |
| `/guides` | PASS | anchor | 3938 | 1 / 9 | 0 | 0 | 0 |
| `/guides/creator-ads` | PASS | anchor | 11962 | 1 / 5 | 0 | 0 | 0 |
| `/guides/creator-programme-cost` | PASS | anchor | 9226 | 1 / 5 | 0 | 0 | 0 |
| `/guides/influencer-agency-or-platform` | PASS | anchor | 9415 | 1 / 5 | 0 | 0 | 0 |
| `/guides/keep-creators-long-term` | PASS | anchor | 7780 | 1 / 6 | 0 | 0 | 0 |
| `/guides/meta-creator-marketing-hub` | PASS | anchor | 9377 | 1 / 5 | 0 | 0 | 0 |
| `/guides/meta-muse-creator-marketing` | PASS | anchor | 10966 | 1 / 5 | 0 | 0 | 0 |
| `/guides/meta-muse-creators-brief` | PASS | anchor | 9941 | 1 / 5 | 0 | 0 | 0 |
| `/guides/meta-muse-nano-micro-creators` | PASS | anchor | 8097 | 1 / 5 | 0 | 0 | 0 |
| `/guides/outgrown-influencer-agency` | PASS | anchor | 10362 | 1 / 5 | 0 | 0 | 0 |
| `/guides/scale-creator-programme-without-headcount` | PASS | anchor | 6583 | 1 / 6 | 0 | 0 | 0 |
| `/guides/trybe-alternatives` | PASS | anchor | 9572 | 1 / 5 | 0 | 0 | 0 |
| `/guides/ugc-ai-shopping-agents` | PASS | anchor | 8838 | 1 / 5 | 0 | 0 | 0 |
| `/guides/usage-rights-pricing` | PASS | anchor | 9123 | 1 / 6 | 0 | 0 | 0 |
| `/guides/win-on-meta-muse-with-creators` | PASS | anchor | 8441 | 1 / 5 | 0 | 0 | 0 |
| `/news` | PASS | anchor | 399 | 1 / 7 | 0 | 0 | 0 |
| `/news/tano-raises-4m-seed-round` | PASS | anchor-dom | 6522 | 1 / 6 | 0 | 0 | 0 |
| `/playbooks` | PASS | temp | 1489 | 1 / 18 | 0 | 0 | 0 |
| `/playbooks/content-analysis-framework` | PASS | temp | 458 | 1 / 4 | 0 | 0 | 0 |
| `/playbooks/creator-discovery` | PASS | temp | 598 | 1 / 6 | 0 | 0 | 0 |
| `/playbooks/creator-partnership-ads` | PASS | temp | 610 | 1 / 6 | 0 | 0 | 0 |
| `/playbooks/rebriefing` | PASS | temp | 695 | 1 / 6 | 0 | 0 | 0 |
| `/playbooks/self-funding-seeding-affiliate` | PASS | temp | 537 | 1 / 6 | 0 | 0 | 0 |
| `/privacy-policy` | PASS | anchor | 10308 | 1 / 5 | 0 | 0 | 0 |
| `/talk-to-us` | PASS | direct | 270 | 1 / 20 | 0 | 0 | 0 |
| `/use-cases/creative-velocity` | PASS | anchor | 7125 | 1 / 7 | 0 | 0 | 0 |
| `/use-cases/drive-revenue` | PASS | anchor | 6137 | 1 / 6 | 0 | 0 | 0 |
| `/webinars` | PASS | temp | 955 | 1 / 5 | 0 | 0 | 0 |

## History / direct load

| Step | Result | Via | Path | H1 | `.rv-in` | Errors |
|---|---|---|---|---|---:|---:|
| push `/guides` | PASS | anchor | `/guides` | 1 | 9 | 0 |
| push `/case-studies` | PASS | anchor | `/case-studies` | 1 | 2 | 0 |
| push `/news` | PASS | temp-after-anchor | `/news` | 1 | 7 | 0 |
| back to `/case-studies` | PASS | back | `/case-studies` | 1 | 30 | 0 |
| back to `/guides` | PASS | back | `/guides` | 1 | 54 | 0 |
| forward to `/case-studies` | PASS | forward | `/case-studies` | 1 | 30 | 0 |
| direct `/news` | PASS | direct | `/news` | 1 | 7 | 0 |

On the `/news` push the real anchor existed but its navigation did not commit
within the 4 s dev allowance, so the audit retried through the temporary anchor
and recorded `temp-after-anchor`; the path then changed in 183 ms. A separate
probe from `/case-studies` clicked the same footer News anchor and reached
`/news`, so this was a timing allowance in the history replay, not a broken
link. The destination itself is healthy.

## Artifacts

- `docs/verify/client-nav/baseline.json` — machine-readable baseline, all
  metrics, anchors, errors, history, exit code.
- `docs/verify/client-nav/failures/` — empty (no failures).
- `docs/verify/client-nav/negative-control.json` — visibility-predicate proof.

## Limitations

- Desktop only at 1440 × 900. Rerun with `--width`/`--height` for other widths;
  the navigation/reveal contract is width-independent, but layout overflow
  checks are not.
- Console assertions count every `console.error` and `pageerror` emitted during
  the navigation window; none occurred in this run.
- The temporary-anchor path exercises the delegated handler but not the pointer
  hit-test of a real link. Routes with a real anchor were clicked through the
  pointer where actionable (30 of 44); the rest have no link to the route on `/`.
- The audit uses the dev server, where `no-store` and on-demand compilation can
  make timings slower than production; timeouts are generous and every route
  completed in 2.6–4.0 s (mean 3.3 s).
