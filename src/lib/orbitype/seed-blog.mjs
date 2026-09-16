/**
 * Blog article posts shared by mock mode and `pnpm run cms:seed`.
 * Source of truth for copy: seed-blog-posts.json (imported from live site).
 */
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const SAMPLE_BLOG_POST_ID =
  "wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung"

function loadSeedBlogPayloads() {
  const raw = readFileSync(join(__dirname, "seed-blog-posts.json"), "utf8")
  return JSON.parse(raw)
}

function toSeedPost(payload, stamp) {
  const article = {
    ...payload.article,
    id: payload.article?.id || "blogArticle",
    reservationMode: payload.article?.reservationMode ?? "mailto",
    reservationTarget:
      payload.article?.reservationTarget ?? "info@bhend-architektur.ch",
    _orbi: { component: "SectionBlogArticle" },
  }
  return {
    id: payload.id,
    title: payload.title,
    lead: payload.lead,
    img: payload.img ?? article.image ?? "",
    status: payload.status ?? {
      options: ["draft", "review", "published"],
      value: "published",
    },
    keywords: payload.keywords ?? ["blog"],
    category: null,
    year: null,
    created_at: stamp,
    updated_at: stamp,
    sections: [article],
  }
}

export function buildSampleBlogPost(now = () => new Date().toISOString()) {
  const stamp = typeof now === "function" ? now() : now
  const payloads = loadSeedBlogPayloads()
  const sample =
    payloads.find((p) => p.id === SAMPLE_BLOG_POST_ID) ?? payloads[0]
  if (!sample) {
    throw new Error("seed-blog-posts.json has no posts")
  }
  return toSeedPost(sample, stamp)
}

/** @deprecated Prefer article from seed-blog-posts.json via buildSampleBlogPost */
export function buildBlogArticleSection() {
  return buildSampleBlogPost().sections[0]
}

export function buildSeedBlogPosts(now = () => new Date().toISOString()) {
  const stamp = typeof now === "function" ? now() : now
  return loadSeedBlogPayloads().map((payload) => toSeedPost(payload, stamp))
}
