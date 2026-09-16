#!/usr/bin/env node
/**
 * List / create / update / delete blog posts (posts.category IS NULL).
 * Mutations require --confirm and always RETURNING.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
)

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROJECT_CATEGORIES = [
  "aktuell",
  "wohnen",
  "industrie-gewerbe",
  "oeffentliche-bauten",
]

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env")
  if (!fs.existsSync(envPath)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=")
        if (i === -1) return null
        return [
          line.slice(0, i).trim(),
          line
            .slice(i + 1)
            .trim()
            .replace(/^["']|["']$/g, ""),
        ]
      })
      .filter(Boolean),
  )
}

const fileEnv = loadEnvFile()
const key =
  process.env.ORBITYPE_API_SQL_KEY ||
  process.env.ORBITYPE_SQL_API_KEY ||
  fileEnv.ORBITYPE_API_SQL_KEY ||
  fileEnv.ORBITYPE_SQL_API_KEY
const endpoint =
  process.env.ORBITYPE_API_SQL_URL ||
  fileEnv.ORBITYPE_API_SQL_URL ||
  "https://core.orbitype.com/api/sql/v1"

if (!key) {
  console.error("Missing ORBITYPE_API_SQL_KEY (shell or .env)")
  process.exit(1)
}

async function sql(statement, bindings = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": key,
    },
    body: JSON.stringify({ sql: statement, bindings }),
  })
  const text = await response.text()
  if (!response.ok) {
    console.error(`HTTP ${response.status}`)
    console.error(text)
    process.exit(1)
  }
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function parseArgs(argv) {
  const flags = {
    confirm: false,
    file: null,
    id: null,
  }
  const positionals = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--confirm") flags.confirm = true
    else if (a === "--file" && argv[i + 1]) flags.file = argv[++i]
    else if (a === "--id" && argv[i + 1]) flags.id = argv[++i]
    else if (a.startsWith("-")) {
      console.error(`Unknown flag: ${a}`)
      process.exit(1)
    } else positionals.push(a)
  }
  return { cmd: positionals[0], flags }
}

function localize(value) {
  if (value == null) return ""
  if (typeof value === "string") return value
  return value.de || value.en || Object.values(value).find(Boolean) || ""
}

function findArticle(sections) {
  return (sections ?? []).find(
    (s) => s?._orbi?.component === "SectionBlogArticle",
  )
}

function validatePayload(payload) {
  const errors = []
  const article =
    payload.article ??
    findArticle(payload.sections) ??
    (payload._orbi?.component === "SectionBlogArticle" ? payload : null)
  const id = payload.id ?? article?.id

  if (!id || typeof id !== "string" || !ID_RE.test(id)) {
    errors.push('id must be kebab-case (e.g. "wie-viel-planung-…")')
  }
  if (!article) {
    errors.push("article (SectionBlogArticle) is required")
  } else {
    if (!article.heading && !article.title && !payload.title) {
      errors.push("article.heading or title is required")
    }
    if (article._orbi?.component !== "SectionBlogArticle") {
      errors.push('_orbi.component must be "SectionBlogArticle"')
    }
  }

  const category = payload.category
  if (
    category != null &&
    category !== "" &&
    PROJECT_CATEGORIES.includes(String(category))
  ) {
    errors.push(
      "blog posts must have category null/empty (use project-post for projects)",
    )
  }

  return { errors, article, id }
}

function buildRow(payload, { id, article }) {
  const title = payload.title ?? article.heading ?? article.title
  const lead = payload.lead ?? article.subheading ?? { de: "", en: "" }
  const img = payload.img ?? article.image ?? ""
  const section = {
    ...article,
    id: article.id || "blogArticle",
    title: article.title ?? title,
    heading: article.heading ?? title,
    image: article.image ?? img,
    reservationMode: article.reservationMode ?? "mailto",
    reservationTarget: article.reservationTarget ?? "info@bhend-architektur.ch",
    _orbi: { component: "SectionBlogArticle" },
  }
  return {
    id,
    title,
    lead,
    img,
    status: payload.status ?? {
      options: ["draft", "review", "published"],
      value: "published",
    },
    keywords: payload.keywords ?? ["blog"],
    category: null,
    year: null,
    sections: [section],
  }
}

function printList(rows) {
  if (!rows.length) {
    console.log("(no blog-posts)")
    return
  }
  for (const row of rows) {
    const title = localize(row.title)
    console.log(`${row.id}\t${title}\tbf=blogArticle.* / blogFeed.${row.id}.*`)
  }
}

async function listBlogs() {
  return sql(
    `SELECT id, title, img, updated_at, created_at FROM posts
     WHERE status->>'value' = 'published'
       AND (category IS NULL OR category = '')
     ORDER BY created_at DESC`,
  )
}

async function getById(id) {
  const rows = await sql(`SELECT * FROM posts WHERE id = :id LIMIT 1`, { id })
  return Array.isArray(rows) ? rows[0] : rows
}

const { cmd, flags } = parseArgs(process.argv.slice(2))

switch (cmd) {
  case "list": {
    const rows = await listBlogs()
    printList(Array.isArray(rows) ? rows : [])
    break
  }
  case "create": {
    if (!flags.file) {
      console.error(
        "Usage: blog-post.mjs create --file payload.json [--confirm]",
      )
      process.exit(1)
    }
    const payload = JSON.parse(fs.readFileSync(flags.file, "utf8"))
    const { errors, article, id } = validatePayload(payload)
    if (errors.length) {
      console.error("Invalid blog-post:")
      for (const e of errors) console.error(`  - ${e}`)
      process.exit(1)
    }
    const existing = await getById(id)
    if (existing) {
      console.error(`id already exists: ${id}`)
      process.exit(1)
    }
    const row = buildRow(payload, { id, article })
    console.log(`Would INSERT blog-post id=${id}`)
    console.log(`Binflow: blogArticle.* / blogFeed.${id}.*`)
    console.log(`Detail: /posts/${id}/…`)
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    const result = await sql(
      `INSERT INTO posts (id, title, lead, img, status, sections, keywords, category, year)
       VALUES (
         :id,
         :title::json,
         :lead::json,
         :img,
         :status::json,
         :sections::json,
         :keywords::json,
         NULL,
         NULL
       )
       RETURNING id, category, updated_at`,
      {
        id: row.id,
        title: JSON.stringify(row.title),
        lead: JSON.stringify(row.lead),
        img: row.img,
        status: JSON.stringify(row.status),
        sections: JSON.stringify(row.sections),
        keywords: JSON.stringify(row.keywords),
      },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  case "update": {
    if (!flags.id || !flags.file) {
      console.error(
        "Usage: blog-post.mjs update --id kebab-id --file payload.json [--confirm]",
      )
      process.exit(1)
    }
    const payload = JSON.parse(fs.readFileSync(flags.file, "utf8"))
    payload.id = flags.id
    const { errors, article, id } = validatePayload(payload)
    if (errors.length) {
      console.error("Invalid blog-post:")
      for (const e of errors) console.error(`  - ${e}`)
      process.exit(1)
    }
    const existing = await getById(id)
    if (!existing) {
      console.error(`id not found: ${id}`)
      process.exit(1)
    }
    const existingCategory = (existing.category ?? "").toString().trim()
    if (existingCategory && PROJECT_CATEGORIES.includes(existingCategory)) {
      console.error(
        `id ${id} is a project post (category=${existingCategory}); use project-post`,
      )
      process.exit(1)
    }
    const row = buildRow(payload, { id, article })
    console.log(`Would UPDATE blog-post id=${id}`)
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    const result = await sql(
      `UPDATE posts SET
         title = :title::json,
         lead = :lead::json,
         img = :img,
         status = :status::json,
         sections = :sections::json,
         keywords = :keywords::json,
         category = NULL,
         year = NULL,
         updated_at = NOW()
       WHERE id = :id
       RETURNING id, category, updated_at`,
      {
        id: row.id,
        title: JSON.stringify(row.title),
        lead: JSON.stringify(row.lead),
        img: row.img,
        status: JSON.stringify(row.status),
        sections: JSON.stringify(row.sections),
        keywords: JSON.stringify(row.keywords),
      },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  case "delete": {
    if (!flags.id) {
      console.error("Usage: blog-post.mjs delete --id kebab-id [--confirm]")
      process.exit(1)
    }
    const existing = await getById(flags.id)
    if (!existing) {
      console.error(`id not found: ${flags.id}`)
      process.exit(1)
    }
    const existingCategory = (existing.category ?? "").toString().trim()
    if (existingCategory && PROJECT_CATEGORIES.includes(existingCategory)) {
      console.error(
        `id ${flags.id} is a project post (category=${existingCategory}); use project-post`,
      )
      process.exit(1)
    }
    console.log(`Would DELETE blog-post id=${flags.id}`)
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    const result = await sql(
      `DELETE FROM posts WHERE id = :id
         AND (category IS NULL OR category = '')
       RETURNING id, category`,
      { id: flags.id },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  default:
    console.error("Commands: list | create | update | delete")
    console.error(
      "Examples:\n  node .agents/skills/blog-post/scripts/blog-post.mjs list\n  node .agents/skills/blog-post/scripts/blog-post.mjs create --file ./blog.json --confirm\n  node .agents/skills/blog-post/scripts/blog-post.mjs delete --id my-blog --confirm",
    )
    process.exit(1)
}
