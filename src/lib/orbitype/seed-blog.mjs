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

/** V2 contract fixture (HTML bodies, quote, authorBox) for mock visual QA. */
function loadBlogV2FixturePayload() {
  const raw = readFileSync(
    join(__dirname, "../../../tests/fixtures/blog-b08-v2.json"),
    "utf8",
  )
  const fixture = JSON.parse(raw)
  const article = fixture.sections?.[0]
  if (!fixture?.id || !article) {
    throw new Error("tests/fixtures/blog-b08-v2.json is incomplete")
  }
  return {
    id: fixture.id,
    title: fixture.title,
    lead: fixture.lead,
    img: fixture.img,
    status: fixture.status,
    keywords: fixture.keywords,
    article,
  }
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
  const fallback = typeof now === "function" ? now() : now
  const payloads = loadSeedBlogPayloads()
  const sample =
    payloads.find((p) => p.id === SAMPLE_BLOG_POST_ID) ?? payloads[0]
  if (!sample) {
    throw new Error("seed-blog-posts.json has no posts")
  }
  return toSeedPost(sample, PUBLISHED_AT[sample.id] ?? fallback)
}

/** @deprecated Prefer article from seed-blog-posts.json via buildSampleBlogPost */
export function buildBlogArticleSection() {
  return buildSampleBlogPost().sections[0]
}

/**
 * Distinct publication dates, spread from 2024 to just before
 * POST_SLUG_V2_SINCE (2026-10-08) so detail URLs stay on the legacy form.
 */
const PUBLISHED_AT = {
  "wertschaetzung-im-alltag": "2026-10-07T12:00:00.000Z",
  "was-macht-ein-nachhaltiges-zuhause-aus": "2026-07-21T12:00:00.000Z",
  "was-flache-hierarchie-bei-bhend-architektur-konkret-bedeutet":
    "2026-05-04T12:00:00.000Z",
  "umbau-und-sanierung-mit-weitblick": "2026-02-15T12:00:00.000Z",
  "so-entsteht-ein-grundriss-der-zu-ihrer-lebensweise-passt":
    "2025-11-29T12:00:00.000Z",
  "mitarbeiterzufriedenheit-als-erfolgsfaktor": "2025-09-12T12:00:00.000Z",
  "mitarbeiter-erzaehlen-was-teamspirit-fuer-uns-ausmacht":
    "2025-06-26T12:00:00.000Z",
  "ihr-individuelles-einfamilienhaus": "2025-04-09T12:00:00.000Z",
  "checkliste-fuer-den-umbau": "2025-01-21T12:00:00.000Z",
  "architektur-auf-augenhoehe": "2024-11-04T12:00:00.000Z",
  "5-haeufige-fehler-bei-sanierungen-und-wie-bhend-architektur-sie-vermeidet":
    "2024-08-18T12:00:00.000Z",
  "10-inspirierende-ideen-fuer-moderne-einfamilienhaeuser":
    "2024-06-01T12:00:00.000Z",
  "wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung":
    "2024-03-12T12:00:00.000Z",
  wohnraumgestaltung: "2024-01-16T12:00:00.000Z",
  "baubewilligung-verfahren-schritt-fuer-schritt": "2026-10-09T12:00:00.000Z",
}

export function buildSeedBlogPosts(now = () => new Date().toISOString()) {
  const fallback = typeof now === "function" ? now() : now
  const posts = loadSeedBlogPayloads().map((payload) =>
    toSeedPost(payload, PUBLISHED_AT[payload.id] ?? fallback),
  )
  const v2 = loadBlogV2FixturePayload()
  if (!posts.some((post) => post.id === v2.id)) {
    posts.push(toSeedPost(v2, PUBLISHED_AT[v2.id] ?? fallback))
  }
  return posts
}
