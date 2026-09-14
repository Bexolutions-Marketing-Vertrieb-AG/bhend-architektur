# Cache policy (native deploy skew)

## Two different problems

| Problem               | What breaks                                                                  | Native handling                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Deploy skew**       | New deploy; HTML still points at old `/_astro/*.css`; 404 cached `immutable` | Vercel Skew Protection + Astro `skewProtection: true` + **short HTML TTL / no long SWR** + post-deploy **assert CSS 200** |
| **CMS content stale** | Editor changed Orbitype; HTML CDN still shows old JSON                       | Tag TTL **or** optional Workflow → `/api/revalidate`                                                                      |

Do **not** use `REVALIDATE_SECRET` as the primary fix for unstyled pages after deploy. Soft tag invalidation does not clear already-cached **asset 404s**.

## Required template defaults

### Adapter

```ts
adapter: vercel({ skewProtection: true })
```

Also enable **Skew Protection** in the Vercel project UI (e.g. 12h max age). The UI banner “necessary steps for your framework” means the adapter flag above.

### routeRules (direction)

Prefer short `swr` (e.g. `60`) or no long SWR on HTML routes that embed hashed `/_astro` assets. Long SWR (300–600s) after asset rotation is what leaves clients on dead CSS hashes.

Keep `maxAge` set on every rule (Astro emits no headers if only `swr` is set).

### Middleware

- `/api/**` → `cache.set(false)` + `Cache-Control: no-store`
- HTML/API **404** responses that pass through Astro → `no-store` (does not cover all static `/_astro` 404s on the CDN)

### Post-deploy sanity (no secret)

```bash
# CI / local (no Production network):
pnpm run check:asset-links -- --fixture tests/fixtures/asset-links

# Post-deploy / preview gate:
pnpm run check:asset-links -- https://www.example.com /
pnpm run check:cache-config   # asserts skewProtection + HTML swr ≤ 60
```

If any stylesheet 404s: emergency **Purge CDN → All content → CDN, ISR, and Image Cache**, then re-check. Do not tell end users to hard-refresh.

### Optional CMS revalidate

Keep `/api/revalidate` for Orbitype Workflows. Document `REVALIDATE_SECRET` as **CMS-only**, optional. No GitHub “revalidate after every deploy” required for CSS health if skew + TTL + assert are in place.

## Emergency recovery (operators)

1. Vercel → Caches → Purge → **All content** + **CDN, ISR, and Image Cache**
2. Confirm Skew Protection enabled + `skewProtection: true` deployed
3. Run asset-link check
4. Affected browsers that already cached a 404 may still need one hard refresh or “Cached images and files” clear — new visitors should be fine after purge

## ADR note (port upstream)

Update ADR-0005 consequences: native CDN cache is fine for CMS HTML **only if** HTML freshness window is shorter than / aligned with asset availability (skew). Document sticky immutable 404 as a known Vercel static-miss behaviour and the assert/purge mitigation.
