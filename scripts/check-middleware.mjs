#!/usr/bin/env node
/**
 * Fail if src/middleware.ts is missing or no longer disables /api + 404 cache.
 */
import fs from "node:fs"

const PATH = "src/middleware.ts"
if (!fs.existsSync(PATH)) {
  console.error("FAIL  src/middleware.ts is missing — APIs would be cacheable")
  process.exit(1)
}

const content = fs.readFileSync(PATH, "utf8")
if (!content.includes("/api/") && !content.includes('"/api"')) {
  console.error("FAIL  middleware does not reference /api/")
  process.exit(1)
}
if (!content.includes("cache.set(false)") && !content.includes("no-store")) {
  console.error("FAIL  middleware does not disable API caching")
  process.exit(1)
}
if (!content.includes("status === 404") && !content.includes("status == 404")) {
  console.error("FAIL  middleware does not no-store Astro 404 responses")
  process.exit(1)
}

console.log("ok    middleware API + 404 cache guard present")
