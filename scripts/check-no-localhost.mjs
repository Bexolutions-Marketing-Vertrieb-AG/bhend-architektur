#!/usr/bin/env node
/**
 * Fail if HTML/sitemap bodies contain localhost (SEO cutover gate).
 *
 * Live (post-deploy — not default CI on localhost):
 *   pnpm run check:no-localhost -- https://www.example.com
 *   pnpm run check:no-localhost -- https://www.example.com / /sitemap.xml
 *
 * Fixture (CI):
 *   pnpm run check:no-localhost -- --fixture tests/fixtures/no-localhost
 *   Expects clean/*.html|xml to pass and dirty/*.html|xml to fail when --expect-fail
 *
 *   pnpm run check:no-localhost -- --fixture tests/fixtures/no-localhost/clean
 *   pnpm run check:no-localhost -- --fixture tests/fixtures/no-localhost/dirty --expect-fail
 */
import fs from "node:fs"
import path from "node:path"

const LOCALHOST_RE = /localhost/i

const args = process.argv.slice(2).filter((a) => a !== "--")

if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`Usage:
  node scripts/check-no-localhost.mjs <origin> [path...]
  node scripts/check-no-localhost.mjs --fixture <dir> [--expect-fail]
`)
  process.exit(args.length === 0 ? 1 : 0)
}

function scanBody(label, body) {
  if (LOCALHOST_RE.test(body)) {
    console.error(`FAIL  ${label} contains localhost`)
    return 1
  }
  console.log(`ok    ${label}`)
  return 0
}

async function checkLive(site, paths) {
  const targets =
    paths.length > 0 ? paths : ["/", "/sitemap.xml", "/robots.txt"]
  let failed = 0
  for (const p of targets) {
    const url = p.startsWith("http")
      ? p
      : `${site}${p.startsWith("/") ? p : `/${p}`}`
    const res = await fetch(url, { redirect: "follow" })
    if (!res.ok) {
      console.error(`FAIL  ${url} → HTTP ${res.status}`)
      failed++
      continue
    }
    failed += scanBody(url, await res.text())
  }
  return failed
}

function checkFixture(dir) {
  const root = path.resolve(dir)
  if (!fs.existsSync(root)) {
    console.error(`FAIL  fixture dir missing: ${root}`)
    return 1
  }
  const files = fs
    .readdirSync(root)
    .filter((n) => /\.(html|xml|txt)$/i.test(n))
    .map((n) => path.join(root, n))
  if (files.length === 0) {
    console.error(`FAIL  no html/xml/txt in ${root}`)
    return 1
  }
  let failed = 0
  for (const file of files) {
    failed += scanBody(file, fs.readFileSync(file, "utf8"))
  }
  return failed
}

let failed
const expectFail = args.includes("--expect-fail")
const filtered = args.filter((a) => a !== "--expect-fail")

if (filtered[0] === "--fixture") {
  const dir = filtered[1]
  if (!dir) {
    console.error("Usage: --fixture <dir>")
    process.exit(1)
  }
  failed = checkFixture(dir)
} else {
  const site = (filtered[0] || "").replace(/\/$/, "")
  if (!site || !/^https?:\/\//.test(site)) {
    console.error(
      "Usage: node scripts/check-no-localhost.mjs <origin> [path...]",
    )
    process.exit(1)
  }
  failed = await checkLive(site, filtered.slice(1))
}

if (expectFail) {
  if (failed === 0) {
    console.error("FAIL  --expect-fail but no localhost found")
    process.exit(1)
  }
  console.log("\nok    fixture correctly detected localhost")
  process.exit(0)
}

if (failed > 0) {
  console.error(`\n${failed} localhost leak(s) — see docs/template/SEO.md`)
  process.exit(1)
}
console.log("\nok    no localhost in scanned bodies")
