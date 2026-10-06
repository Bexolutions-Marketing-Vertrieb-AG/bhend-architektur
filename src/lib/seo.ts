import type { Locale } from "~/config/locales"
import { LOCALES, DEFAULT_LOCALE } from "~/config/locales"
import { isProjectCategory, PROJECT_CATEGORY_LABELS } from "~/config/projects"
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

function meaningfulHead(head: Page["head"], key: string): string | undefined {
  if (!head) return undefined
  const value = head[key]
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed === "...") return undefined
  return trimmed
}

function isoDate(value: string | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function listItem(position: number, name: string, item: string) {
  return {
    "@type": "ListItem",
    position,
    name,
    item,
  }
}

function breadcrumbList(
  crumbs: Array<{ name: string; item: string }>,
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) =>
      listItem(index + 1, crumb.name, crumb.item),
    ),
  }
}

function asGraph(
  nodes: Array<Record<string, unknown>>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  }
}

function pageBreadcrumb(
  slug: string,
  title: string,
): Record<string, unknown> | null {
  if (!slug || slug === "home") return null
  return breadcrumbList([
    { name: "Home", item: `${getSiteUrl()}/` },
    { name: title, item: absoluteUrl(`/${slug}`) },
  ])
}

function postBreadcrumb(
  post: Post,
  headline: string,
  canonical: string,
): Record<string, unknown> {
  const crumbs = [{ name: "Home", item: `${getSiteUrl()}/` }]
  if (post.category && isProjectCategory(post.category)) {
    crumbs.push({
      name: PROJECT_CATEGORY_LABELS[post.category],
      item: absoluteUrl(`/${post.category}`),
    })
  } else if (!post.category) {
    crumbs.push({ name: "Blog", item: absoluteUrl("/blog") })
  }
  crumbs.push({ name: headline, item: canonical })
  return breadcrumbList(crumbs)
}

export function buildPageSeo(options: {
  page: Page
  locale: Locale
  path: string
}): SeoData {
  const { page, locale, path } = options
  const pageTitle = translate(page.title, locale) || siteName()
  const title = truncate(meaningfulHead(page.head, "title") || pageTitle, 60)
  const description = truncate(
    stripHtml(
      meaningfulHead(page.head, "description") ||
        translate(page.lead, locale) ||
        siteDescription(),
    ),
    160,
  )
  const keywords = Array.isArray(page.keywords)
    ? page.keywords.map(String).filter((k) => k && k !== "...")
    : []

  const canonical = absoluteUrl(path)
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

  const webPage = {
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
  }
  const breadcrumb = pageBreadcrumb(page.slug, pageTitle)

  return {
    title,
    description,
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
    jsonLd: asGraph(breadcrumb ? [webPage, breadcrumb] : [webPage]),
  }
}

export function buildPostSeo(options: {
  post: Post
  locale: Locale
  path: string
}): SeoData {
  const { post, locale, path } = options
  const headline = translate(post.title, locale) || siteName()
  const title = truncate(headline, 60)
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
  const isBlog = !post.category
  const published = isoDate(post.created_at)
  const modified = isoDate(post.updated_at) ?? published
  const article: Record<string, unknown> = {
    "@type": isBlog ? "BlogPosting" : "Article",
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
  }
  if (isBlog) {
    article.author = {
      "@type": "Organization",
      name: organizationName(),
    }
    if (published) article.datePublished = published
    if (modified) article.dateModified = modified
  }

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
    jsonLd: asGraph([article, postBreadcrumb(post, headline, canonical)]),
  }
}
