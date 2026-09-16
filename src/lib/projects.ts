import type { Post } from "~/types/post"
import type { ProjectCategory } from "~/config/projects"
import { isProjectCategory, projectPhase } from "~/config/projects"
import type { Section } from "~/types/section"
import type { I18nString } from "~/types/i18n"

type ProjectCardFields = {
  id?: string
  title?: I18nString
  subcategory?: I18nString
  location?: I18nString
  year?: number | string
  projektId?: string
  renderImage?: string
  renderImageAlt?: I18nString
  description?: I18nString
  mainImage?: string
  mainImageAlt?: I18nString
  gallery?: Array<{ src?: string; alt?: I18nString }>
  phase?: "aktuell" | "referenz"
  category?: ProjectCategory
}

/** Pull SectionProjectCard props from a project post row. */
export function projectCardFromPost(post: Post): ProjectCardFields {
  const card = post.sections.find(
    (section) => section._orbi?.component === "SectionProjectCard",
  ) as ProjectCardFields | undefined
  const categoryRaw = (post.category ?? "").toString().trim()
  const category = isProjectCategory(categoryRaw) ? categoryRaw : undefined
  const { _orbi: _ignored, ...base } = (card ?? {}) as ProjectCardFields & {
    _orbi?: unknown
  }

  return {
    ...base,
    id: base.id ?? post.id,
    title: base.title ?? post.title,
    mainImage: base.mainImage ?? post.img,
    year: base.year ?? post.year ?? undefined,
    category,
    phase: category ? projectPhase(category) : undefined,
  }
}

export async function enrichProjectFeedSections(
  sections: Section[],
  listProjects: (opts: { category: ProjectCategory }) => Promise<Post[]>,
): Promise<Section[]> {
  const out: Section[] = []
  for (const section of sections) {
    if (section._orbi?.component !== "SectionProjectFeed") {
      out.push(section)
      continue
    }
    const category = String(section.category ?? "").trim()
    if (!isProjectCategory(category)) {
      out.push({ ...section, projects: [] })
      continue
    }
    const posts = await listProjects({ category })
    out.push({
      ...section,
      projects: posts.map(projectCardFromPost),
    })
  }
  return out
}
