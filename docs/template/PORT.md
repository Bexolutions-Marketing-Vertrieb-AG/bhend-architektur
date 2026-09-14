# Port hardening → upstream template

How to apply this playbook into the **canonical Astro + Orbitype template** (not a live client). One wave = one PR (or logical commit) + green tests before the next wave.

## Setup

1. Open a workspace with **two roots**:
   - **Hardening** (this repo) — source of truth for docs + `proposed/`
   - **Template upstream** — destination for code and `docs/template/`
2. Do **not** apply patches inside a branded client clone.
3. Prefer the template’s existing test runners (Vitest / Playwright / etc.). Do not invent a second stack.
4. Copy-paste the **Master prompt** below into the agent session that can edit the template.

## Wave map (must pass before next)

| Wave            | Scope                                                                                                                                                           | Must pass                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 0 Docs          | Copy hardening `docs/*` → template `docs/template/` (skip re-copying `PORT.md` into itself if already there; keep `PORT.md` in hardening and optionally mirror) | Paths exist; template README links `docs/template/*`                                       |
| 1 Cache         | `PATCHES` §1–2, `check-asset-links`, `CACHE.md`                                                                                                                 | typecheck/build; config assert skew + short SWR; asset-links script present                |
| 2 Bootstrap/ENV | `BOOTSTRAP.md`, `ENV.md`, URL guard §3                                                                                                                          | bootstrap/`project:init` smoke; Production URL guard test; `.env.example` neutral          |
| 3 SEO scaffold  | §10–12, empty 301 map, `SEO.md`                                                                                                                                 | unit tests normalizer/map; `check:no-localhost` + HTML fixtures; build OK                  |
| 4 CMS setup     | `cms:setup`, seed neutrality §7–8                                                                                                                               | setup dry/stub path; seed has no client brand strings                                      |
| 5 BSI           | §13–15, inventory example, Home markers, `BSI.md`                                                                                                               | YAML valid; assert `data-bf-*`; no client inventory loader                                 |
| 6 DX            | SVG dims, CTA contract, cookie e2e §4–6                                                                                                                         | types/tests for reservationMode; cookie clear-once e2e; SVG width/height on critical icons |

## Testing rules (all waves)

- Each feature ships with **one contract test** (expected behaviour) and **one non-regression check** (`typecheck` / `build` / home smoke).
- Live-URL smokes (`check:asset-links`, `check:no-localhost` against Production): unit/fixture tests in CI; live script documented as post-deploy / manual gate.
- Fail CI when Production `PUBLIC_SITE_URL` resolves to localhost or `*.vercel.app` (guard + fixture tests).
- After each wave, report: changes / tests run / evidence / risks. Stop and ask if the template already has a conflicting partial implementation.
- Keep upstream seed **generic**. No client brand copy.

---

## Master prompt (copy-paste)

