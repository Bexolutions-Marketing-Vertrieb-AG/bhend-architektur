#!/usr/bin/env node
/**
 * Export CMS rows to artifacts/cms-export-<timestamp>.json for rollback.
 */
import fs from "node:fs"
import { loadEnvFile } from "../lib/env.mjs"
import {
  getConnectorContext,
  orbitypeSql,
  sqlConfigured,
} from "../lib/orbitype-sql.mjs"
import { confirm, hasYesFlag } from "../lib/confirm.mjs"
import { assertExpectedContext } from "../lib/assert-expected-context.mjs"

loadEnvFile()

async function main() {
  if (!sqlConfigured()) {
    console.error("Missing ORBITYPE_API_SQL_KEY")
    process.exit(1)
  }

  const context = await getConnectorContext().catch(() => ({}))
  try {
    assertExpectedContext(context)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  console.log(
    `projectId=${context.projectId ?? "?"} connectorId=${context.connectorId ?? "?"}`,
  )
  const ok = await confirm("Export pages/posts/settings/templates now?", {
    yes: hasYesFlag(),
  })
  if (!ok) process.exit(0)

  const [pages, posts, settings, templates] = await Promise.all([
    orbitypeSql("SELECT * FROM pages ORDER BY slug"),
    orbitypeSql("SELECT * FROM posts ORDER BY id"),
    orbitypeSql("SELECT * FROM settings ORDER BY name"),
    orbitypeSql("SELECT * FROM templates ORDER BY name"),
  ])

  fs.mkdirSync("artifacts", { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const out = `artifacts/cms-export-${stamp}.json`
  const payload = {
    exportedAt: new Date().toISOString(),
    context,
    pages,
    posts,
    settings,
    templates,
  }
  fs.writeFileSync(out, JSON.stringify(payload, null, 2))
  console.log(`ok    wrote ${out}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
