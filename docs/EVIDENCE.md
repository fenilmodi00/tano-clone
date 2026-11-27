# Evidence and asset retention

The clone needs frozen source evidence for capture regeneration and visual verification, but the
runtime does not. Keep the working tree reproducible without shipping gigabytes in git.

## Tracked

- `docs/*.md`, `docs/coordination/*.md`, `docs/design-references/`.
- `docs/research/tano/routes.json` and `docs/research/tano/asset-map.json`.
- `docs/research/tano/**/page.html` and `page.json` (44 routes; the regeneration inputs).
- `docs/verify/client-nav/baseline.json` (navigation gate baseline).
- Runtime assets under `public/sites/tano/` and `public/brand-mark/` that are referenced by
  `src/`, plus the three brand fonts.

## Untracked (local working tree)

- All research/verification/coordination PNG/JPG screenshots (`docs/research/**`, `docs/verify/**`,
  `docs/coordination/**`).
- Research JSON other than `page.json`, `routes.json`, `asset-map.json`.
- Verification JSON other than the client-nav baseline.
- `.archive/` — unreferenced captured assets moved out of `public/` (gitignored, not deployed).

These paths are listed in `.gitignore`; `git rm --cached` was used so the files remain on disk.
A fresh clone will not contain them.

## Regenerate

```bash
node scripts/capture-source.mjs            # live source HTML/DOM evidence
node scripts/download-assets.mjs           # mirror referenced assets
node scripts/extract-source-content.mjs    # content JSON
node scripts/generate-route-manifest.mjs   # routes.ts
node scripts/verify-all.mjs --widths 1568  # pixel/geometry reports
```

Capture output defaults to `docs/research` / `docs/verify`; redirect heavy runs to
`.artifacts/` (also gitignored) when they are not needed long-term.

## Deployment

`public/` is copied into the standalone image. Keep it limited to referenced runtime assets;
`.archive/` is excluded by `.dockerignore`. The three long case-study films are the largest
runtime files; move them to object storage/CDN if image size or bandwidth matters.
