/**
 * Shared Production PUBLIC_SITE_URL rules (Node scripts + mirrored in site.ts).
 */

/**
 * @param {string} url
 * @returns {string | null} error message if forbidden for Production, else null
 */
export function isForbiddenProductionSiteUrl(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return `PUBLIC_SITE_URL is not a valid URL: ${url}`
  }

  const host = parsed.hostname.toLowerCase()
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
    return `PUBLIC_SITE_URL must not point at ${host} in production (got ${url})`
  }
  if (host === "vercel.app" || host.endsWith(".vercel.app")) {
    return `PUBLIC_SITE_URL must not use *.vercel.app in production (got ${url})`
  }
  if (parsed.protocol !== "https:") {
    return `PUBLIC_SITE_URL must use https in production (got ${url})`
  }
  return null
}

/**
 * @param {string} url
 * @param {string | undefined} vercelEnv
 */
export function assertProductionSiteUrl(
  url,
  vercelEnv = process.env["VERCEL_ENV"],
) {
  if (vercelEnv !== "production") return
  const error = isForbiddenProductionSiteUrl(url)
  if (error) throw new Error(error)
}
