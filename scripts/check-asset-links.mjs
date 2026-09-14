#!/usr/bin/env node
/**
 * Verifies that HTML pages reference stylesheets that return HTTP 200 (CSS).
 *
 * Live (post-deploy gate — not default CI):
 *   pnpm run check:asset-links -- https://www.example.com
 *   pnpm run check:asset-links -- https://www.example.com / /about
 *
 * Fixture (CI / local, no Production network):
 *   pnpm run check:asset-links -- --fixture tests/fixtures/asset-links
 *
 *   Fixture layout:
 *     index.html          — HTML with href="/_astro/ok.css"
 *     _astro/ok.css       — real CSS file
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const args = process.argv.slice(2).filter((a) => a !== "--")

if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`Usage:
  node scripts/check-asset-links.mjs <origin> [path...]
  node scripts/check-asset-links.mjs --fixture <dir>

Live mode fetches HTML and asserts each .css href returns CSS 200.
Fixture mode reads local HTML and asserts linked files exist and look like CSS.
`)
  process.exit(args.length === 0 ? 1 : 0)
}

function cssHrefs(html) {
  return [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
}

async function checkLive(site, paths) {
  const targets = paths.length > 0 ? paths : ["/"]
  let failed = 0

  for (const pagePath of targets) {
    const pageUrl = pagePath.startsWith("http")
      ? pagePath
      : `${site}${pagePath.startsWith("/") ? pagePath : `/${pagePath}`}`
    const res = await fetch(pageUrl, { redirect: "follow" })
    if (!res.ok) {
      console.error(`FAIL  ${pageUrl} → HTTP ${res.status}`)
      failed++
      continue
    }
    const html = await res.text()
    const hrefs = cssHrefs(html)
    if (hrefs.length === 0) {
      console.warn(`WARN  ${pageUrl} — no .css href found (dev inject?)`)
      continue
    }
    for (const href of hrefs) {
      const cssUrl = href.startsWith("http")
        ? href
        : new URL(href, pageUrl).toString()
      const css = await fetch(cssUrl, { redirect: "follow" })
      const ct = css.headers.get("content-type") || ""
      if (!css.ok || !/css/i.test(ct)) {
        console.error(`FAIL  ${cssUrl} → HTTP ${css.status} (${ct})`)
        failed++
      } else {
        console.log(`ok    ${cssUrl}`)
      }
    }
  }

  return failed
}

function checkFixture(dir) {
  const root = path.resolve(dir)
  if (!fs.existsSync(root)) {
    console.error(`FAIL  fixture dir missing: ${root}`)
    return 1
  }

  const htmlFiles = fs
    .readdirSync(root)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(root, name))

  if (htmlFiles.length === 0) {
    console.error(`FAIL  no .html files in fixture: ${root}`)
    return 1
  }

  let failed = 0
  const base = pathToFileURL(root.endsWith(path.sep) ? root : `${root}/`).href

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8")
    const hrefs = cssHrefs(html)
    if (hrefs.length === 0) {
      console.error(`FAIL  ${file} — no .css href found`)
      failed++
      continue
    }
    for (const href of hrefs) {
      const resolved = href.startsWith("http")
        ? href
        : new URL(href.startsWith("/") ? href.slice(1) : href, base).pathname
      const cssPath = href.startsWith("http")
        ? null
        : path.join(root, href.replace(/^\//, "").split("?")[0])
      if (!cssPath || !fs.existsSync(cssPath)) {
        console.error(`FAIL  ${href} → missing (${resolved})`)
        failed++
        continue
      }
      const body = fs.readFileSync(cssPath, "utf8")
      if (!/[{:;]|@|\/\*/.test(body) && body.trim().length === 0) {
        console.error(`FAIL  ${href} → empty / not CSS-like`)
        failed++
      } else {
        console.log(`ok    ${href}`)
      }
    }
  }

  return failed
}

let failed

if (args[0] === "--fixture") {
  const dir = args[1]
  if (!dir) {
    console.error("Usage: node scripts/check-asset-links.mjs --fixture <dir>")
    process.exit(1)
  }
  failed = checkFixture(dir)
} else {
  const site = (args[0] || "").replace(/\/$/, "")
  if (!site || !/^https?:\/\//.test(site)) {
    console.error(
      "Usage: node scripts/check-asset-links.mjs <origin> [path...]",
    )
    process.exit(1)
  }
  failed = await checkLive(site, args.slice(1))
}

if (failed > 0) {
  console.error(
    `\n${failed} asset link(s) failed — see docs/template/CACHE.md (purge / skew), do not tell users to hard-refresh.`,
  )
  process.exit(1)
}
console.log("\nok    all stylesheet links returned CSS 200")
