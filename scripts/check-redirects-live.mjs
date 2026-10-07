#!/usr/bin/env node
/**
 * Probe every legacy URL against a deployment and print a Markdown table:
 * status chain, hop count and final status.
 *
 * Usage:
 *   node scripts/check-redirects-live.mjs https://www.bhend-architektur.ch
 *   node scripts/check-redirects-live.mjs https://www.bhend-architektur.ch \
 *     --origins https://bhend-architektur.ch,http://bhend-architektur.ch,http://www.bhend-architektur.ch,https://bexo.bhend-architektur.ch
 *
 * Exit 1 when a URL needs more than one 301 (plus Vercel's forced
 * http→https 308 on http origins) or does not end in 200.
 */
import path from "node:path"
import { pathToFileURL } from "node:url"

const { LEGACY_REDIRECTS } = await import(
  pathToFileURL(path.resolve("src/lib/legacy-redirects.ts")).href
)

const [base, ...rest] = process.argv.slice(2)
if (!base) {
  console.error("Usage: check-redirects-live.mjs <baseUrl> [--origins a,b]")
  process.exit(1)
}
const originsFlag = rest.indexOf("--origins")
const extraOrigins =
  originsFlag === -1 ? [] : (rest[originsFlag + 1] ?? "").split(",")

/** Old URLs whose path survives (only the trailing slash / case changes). */
const SAME_PATH_OLD = [
  "/kontakt/",
  "/aktuell/",
  "/Aktuell/",
  "/wohnen/",
  "/industrie-gewerbe/",
  "/oeffentliche-bauten/",
  "/planung/",
  "/beratung/",
  "/brandschutz/",
  "/realisierung/",
  "/energieberatung/",
  "/bauherrenberatung/",
  "/impressum/",
  "/architektur-erleben/",
]

/** Prefix rules and project resolver samples. */
const PATTERN_OLD = [
  "/mitarbeiter/thomas-schweizer/",
  "/freie-stelle/zeicher-in/",
  "/freie-stelle/test/",
  "/bhend-architektur-blog/page/2/",
  "/author/itbexolutions-ch/",
  "/author/thomas-schweizerbhend-architektur-ch/",
  "/projekt/grosszugiges-einfamilienhaus-muhlethal/",
  "/projekte/kindergarten-oftringen/",
]

const mapPaths = Object.keys(LEGACY_REDIRECTS).flatMap((p) =>
  p.endsWith(".xml") || p.endsWith(".pdf") ? [p] : [p, `${p}/`],
)
const paths = [...mapPaths, ...SAME_PATH_OLD, ...PATTERN_OLD]

async function follow(url) {
  const chain = []
  let current = url
  for (let i = 0; i < 6; i++) {
    const res = await fetch(current, { method: "GET", redirect: "manual" })
    chain.push(res.status)
    const location = res.headers.get("location")
    if (res.status < 300 || res.status >= 400 || !location) {
      return { chain, final: current }
    }
    current = new URL(location, current).href
  }
  return { chain, final: current }
}

function verdict(origin, chain) {
  const finalOk = chain.at(-1) === 200
  const redirects = chain.slice(0, -1)
  const forcedHttps = origin.startsWith("http://") && redirects[0] === 308
  const own = forcedHttps ? redirects.slice(1) : redirects
  const oneHop = own.length <= 1 && own.every((s) => s === 301)
  return finalOk && oneHop
}

let failures = 0
const rows = []
for (const origin of [base, ...extraOrigins]) {
  for (const p of paths) {
    const { chain, final } = await follow(`${origin}${p}`)
    const ok = verdict(origin, chain)
    if (!ok) failures++
    rows.push(
      `| ${ok ? "ok" : "FAIL"} | ${origin}${p} | ${chain.join(" → ")} | ${final} |`,
    )
  }
}

console.log("| | Old URL | Status chain | Final URL |")
console.log("|---|---|---|---|")
console.log(rows.join("\n"))
console.log(`\n${rows.length - failures}/${rows.length} ok`)
if (failures > 0) process.exit(1)
