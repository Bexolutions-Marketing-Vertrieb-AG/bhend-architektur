#!/usr/bin/env node
import { loadEnvFile } from "../lib/env.mjs"
import { confirm, hasYesFlag } from "../lib/confirm.mjs"
import {
  getConnectorContext,
  orbitypeSql,
  sqlConfigured,
} from "../lib/orbitype-sql.mjs"
import { assertExpectedContext } from "../lib/assert-expected-context.mjs"
import {
  CMS_SCHEMA_SQL_SAFE,
  CREATE_UID_FUNCTION_SQL,
} from "../../src/lib/orbitype/schema-sql.mjs"

loadEnvFile()

const yes = hasYesFlag()
const tableArg = process.argv.find((a) => a.startsWith("--table="))
const requested = tableArg ? tableArg.slice("--table=".length) : "all"

async function main() {
  if (!sqlConfigured()) {
    console.error(
      "Orbitype SQL API is not configured. Set ORBITYPE_API_SQL_KEY in .env",
    )
    process.exit(1)
  }

  const tables =
    requested === "all"
      ? Object.keys(CMS_SCHEMA_SQL_SAFE)
      : requested in CMS_SCHEMA_SQL_SAFE
        ? [requested]
        : null

  if (!tables) {
    console.error(
      `Unknown table "${requested}". Use: all, ${Object.keys(CMS_SCHEMA_SQL_SAFE).join(", ")}`,
    )
    process.exit(1)
  }

  let context = { projectId: null, connectorId: null }
  try {
    context = await getConnectorContext()
  } catch (error) {
    console.warn(
      "• could not probe connector context:",
      error instanceof Error ? error.message : error,
    )
  }

  try {
    assertExpectedContext(context)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  console.log("• about to install CMS schema")
  console.log(`  projectId:   ${context.projectId ?? "(unknown)"}`)
  console.log(`  connectorId: ${context.connectorId ?? "(unknown)"}`)
  console.log(`  tables:      ${tables.join(", ")}`)

  const ok = await confirm(
    "Install schema (CREATE FUNCTION / CREATE TABLE IF NOT EXISTS) on this connector?",
    { yes },
  )
  if (!ok) {
    console.log("• aborted")
    process.exit(0)
  }

  const results = []

  try {
    await orbitypeSql(CREATE_UID_FUNCTION_SQL)
    results.push({ table: "uid()", status: "ok" })
  } catch (error) {
    try {
      await orbitypeSql("SELECT uid() AS id")
      results.push({ table: "uid()", status: "ok" })
    } catch {
      results.push({
        table: "uid()",
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const table of tables) {
    try {
      await orbitypeSql(CMS_SCHEMA_SQL_SAFE[table])
      results.push({ table, status: "ok" })
    } catch (error) {
      results.push({
        table,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const r of results) {
    const suffix = r.error ? ` — ${r.error}` : ""
    console.log(`  ${r.table}: ${r.status}${suffix}`)
  }

  const success = results.every((r) => r.status === "ok")
  console.log(
    success
      ? "• schema installed successfully"
      : "• schema install finished with errors",
  )
  process.exit(success ? 0 : 1)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
