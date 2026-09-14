#!/usr/bin/env node
/**
 * Contract: assertExpectedContext fail-closed + seed stays brand-neutral.
 */
import fs from "node:fs"
import { assertExpectedContext } from "./lib/assert-expected-context.mjs"

let failed = 0

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL  ${msg}`)
    failed++
  } else {
    console.log(`ok    ${msg}`)
  }
}

// --- expected ID contracts ---
const prevP = process.env.ORBITYPE_EXPECTED_PROJECT_ID
const prevC = process.env.ORBITYPE_EXPECTED_CONNECTOR_ID

process.env.ORBITYPE_EXPECTED_PROJECT_ID = "proj-expected"
process.env.ORBITYPE_EXPECTED_CONNECTOR_ID = "conn-expected"

try {
  assertExpectedContext({
    projectId: "proj-expected",
    connectorId: "conn-expected",
  })
  console.log("ok    matching expected IDs pass")
} catch (error) {
  console.error(`FAIL  matching should pass: ${error.message}`)
  failed++
}

try {
  assertExpectedContext({
    projectId: "proj-wrong",
    connectorId: "conn-expected",
  })
  console.error("FAIL  wrong projectId should throw")
  failed++
} catch {
  console.log("ok    wrong projectId refused")
}

try {
  assertExpectedContext({
    projectId: "proj-expected",
    connectorId: "conn-wrong",
  })
  console.error("FAIL  wrong connectorId should throw")
  failed++
} catch {
  console.log("ok    wrong connectorId refused")
}

try {
  assertExpectedContext({ projectId: null, connectorId: null })
  console.error("FAIL  unknown context with expected set should throw")
  failed++
} catch {
  console.log("ok    unknown context fail-closed when expected set")
}

if (prevP === undefined) delete process.env.ORBITYPE_EXPECTED_PROJECT_ID
else process.env.ORBITYPE_EXPECTED_PROJECT_ID = prevP
if (prevC === undefined) delete process.env.ORBITYPE_EXPECTED_CONNECTOR_ID
else process.env.ORBITYPE_EXPECTED_CONNECTOR_ID = prevC

delete process.env.ORBITYPE_EXPECTED_PROJECT_ID
delete process.env.ORBITYPE_EXPECTED_CONNECTOR_ID
try {
  assertExpectedContext({ projectId: "any", connectorId: "any" })
  console.log("ok    no expected env → allow any context")
} catch (error) {
  console.error(`FAIL  unset expected should allow: ${error.message}`)
  failed++
}

// --- seed neutrality ---
const seed = fs.readFileSync("src/lib/orbitype/seed-data.mjs", "utf8")
const banned = [
  /\bZIMA\b/i,
  /\bzima\b/,
  /opentable/i,
  /bexolutions/i,
  /client\.ch/i,
  /restaurant\s+name/i,
]
for (const re of banned) {
  assert(!re.test(seed), `seed-data has no match for ${re}`)
}
assert(
  seed.includes("SectionWelcome") || seed.includes("welcome"),
  "seed includes welcome stub",
)

assert(fs.existsSync("scripts/cms/setup.mjs"), "scripts/cms/setup.mjs exists")

if (failed > 0) {
  console.error(`\n${failed} cms setup / seed contract(s) failed`)
  process.exit(1)
}
console.log("\nok    cms setup + seed neutrality contracts passed")
