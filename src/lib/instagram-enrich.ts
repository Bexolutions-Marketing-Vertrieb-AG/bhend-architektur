import type { Section } from "~/types/section"
import { fetchInstagramFeed } from "~/lib/instagram"

/** Inject live Instagram posts into SectionInstagramFeed payloads. */
export async function enrichInstagramFeedSections(
  sections: Section[],
): Promise<Section[]> {
  const out: Section[] = []
  for (const section of sections) {
    if (section._orbi?.component !== "SectionInstagramFeed") {
      out.push(section)
      continue
    }
    const username =
      typeof section.username === "string" ? section.username : undefined
    const limit =
      typeof section.limit === "number" && Number.isFinite(section.limit)
        ? section.limit
        : 12
    const feed = await fetchInstagramFeed({ username, limit })
    out.push({
      ...section,
      profile: feed.profile,
      posts: feed.posts,
      feedSource: feed.source,
    })
  }
  return out
}
