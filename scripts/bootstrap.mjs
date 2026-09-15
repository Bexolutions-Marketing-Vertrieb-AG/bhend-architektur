#!/usr/bin/env node
/**
 * Interactive / flagged bootstrap for a project cloned from this template.
 * Refuses to leave template defaults (package name, "My Site", favicon, etc.).
 *
 *   pnpm run bootstrap
 *   pnpm run project:init -- --name my-site --site-name "Acme" ... --dry-run
 */
import fs from "node:fs"
import crypto from "node:crypto"
import path from "node:path"
import readline from "node:readline"
import { execSync } from "node:child_process"
import { isForbiddenProductionSiteUrl } from "./lib/site-url-guard.mjs"

const TEMPLATE_FAVICON_SHA256 =
  "30300a9d4fc6f257a77d1c660aac4d4afab2d0b5e7b70352f0a30fe2dde2b998"

const TEMPLATE_PACKAGE_NAME = "orbitype-astro-template"
const FORBIDDEN_SITE_NAMES = new Set(["", "My Site", "My Organisation"])

function parseArgs(argv) {
  const flags = {
    dryRun: false,
    yes: false,
    name: null,
    siteName: null,
    description: null,
    org: null,
    url: null,
    locale: null,
    owner: null,
    productionBranch: null,
    connector: null,
    skipFavicon: false,
    help: false,
  }
  const args = argv.filter((a) => a !== "--")
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    const next = () => args[++i]
    switch (a) {
      case "--help":
      case "-h":
        flags.help = true
        break
      case "--dry-run":
        flags.dryRun = true
        break
      case "--yes":
      case "-y":
        flags.yes = true
        break
      case "--name":
        flags.name = next()
        break
      case "--site-name":
        flags.siteName = next()
        break
      case "--description":
        flags.description = next()
        break
      case "--org":
        flags.org = next()
        break
      case "--url":
        flags.url = next()
        break
      case "--locale":
        flags.locale = next()
        break
      case "--owner":
        flags.owner = next()
        break
      case "--production-branch":
        flags.productionBranch = next()
        break
      case "--connector":
        flags.connector = next()
        break
      case "--skip-favicon-check":
        flags.skipFavicon = true
        break
      default:
        console.error(`Unknown flag: ${a}`)
        process.exit(1)
    }
  }
  return flags
}

function usage() {
  console.log(`Usage:
  node scripts/bootstrap.mjs
  node scripts/bootstrap.mjs --name my-site --site-name "Acme" --description "…" \\
    --org "Acme GmbH" --url https://www.example.com --locale en --owner "Team" [--dry-run]

Refuses template package name, empty PUBLIC_* values, "My Site" defaults, and
non-https / localhost / *.vercel.app production URLs.
`)
}

function replaceEnvLine(content, key, value) {
  const line = `${key}=${value}`
  const re = new RegExp(`^${key}=.*$`, "m")
  if (re.test(content)) return content.replace(re, line)
  return `${content.trimEnd()}\n${line}\n`
}

