import type { Locale } from "~/config/locales"
import { LOCALES, DEFAULT_LOCALE } from "~/config/locales"
import { translate } from "~/lib/i18n"
import { localePath } from "~/lib/i18n"
import { stripHtml } from "~/lib/sanitize"
import {
  absoluteUrl,
  getSiteUrl,
  organizationLogo,
  organizationName,
  siteDescription,
  siteName,
} from "~/lib/site"
import type { Page } from "~/types/page"
import type { Post } from "~/types/post"

export type SeoAlternate = {
  hreflang: string
  href: string
}

export type SeoData = {
  title: string
  description: string
  keywords: string[]
  canonical: string
  alternates: SeoAlternate[]
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  jsonLd: Record<string, unknown>
}

function truncate(text: string, max: number): string {
  const clean = text.trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

function pageSlugPath(slug: string): string {
  return slug === "home" ? "" : slug
}

export function buildPageSeo(options: {
  page: Page
  locale: Locale
  path: string
}): SeoData {
  const { page, locale, path } = options
  const title = truncate(translate(page.title, locale) || siteName(), 60)
  const rawDescription =
    translate(page.lead, locale) ||
    (typeof page.head?.["description"] === "string"
      ? page.head["description"]
      : "") ||
    siteDescription()
  const description = truncate(stripHtml(rawDescription), 160)
  const keywords = Array.isArray(page.keywords)
    ? page.keywords.map(String).filter((k) => k && k !== "...")
    : []

  const canonical = absoluteUrl(path)
  const slug = pageSlugPath(page.slug)
  const alternates: SeoAlternate[] = LOCALES.map((loc) => ({
    hreflang: loc,
    href: absoluteUrl(localePath(loc, page.slug)),
  }))
  alternates.push({
    hreflang: "x-default",
    href: absoluteUrl(localePath(DEFAULT_LOCALE, page.slug)),
  })

  const ogImage = page.img
    ? absoluteUrl(page.img)
    : absoluteUrl(
        `/api/og/page?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      )

  const headOverride =
    page.head && typeof page.head === "object" ? page.head : {}

  const seo: SeoData = {
    title:
      typeof headOverride["title"] === "string"
        ? truncate(String(headOverride["title"]), 60)
        : title,
    description:
      typeof headOverride["description"] === "string"
        ? truncate(stripHtml(String(headOverride["description"])), 160)
        : description,
    keywords,
    canonical,
    alternates,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterCreator: "",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
      isPartOf: {
        "@type": "WebSite",
        name: siteName(),
        url: getSiteUrl(),
      },
      publisher: {
        "@type": "Organization",
        name: organizationName(),
        logo: {
          "@type": "ImageObject",
          url: organizationLogo(),
        },
      },
    },
  }

  // Suppress unused for slug (kept for clarity / future use)
  void slug
  return seo
}

export function buildPostSeo(options: {
  post: Post
  locale: Locale
  path: string
}): SeoData {
  const { post, locale, path } = options
  const title = truncate(translate(post.title, locale) || siteName(), 60)
  const description = truncate(
    stripHtml(translate(post.lead, locale) || siteDescription()),
    160,
  )
  const canonical = absoluteUrl(path)
  const ogImage = post.img
    ? absoluteUrl(post.img)
    : absoluteUrl(
        `/api/og/post?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      )

  return {
    title,
    description,
    keywords: Array.isArray(post.keywords)
      ? post.keywords.map(String).filter((k) => k && k !== "...")
      : [],
    canonical,
    alternates: [
      { hreflang: locale, href: canonical },
      { hreflang: "x-default", href: canonical },
    ],
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterCreator: "",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: canonical,
      image: ogImage,
      publisher: {
        "@type": "Organization",
        name: organizationName(),
        logo: {
          "@type": "ImageObject",
          url: organizationLogo(),
        },
      },
    },
  }
}
