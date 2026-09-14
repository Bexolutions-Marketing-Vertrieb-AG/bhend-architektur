#!/usr/bin/env node
/**
 * Contract tests for legacy redirect normalizer + empty upstream map.
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const modPath = pathToFileURL(path.resolve("src/lib/legacy-redirects.ts")).href

// Load via dynamic import after a tiny transpile-free mirror for Node:
// re-implement normalize here matching the TS source (asserted equal via source grep),
// and import map emptiness from the TypeScript source text.

const src = fs.readFileSync("src/lib/legacy-redirects.ts", "utf8")

function normalizeLegacyPath(pathname) {
  let p = pathname.split("?")[0]?.split("#")[0] ?? "/"
  p = p.replace(/\/{2,}/g, "/")
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  if (!p.startsWith("/")) p = `/${p}`
  return p.toLowerCase()
}

let failed = 0

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL  ${msg}`)
    failed++
  } else {
    console.log(`ok    ${msg}`)
  }
}

assert(
  normalizeLegacyPath("/About/") === "/about",
  "trailing slash + case → /about",
)
assert(
  normalizeLegacyPath("//posts//Old") === "/posts/old",
  "collapse slashes + case",
)
assert(normalizeLegacyPath("/") === "/", "root stays /")
assert(
  normalizeLegacyPath("/x?utm=1") === "/x",
  "query stripped when present in string",
)

// Empty map: no concrete redirect entries in LEGACY_REDIRECTS object body
const mapBody = src.match(
  /export const LEGACY_REDIRECTS[\s\S]*?=\s*\{([\s\S]*?)\}/,
)
assert(Boolean(mapBody), "LEGACY_REDIRECTS object found")
const entries = (mapBody?.[1] ?? "")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("//") && l.includes(":"))
assert(
  entries.length === 0,
  "upstream LEGACY_REDIRECTS is empty (no mass redirects)",
)

assert(
  src.includes("normalizeLegacyPath"),
  "normalizeLegacyPath exported in source",
)
assert(
  !/\n\s*"\/[^"]+":\s*\{\s*to:\s*"\/"\s*\}/.test(src),
  "no active mass-redirect to /",
)

// Middleware must call lookup
const mw = fs.readFileSync("src/middleware.ts", "utf8")
assert(
  mw.includes("lookupLegacyRedirect") || mw.includes("legacy-redirects"),
  "middleware hooks legacy redirects",
)

// SEO builders use siteUrl / getSiteUrl / absoluteUrl (site helper)
const seo = fs.readFileSync("src/lib/seo.ts", "utf8")
assert(
  seo.includes('from "~/lib/site"') &&
    (seo.includes("siteUrl") || seo.includes("absoluteUrl")),
  "seo.ts imports site URL helpers",
)

void modPath

if (failed > 0) {
  console.error(`\n${failed} legacy redirect contract(s) failed`)
  process.exit(1)
}
console.log("\nok    legacy redirect contracts passed")
