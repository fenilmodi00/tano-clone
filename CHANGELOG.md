# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Production shell: per-route canonical/OG/Twitter metadata, generated Open Graph image, sitemap, robots, web manifest, branded 404/error/global-error/loading, security headers, font preloads and a no-JS reveal fallback.
- `src/content/tano/routes.ts` generated manifest; `sitemap.ts` is derived from it.
- Shared `TanoButton`, `FaqRow` and `ReelCard` components, plus data-driven `PlaybookPage` (five routes) and `ComparePage` (four routes) templates.
- Static-build assertion, content-manifest check, CI runtime visibility/link/smoke job.
- `docs/ARCHITECTURE.md` and `docs/EVIDENCE.md`.
- Cloudflare Workers deployment through vinext with the Static Assets response cache: every
  route is prerendered at build time, hashed `_next/static` assets skip the Worker, and Worker
  logs/traces are enabled.
- `worker/index.js` returns `206` byte ranges for case-study videos; Workers Static Assets
  otherwise answers `Range` with the full file, which breaks Safari playback.
- `docs/CLOUDFLARE.md` plus the official Cloudflare Next.js and vinext migration skills under
  `.agents/skills/`.
- Shared `useTrackCarousel` hook plus `nav-cartwheel.ts`, which ports the live site's rolling Tano
  mark into the seeded nav square.

### Changed

- All internal links use `next/link`; the custom client-navigation interceptor was removed.
- The content extractor now preserves consecutive `wire-article-quote` blockquotes as typed `quotes` blocks.
- Captured route bodies are formatted, linted, and hand-maintainable instead of one-line generated files.
- CSS was purged by static usage (608 classes, 1,330 rules), split into vendor/runtime layers, and duplicate DOM ids were made unique.
- Root metadata no longer claims canonical `/` for every page.
- Docker builds receive `NEXT_PUBLIC_*` at build time; asset cache policy is split by volatility.
- Evidence captures are untracked from git; tracked docs are ~24 MB.
- `output: "standalone"` is now opt-in through `NEXT_OUTPUT=standalone`; Docker sets it, while
  the Cloudflare/vinext build leaves Vite's output in place.
- The three 1080p case-study films were re-encoded to 720p so each is under the 25 MiB Workers
  Static Assets limit. Originals remain in the gitignored `.archive/`.

### Removed

- Unused scaffold dependencies and files (`@base-ui/react`, `cva`, `clsx`, `tailwind-merge`, `lucide-react`, `shadcn`, `tw-animate-css`, `pngjs`, `ui/button.tsx`, `lib/utils.ts`, `components.json`).
- Template workflows, the `/devtest` route, one-off probe scripts, dead replica/content barrels, and 130 MB of unreferenced public assets (archived locally).

### Fixed

- Client navigation commits every route at the top (`useRouteScrollReset`) instead of inheriting Next's visible-page offset, which could drop a deep-scrolled visitor into the shared footer. The re-introduced document click interceptor and its `data-navigating` footer timers were removed again.
- The root loading fallback covers the viewport, so the footer can no longer flash into view mid-transition and animate the fixed nav away.
- Header dropdowns close on item click and on every committed pathname change; they previously survived navigation because the shell persists.
- The nav arrival animation is marked per document and cannot replay after a route change.
- The use-case pages (`creative-velocity`, `drive-revenue`) now mount the tracking carousel, so
  slides advance on the 5 s beat like the home page.
- The nav intro now measures the expanded bar, expands for the full 1 s travel and settles 1.14 s
  after travel; it previously settled 1.14 s after the drop, cutting the expansion and the
  cartwheel roll short. The seed square shows Tano's cartwheel mark rolling to rest.
- Added `npm run verify:nav` for footer landing, dropdown reset, client-nav, hydration and reveal regressions; the client-nav audits record routes without an in-page anchor as skipped instead of faking a click into a removed interceptor.
- Documented the Cloudflare edge rewriters (Email Address Obfuscation, Rocket Loader) that desync hydration; `email_off` comment markers measurably make it worse and are not used.
- Dev `/_next` responses are now `no-store`. Cloudflare had rewritten the dev server's `no-cache` to a four-hour `max-age`, so an open tab could keep executing a module from an older compile (a missing React import surfaced as `useEffect is not defined` until a hard reload).

## [0.6.2] - 2026-11-25

### Security

- Update Next.js to 16.4.6 and React to 19.3.1, along with the other dependencies, clearing every open `npm audit` and Dependabot advisory, including remote code execution in `next/og`.

### Added

- The README's Star History chart now refreshes daily, in light and dark versions.
- Monthly grouped Dependabot updates for npm packages and GitHub Actions.

### Fixed

- The Docker app container now reports healthy. Its healthcheck used `wget`, which the slim Node image doesn't include.
- The README token badge is counted in CI, so it reflects the current default branch instead of a stale hosted count.

### Removed

- An unused Copilot setup file left over from the earlier multi-platform support.

## [0.6.1] - 2026-10-05

### Changed

- Generalize cloning guidance: treat each observation as a sample of a rule found by varying width, height, input, and state; use the source's actual files; and build shared components from every observed state.

## [0.6.0] - 2026-10-05

### Changed

- Simplify the shared website-cloning workflow, improve responsive and motion guidance, and align the project documentation.

## [0.5.1] - 2026-09-26

### Changed

- Recommend Claude Code with Opus 5.5 in the README
- Refreshed the static Star History chart through September 2026
- Removed a redundant note about editing the canonical skill from the README

