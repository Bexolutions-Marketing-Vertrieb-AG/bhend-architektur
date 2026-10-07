import { PROJECT_CATEGORIES } from "~/config/projects"
import { listProjects } from "~/lib/orbitype/posts"
import { postPath } from "~/lib/post-slug"

const LEGACY_PROJECT_PATH = /^\/projekte?\/(.+)$/
const FALLBACK = "/aktuell"

/**
 * WordPress dropped umlauts (`ü` → `u`) while CMS ids spell them (`ue`);
 * folding both sides lets `grosszugiges-…` match `grosszuegiges-…`.
 */
function fold(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
}

/**
 * Old WordPress project URL (`/projekt/<slug>`, `/projekte/<slug>`) → current
 * project post path, whatever its category. Unknown slugs → `/aktuell`.
 * Returns `undefined` for paths that are not legacy project URLs.
 */
export async function resolveLegacyProject(
  normalizedPath: string,
): Promise<string | undefined> {
  const match = LEGACY_PROJECT_PATH.exec(normalizedPath)
  if (!match?.[1]) return undefined
  const slug = fold(match[1].split("/").pop() ?? "")
  if (!slug) return FALLBACK

  const lists = await Promise.all(
    PROJECT_CATEGORIES.map((category) => listProjects({ category })),
  )
  const project = lists.flat().find((post) => fold(post.id) === slug)
  return project ? postPath(project) : FALLBACK
}
