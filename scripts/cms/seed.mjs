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
  buildSeedPages,
  buildSeedPosts,
} from "../../src/lib/orbitype/seed-data.mjs"

loadEnvFile()

const yes = hasYesFlag()

async function main() {
  if (!sqlConfigured()) {
    console.error(
      "Orbitype SQL API is not configured. Set ORBITYPE_API_SQL_KEY in .env",
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

  const pages = buildSeedPages()
  const posts = buildSeedPosts()

  console.log("• about to seed starter content")
  console.log(`  projectId:   ${context.projectId ?? "(unknown)"}`)
  console.log(`  connectorId: ${context.connectorId ?? "(unknown)"}`)
  console.log(`  pages:       ${pages.map((p) => p.slug).join(", ")}`)
  console.log(`  posts:       ${posts.length}`)

  const ok = await confirm("Insert starter rows (existing slugs skipped)?", {
    yes,
  })
  if (!ok) {
    console.log("• aborted")
    process.exit(0)
  }

  const results = []

  for (const page of pages) {
    try {
      const existing = await orbitypeSql(
        "SELECT slug FROM pages WHERE slug = :slug LIMIT 1",
        { slug: page.slug },
      )
      if (existing[0]) {
        results.push({ kind: "page", slug: page.slug, status: "skipped" })
        continue
      }

      // Strip runtime-only welcome props before insert.
      const sections = page.sections.map((section) => {
        const { hasSqlKeyConfigured: _h, apiKeysUrl: _a, ...rest } = section
        return rest
      })

      await orbitypeSql(
        `INSERT INTO pages (title, slug, lead, img, sections, keywords, head)
         VALUES (
           :title::json,
           :slug,
           :lead::json,
           :img,
           :sections::json,
           :keywords::json,
           :head::json
         )
         RETURNING id, slug`,
        {
          title: JSON.stringify(page.title),
          slug: page.slug,
          lead: JSON.stringify(page.lead ?? { en: "" }),
          img: page.img ?? "",
          sections: JSON.stringify(sections),
          keywords: JSON.stringify(page.keywords ?? []),
          head: JSON.stringify(page.head ?? {}),
        },
      )
      results.push({ kind: "page", slug: page.slug, status: "inserted" })
    } catch (error) {
      results.push({
        kind: "page",
        slug: page.slug,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const post of posts) {
    try {
      const titleEn = post.title.en
      const existing = await orbitypeSql(
        `SELECT id FROM posts WHERE title->>'en' = :title LIMIT 1`,
        { title: titleEn },
      )
      if (existing[0]) {
        results.push({ kind: "post", id: existing[0].id, status: "skipped" })
        continue
      }

      const inserted = await orbitypeSql(
        `INSERT INTO posts (title, lead, img, status, sections, keywords)
         VALUES (
           :title::json,
           :lead::json,
           :img,
           :status::json,
           :sections::json,
           :keywords::json
         )
         RETURNING id`,
        {
          title: JSON.stringify(post.title),
          lead: JSON.stringify(post.lead ?? { en: "" }),
          img: post.img ?? "",
          status: JSON.stringify(
            post.status ?? {
              options: ["draft", "review", "published"],
              value: "published",
            },
          ),
          sections: JSON.stringify(post.sections),
          keywords: JSON.stringify(post.keywords ?? []),
        },
      )
      results.push({
        kind: "post",
        id: inserted[0]?.id ?? post.id,
        status: "inserted",
      })
    } catch (error) {
      results.push({
        kind: "post",
        id: post.id,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const r of results) {
    const label = r.slug ?? r.id ?? r.kind
    const suffix = r.error ? ` — ${r.error}` : ""
    console.log(`  ${r.kind} ${label}: ${r.status}${suffix}`)
  }

  const success = results.every((r) => r.status !== "error")
  console.log(
    success
      ? "• starter content seeded (existing rows skipped)"
      : "• seed finished with errors",
  )
  process.exit(success ? 0 : 1)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
