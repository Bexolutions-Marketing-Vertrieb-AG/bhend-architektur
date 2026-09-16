#!/usr/bin/env node
/**
 * List / create / update / delete / set-category for architectural project posts.
 * Mutations require --confirm and always RETURNING.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
)

const CATEGORIES = [
  "aktuell",
  "wohnen",
  "industrie-gewerbe",
  "oeffentliche-bauten",
]
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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
    category: null,
  }
  const positionals = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--confirm") flags.confirm = true
    else if (a === "--file" && argv[i + 1]) flags.file = argv[++i]
    else if (a === "--id" && argv[i + 1]) flags.id = argv[++i]
    else if (a === "--category" && argv[i + 1]) flags.category = argv[++i]
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

function normalizeSections(raw) {
  if (Array.isArray(raw)) return raw
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }
  return []
}

function phaseFor(category) {
  return category === "aktuell" ? "aktuell" : "referenz"
}

function findCard(sections) {
  return sections.find((s) => s?._orbi?.component === "SectionProjectCard")
}

function validatePayload(payload) {
  const errors = []
  const card = payload.card ?? payload.sections?.[0] ?? payload
  const category = payload.category ?? card.category
  const id = payload.id ?? card.id

  if (!id || typeof id !== "string" || !ID_RE.test(id)) {
    errors.push('id must be kebab-case (e.g. "machbarkeitsstudie-roggwil")')
  }
  if (!CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}`)
  }
  if (!card.title && !payload.title) errors.push("title is required")

  const phase = phaseFor(category)
  if (phase === "aktuell" && !(card.renderImage ?? "").trim()) {
    errors.push("renderImage is required for aktuell projects")
  }
  if (phase === "referenz") {
    const description = card.description
    const has =
      typeof description === "string"
        ? description.trim()
        : description && (description.de || description.en)
    if (!has) errors.push("description is required for referenz projects")
  }

  return { errors, card, category, id, phase }
}

function buildRow(payload, { id, card, category, phase }) {
  const title = payload.title ?? card.title
  const year = payload.year ?? card.year ?? null
  const img = payload.img ?? card.mainImage ?? ""
  const section = {
    ...card,
    id,
    title: card.title ?? title,
    category,
    phase,
    year: card.year ?? year,
    _orbi: { component: "SectionProjectCard" },
  }
  return {
    id,
    title,
    lead: payload.lead ?? { de: "", en: "" },
    img,
    status: payload.status ?? {
      options: ["draft", "review", "published"],
      value: "published",
    },
    keywords: payload.keywords ?? [],
    category,
    year: year == null || year === "" ? null : Number(year),
    sections: [section],
  }
}

function printList(rows) {
  if (!rows.length) {
    console.log("(no project-posts)")
    return
  }
  for (const row of rows) {
    const title = localize(row.title)
    console.log(
      `${row.id}\t${row.category ?? ""}\tyear=${row.year ?? ""}\t${title}\tbf=project.${row.id}.*`,
    )
  }
}

async function listProjects(category) {
  if (category) {
    if (!CATEGORIES.includes(category)) {
      console.error(`Invalid category: ${category}`)
      process.exit(1)
    }
    return sql(
      `SELECT id, title, category, year, img, updated_at FROM posts
       WHERE status->>'value' = 'published' AND category = :category
       ORDER BY year DESC NULLS LAST, created_at ASC NULLS LAST`,
      { category },
    )
  }
  return sql(
    `SELECT id, title, category, year, img, updated_at FROM posts
     WHERE status->>'value' = 'published'
       AND category = ANY(:categories::text[])
     ORDER BY category ASC, year DESC NULLS LAST, created_at ASC NULLS LAST`,
    { categories: CATEGORIES },
  )
}

async function getById(id) {
  const rows = await sql(`SELECT * FROM posts WHERE id = :id LIMIT 1`, { id })
  return Array.isArray(rows) ? rows[0] : rows
}

const { cmd, flags } = parseArgs(process.argv.slice(2))

switch (cmd) {
  case "list": {
    const rows = await listProjects(flags.category)
    printList(Array.isArray(rows) ? rows : [])
    break
  }
  case "create": {
    if (!flags.file) {
      console.error(
        "Usage: project-post.mjs create --file payload.json [--confirm]",
      )
      process.exit(1)
    }
    const payload = JSON.parse(fs.readFileSync(flags.file, "utf8"))
    const { errors, card, category, id, phase } = validatePayload(payload)
    if (errors.length) {
      console.error("Invalid project-post:")
      for (const e of errors) console.error(`  - ${e}`)
      process.exit(1)
    }
    const existing = await getById(id)
    if (existing) {
      console.error(`id already exists: ${id}`)
      process.exit(1)
    }
    const row = buildRow(payload, { id, card, category, phase })
    console.log(
      `Would INSERT project-post id=${id} category=${category} year=${row.year}`,
    )
    console.log(`Binflow prefix: project.${id}`)
    console.log(`Listing: /${category}`)
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
         :category,
         :year
       )
       RETURNING id, category, year, updated_at`,
      {
        id: row.id,
        title: JSON.stringify(row.title),
        lead: JSON.stringify(row.lead),
        img: row.img,
        status: JSON.stringify(row.status),
        sections: JSON.stringify(row.sections),
        keywords: JSON.stringify(row.keywords),
        category: row.category,
        year: row.year,
      },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  case "update": {
    if (!flags.id || !flags.file) {
      console.error(
        "Usage: project-post.mjs update --id kebab-id --file payload.json [--confirm]",
      )
      process.exit(1)
    }
    const payload = JSON.parse(fs.readFileSync(flags.file, "utf8"))
    payload.id = flags.id
    const { errors, card, category, id, phase } = validatePayload(payload)
    if (errors.length) {
      console.error("Invalid project-post:")
      for (const e of errors) console.error(`  - ${e}`)
      process.exit(1)
    }
    const existing = await getById(id)
    if (!existing) {
      console.error(`id not found: ${id}`)
      process.exit(1)
    }
    const row = buildRow(payload, { id, card, category, phase })
    console.log(
      `Would UPDATE project-post id=${id} category=${category} year=${row.year}`,
    )
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
         category = :category,
         year = :year,
         updated_at = NOW()
       WHERE id = :id
       RETURNING id, category, year, updated_at`,
      {
        id: row.id,
        title: JSON.stringify(row.title),
        lead: JSON.stringify(row.lead),
        img: row.img,
        status: JSON.stringify(row.status),
        sections: JSON.stringify(row.sections),
        keywords: JSON.stringify(row.keywords),
        category: row.category,
        year: row.year,
      },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  case "delete": {
    if (!flags.id) {
      console.error("Usage: project-post.mjs delete --id kebab-id [--confirm]")
      process.exit(1)
    }
    const existing = await getById(flags.id)
    if (!existing) {
      console.error(`id not found: ${flags.id}`)
      process.exit(1)
    }
    console.log(
      `Would DELETE project-post id=${flags.id} category=${existing.category}`,
    )
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    const result = await sql(
      `DELETE FROM posts WHERE id = :id RETURNING id, category`,
      { id: flags.id },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  case "set-category": {
    if (!flags.id || !flags.category) {
      console.error(
        "Usage: project-post.mjs set-category --id kebab-id --category <cat> [--confirm]",
      )
      process.exit(1)
    }
    if (!CATEGORIES.includes(flags.category)) {
      console.error(`Invalid category: ${flags.category}`)
      process.exit(1)
    }
    const existing = await getById(flags.id)
    if (!existing) {
      console.error(`id not found: ${flags.id}`)
      process.exit(1)
    }
    const sections = normalizeSections(existing.sections)
    const card = findCard(sections)
    const phase = phaseFor(flags.category)
    if (card) {
      card.category = flags.category
      card.phase = phase
    }
    console.log(
      `Would set category ${existing.category} → ${flags.category} for id=${flags.id}`,
    )
    console.log(`Listing moves to /${flags.category}`)
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    const result = await sql(
      `UPDATE posts SET
         category = :category,
         sections = :sections::json,
         updated_at = NOW()
       WHERE id = :id
       RETURNING id, category, year, updated_at`,
      {
        id: flags.id,
        category: flags.category,
        sections: JSON.stringify(sections),
      },
    )
    console.log(JSON.stringify(result, null, 2))
    break
  }
  default:
    console.error("Commands: list | create | update | delete | set-category")
    console.error(
      "Examples:\n  node .agents/skills/project-post/scripts/project-post.mjs list --category aktuell\n  node .agents/skills/project-post/scripts/project-post.mjs create --file ./project.json --confirm\n  node .agents/skills/project-post/scripts/project-post.mjs set-category --id my-project --category wohnen --confirm",
    )
    process.exit(1)
}
