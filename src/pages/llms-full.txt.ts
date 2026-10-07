import type { APIRoute } from "astro"
import { getPage, listPageSlugs } from "~/lib/orbitype/pages"
import { getPost, listPublishedPostIds } from "~/lib/orbitype/posts"
import { DEFAULT_LOCALE } from "~/config/locales"
import { localePath, translate } from "~/lib/i18n"
import { postPath } from "~/lib/post-slug"
import { stripHtml } from "~/lib/sanitize"
import { siteDescription, siteName, siteUrl } from "~/lib/site"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const pages = await listPageSlugs()
  const posts = await listPublishedPostIds()

  const pageBlocks: string[] = []
  for (const entry of pages) {
    const page = await getPage(entry.slug)
    if (!page) continue
    const path = localePath(DEFAULT_LOCALE, page.slug)
    const excerpt = stripHtml(translate(page.lead, DEFAULT_LOCALE)).slice(
      0,
      280,
    )
    pageBlocks.push(
      `### ${translate(page.title, DEFAULT_LOCALE)}\n\n${excerpt}\n\nURL: ${base}${path === "/" ? "/" : path}`,
    )
  }

  const postBlocks: string[] = []
  for (const entry of posts) {
    const post = await getPost(entry.id)
    if (!post) continue
    const excerpt = stripHtml(translate(post.lead, DEFAULT_LOCALE)).slice(
      0,
      280,
    )
    postBlocks.push(
      `### ${translate(post.title, DEFAULT_LOCALE)}\n\n${excerpt}\n\nURL: ${base}${postPath(post)}`,
    )
  }

  const body = `# ${siteName()}

> ${siteDescription()}

## Pages

${pageBlocks.join("\n\n") || "(none)"}

## Posts

${postBlocks.join("\n\n") || "(none)"}
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}
