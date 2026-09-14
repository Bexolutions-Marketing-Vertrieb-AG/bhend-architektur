#!/usr/bin/env node
/**
 * Contract: skewProtection enabled; HTML routeRules swr ≤ 60; every rule has maxAge.
 */
import fs from "node:fs"

const PATH = "astro.config.ts"
const src = fs.readFileSync(PATH, "utf8")

if (!/skewProtection:\s*true/.test(src)) {
  console.error("FAIL  adapter must set skewProtection: true")
  process.exit(1)
}

const ruleBlock = src.match(/routeRules:\s*\{([\s\S]*?)\n\s*\},/)
if (!ruleBlock) {
  console.error("FAIL  routeRules block not found")
  process.exit(1)
}

const body = ruleBlock[1]
const swrMatches = [...body.matchAll(/swr:\s*(\d+)/g)]
if (swrMatches.length === 0) {
  console.error("FAIL  no swr values in routeRules")
  process.exit(1)
}

for (const match of swrMatches) {
  const value = Number(match[1])
  if (value > 60) {
    console.error(
      `FAIL  HTML swr ${value} > 60 — long SWR + hashed /_astro causes deploy skew`,
    )
    process.exit(1)
  }
}

const maxAgeMatches = [...body.matchAll(/maxAge:\s*(\d+)/g)]
if (maxAgeMatches.length < swrMatches.length) {
  console.error("FAIL  every routeRule with swr must also set maxAge")
  process.exit(1)
}

console.log(
  `ok    skewProtection + ${swrMatches.length} HTML swr≤60 rules with maxAge`,
)
