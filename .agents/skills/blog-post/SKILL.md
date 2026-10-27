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
| Detail       | `/posts/{id}` (see URL rule below)           |
| Article body | one `SectionBlogArticle` in `posts.sections` |

## URL rule (`postPath` in `src/lib/post-slug.ts`)

| Post                                                        | URL                        |
| ----------------------------------------------------------- | -------------------------- |
| Created before `POST_SLUG_V2_SINCE` (`src/config/posts.ts`) | unchanged legacy URL       |
| New, kebab-case `id`                                        | `/posts/{id}`              |
| New, random `id` (Orbitype default)                         | `/posts/{id}/{title-slug}` |

- Choose the `id` as the URL: lowercase, words joined by `-`, umlauts spelled
  out (`ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`), no repeated title segment.
- New-post title slugs transliterate umlauts the same way; legacy posts keep
  their old slug so existing URLs never move.
- Renaming the title of a post with a random id changes its URL (the old one
  301s to the new one). Never rename an `id` after publishing.
- Old WordPress URLs are mapped in `src/lib/legacy-redirects.ts`; check with
  `node scripts/check-redirects-live.mjs <baseUrl>`.

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
| Quote             | `blogArticle.quote`                                   |
| FAQ               | `blogArticle.faq.shell` / `faqHeading` / `itemN.*`    |
| Mid / closing CTA | `blogArticle.midCta` / `closingCta` (`chrome_denied`) |
| Author box        | `blogArticle.authorBox`                               |
| Feed card         | `blogFeed.{postId}.shell`                             |

CTAs use `reservationMode` + `reservationTarget` (project contract:
`mailto` / `anchor` / `opentable` / `path` / `url`) — never invent hrefs from
label text. CTA markers are chrome, not copy.

## Contract V2 (`SectionBlogArticle`)

Canonical shape: `tests/fixtures/blog-b08-v2.json` (Hub dry-run for B08).

```json
{
  "id": "my-blog-slug",
  "title": { "de": "TITLE from H1…" },
  "lead": { "de": "150–160 char meta / Kurzbeschreibung from notes" },
  "img": "https://cdn.orbitype.com/…/hero.jpg",
  "keywords": ["blog", "keyword"],
  "category": null,
  "sections": [
    {
      "id": "blogArticle",
      "heading": { "de": "TITLE from H1…" },
      "title": { "de": "TITLE from H1…" },
      "subheading": { "de": "Von … | Datum · X Min. Lesezeit" },
      "image": "https://cdn.orbitype.com/…/hero.jpg",
      "imageAlt": { "de": "…" },
      "tocLabel": { "de": "Inhaltsverzeichnis" },
      "toc": [{ "id": "einleitung", "label": { "de": "Einleitung" } }],
      "blocks": [
        {
          "id": "einleitung",
          "heading": { "de": "Einleitung" },
          "body": { "de": "<p>HTML allowlist…</p><ul><li>…</li></ul>" }
        }
      ],
      "midCtaLabel": { "de": "Jetzt Erstgespräch" },
      "quote": { "de": "«…»" },
      "quoteAttribution": { "de": "Name, Rolle" },
      "faqHeading": { "de": "Häufige Fragen…" },
      "faqAnchorId": "haeufige-fragen",
      "faq": [
        {
          "question": { "de": "…" },
          "answer": { "de": "<p>…</p>" }
        }
      ],
      "closingAnchorId": "jetzt-loslegen",
      "closingHeading": { "de": "…" },
      "closingBody": { "de": "<p>…</p>" },
      "closingCtaLabel": { "de": "Gespräch vereinbaren" },
      "authorBox": {
        "name": { "de": "…" },
        "role": { "de": "…" },
        "credentials": [{ "de": "…" }]
      },
      "reservationMode": "mailto",
      "reservationTarget": "info@bhend-architektur.ch",
      "_orbi": { "component": "SectionBlogArticle" }
    }
  ]
}
```

### Field rules

| Field                                          | Rule                                                                                                                                                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id` / slug                                    | Stable URL key. Do **not** rename after publish. Hub title may differ from H1; keep existing slug (e.g. B08 stays `baubewilligung-verfahren-schritt-fuer-schritt`). New posts: align Hub title with H1 before first publish. |
| `title.de` / `heading` / section `title`       | From body H1.                                                                                                                                                                                                                |
| `lead.de`                                      | From notes `Kurzbeschreibung:` only (no first-paragraph fallback). Prefer 150–160 chars with primary keyword.                                                                                                                |
| `blocks[].body`, `faq[].answer`, `closingBody` | Sanitized HTML. Plain text still works for older posts.                                                                                                                                                                      |
| `quote` / `quoteAttribution`                   | First `<blockquote>` extracted; not left inside blocks.                                                                                                                                                                      |
| `authorBox`                                    | From `.autor-box`.                                                                                                                                                                                                           |
| `summary*`                                     | Optional legacy; omit on new V2 posts.                                                                                                                                                                                       |
| Sections                                       | Exactly one `SectionBlogArticle`. No `SectionProse`. Drop “Weiterführende Informationen”.                                                                                                                                    |

### HTML allowlist (Astro `sanitize.ts` + CMS publisher)

`p br strong em u s a ul ol li h2 h3 h4 blockquote code pre table thead tbody tr th td img figure figcaption`

- `a[href]`: `https:`, `mailto:`, or site-relative `/path`
- `img[src]`: `cdn.orbitype.com` or `/images/…`
- Map `b→strong`, `i→em`; strip scripts/styles/comments
- Prefer real `<h3>` for in-body subheads (do not flatten to `<p><strong>`)
- Text images as `<figure><img …></figure>` inside the owning block

### Render order

blocks → mid CTA → quote → FAQ → closing → authorBox

(`summary*` still renders if present, between FAQ and closing.)

`toc[].id` must match `blocks[].id` or `faqAnchorId` / `summaryAnchorId` /
`closingAnchorId`.

## CMS publisher V2 (Hub)

Do **not** enable until this Astro deploy is in production.

1. Keep flat `publishToWebsite` as default until flag `publishV2` is on.
2. Move `previewPostV2` logic into the flagged publish path (allowlist sanitizer, no flatten/list/table-to-bullets).
3. Live / duplicate check against `title.de` (H1), not Hub title alone.
4. Re-publish B08 with **same** `id` (replace, no slug change).
5. Emit `<h3>` for non-FAQ subheads.
6. Retire `previewPostV2` once V2 is the default.

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
2. Place hero under `public/images/blog/{id}/hero.jpg` (or CDN `blog-bilder`)
3. `list` — see existing blog ids
4. Propose payload to the user (prefer V2 HTML bodies)
5. After approval → mutate with `--confirm`
6. Re-`list` + open `/blog` and `/posts/{id}/…`
7. Extend `binflow/surface-inventory.yaml` for new `{postId}` / blocks when needed

Seed sample: `src/lib/orbitype/seed-blog.mjs`
(`wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung`).
Fixture V2: `tests/fixtures/blog-b08-v2.json`.
