import { defineMiddleware } from "astro:middleware"
import {
  canonicalRequestPath,
  lookupLegacyRedirect,
  normalizeLegacyPath,
} from "~/lib/legacy-redirects"
import { resolveLegacyProject } from "~/lib/legacy-projects"

const CANONICAL_ORIGIN = "https://www.bhend-architektur.ch"

/**
 * Hosts served by this project only to redirect to {@link CANONICAL_ORIGIN}.
 * They must be attached to the Vercel project without a domain-level redirect,
 * otherwise Vercel answers first (308) and old URLs take two hops.
 */
const ALIAS_HOSTS = new Set([
  "bhend-architektur.ch",
  "bexo.bhend-architektur.ch",
])

async function targetPath(pathname: string): Promise<string> {
  const legacy = lookupLegacyRedirect(pathname)
  if (legacy) return legacy.to
  const project = await resolveLegacyProject(normalizeLegacyPath(pathname))
  return project ?? canonicalRequestPath(pathname)
}

/**
 * Mandatory cache + robots + baseline security headers.
 *
 * The `/[...slug]` route rule in astro.config.ts also matches `/api/**`.
 * Removing this file silently makes every API response cacheable.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname
  const isApi = pathname.startsWith("/api/")

  if (!isApi) {
    const path = await targetPath(pathname)
    const query = context.url.search
    if (ALIAS_HOSTS.has(context.url.hostname)) {
      return context.redirect(`${CANONICAL_ORIGIN}${path}${query}`, 301)
    }
    if (path !== pathname) {
      return context.redirect(`${path}${query}`, 301)
    }
  }

  if (context.cache.enabled && isApi) {
    context.cache.set(false)
  }

  const response = await next()

  // API + Astro-handled 404s must not be CDN-cached. Static `/_astro` 404s may
  // still bypass this middleware — skew + short HTML swr + check:asset-links.
  if (isApi || response.status === 404) {
    response.headers.set("Cache-Control", "no-store")
    response.headers.set("CDN-Cache-Control", "no-store")
    response.headers.set("Vercel-CDN-Cache-Control", "no-store")
  }

  const vercelEnv = process.env["VERCEL_ENV"]
  const forceNoindex = process.env["NOINDEX"] === "true"
  const isProduction = vercelEnv === "production"
  const shouldNoindex =
    forceNoindex || isApi || (vercelEnv !== undefined && !isProduction)

  if (shouldNoindex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  if (isProduction) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    )
  }

  if (!response.headers.has("Content-Security-Policy")) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline'",
        "connect-src 'self' https:",
        "frame-src 'self' https://www.google.com https://maps.google.com https://www.google.ch",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    )
  }

  return response
})
