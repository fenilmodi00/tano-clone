# ClientNavAudit — site-wide client-navigation regression audit

Scope: verify that every route in `docs/research/tano/routes.json` is visible
after a client-side (App Router) navigation, plus Back/Forward and direct load.
No app file is edited; this workstream owns only the audit script, its output
directory, and this note.

## Files

| File | Purpose |
|---|---|
| `scripts/audit-client-nav.mjs` | Playwright audit; exits 1 on any hidden/broken route |
| `docs/verify/client-nav/baseline.json` | Machine-readable baseline (44 routes + 7 history steps) |
| `docs/verify/client-nav/REPORT.md` | Method, per-route table, failure list, limitations |
| `docs/verify/client-nav/negative-control.json` | Proof the visibility check rejects the pre-fix hidden state |
| `docs/coordination/ClientNavAudit.md` | This note |

## Current state — baseline green

Baseline run **2026-11-27T12:08:34Z**, base `http://127.0.0.1:3000`,
1440 × 900, motion enabled:

- **44/44 routes PASS**, 0 hidden, 0 console/page errors, 0 horizontal overflow,
  0 px overflow, every `scrollY` at 0.
- **7/7 Back/Forward + direct-load steps PASS** (`/guides` → `/case-studies` →
  `/news`, two Backs, one Forward, direct `/news`).
- Exit code **0**.

No failure list exists for this run because the client-side reveal fix was
already live when it started: `src/components/sites/tano/runtime.tsx`
(mtime 12:07:09Z) keys `PageRuntime` by `pathname`, remounting `useReveal` after
each route commit. The audit was validated against the pre-fix state instead:
`negative-control.json` shows a real `/careers` client navigation passing, then
the same page with `.rv-in` removed and heading/word opacity forced to 0 failing
the audit's predicate.

## Rerun after the fix

```sh
cd /home/boxd/tano-clone
node scripts/audit-client-nav.mjs \
  --base http://127.0.0.1:3000 \
  --label after-fix \
  --json docs/verify/client-nav/after-fix.json
```

Exit code 0 = every route and history step passed; 1 = at least one hidden or
broken route (failure screenshots go to `docs/verify/client-nav/failures/`,
names in JSON); 2 = the dev server never answered.

Fast loop while fixing a subset:

```sh
node scripts/audit-client-nav.mjs --only /careers,/guides --no-history
```

Useful flags: `--width`/`--height`, `--settle <ms>`, `--shots <dir>`,
`--timeout <ms>`, `--wait-server <ms>`.

## What the audit asserts

Per route: starts at `/`; clicks a real internal anchor when one exists,
otherwise dispatches a click on a temporary anchor so the delegated
`useClientNav` handler runs (anchor is removed immediately); waits for pathname,
network quiet, fonts, 1 s settle and scroll-top; then checks expected pathname,
`main` text > 20, first `main h1/h2` opacity > 0 with split words visible (or
`.rv-in` > 0 in `main`), no `pageerror`/`console.error`, overflow ≤ 1 px, and
`scrollY` ≤ 5.

`/talk-to-us` is audited by direct load: `useClientNav` deliberately delegates
unmodified `/talk-to-us` clicks to the drawer and leaves the URL unchanged.
History Back/Forward assert visibility/path/content/errors; scroll restoration
is recorded but not asserted.

## Contracts / blockers

- Output JSON shape: `summary` (`total`, `passed`, `failed`, `hidden`,
  `historyTotal`, `historyFailed`, `exitCode`), `routes[]` (checks, metrics,
  via, errors, screenshot), `history[]`.
- Default base is `http://127.0.0.1:3000`; override with `--base`.
- No blockers. Do not serve this audit from port 3100 (stale build).
