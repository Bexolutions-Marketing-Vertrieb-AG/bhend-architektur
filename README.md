# Orbitype Astro Template

A zero-JavaScript-by-default Astro starter for [Orbitype](https://www.orbitype.com)-powered websites. Pages are composed from CMS-authored JSON sections, SEO is server-rendered, and CDN caching uses native Astro/`@astrojs/vercel` tags.

Use it for landing pages, marketing sites, brochure sites and documentation sites — anywhere content dominates and interactivity is incidental.

> Independent Astro counterpart to a Nuxt/Vue Orbitype CMS template. Same `pages` / `posts` / `settings` schema and `sections` JSON convention.

---

## Feature status

| Feature                                | Status                                                     |
| -------------------------------------- | ---------------------------------------------------------- |
| CMS catch-all router `[...slug].astro` | Ready                                                      |
| Mock mode + seed content               | Ready                                                      |
| Schema install / seed                  | Ready — **CLI only** (`pnpm run cms:install` / `cms:seed`) |
| `RENDER_MODE=server`                   | Ready                                                      |
| `RENDER_MODE=static`                   | Ready (pages prerendered; `/api/**` remain serverless)     |
| E2E without live Orbitype keys         | Ready                                                      |
| Contact form + email provider          | Stub — wire `EmailProvider` before launch                  |
| CDN cache HIT verification             | Needs a Vercel project                                     |
| Orbitype Workflow → `/api/revalidate`  | Code ready; Workflow not verified end-to-end               |
| CI (GitHub Actions)                    | See `.github/workflows/ci.yml`                             |

Do not describe an incomplete row as production-ready for a client launch.

---

## Quick start

```bash
corepack enable
pnpm install
pnpm run setup
pnpm dev
```

Open `http://localhost:4321`. No credentials are needed — the template starts in **mock mode** and serves **built-in content** until you connect a CMS.

Note the explicit `run` in `pnpm run setup`. `pnpm setup` is a built-in pnpm command and will not run the project script.

For a **client project** cloned from this template, also run `pnpm run bootstrap` (package name, locale, favicon, `template.lock.json`).

## Requirements

- Node **24.x** (see `.nvmrc` / `.node-version` / `engines`). Pin the same major in Vercel Project Settings.
- pnpm 11, via `corepack enable`.

## Scripts

| Script                  | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `pnpm dev`              | Dev server on port 4321                                |
| `pnpm run build`        | Production build (current `RENDER_MODE`)               |
| `pnpm run build:server` | Server build; fails on unexpected warnings             |
| `pnpm run build:static` | Static prerender build                                 |
| `pnpm run setup`        | Create `.env` from `.env.example`, sync types, husky   |
| `pnpm run bootstrap`    | Clone checklist for a real project                     |
| `pnpm run cms:install`  | Install CMS schema (CLI, confirms connector)           |
| `pnpm run cms:migrate`  | Additive migrations                                    |
| `pnpm run cms:seed`     | Seed starter rows                                      |
| `pnpm run lint`         | ESLint, zero warnings                                  |
| `pnpm run typecheck`    | `astro check`                                          |
| `pnpm run verify`       | Lint, typecheck, leakage, e2e, both builds (mock)      |
| `pnpm run mcp:env`      | Show whether MCP env vars are present (no secret dump) |
| `pnpm run mcp:verify`   | Check Orbitype MCP wiring                              |
| `pnpm run figma:verify` | Check Figma REST connection                            |

There is **no** `astro preview` script: `@astrojs/vercel` does not support it. Use `pnpm dev` locally, or a Vercel preview deployment for CDN behaviour.

## Documentation

| Document                                                       | Contents                                       |
| -------------------------------------------------------------- | ---------------------------------------------- |
| [docs/00-TEMPLATE-BLUEPRINT.md](docs/00-TEMPLATE-BLUEPRINT.md) | Architecture and Orbitype contract             |
| [docs/01-orbitype-cms.md](docs/01-orbitype-cms.md)             | Operator CMS guide                             |
| [docs/03-deployment.md](docs/03-deployment.md)                 | Vercel, render modes, revalidate               |
| [docs/preview-promote.md](docs/preview-promote.md)             | Preview checks → promote → rollback            |
| [docs/vercel-linking.md](docs/vercel-linking.md)               | Linking Vercel without committing `.vercel/`   |
| [docs/DEVIATIONS.md](docs/DEVIATIONS.md)                       | Verified departures                            |
| `docs/adr/`                                                    | Architecture decision records                  |
| [docs/template/LESSONS.md](docs/template/LESSONS.md)           | Hardening lessons from first client ships      |
| [docs/template/CACHE.md](docs/template/CACHE.md)               | Skew protection, short SWR, asset checks       |
| [docs/template/SEO.md](docs/template/SEO.md)                   | Canonicals, 301 cutover, no-localhost gates    |
| [docs/template/BSI.md](docs/template/BSI.md)                   | Binflow surface inventory + `data-bf-*`        |
| [docs/template/ENV.md](docs/template/ENV.md)                   | Env tiers and key dualism                      |
| [docs/template/PROMPTS.md](docs/template/PROMPTS.md)           | Agent/operator prompt pack                     |
| [docs/template/PORT.md](docs/template/PORT.md)                 | How this playbook was ported into the template |

## Configuring a project

1. `pnpm run setup`
2. `pnpm run project:init` (alias: `pnpm run bootstrap`) — or pass flags for agents; refuses `My Site` / template package name.
3. Replace `public/favicon.svg` (bootstrap fails if the template hash remains).
4. Fill in remaining `.env` secrets — production `PUBLIC_SITE_URL` must be `https://` on a real domain (never localhost or `*.vercel.app`). See [`docs/template/ENV.md`](docs/template/ENV.md).
5. Create an Orbitype SQL connector key; set `ORBITYPE_API_SQL_KEY` (and locally `ORBITYPE_SQL_API_KEY`); set `ORBITYPE_MOCK=false`.
6. Run `pnpm run cms:setup` (install + seed) — or `cms:install` then `cms:seed` — from an authorized machine (**never** via HTTP). Set `ORBITYPE_EXPECTED_PROJECT_ID` / `ORBITYPE_EXPECTED_CONNECTOR_ID` to fail closed on the wrong connector.
7. Export authoring keys for Cursor MCP (`pnpm run mcp:env -- --write-file …`), reload MCP.
8. Set design tokens in `src/styles/global.css`.
9. Confirm locale in `src/config/locales.ts`.

## Rendering modes

`RENDER_MODE=server` (default) renders on demand and caches at the CDN.

`RENDER_MODE=static` prerenders CMS pages at build time. API routes under `src/pages/api/` still deploy as serverless functions. Content changes need a rebuild (or keep server mode + revalidate).

Caching is inert under `astro dev`. Observe CDN behaviour on a Vercel preview/production deployment — not via `astro preview`.

## MCP and agents

- Cursor: `.cursor/mcp.json` + `.cursor/rules` + `.cursor/skills` (symlinks into `.agents/skills`).
- Codex / ChatGPT desktop: `AGENTS.md` + `.agents/skills`.
- ChatGPT web needs a platform connector/plugin — a local `.env` alone is not enough.

## License

Proprietary.
