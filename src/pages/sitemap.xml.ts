import type { APIRoute } from "astro"
import { listPageSlugs } from "~/lib/orbitype/pages"
import { listPublishedPostIds } from "~/lib/orbitype/posts"
import { LOCALES, DEFAULT_LOCALE } from "~/config/locales"
import type { Locale } from "~/config/locales"
import { localePath } from "~/lib/i18n"
import { postPath, postTitleSlug } from "~/lib/post-slug"
import { siteUrl } from "~/lib/site"

export const prerender = false

/** Operator-only pages that must never be indexed. */
const EXCLUDED_SLUGS = new Set(["setup"])

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const pages = (await listPageSlugs())
    .filter((page) => !EXCLUDED_SLUGS.has(page.slug))
    .sort((a, b) => sortKey(a.slug).localeCompare(sortKey(b.slug)))
  const posts = await listPublishedPostIds()

  const urls: string[] = []

  for (const page of pages) {
    for (const locale of LOCALES) {
      const path = localePath(locale as Locale, page.slug)
      const loc = `${base}${path === "/" ? "/" : path}`
      const alternates =
        LOCALES.length > 1
          ? LOCALES.map(
              (alt) =>
                `<xhtml:link rel="alternate" hreflang="${alt}" href="${base}${localePath(alt as Locale, page.slug)}" />`,
            ).join("") +
            `<xhtml:link rel="alternate" hreflang="x-default" href="${base}${localePath(DEFAULT_LOCALE, page.slug)}" />`
          : ""
      urls.push(
        `<url><loc>${escapeXml(loc)}</loc>${lastmod(page.updated_at)}${alternates}</url>`,
      )
    }
  }

  for (const post of posts) {
    const loc = `${base}${postPath(post.id, postTitleSlug(post.title))}`
    urls.push(
      `<url><loc>${escapeXml(loc)}</loc>${lastmod(post.updated_at)}</url>`,
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}

/** Home first, then pages alphabetically by path. */
function sortKey(slug: string): string {
  return slug === "home" ? "" : slug
}

function lastmod(updatedAt: string | undefined): string {
  return updatedAt
    ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>`
    : ""
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
