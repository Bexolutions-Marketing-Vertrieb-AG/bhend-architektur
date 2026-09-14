import {
  PUBLIC_ORGANIZATION_LOGO,
  PUBLIC_ORGANIZATION_NAME,
  PUBLIC_SITE_DESCRIPTION,
  PUBLIC_SITE_NAME,
  PUBLIC_SITE_URL,
} from "astro:env/client"

/**
 * Production PUBLIC_SITE_URL rules (keep in sync with scripts/lib/site-url-guard.mjs).
 */
function assertProductionSiteUrl(url: string): void {
  if (process.env["VERCEL_ENV"] !== "production") return

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`PUBLIC_SITE_URL is not a valid URL: ${url}`)
  }

  const host = parsed.hostname.toLowerCase()
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
    throw new Error(
      `PUBLIC_SITE_URL must not point at ${host} in production (got ${url})`,
    )
  }
  if (host === "vercel.app" || host.endsWith(".vercel.app")) {
    throw new Error(
      `PUBLIC_SITE_URL must not use *.vercel.app in production (got ${url})`,
    )
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`PUBLIC_SITE_URL must use https in production (got ${url})`)
  }
}

/** Canonical site origin. Alias: {@link getSiteUrl}. */
export function siteUrl(): string {
  const url = PUBLIC_SITE_URL.replace(/\/$/, "")
  assertProductionSiteUrl(url)
  return url
}

/** Playbook name for {@link siteUrl}. */
export function getSiteUrl(): string {
  return siteUrl()
}

export function siteName(): string {
  return PUBLIC_SITE_NAME
}

export function siteDescription(): string {
  return PUBLIC_SITE_DESCRIPTION
}

export function organizationName(): string {
  return PUBLIC_ORGANIZATION_NAME
}

export function organizationLogo(): string {
  const logo = PUBLIC_ORGANIZATION_LOGO
  if (logo.startsWith("http")) return logo
  return `${siteUrl()}${logo.startsWith("/") ? logo : `/${logo}`}`
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  const base = siteUrl()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
