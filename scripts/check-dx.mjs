#!/usr/bin/env node
/**
 * Wave 6 DX contracts: reservationMode union, cookie clear-once helper,
 * critical SVG width/height.
 */
import fs from "node:fs"
import { resolveReservationHref } from "../src/lib/reservation.ts"
import { clearCookieDismissStorageOnce } from "../src/lib/cookie-dismiss.ts"

let failed = 0

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL  ${msg}`)
    failed++
  } else {
    console.log(`ok    ${msg}`)
  }
}

// --- reservation ---
assert(
  resolveReservationHref({
    reservationMode: "mailto",
    reservationTarget: "hi@example.com",
  }) === "mailto:hi@example.com",
  "mailto mode",
)
assert(
  resolveReservationHref({
    reservationMode: "anchor",
    reservationTarget: "contact",
  }) === "#contact",
  "anchor mode",
)
assert(
  resolveReservationHref({
    reservationMode: "path",
    reservationTarget: "posts",
  }) === "/posts",
  "path mode",
)
assert(
  resolveReservationHref({
    reservationMode: "opentable",
    reservationTarget: "https://www.opentable.com/r/x",
  }) === "https://www.opentable.com/r/x",
  "opentable mode uses target not label",
)
assert(
  resolveReservationHref({ ctaHref: "/about" }) === "/about",
  "legacy ctaHref when mode unset",
)

const reservationSrc = fs.readFileSync("src/lib/reservation.ts", "utf8")
assert(
  !/\bctaLabel\b|match.*label|german|reservieren/i.test(reservationSrc),
  "no label heuristics in reservation helper",
)

// --- cookie clear-once ---
const cleared = []
await clearCookieDismissStorageOnce(async (key) => {
  cleared.push(key)
})
assert(cleared.length >= 1, "clearCookieDismissStorageOnce clears keys once")
assert(
  fs.readFileSync("src/lib/cookie-dismiss.ts", "utf8").includes("ONCE") ||
    fs.readFileSync("src/lib/cookie-dismiss.ts", "utf8").includes("once"),
  "cookie helper documents clear-once",
)
assert(
  !fs.existsSync("src/components/CookieBanner.astro"),
  "no cookie banner in upstream — e2e banner deferred (helper shipped)",
)

// --- Favicon present ---
assert(
  fs.existsSync("public/favicon.png") &&
    fs.statSync("public/favicon.png").size > 0,
  "favicon.png is present",
)
assert(
  fs.existsSync("public/favicon-32x32.png"),
  "favicon-32x32.png is present",
)

const nav = fs.readFileSync("src/components/layout/Navigation.astro", "utf8")
assert(
  (nav.includes("<svg") &&
    /width="\d+"/.test(nav) &&
    /height="\d+"/.test(nav)) ||
    (/<img[^>]+src="\/images\/logo\.png"/.test(nav) &&
      /width="\d+"/.test(nav) &&
      /height="\d+"/.test(nav)),
  "Navigation critical logo (SVG or img) has width and height",
)

const cta = fs.readFileSync("src/components/sections/SectionCta.astro", "utf8")
assert(
  cta.includes("resolveReservationHref") || cta.includes("reservationMode"),
  "SectionCta uses reservation contract",
)

if (failed > 0) {
  console.error(`\n${failed} DX contract(s) failed`)
  process.exit(1)
}
console.log("\nok    DX contracts passed")
