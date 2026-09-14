# Lessons from production clones

Synthesized from agent chats on Bistro zur Linde (Astro 7 + Orbitype + Vercel). Use these to harden the **upstream template**, not to re-litigate one client site.

## Systemic gaps

### 1. Deploy skew → unstyled site until hard refresh

**Symptom:** All URLs look like naked HTML; incognito OK; hard refresh OK; Clear site data sometimes insufficient.

**Cause:** Cached HTML references hashed `/_astro/*.css` that briefly (or permanently) 404. Vercel serves that miss as:

```http
HTTP/2 404
cache-control: public, max-age=31536000, immutable
```

Browsers and edges keep that 404 for up to a year. Soft `cache.invalidate` does **not** clear it.

**Wrong fix:** Treat `REVALIDATE_SECRET` + GitHub post-deploy revalidate as the primary CSS cure. That is CMS tooling, not deploy-skew handling.

**Right direction:** See [CACHE.md](CACHE.md) — Skew Protection + short HTML TTL + assert stylesheet 200; purge only as emergency recovery.

### 2. Seed vs live Orbitype drift

Almost every content fix required **seed + CMS**. With `ORBITYPE_MOCK=false`, seed-only changes never appear. Agents patched components to ignore CMS flags (e.g. play overlays) — brittle.

**Template need:** Generic seed only; explicit `cms:setup`; optional drift check; never “fix in seed and hope”.

### 3. Env / onboarding opacity

- Empty `REVALIDATE_SECRET`; user asked if it should be public.
- `PUBLIC_SITE_URL` set to `*.vercel.app` → wrong canonicals/schema.
- Dual keys: `ORBITYPE_API_SQL_KEY` (app) vs `ORBITYPE_SQL_API_KEY` (MCP).
- Figma skill cache naming (“Zima”) confused agents despite correct `.env`.

**Template need:** One ENV table; bootstrap rewrites placeholders; Production URL guard.

### 4. Dual Git / wrong Vercel link

Work pushed to repo A while Vercel tracked repo B → “CMS updated, UI empty”. Force-push workarounds. Third-party apps committing to `main` while agents used `develop`.

**Template need:** Pre-launch checklist: one `origin`, Vercel linked to that repo only; shipping phrases that merge remote before ship.

### 5. Ambiguous reservation / CTA contracts

CTAs bounced between `/kontakt`, `#reservieren`, `mailto:`, OpenTable dialog intercept by **button label**. PDF menu paths dated and went stale.

**Template need:** Typed reservation mode + menu URL in settings/CMS, not label heuristics.

### 6. Cookie / consent

Dismiss only in memory → every reload. Then localStorage; then cookie + inline. E2E cleared storage on every navigation and “proved” persistence was broken.

**Template need:** One durable store; early inline gate; e2e clears once per test, not on reload.

### 7. Asset / FOUC UX

Menu SVG without HTML `width`/`height` exploded into a giant black ring when CSS failed. Same-path image replaces fought browser cache.

**Template need:** Intrinsic dimensions on critical SVG/img; prefer hashed or versioned public filenames for editorial swaps.

### 8. Bootstrap exists but undiscovered

`scripts/bootstrap.mjs` was not in README Quick start. Clones brand by hand and leave template defaults.

### 9. Stale blueprint vs reality

Blueprint still describes HTTP welcome installers; product is CLI-only (`cms:install` / `cms:seed`). Agents and operators follow the wrong path.

### 10. SEO cutover without 301s / SITE_URL from development

**Symptom:** After WordPress (or any URL-structure) → Astro/Orbitype go-live, organic impressions collapse (~85% in one recovery), indexed pages drop, GSC fills with “Not found”. Content still exists under new paths; Google cannot join old URLs to new ones. Manual actions / Security usually OK.

**Cause:** Three defects, one root: no server-side permanent redirect map; `PUBLIC_SITE_URL` (or code fallback) left as localhost / preview → broken canonicals and sitemaps; no post-go-live indexing gate. Dev config shipped to Production.

**Wrong fix:** Treat as “Google penalty”, delay redirects, or start with on-page SEO polish. Soft SPA redirects / meta refresh. Mass-redirect every legacy URL to homepage.

**Right direction:** See [SEO.md](SEO.md) — inventory old→new map → 301 middleware/`vercel.json` first → `getSiteUrl()` prod fallback never localhost → flat live sitemaps → curl gate → GSC (remove old sitemap, submit new, Validate Fix, Request Indexing).

### 11. Unlabeled Telegram / Binflow surfaces

**Symptom:** Site owner cannot edit copy/images/CTAs from Binflow (Telegram), or tools scrape the wrong node. Agents ship Figma-faithful sections with no stable surface ids. Parallel ad-hoc attributes appear (`data-edit-*`, random ids).

**Cause:** No `binflow/surface-inventory.yaml` and no `data-bf-*` on editable roots; locators tied to `sections[]` index; CTA fields mixed into copy kinds; invented tag systems beside BSI.

**Wrong fix:** Client-side inventory discovery scripts; mark every nested span; require BSI for the site to boot; invent a second attribute vocabulary.

**Right direction:** See [BSI.md](BSI.md) — inventory v1 + markers on editable roots + locators by `componentId`; preserve heuristic prop names; site must work without BSI.

---

## Frequency (this client)

| Theme                                 | Relative frequency                 |
| ------------------------------------- | ---------------------------------- |
| DOM/CTA/image micro-edits             | Very high                          |
| Seed + CMS dual write                 | Very high                          |
| Sube / Actualiza shipping             | High                               |
| Figma + fidelity                      | High                               |
| CSS hard-refresh                      | Critical when it hits              |
| Cookie banner                         | Medium                             |
| SEO / PUBLIC_SITE_URL (day-to-day)    | Medium                             |
| SEO cutover / URL migration           | Critical when it hits              |
| Dual repo / Vercel                    | High impact when it hits           |
| Unlabeled Binflow / Telegram surfaces | High when owner edits via Telegram |

---

## Do / don’t for the next template revision

| Do                                      | Don’t                                       |
| --------------------------------------- | ------------------------------------------- |
| Skew Protection + short HTML SWR        | Sell REVALIDATE_SECRET as the CSS fix       |
| Generic seed + explicit CMS publish     | Ship client copy in upstream seed           |
| Document key dualism once               | Invent new env names per clone              |
| Fail build if Production URL is preview | Trust operators to remember                 |
| SVG width/height                        | Rely on Tailwind alone for critical icons   |
| One origin ↔ one Vercel project         | Dual remotes “just for deploy”              |
| 301 map + `getSiteUrl()` prod fallback  | Live without redirects / fallback localhost |
| BSI markers + `surface-inventory.yaml`  | Heuristic-only labeling / parallel attrs    |
