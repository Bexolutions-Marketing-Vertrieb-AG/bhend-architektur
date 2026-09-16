/** Architectural project listing pages + categorized project posts (from Figma). */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const de = (value) => ({ de: value, en: value })

function projectPhase(category) {
  return category === "aktuell" ? "aktuell" : "referenz"
}

/** posts.year is integer — coerce ranges like "2020-2022" to the end year for sorting. */
function postYearSort(year) {
  if (year === null || year === undefined || year === "") return null
  if (typeof year === "number" && Number.isFinite(year)) return Math.trunc(year)
  const match = String(year).match(/(\d{4})(?:\s*[-–]\s*(\d{4}))?/)
  if (!match) return null
  return Number(match[2] || match[1])
}

const PROJECT_PAGE_DEFS = [
  {
    slug: "aktuell",
    title: "Aktuell",
    heading: "AKTUELL",
    category: "aktuell",
    keywords: ["aktuell", "projekte", "bau"],
  },
  {
    slug: "wohnen",
    title: "Wohnen",
    heading: "WOHNEN",
    category: "wohnen",
    keywords: ["referenzen", "wohnen"],
  },
  {
    slug: "industrie-gewerbe",
    title: "Industrie Gewerbe",
    heading: "INDUSTRIE GEWERBE",
    category: "industrie-gewerbe",
    keywords: ["referenzen", "industrie", "gewerbe"],
  },
  {
    slug: "oeffentliche-bauten",
    title: "Öffentliche Bauten",
    heading: "ÖFFENTLICHE BAUTEN",
    category: "oeffentliche-bauten",
    keywords: ["referenzen", "öffentliche bauten"],
  },
]

const MANIFEST_FILES = [
  "aktuell-projects.json",
  "wohnen-projects.json",
  "industrie-gewerbe-projects.json",
  "oeffentliche-bauten-projects.json",
]

function loadManifest(filename) {
  const path = join(__dirname, "../../../scripts/cms", filename)
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return []
  }
}

function loadAllProjectManifests() {
  return MANIFEST_FILES.flatMap((file) => loadManifest(file))
}

export function buildProjectFeedPages(now) {
  return PROJECT_PAGE_DEFS.map((def) => ({
    id: `seed-${def.slug}`,
    slug: def.slug,
    title: de(def.title),
    lead: de(def.title),
    img: "",
    keywords: def.keywords,
    head: {},
    created_at: now(),
    updated_at: now(),
    sections: [
      {
        id: "projectFeed",
        title: de(def.heading),
        heading: de(def.heading),
        category: def.category,
        _orbi: { component: "SectionProjectFeed" },
      },
    ],
  }))
}

function buildPostFromManifest(project, index, baseMs) {
  const category = project.category || "aktuell"
  const phase = projectPhase(category)
  const title = de(project.title)
  const mainImage = project.paths?.main || project.paths?.render || ""
  const renderImage = project.paths?.render || ""
  const stamp = new Date(baseMs + index * 1000).toISOString()
  const projektId = (project.projektId ?? "").trim()
  const keywords = [category, "projekt", project.subcategory, projektId].filter(
    Boolean,
  )

  const card = {
    id: project.id,
    title,
    subcategory: de(project.subcategory || ""),
    location: de(project.location || ""),
    year: project.year,
    ...(projektId ? { projektId } : {}),
    mainImage,
    mainImageAlt: title,
    gallery: (project.gallery || []).map((src) => ({
      src,
      alt: title,
    })),
    phase,
    category,
    _orbi: { component: "SectionProjectCard" },
  }

  if (phase === "aktuell") {
    card.renderImage = renderImage || mainImage
    card.renderImageAlt = title
  } else {
    card.description = de(project.description || "")
  }

  return {
    id: project.id,
    title,
    lead: { de: "", en: "" },
    img: mainImage,
    status: {
      options: ["draft", "review", "published"],
      value: "published",
    },
    keywords,
    category,
    year: postYearSort(project.year),
    created_at: stamp,
    updated_at: stamp,
    sections: [card],
  }
}

export function buildSeedProjectPosts(now) {
  const projects = loadAllProjectManifests()
  const baseMs = Date.parse(now())
  return projects.map((project, index) =>
    buildPostFromManifest(project, index, baseMs),
  )
}
