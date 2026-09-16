import type { Post } from "~/types/post"
import type { Section } from "~/types/section"
import type { I18nString } from "~/types/i18n"
import { translate } from "~/lib/i18n"
import { stripHtml } from "~/lib/sanitize"
import { DEFAULT_LOCALE } from "~/config/locales"

export type BlogCardFields = {
  id: string
  title: I18nString
  lead?: I18nString
  image?: string
  imageAlt?: I18nString
  href: string
  publishedAt?: string
  ctaLabel?: I18nString
}

function slugifyTitle(title: I18nString): string {
  return translate(title, DEFAULT_LOCALE)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function formatBlogDate(iso?: string): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function plainLead(lead?: I18nString): I18nString | undefined {
  if (!lead) return undefined
  if (typeof lead === "string") {
    const text = stripHtml(lead)
    return { en: text, de: text }
  }
  const en = stripHtml(lead.en ?? "")
  const out: I18nString = { en }
  for (const [locale, value] of Object.entries(lead)) {
    if (locale === "en") continue
    if (typeof value === "string") out[locale] = stripHtml(value)
  }
  return out
}

/** Map a blog post row to SectionBlogFeed card props. */
export function blogCardFromPost(post: Post): BlogCardFields {
  const slug = slugifyTitle(post.title) || post.id
  return {
    id: post.id,
    title: post.title,
    lead: plainLead(post.lead),
    image: post.img || undefined,
    imageAlt: post.title,
    href: `/posts/${post.id}/${slug}`,
    publishedAt: formatBlogDate(post.created_at),
    ctaLabel: { de: "MEHR LESEN", en: "READ MORE" },
  }
}

export async function enrichBlogFeedSections(
  sections: Section[],
  listPosts: (opts: {
    limit?: number
  }) => Promise<{ posts: Post[]; total: number }>,
): Promise<Section[]> {
  const out: Section[] = []
  for (const section of sections) {
    if (section._orbi?.component !== "SectionBlogFeed") {
      out.push(section)
      continue
    }
    const { posts } = await listPosts({ limit: 50 })
    out.push({
      ...section,
      posts: posts.map(blogCardFromPost),
    })
  }
  return out
}
