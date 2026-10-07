#!/usr/bin/env node
/**
 * Contract tests for the legacy redirect map (Node ≥ 22.18 imports the
 * dependency-free TS module directly): normalizer, no chains, no mass
 * redirects to `/`, middleware wiring.
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const {
  LEGACY_REDIRECTS,
  LEGACY_PREFIX_REDIRECTS,
  normalizeLegacyPath,
  lookupLegacyRedirect,
  canonicalRequestPath,
} = await import(
  pathToFileURL(path.resolve("src/lib/legacy-redirects.ts")).href
)

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
assert(canonicalRequestPath("/Wohnen/") === "/wohnen", "page path canonical")
assert(
  canonicalRequestPath("/posts/3ClhWZ/x/") === "/posts/3ClhWZ/x",
  "post ids keep case",
)

const targets = [
  ...Object.values(LEGACY_REDIRECTS),
  ...LEGACY_PREFIX_REDIRECTS.map(([, redirect]) => redirect),
].map((redirect) => redirect.to)

for (const [from, { to }] of Object.entries(LEGACY_REDIRECTS)) {
  if (normalizeLegacyPath(from) !== from) {
    assert(false, `key ${from} is not normalized`)
  }
  if (lookupLegacyRedirect(to)) {
    assert(false, `chain: ${from} → ${to} is itself redirected`)
  }
}
assert(
  targets.every((to) => to.startsWith("/") && to !== "/"),
  `${targets.length} targets are paths and none is a mass redirect to /`,
)
assert(
  targets.every((to) => canonicalRequestPath(to) === to),
  "targets are canonical (no trailing slash, no case change)",
)
assert(
  lookupLegacyRedirect("/Team/")?.to === "/ueber-uns/team",
  "lookup handles case + trailing slash",
)
assert(
  lookupLegacyRedirect("/freie-stelle/zeichner-in-schnuppertag")?.to ===
    "/architektur-erleben",
  "exact entry wins over prefix",
)

const mw = fs.readFileSync("src/middleware.ts", "utf8")
assert(
  mw.includes("lookupLegacyRedirect") && mw.includes("resolveLegacyProject"),
  "middleware hooks legacy + project redirects",
)

const seo = fs.readFileSync("src/lib/seo.ts", "utf8")
assert(
  seo.includes('from "~/lib/site"') &&
    (seo.includes("siteUrl") || seo.includes("absoluteUrl")),
  "seo.ts imports site URL helpers",
)

if (failed > 0) {
  console.error(`\n${failed} legacy redirect contract(s) failed`)
  process.exit(1)
}
console.log("\nok    legacy redirect contracts passed")
