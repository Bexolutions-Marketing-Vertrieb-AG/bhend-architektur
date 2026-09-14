# Environment variables (unified)

Use these **exact names** in every clone. Do not invent aliases per client.

## Taxonomy

| Tier                 | Deploy to Vercel?     | Purpose                              |
| -------------------- | --------------------- | ------------------------------------ |
| A — Runtime required | Yes (Production)      | Site boots against live CMS          |
| B — Runtime optional | Yes when feature used | Mail, analytics, CMS revalidate      |
| C — Local authoring  | **Never**             | MCP, Figma, S3, connector allowlists |
| D — Local only       | Never                 | Host/port                            |

---

## A — Vercel Production minimum

| Variable                   | Example                                | Rules                                                                                                          |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ORBITYPE_MOCK`            | `false`                                | Must be false in Production                                                                                    |
| `ORBITYPE_API_SQL_URL`     | `https://core.orbitype.com/api/sql/v1` |                                                                                                                |
| `ORBITYPE_API_SQL_KEY`     | (preview or prod SQL key)              | Runtime CMS reads                                                                                              |
| `PUBLIC_SITE_URL`          | `https://www.example.com`              | **Never** `http://localhost` or `*.vercel.app` in Production. URL migrations / cutovers: see [SEO.md](SEO.md). |
| `PUBLIC_SITE_NAME`         | `My Site`                              | Footer, OG defaults                                                                                            |
| `PUBLIC_SITE_DESCRIPTION`  | One sentence                           | Meta / OG                                                                                                      |
| `PUBLIC_ORGANIZATION_NAME` | `My Site GmbH`                         | JSON-LD org                                                                                                    |
| `RENDER_MODE`              | `server`                               | Default; use `static` only when intended                                                                       |

Optional but recommended in schema defaults:

| Variable                   | Default idea                         |
| -------------------------- | ------------------------------------ |
| `PUBLIC_ORGANIZATION_LOGO` | `/favicon.svg` or `/images/logo.png` |
| `PUBLIC_OG_LOGO_PATH`      | same                                 |
| `PUBLIC_OG_IMAGE_ENABLED`  | `true`                               |
| `PUBLIC_COMMENTS_ENABLED`  | `false`                              |

---

## B — Runtime optional

| Variable                                         | When                                                  |
| ------------------------------------------------ | ----------------------------------------------------- |
| `MAIL_API_KEY`                                   | Contact form sends mail                               |
| `MAIL_FROM_EMAIL`                                | Verified sender at provider                           |
| `MAIL_FROM_NAME`                                 | Display name                                          |
| `MAIL_TO_EMAIL`                                  | Inbox                                                 |
| `PUBLIC_GTM_ID`                                  | Analytics                                             |
| `PUBLIC_TWITTER_SITE` / `PUBLIC_TWITTER_CREATOR` | Twitter cards                                         |
| `NOINDEX`                                        | Force noindex                                         |
| `REVALIDATE_SECRET`                              | **Only** if Orbitype Workflow calls `/api/revalidate` |

`REVALIDATE_SECRET`: long random hex (`openssl rand -hex 32`). **Never** `PUBLIC_*`. Same value in Vercel Production (and Workflow secret). Not required for deploy-skew / CSS health — see [CACHE.md](CACHE.md).

---

## C — Local authoring only (never Vercel)

| Variable                         | Used by                             |
| -------------------------------- | ----------------------------------- |
| `ORBITYPE_SQL_API_KEY`           | Cursor MCP / CMS CLI skills (alias) |
| `ORBITYPE_S3_PUBLIC_API_KEY`     | Media tools                         |
| `ORBITYPE_S3_PRIVATE_API_KEY`    | Media tools                         |
| `ORBITYPE_EXPECTED_PROJECT_ID`   | Safety on install/seed/export       |
| `ORBITYPE_EXPECTED_CONNECTOR_ID` | Safety on install/seed/export       |
| `FIGMA_API_KEY`                  | Figma REST skills                   |
| `FIGMA_FILE_KEY`                 | Figma REST skills                   |
| `FIGMA_EXPECTED_FILE_NAME`       | Optional assert                     |
| `FIGMA_EXPECTED_ACCOUNT_EMAIL`   | Optional assert                     |

### Key dualism (document once, forever)

| Context                  | Variable               |
| ------------------------ | ---------------------- |
| Astro runtime / Vercel   | `ORBITYPE_API_SQL_KEY` |
| MCP + many local scripts | `ORBITYPE_SQL_API_KEY` |

Locally, set **both** to the same key. On Vercel, set **only** `ORBITYPE_API_SQL_KEY`.

---

## D — Local only

`HOST`, `PORT` — not for Vercel.

---

## Vercel project checklist (minimum correct install)

1. Framework: **Astro**; install `pnpm install --frozen-lockfile`; build `pnpm run build` (or `build:server`).
2. **Node.js** major = `.nvmrc` / `engines` (e.g. 24.x).
3. Git connected to the **same** GitHub repo as local `origin` (one remote).
4. Env: all **tier A** for Production; Preview may use mock or a preview connector.
5. **Skew Protection** enabled for Production.
6. Production domain matches `PUBLIC_SITE_URL` (prefer `www` + apex redirect).
7. Do **not** add `FIGMA_*`, `ORBITYPE_S3_*`, or `ORBITYPE_SQL_API_KEY` to Vercel.
8. After first Production deploy: run stylesheet 200 check ([CACHE.md](CACHE.md)).

### Purge CDN (emergency only)

- Which content: **All content**
- Cache layer: **CDN, ISR, and Image Cache**
- Not “Runtime and Data Cache” for sticky CSS 404s.

---

## `.env.example` for upstream template

Keep **neutral** placeholders:

```env
ORBITYPE_MOCK=true
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=My Site
PUBLIC_SITE_DESCRIPTION=Short description of the site.
PUBLIC_ORGANIZATION_NAME=My Organization
```

Clones brand via `pnpm run bootstrap` / Prompt 0 — never commit client names into the upstream template.
