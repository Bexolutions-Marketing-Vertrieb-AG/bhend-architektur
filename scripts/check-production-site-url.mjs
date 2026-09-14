#!/usr/bin/env node
/**
 * Contract tests for Production PUBLIC_SITE_URL guard (no network).
 */
import {
  assertProductionSiteUrl,
  isForbiddenProductionSiteUrl,
} from "./lib/site-url-guard.mjs"

let failed = 0

function expectForbidden(url, label) {
  const err = isForbiddenProductionSiteUrl(url)
  if (!err) {
    console.error(`FAIL  expected forbidden: ${label} (${url})`)
    failed++
  } else {
    console.log(`ok    rejects ${label}`)
  }
}

function expectOk(url, label) {
  const err = isForbiddenProductionSiteUrl(url)
  if (err) {
    console.error(`FAIL  expected ok: ${label} — ${err}`)
    failed++
  } else {
    console.log(`ok    allows ${label}`)
  }
}

expectForbidden("http://localhost:4321", "localhost")
expectForbidden("https://127.0.0.1", "loopback")
expectForbidden("https://my-app.vercel.app", "vercel.app preview host")
expectForbidden("http://www.example.com", "http in production")
expectOk("https://www.example.com", "canonical https domain")

try {
  assertProductionSiteUrl("https://www.example.com", "preview")
  console.log("ok    non-production env skips guard")
} catch (error) {
  console.error(`FAIL  preview should skip: ${error.message}`)
  failed++
}

try {
  assertProductionSiteUrl("https://foo.vercel.app", "production")
  console.error("FAIL  production should reject vercel.app")
  failed++
} catch {
  console.log("ok    production assert throws on vercel.app")
}

if (failed > 0) {
  console.error(`\n${failed} production site URL contract(s) failed`)
  process.exit(1)
}
console.log("\nok    production site URL contracts passed")
