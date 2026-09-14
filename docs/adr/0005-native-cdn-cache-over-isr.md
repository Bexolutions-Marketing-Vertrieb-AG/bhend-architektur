# ADR-0005: Native CDN cache over adapter ISR

**Status:** Accepted

## Context

Server-mode Astro on Vercel can cache HTML via adapter ISR or via Astro 7's native `cache` + `routeRules` backed by `cacheVercel()`. Both avoid function invocations on CDN hits.

Adapter ISR has a disqualifying limitation: **search params are stripped** from ISR requests. Pagination (`/posts?page=2`) would always serve page 1. ISR also uses one global expiration, excludes routes via internal pattern strings, and offers no tag-based invalidation.

## Decision

Use **`cache: { provider: cacheVercel() }`** and per-route **`routeRules`** with explicit `maxAge`, `swr`, and `tags`. Every rule sets `maxAge` — rules with only `swr` emit no cache headers at all.

**HTML `swr` stays ≤ 60.** Long SWR (300–600s) on HTML that embeds hashed `/_astro` assets leaves clients on dead CSS hashes after deploy. Pair this with `adapter: vercel({ skewProtection: true })` and Vercel project Skew Protection. See `docs/template/CACHE.md`.

`src/middleware.ts` disables caching for `/api/**` and Astro-handled **404** responses at runtime because the `/[...slug]` catch-all rule matches API paths and there is no declarative opt-out. Static `/_astro` 404s may still bypass middleware — mitigate with skew, short HTML TTL, and `pnpm run check:asset-links` post-deploy.

`/api/revalidate` is for **CMS content** tag/path invalidation only. Do not treat “revalidate on every Production deploy” as the fix for unstyled pages after asset rotation.

## Consequences

- **Positive:** Query strings preserved; per-route TTLs; tag invalidation via `/api/revalidate`.
- **Positive:** Aligns with CMS workflows that purge by tag or path.
- **Positive:** Short HTML freshness window reduces deploy-skew sticky CSS 404s when combined with skew protection.
- **Negative:** Native CDN cache is regional; miss traffic hits SQL more often than ISR's durable store.
- **Negative:** Cache headers appear at runtime, not in build output — caching tests need preview or deploy.
- **Negative:** Immutable CDN 404s for old `/_astro` hashes may still need an emergency purge; assert CSS 200 after promote.
