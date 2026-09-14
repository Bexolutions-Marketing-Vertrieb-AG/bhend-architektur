/**
 * Legacy URL → permanent destination map for SEO cutovers.
 * Upstream template ships empty; clones fill from GSC / old sitemap inventory.
 * Never mass-redirect unknowns to `/` (soft-404).
 *
 * @see docs/template/SEO.md
 */

export type LegacyRedirect = {
  /** Final path (one hop), starting with `/` */
  to: string
}

/** Path keys must be normalized via {@link normalizeLegacyPath}. */
export const LEGACY_REDIRECTS: Readonly<Record<string, LegacyRedirect>> = {
  // Example (disabled in upstream):
  // "/old-about": { to: "/about" },
}

/**
 * Normalize a request pathname for map lookup.
 * - lowercase
 * - collapse duplicate slashes
 * - strip trailing slash (except `/`)
 * - drop query/hash (caller should pass pathname only)
 */
export function normalizeLegacyPath(pathname: string): string {
  let path = pathname.split("?")[0]?.split("#")[0] ?? "/"
  path = path.replace(/\/{2,}/g, "/")
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (!path.startsWith("/")) path = `/${path}`
  return path.toLowerCase()
}

export function lookupLegacyRedirect(
  pathname: string,
): LegacyRedirect | undefined {
  return LEGACY_REDIRECTS[normalizeLegacyPath(pathname)]
}
