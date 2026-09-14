#!/usr/bin/env node
/**
 * BSI contracts: inventory YAML parses; required Home bf_ids; markers in sections;
 * no client inventory discovery script.
 */
import fs from "node:fs"
import path from "node:path"

let failed = 0

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL  ${msg}`)
    failed++
  } else {
    console.log(`ok    ${msg}`)
  }
}

const invPath = "binflow/surface-inventory.yaml"
assert(fs.existsSync(invPath), "binflow/surface-inventory.yaml exists")

const yaml = fs.readFileSync(invPath, "utf8")
assert(/^version:\s*1\b/m.test(yaml), "version: 1")
assert(/project_key:\s*\S+/.test(yaml), "project_key set")

const required = [
  "home.welcome.shell",
  "home.welcome.heading",
  "home.welcome.body",
  "home.hero.shell",
  "home.hero.heading",
  "home.hero.body",
  "home.hero.image",
  "home.hero.cta",
]
for (const id of required) {
  assert(yaml.includes(`bf_id: ${id}`), `inventory has ${id}`)
}

assert(!/sections\[\d+\]/.test(yaml), "locators do not use sections[] index")
assert(
  yaml.includes("SectionWelcome") && yaml.includes("SectionHero"),
  "paths use Section* componentIds",
)

const welcome = fs.readFileSync(
  "src/components/sections/SectionWelcome.astro",
  "utf8",
)
assert(welcome.includes("bf("), "SectionWelcome uses bf() helper")
assert(welcome.includes("home.welcome.heading"), "welcome heading bf_id")
assert(welcome.includes("home.welcome.body"), "welcome body bf_id")
assert(welcome.includes("home.welcome.shell"), "welcome shell bf_id")

const hero = fs.readFileSync(
  "src/components/sections/SectionHero.astro",
  "utf8",
)
assert(hero.includes("home.hero.shell"), "hero shell bf_id")
assert(hero.includes("home.hero.cta"), "hero cta bf_id")
assert(hero.includes("home.hero.image"), "hero image bf_id")

const bfHelper = fs.readFileSync("src/lib/bf.ts", "utf8")
assert(
  !/fetch\(|import\.meta\.glob|surface-inventory/.test(bfHelper),
  "bf() is attrs-only (no inventory load)",
)

// No client-side inventory discovery scripts under src/
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(ts|js|mjs|astro)$/.test(entry.name)) files.push(full)
  }
  return files
}

const offenders = walk("src").filter((file) => {
  if (file.endsWith("bf.ts")) return false
  const text = fs.readFileSync(file, "utf8")
  return (
    /surface-inventory\.yaml/.test(text) ||
    /binflow\/.*fetch/.test(text) ||
    /loadSurfaceInventory/.test(text)
  )
})
assert(
  offenders.length === 0,
  `no client inventory discovery (${offenders.join(", ") || "none"})`,
)

if (failed > 0) {
  console.error(`\n${failed} BSI contract(s) failed`)
  process.exit(1)
}
console.log("\nok    BSI contracts passed")
