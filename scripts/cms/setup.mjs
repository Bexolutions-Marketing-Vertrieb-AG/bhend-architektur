#!/usr/bin/env node
/**
 * cms:setup = install-schema then seed (CLI only — never HTTP).
 * Enforces ORBITYPE_EXPECTED_PROJECT_ID / CONNECTOR_ID when set.
 */
import { spawnSync } from "node:child_process"
import { loadEnvFile } from "../lib/env.mjs"
import { assertExpectedContext } from "../lib/assert-expected-context.mjs"
import { getConnectorContext, sqlConfigured } from "../lib/orbitype-sql.mjs"

loadEnvFile()

const passthrough = process.argv.slice(2).filter((a) => a !== "--")

async function main() {
  if (!sqlConfigured()) {
    console.error(
      "Orbitype SQL API is not configured. Set ORBITYPE_API_SQL_KEY (and optionally ORBITYPE_SQL_API_KEY) in .env",
    )
    process.exit(1)
  }

  let context = { projectId: null, connectorId: null }
  try {
    context = await getConnectorContext()
  } catch (error) {
    console.error(
      "• could not probe connector context:",
      error instanceof Error ? error.message : error,
    )
    if (
      process.env.ORBITYPE_EXPECTED_PROJECT_ID ||
      process.env.ORBITYPE_EXPECTED_CONNECTOR_ID
    ) {
      process.exit(1)
    }
  }

  try {
    assertExpectedContext(context)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  console.log(
    `• cms:setup projectId=${context.projectId ?? "?"} connectorId=${context.connectorId ?? "?"}`,
  )

  const run = (script) => {
    const result = spawnSync(process.execPath, [script, ...passthrough], {
      stdio: "inherit",
      env: process.env,
    })
    if (result.status !== 0) {
      process.exit(result.status ?? 1)
    }
  }

  run(new URL("./install-schema.mjs", import.meta.url).pathname)
  run(new URL("./seed.mjs", import.meta.url).pathname)

  console.log("ok    cms:setup finished (install + seed)")
  console.log("      Set ORBITYPE_MOCK=false to read live CMS")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
