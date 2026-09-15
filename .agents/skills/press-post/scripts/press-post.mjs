#!/usr/bin/env node
/**
 * Create / delete / list press-post items on pages.slug = ueber-uns/presse-extern
 * section id pressList. Mutations require --confirm and always RETURNING.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
)
const PAGE_SLUG = "ueber-uns/presse-extern"
const SECTION_ID = "pressList"
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
  const flags = { confirm: false, file: null, id: null }
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

function normalizeSections(raw) {
  if (Array.isArray(raw)) return raw
  if (typeof raw === "string") return JSON.parse(raw)
  return []
}

function findPressSection(sections) {
  return sections.find(
    (s) => s?.id === SECTION_ID || s?._orbi?.component === "SectionPressList",
  )
}

function localize(value) {
  if (value == null) return ""
  if (typeof value === "string") return value
  return value.de || value.en || Object.values(value).find(Boolean) || ""
}

function validatePressPost(item, { requireImages = false } = {}) {
  const errors = []
  if (!item || typeof item !== "object") {
    return ["payload must be an object"]
  }
  if (!item.id || typeof item.id !== "string" || !ID_RE.test(item.id)) {
    errors.push('id must be kebab-case (e.g. "baureportage-bornapark")')
  }
  if (!item.title) errors.push("title is required")
  if (requireImages && !(item.images && item.images.length)) {
    errors.push("images[] should include at least one src (warn-level OK)")
  }
  if (item.images) {
    if (!Array.isArray(item.images)) errors.push("images must be an array")
    else {
      item.images.forEach((img, i) => {
        if (!img?.src) errors.push(`images[${i}].src is required`)
      })
    }
  }
  return errors
}

async function loadPage() {
  const rows = await sql(
    `SELECT id, slug, sections FROM pages WHERE slug = :slug LIMIT 1`,
    { slug: PAGE_SLUG },
  )
  const row = Array.isArray(rows) ? rows[0] : rows
  if (!row) {
    console.error(`Page not found: ${PAGE_SLUG}`)
    process.exit(1)
  }
  const sections = normalizeSections(row.sections)
  const section = findPressSection(sections)
  if (!section) {
    console.error(`Section ${SECTION_ID} / SectionPressList not found`)
    process.exit(1)
  }
  if (!Array.isArray(section.items)) section.items = []
  return { row, sections, section }
}

async function saveSections(sections) {
  return sql(
    `UPDATE pages SET sections = :sections::json, updated_at = NOW()
     WHERE slug = :slug RETURNING id, slug, updated_at`,
    { slug: PAGE_SLUG, sections: JSON.stringify(sections) },
  )
}

function printList(items) {
  if (!items.length) {
    console.log("(no press-posts)")
    return
  }
  for (const item of items) {
    const imgs = Array.isArray(item.images) ? item.images.length : 0
    console.log(
      `${item.id}\t${localize(item.title)}\timages=${imgs}\tbf=pressList.press.${item.id}.*`,
    )
  }
}

const { cmd, flags } = parseArgs(process.argv.slice(2))

switch (cmd) {
  case "list": {
    const { section } = await loadPage()
    printList(section.items)
    break
  }
  case "create": {
    if (!flags.file) {
      console.error(
        "Usage: press-post.mjs create --file payload.json [--confirm]",
      )
      process.exit(1)
    }
    const payload = JSON.parse(fs.readFileSync(flags.file, "utf8"))
    const item = payload.item ?? payload
    const errors = validatePressPost(item)
    if (errors.length) {
      console.error("Invalid press-post:")
      for (const e of errors) console.error(`  - ${e}`)
      process.exit(1)
    }
    const { sections, section } = await loadPage()
    if (section.items.some((existing) => existing.id === item.id)) {
      console.error(`id already exists: ${item.id}`)
      process.exit(1)
    }
    const next = [item, ...section.items]
    console.log(`Would insert press-post id=${item.id} (total ${next.length})`)
    console.log(`Binflow prefix: pressList.press.${item.id}`)
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    section.items = next
    const result = await saveSections(sections)
    console.log(JSON.stringify(result, null, 2))
    printList(section.items.slice(0, 5))
    break
  }
  case "delete": {
    if (!flags.id) {
      console.error("Usage: press-post.mjs delete --id kebab-id [--confirm]")
      process.exit(1)
    }
    const { sections, section } = await loadPage()
    const before = section.items.length
    const next = section.items.filter((item) => item.id !== flags.id)
    if (next.length === before) {
      console.error(`id not found: ${flags.id}`)
      process.exit(1)
    }
    console.log(
      `Would delete press-post id=${flags.id} (remaining ${next.length})`,
    )
    if (!flags.confirm) {
      console.log("Dry-run only. Re-run with --confirm after approval.")
      process.exit(0)
    }
    section.items = next
    const result = await saveSections(sections)
    console.log(JSON.stringify(result, null, 2))
    break
  }
  default:
    console.error("Commands: list | create | delete")
    console.error(
      "Examples:\n  node .agents/skills/press-post/scripts/press-post.mjs list\n  node .agents/skills/press-post/scripts/press-post.mjs create --file ./press.json --confirm\n  node .agents/skills/press-post/scripts/press-post.mjs delete --id my-clipping --confirm",
    )
    process.exit(1)
}
