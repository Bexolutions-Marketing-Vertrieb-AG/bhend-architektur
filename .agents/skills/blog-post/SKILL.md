---
name: blog-post
description: >-
  List, create, update, or delete blog posts in Orbitype (posts.category IS NULL).
  Use when managing Blog cards / article detail pages; never invent Binflow ids —
  use the post kebab-case id. Covers new blog, update blog, and delete blog.
---

# Blog-post (CRUD)

Blog articles are **`posts`** rows with **`category` null/empty** (project posts
use `aktuell|wohnen|industrie-gewerbe|oeffentliche-bauten`).

| Surface      | Route                                        |
| ------------ | -------------------------------------------- |
| Listing      | `/blog` (`SectionBlogFeed`)                  |
| Detail       | `/posts/{id}/{title-slug}`                   |
| Article body | one `SectionBlogArticle` in `posts.sections` |

Listing cards are derived at render time from published blog posts
(`listPosts` → `blogCardFromPost`). The article section is the CMS source of
truth for the detail page.

## Binflow identity

Markers use section `id` (default `blogArticle`) and post/block ids — never
`sections[]` index:

| Surface           | `data-bf-id`                                          |
| ----------------- | ----------------------------------------------------- |
| Article shell     | `blogArticle.shell`                                   |
| Hero image        | `blogArticle.image`                                   |
| Heading           | `blogArticle.heading`                                 |
| Subheading        | `blogArticle.subheading`                              |
| TOC               | `blogArticle.toc` / `blogArticle.tocLabel`            |
| Block             | `blogArticle.block.{blockId}.shell                    | heading | body` |
| FAQ               | `blogArticle.faq.shell` / `faqHeading` / `itemN.*`    |
| Mid / closing CTA | `blogArticle.midCta` / `closingCta` (`chrome_denied`) |
| Feed card         | `blogFeed.{postId}.shell`                             |

CTAs use `reservationMode` + `reservationTarget` (project contract:
`mailto` / `anchor` / `opentable` / `path` / `url`) — never invent hrefs from
label text. CTA markers are chrome, not copy.

## Contract (`SectionBlogArticle`)

```json
{
  "id": "my-blog-slug",
  "title": { "de": "TITLE…" },
  "lead": { "de": "Card lead / subtitle" },
  "img": "/images/blog/my-blog-slug/hero.jpg",
  "keywords": ["blog", "sanierung"],
  "category": null,
  "article": {
    "id": "blogArticle",
    "heading": { "de": "TITLE…" },
    "subheading": { "de": "Subtitle…" },
    "image": "/images/blog/my-blog-slug/hero.jpg",
    "tocLabel": { "de": "Inhaltsverzeichnis" },
    "toc": [{ "id": "einleitung", "label": { "de": "Einleitung" } }],
    "blocks": [
      {
        "id": "einleitung",
        "heading": { "de": "Einleitung" },
        "body": { "de": "…" },
        "paragraphs": [{ "de": "…" }]
      }
    ],
    "faqHeading": { "de": "Häufige Fragen…" },
    "faqAnchorId": "haeufige-fragen",
    "faq": [{ "question": { "de": "…" }, "answer": { "de": "…" } }],
    "midCtaLabel": { "de": "JETZT ERSTGESPRÄCH" },
    "summaryAnchorId": "zusammenfassung",
    "summaryHeading": { "de": "…" },
    "summaryBody": { "de": "…" },
    "closingAnchorId": "jetzt-loslegen",
    "closingHeading": { "de": "…" },
    "closingBody": { "de": "…" },
    "closingCtaLabel": { "de": "GESPRÄCH VEREINBAREN" },
    "reservationMode": "mailto",
    "reservationTarget": "info@bhend-architektur.ch",
    "_orbi": { "component": "SectionBlogArticle" }
  }
}
```

`toc[].id` must match `blocks[].id` or `faqAnchorId` / `summaryAnchorId` /
`closingAnchorId` for in-page anchors.

## CLI

```bash
# List blog posts only (category null)
node .agents/skills/blog-post/scripts/blog-post.mjs list

# Dry-run create / update
node .agents/skills/blog-post/scripts/blog-post.mjs create --file ./blog.json
node .agents/skills/blog-post/scripts/blog-post.mjs update --id kebab-id --file ./blog.json

# Writes require --confirm + RETURNING
node .agents/skills/blog-post/scripts/blog-post.mjs create --file ./blog.json --confirm
node .agents/skills/blog-post/scripts/blog-post.mjs update --id kebab-id --file ./blog.json --confirm
node .agents/skills/blog-post/scripts/blog-post.mjs delete --id kebab-id --confirm
```

`--confirm` is required for any CMS write. Confirm `projectId` / `connectorId`
via `orbitype-read` context first.

## Workflow

1. Read skill + `SectionBlogArticle.schema.ts`
2. Place hero under `public/images/blog/{id}/hero.jpg`
3. `list` — see existing blog ids
4. Propose payload to the user
5. After approval → mutate with `--confirm`
6. Re-`list` + open `/blog` and `/posts/{id}/…`
7. Extend `binflow/surface-inventory.yaml` for new `{postId}` / blocks when needed

Seed sample: `src/lib/orbitype/seed-blog.mjs`
(`wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung`).
