import type { APIRoute } from "astro"
import { listPageSlugs } from "~/lib/orbitype/pages"
import { listPublishedPostIds } from "~/lib/orbitype/posts"
import { DEFAULT_LOCALE } from "~/config/locales"
import { localePath, translate } from "~/lib/i18n"
import {
  organizationName,
  organizationProfile,
  siteDescription,
  siteName,
  siteUrl,
} from "~/lib/site"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const pages = await listPageSlugs()
  const posts = await listPublishedPostIds()

  const pageLinks = pages
    .map((p) => {
      const path = localePath(DEFAULT_LOCALE, p.slug)
      return `- [${p.slug}](${base}${path === "/" ? "/" : path})`
    })
    .join("\n")

  const postLinks = posts
    .map((p) => {
      const slug = translate(p.title, DEFAULT_LOCALE)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      return `- [${translate(p.title, DEFAULT_LOCALE)}](${base}/posts/${p.id}/${slug})`
    })
    .join("\n")

  const profile = organizationProfile()
  const body = `# ${siteName()}

> ${siteDescription()}

## Services

- Planung: massgeschneiderte und präzise Planung, vom Entwurf bis zur Ausführungsplanung
- Beratung: Beratungsdienstleistungen für Bauvorhaben
- Brandschutz: Analyse, Planung und Umsetzung bei Neubau, Umbau und Sanierung
- Realisierung: Bauleitung und Koordination bis zur Schlüsselübergabe
- Energieberatung: GEAK-Beratungsberichte, Gebäudeanalysen und Modernisierung
- Bauherrenberatung: unabhängige Begleitung von der ersten Idee bis zur Abnahme

## Project types

- Wohnen: Einfamilienhäuser und Wohnkomplexe
- Industrie und Gewerbe
- Öffentliche Bauten: Schulen, Kindergärten und öffentliche Einrichtungen

## Location

- ${organizationName()}, ${profile.streetAddress}, ${profile.postalCode} ${profile.addressLocality}, Kanton ${profile.addressRegion}
- Telefon: ${profile.telephone}
- E-Mail: ${profile.email}

## Pages

${pageLinks || "- (none)"}

## Posts

${postLinks || "- (none)"}

## Optional

- [Full content](${base}/llms-full.txt)
- [Sitemap](${base}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}