```text
You are porting the Astro+Orbitype HARDENING playbook into the UPSTREAM TEMPLATE repo.

WORKSPACE
- Hardening repo (read-only source): the folder named like astro-orbitype-template-hardening
  (docs/, proposed/).
- Template upstream (WRITE HERE ONLY): the canonical Astro+Orbitype template that new
  clients clone. Never apply these patches to a live branded client site.

GOAL
Implement ALL hardening deliverables in prioritized waves. Each wave MUST include tests
that prove: (1) the template still builds, (2) the change behaves correctly, (3) the
feature is useful (contract asserted). Do not big-bang merge everything in one untested PR.

READ FIRST (hardening repo, in order)
1. README.md — Priority list
2. docs/LESSONS.md
3. docs/CACHE.md, docs/SEO.md, docs/BSI.md, docs/ENV.md
4. docs/PROMPTS.md
5. docs/PORT.md (this port process)
6. proposed/PATCHES.md, proposed/BOOTSTRAP.md
7. proposed/scripts/*, proposed/binflow/surface-inventory.example.yaml

HARD RULES
- Seed / welcome content stays GENERIC (no client brand).
- Prefer existing test runners in the template (Vitest, Playwright, etc.). Do not add a
  second competing framework.
- Every feature: ≥1 contract test + ≥1 non-regression (pnpm typecheck and/or build,
  and/or home smoke). Wire new scripts into package.json when PATCHES says so.
- Live URL checks: implement scripts + fixture-based unit tests for CI; document live
  runs as post-deploy gates (do not require Production network in default CI).
- If the template already implements part of a patch differently, STOP that wave, summarize
  the conflict, and ask before overwriting.
- After each wave: summarize what changed, commands run, pass/fail evidence, residual risk.
  Do NOT start the next wave until the current wave’s must-pass checks are green.
- One wave = one PR (or one clear commit series). Prefer small reviewable diffs.

═══════════════════════════════════════════════════════════════════════════════
WAVE 0 — Docs into template
═══════════════════════════════════════════════════════════════════════════════
- Copy hardening docs (LESSONS, CACHE, SEO, BSI, ENV, PROMPTS; and PORT if useful)
  into the template as docs/template/* (merge if docs/template already exists).
- Link them from the template README (and CLAUDE.md / agent runbook if present).
- Do NOT treat docs-only as “features done”; code waves still required.
MUST PASS
- Listed files exist under docs/template/
- Template README points operators/agents at them
- pnpm typecheck (or equivalent) still green if you touch package files

═══════════════════════════════════════════════════════════════════════════════
WAVE 1 — Native cache (PATCHES §1–2, CACHE.md)
═══════════════════════════════════════════════════════════════════════════════
- vercel adapter skewProtection: true
- routeRules: short swr (e.g. 60), maxAge always set; no long SWR on HTML that embeds
  hashed /_astro assets
- Middleware: no-store on API + 404 responses that pass through Astro
- Port proposed/scripts/check-asset-links.mjs → scripts/; add pnpm check:asset-links
- Deprecate “revalidate every Production deploy” as the CSS fix; keep /api/revalidate for CMS
MUST PASS (contract + non-regression)
- typecheck + build
- Test or assert config: skewProtection enabled; HTML routeRules swr ≤ 60 (or documented
  equivalent policy)
- check:asset-links runs with --help/usage or against a fixture/local preview; CI has a
  unit path that does not require Production
- Home still renders in mock/dev smoke if the template has one

═══════════════════════════════════════════════════════════════════════════════
WAVE 2 — Bootstrap + ENV (BOOTSTRAP.md, ENV.md, PATCHES §3)
═══════════════════════════════════════════════════════════════════════════════
- Align env names with docs/template/ENV.md (ORBITYPE_API_SQL_KEY vs MCP alias dualism)
- project:init / bootstrap: rewrite package name, PUBLIC_*, README placeholders; refuse
  leaving template defaults when required fields empty
- PUBLIC_SITE_URL Production guard: fail if VERCEL_ENV=production and URL is localhost
  or *.vercel.app (prefer build-time check script)
- .env.example stays neutral placeholders
MUST PASS
- typecheck + build
- Contract test: Production guard rejects localhost / vercel.app
- Smoke: bootstrap/project:init with flags dry-run or temp dir does not leave “My Site”
  defaults when inputs provided
- .env.example has no real client domain

═══════════════════════════════════════════════════════════════════════════════
WAVE 3 — SEO scaffold (SEO.md, PATCHES §10–12)
═══════════════════════════════════════════════════════════════════════════════
- Single getSiteUrl() for canonicals, OG, robots, sitemaps; fallback = prod domain, NEVER
  localhost
- Empty legacy 301 map + normalizer + middleware/vercel.json hook; unit tests for
  trailing slash/case; no mass-redirect to /
- check:no-localhost script + HTML/sitemap fixtures for CI; package.json script
- Document curl/GSC cutover in docs/template/SEO.md (already copied in wave 0)
MUST PASS
- typecheck + build
- Unit tests: normalizer + empty map behaviour; getSiteUrl never returns localhost when
  simulating production
- Fixture test: check:no-localhost (or equivalent) fails on HTML containing localhost and
  passes on clean fixture
- Canonical/SEO builders use getSiteUrl() (grep/assert import sites)

═══════════════════════════════════════════════════════════════════════════════
WAVE 4 — CMS setup + seed neutrality (PATCHES §7–9, cms-setup stub)
═══════════════════════════════════════════════════════════════════════════════
- pnpm cms:setup = install + seed; honor ORBITYPE_EXPECTED_PROJECT_ID / CONNECTOR_ID
  fail-closed when set
- Blueprint/docs: CLI cms:install/seed only (no HTTP welcome installer as the path)
- Upstream seed = welcome + generic stubs only
MUST PASS
- typecheck + build
- Contract: cms:setup refuses wrong expected IDs when env set (unit/integration)
- Grep/assert seed data has no known client brand strings (or snapshot “generic only”)
- Mock home still boots (ORBITYPE_MOCK=true)

═══════════════════════════════════════════════════════════════════════════════
WAVE 5 — BSI (BSI.md, PATCHES §13–15, surface-inventory.example.yaml)
═══════════════════════════════════════════════════════════════════════════════
- Commit binflow/surface-inventory.yaml (v1) from the example; project_key placeholder
- data-bf-id / data-bf-kind / data-bf-section on editable Home roots; background
  presentation attrs; optional bf() attrs-only helper — NO client inventory loader
- Locators by componentId, never sections[] index; preserve heuristic camelCase field names
MUST PASS
- typecheck + build
- Inventory YAML parses; required Home bf_ids present (shell, heading, body, image|background,
  cta if CTA exists)
- Test or rendered fixture asserts data-bf-* on declared roots
- Grep: no client-side inventory discovery script added

═══════════════════════════════════════════════════════════════════════════════
WAVE 6 — DX guards (PATCHES §4–6)
═══════════════════════════════════════════════════════════════════════════════
- Critical inline SVGs: HTML width + height
- Typed reservation/CTA contract (reservationMode + reservationTarget) — no label heuristics
- Cookie e2e: clear dismiss storage ONCE at test start, never on every navigation/reload
MUST PASS
- typecheck + build
- Types/unit for reservationMode union
- E2E or unit proving cookie dismiss persistence pattern (clear-once)
- Assert critical nav/menu SVGs expose width & height attributes

═══════════════════════════════════════════════════════════════════════════════
DONE CRITERIA (all waves)
═══════════════════════════════════════════════════════════════════════════════
- docs/template/* present and linked
- package.json has check:asset-links, check:no-localhost (and project:init / cms:setup as
  applicable)
- Default CI green without needing Production network
- Final report: wave-by-wave checklist with commands + evidence; list anything deferred
  and why

Start with WAVE 0. After it passes, continue 1→6 unless blocked by a conflict question.
```

## After the port

New client clones use [`PROMPTS.md`](PROMPTS.md) (0–8) from the hardened template. Do not re-run this entire PORT prompt on a live client unless you are deliberately retrofitting cache/SEO/BSI with a scoped Prompt 7/8.