### Security

- Update Next.js and eslint-config-next to 16.3.5 with exact version pins, and refresh vulnerable transitive dependencies. Thanks to @atahan150 for the report in [#117](https://github.com/JCodesMore/ai-website-cloner-template/issues/117) and proposed fix in [#118](https://github.com/JCodesMore/ai-website-cloner-template/pull/118).

## [0.5.0] - 2026-09-17

### Added

- Repository ranking badges in the README

### Changed

- Simplified Quick Start with a copyable agent setup prompt, a template button, and one cloning command example
- Consolidated Claude Code, Codex, Cursor, and OpenCode support around one canonical Agent Skill in `.agents/skills/clone-website/`
- Reduced the Claude Code integration to a thin command bridge that forwards arguments to the canonical skill without creating a duplicate skill in other agents
- Moved the website inspection guide into the canonical skill's on-demand references

### Removed

- Expired sponsor integrations
- Japanese and Simplified Chinese READMEs; the English README is the single maintained entry point
- Redundant workflow diagrams from the READMEs
- Generated skill and instruction copies for unsupported or redundant agent platforms
- The agent-rule and skill synchronization scripts and their generated-file CI gate

## [0.4.0] - 2026-08-10

### Added

- Docker workflows for local development and multi-stage production builds
- Kiro support through a generated workspace `/clone-website` skill
- Complete generated workspace skills for Cline and Roo Code, including a Roo slash-command bridge
- Simplified Chinese and Japanese READMEs with the same onboarding and workflow guidance as the English documentation
- Contributor and security policies, including a private vulnerability-reporting path
- CI enforcement that generated agent rules and skills remain synchronized with their source files
- Compact pipeline diagrams and a static Star History chart in every README

### Changed

- Raised the project Node.js baseline to 24 across local development, CI, Docker, and contributor-facing documentation
- Refreshed Next.js to 16.3, React to 19.2.4, and related dependencies
- Updated `/clone-website` so later runs preserve existing pages and isolate routes, research, components, assets, and downloaders for each target
- Improved multi-origin and query/fragment planning with collision-resistant output namespaces and explicit route verification
- Redesigned README onboarding around the template workflow, Opus 5 recommendation, supported platforms, and community links
- Hardened the rule and skill generators for current platform schemas and deterministic output

### Fixed

- Gemini CLI command validation by adding the required name and flattening the prompt schema
- Cline and Roo Code invocation, frontmatter, and argument handling
- Next.js documentation resolution in generated agent rules
- Vulnerable framework dependencies and generated-file consistency checks

### Removed

- Aider from the officially supported-platform list because its current capabilities cannot run the complete browser and subagent workflow reliably; `.aider.conf.yml` remains available for loading general project context

### Security

- Documented responsible vulnerability disclosure through GitHub private vulnerability reporting
- Updated vulnerable dependencies to patched releases

## [0.3.1] - 2026-03-29

### Fixed

- `sync-agent-rules.sh` failing to resolve `@file` imports on Windows due to CRLF line endings — platform instruction files now correctly inline the Inspection Guide content

## [0.3.0] - 2026-03-29

### Added

- Multi-URL support for `/clone-website` — clone multiple sites in a single command with parallel processing and isolated output
- CI quality gates via GitHub Actions — automated lint, typecheck, and build on every push and PR
- `npm run typecheck` and `npm run check` scripts for local quality validation
- `.gitattributes` for cross-platform line ending normalization
- `.nvmrc` to pin Node.js 20 for contributor consistency

### Changed

- Streamlined PR template — removed redundant checklist items and screenshots section
- Improved project description and README — clearer use cases, limitations, and modern wording
- Refined documentation and agent rules across all platforms for clarity and consistency
- Fixed CRLF handling in `sync-skills.mjs` for reliable Windows operation

### Removed

- Outdated use case from README documentation

## [0.2.0] - 2026-03-28

### Added

- Multi-platform AI agent support: Claude Code, Codex CLI, OpenCode, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Cline/Roo Code, Continue, Amazon Q, Augment Code, Aider
- Platform-specific instruction files and `/clone-website` skill for each supported agent
- `scripts/sync-agent-rules.sh` to regenerate platform instruction files from AGENTS.md
- `scripts/sync-skills.mjs` to regenerate `/clone-website` skill across all platforms
- GEMINI.md for Gemini CLI configuration
- Supported Platforms table in README
- "Updating for Other Platforms" documentation section in README

### Changed

- README now describes the project as multi-agent (Claude Code recommended, not required)
- AGENTS.md updated with sync script reminders

## [0.1.1] - 2026-03-28

### Added

- Bug report and feature request issue templates
- Pull request template with checklist
- CHANGELOG.md following Keep a Changelog format
- Package.json metadata (description, repository, homepage, keywords, engines)

### Fixed

- LICENSE copyright holder now attributed to JCodesMore

## [0.1.0] - 2026-03-28

### Added

- Initial template scaffold for website reverse-engineering with Claude Code
- `/clone-website` skill for full-site cloning pipeline
- `/build-from-spec` and `/customize` skills
- Parallel builder agents with git worktree isolation
- Chrome MCP integration for design token extraction
- Comprehensive inspection guide and project structure documentation
- Next.js 16 + shadcn/ui + Tailwind CSS v4 base scaffold
- MIT license
- README with badges, demo section, quick start, and star history

[Unreleased]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.6.2...HEAD
[0.6.2]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/JCodesMore/ai-website-cloner-template/releases/tag/v0.1.0