async function main() {
  const flags = parseArgs(process.argv.slice(2))
  if (flags.help) {
    usage()
    process.exit(0)
  }

  const interactive = !(
    flags.name &&
    flags.siteName &&
    flags.description &&
    flags.org &&
    flags.url &&
    flags.locale &&
    flags.owner
  )

  let rl = null
  const ask = async (question, fallback = "") => {
    if (!interactive && fallback !== undefined) return fallback
    if (!rl) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
    }
    return new Promise((resolve) =>
      rl.question(question, (answer) => resolve(answer)),
    )
  }

  console.log("Bootstrap / project:init — clone checklist\n")

  const name = (
    flags.name ??
    (await ask("package.json name (not orbitype-astro-template): "))
  ).trim()
  if (!name || name === TEMPLATE_PACKAGE_NAME) {
    console.error("FAIL  choose a project-specific package name")
    process.exit(1)
  }

  const siteName = (
    flags.siteName ?? (await ask('PUBLIC_SITE_NAME (not "My Site"): '))
  ).trim()
  if (FORBIDDEN_SITE_NAMES.has(siteName)) {
    console.error('FAIL  PUBLIC_SITE_NAME must not be empty or "My Site"')
    process.exit(1)
  }

  const description = (
    flags.description ?? (await ask("PUBLIC_SITE_DESCRIPTION (one sentence): "))
  ).trim()
  if (!description || description === "Describe this site in one sentence.") {
    console.error("FAIL  PUBLIC_SITE_DESCRIPTION is required")
    process.exit(1)
  }

  const org = (
    flags.org ??
    (await ask('PUBLIC_ORGANIZATION_NAME (not "My Organisation"): '))
  ).trim()
  if (FORBIDDEN_SITE_NAMES.has(org) || org === "My Organisation") {
    console.error(
      'FAIL  PUBLIC_ORGANIZATION_NAME must not be empty or "My Organisation"',
    )
    process.exit(1)
  }

  const domain = (
    flags.url ?? (await ask("Production domain (https://…): "))
  ).trim()
  if (!domain.startsWith("https://")) {
    console.error("FAIL  domain must be an https:// URL")
    process.exit(1)
  }
  const forbidden = isForbiddenProductionSiteUrl(domain)
  if (forbidden) {
    console.error(`FAIL  ${forbidden}`)
    process.exit(1)
  }

  const locale = (
    flags.locale ?? (await ask("Default locale (e.g. en, es): "))
  ).trim()
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
    console.error("FAIL  locale looks invalid")
    process.exit(1)
  }

  const owner = (flags.owner ?? (await ask("Owner / team: "))).trim()
  if (!owner) {
    console.error("FAIL  owner is required")
    process.exit(1)
  }

  const productionBranch =
    (
      flags.productionBranch ?? (await ask("Production branch [main]: "))
    ).trim() || "main"

  const connector = (
    flags.connector ?? (await ask("Orbitype connector id (optional): "))
  ).trim()

  if (!flags.skipFavicon && !flags.dryRun) {
    if (!fs.existsSync("public/favicon.png")) {
      console.error(
        "FAIL  public/favicon.png is missing. Add the project favicon before bootstrap completes.",
      )
      process.exit(1)
    }
    const faviconHash = sha256File("public/favicon.svg")
    if (
      fs.existsSync("public/favicon.svg") &&
      faviconHash === TEMPLATE_FAVICON_SHA256
    ) {
      console.error(
        "FAIL  public/favicon.svg still matches the template hash. Remove or replace it; use public/favicon.png.",
      )
      process.exit(1)
    }
  }

  const writes = []

  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
  pkg.name = name
  writes.push({
    path: "package.json",
    content: JSON.stringify(pkg, null, 2) + "\n",
  })

  let localesSrc = fs.readFileSync("src/config/locales.ts", "utf8")
  localesSrc = localesSrc.replace(
    /export const LOCALES = \[[^\]]*\] as const/,
    `export const LOCALES = ["${locale}"] as const`,
  )
  localesSrc = localesSrc.replace(
    /export const DEFAULT_LOCALE: Locale = "[^"]+"/,
    `export const DEFAULT_LOCALE: Locale = "${locale}"`,
  )
  writes.push({ path: "src/config/locales.ts", content: localesSrc })

  for (const envPath of [".env.example", ".env"]) {
    if (!fs.existsSync(envPath)) continue
    let env = fs.readFileSync(envPath, "utf8")
    env = replaceEnvLine(env, "PUBLIC_SITE_URL", domain)
    env = replaceEnvLine(env, "PUBLIC_SITE_NAME", siteName)
    env = replaceEnvLine(env, "PUBLIC_SITE_DESCRIPTION", description)
    env = replaceEnvLine(env, "PUBLIC_ORGANIZATION_NAME", org)
    writes.push({ path: envPath, content: env })
  }

  if (fs.existsSync("README.md")) {
    let readme = fs.readFileSync("README.md", "utf8")
    const title = `# ${siteName}`
    if (/^# .+/m.test(readme)) {
      readme = readme.replace(/^# .+/m, title)
    } else {
      readme = `${title}\n\n${readme}`
    }
    const oneLiner = description.endsWith(".") ? description : `${description}.`
    if (/^> .+/m.test(readme)) {
      readme = readme.replace(/^> .+/m, `> ${oneLiner}`)
    }
    writes.push({ path: "README.md", content: readme })
  }

  let commit = null
  try {
    commit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim()
  } catch {
    // leave null when not in a git checkout
  }

  const lock = {
    repository: "arrobabeto/orbitype-astro-template",
    version: pkg.version ?? "0.1.0",
    commit,
    createdAt: new Date().toISOString(),
    owner,
    productionBranch,
    connectorId: connector || null,
    domain,
    locale,
    siteName,
  }
  writes.push({
    path: "template.lock.json",
    content: JSON.stringify(lock, null, 2) + "\n",
  })

  if (flags.dryRun) {
    console.log("dry-run — would write:")
    for (const w of writes) console.log(`  ${w.path}`)
    console.log(`  package name → ${name}`)
    console.log(`  PUBLIC_SITE_NAME → ${siteName}`)
    console.log(`  PUBLIC_SITE_URL → ${domain}`)
    console.log("ok    dry-run refused template defaults and accepted inputs")
  } else {
    for (const w of writes) {
      fs.mkdirSync(path.dirname(w.path), { recursive: true })
      fs.writeFileSync(w.path, w.content)
    }
    console.log(
      "\nok    bootstrap wrote package name, PUBLIC_*, locale, README, template.lock.json",
    )
  }

  console.log(
    "      Next: pnpm run setup && pnpm run cms:setup (when keys exist)",
  )
  console.log("      See docs/template/BSI.md after sections exist.")
  if (rl) rl.close()
}

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
