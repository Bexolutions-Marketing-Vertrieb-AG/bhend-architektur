import type { I18nString } from "~/types/i18n"
import type { Post } from "~/types/post"
import { DEFAULT_LOCALE } from "~/config/locales"
import { POST_SLUG_V2_SINCE } from "~/config/posts"
import { translate } from "~/lib/i18n"

export type PostRef = Pick<Post, "id" | "title" | "created_at">

/** Readable id typed by the editor, e.g. `checkliste-fuer-den-umbau`. */
const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)+$/

/**
 * Slug used by every post created before {@link POST_SLUG_V2_SINCE}.
 * Drops umlauts (`ü` → `-`); must never change or indexed URLs break.
 */
function legacyTitleSlug(title: I18nString | string | undefined): string {
  return translate(title, DEFAULT_LOCALE)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** German-aware slug: ä→ae, ö→oe, ü→ue, ß→ss, other accents stripped. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function isLegacyPost(post: PostRef): boolean {
  if (!post.created_at) return true
  const created = new Date(post.created_at).getTime()
  if (Number.isNaN(created)) return true
  return created < new Date(POST_SLUG_V2_SINCE).getTime()
}

/** Canonical path of a post detail page. */
export function postPath(post: PostRef): string {
  if (isLegacyPost(post)) {
    const slug = legacyTitleSlug(post.title)
    return slug ? `/posts/${post.id}/${slug}` : `/posts/${post.id}`
  }
  if (KEBAB_ID.test(post.id)) return `/posts/${post.id}`
  const slug = slugify(translate(post.title, DEFAULT_LOCALE))
  return slug ? `/posts/${post.id}/${slug}` : `/posts/${post.id}`
}
