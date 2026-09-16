---
name: project-post
description: >-
  List, create, update, delete, or move architectural project posts in Orbitype
  (posts.category = aktuell|wohnen|industrie-gewerbe|oeffentliche-bauten). Use
  when managing Aktuell / Referenzen project cards; never invent Binflow ids —
  use the card kebab-case id.
---

# Project-post (CRUD / category)

Architectural projects are **`posts`** rows with a non-null **`category`**:

| `posts.category`      | Listing page           |
| --------------------- | ---------------------- |
| `aktuell`             | `/aktuell`             |
| `wohnen`              | `/wohnen`              |
| `industrie-gewerbe`   | `/industrie-gewerbe`   |
| `oeffentliche-bauten` | `/oeffentliche-bauten` |

Phase: `aktuell` → construction layout (requires `renderImage`); other three →
Referenzen layout (requires `description`).

Sort on listing: `year` DESC, then `created_at` ASC (seed stamps Figma order;
Orbitype triggers rewrite `updated_at` on UPDATE).

Listing pages use **`SectionProjectFeed`** with `{ category }`. Card fields live
on each post as a single **`SectionProjectCard`** section (source of truth).
`[...slug].astro` injects `projects` at render time via `listProjects`.

## Binflow identity

Markers use the card `id`, never list index:

| Surface      | `data-bf-id`                       |
| ------------ | ---------------------------------- |
| Card shell   | `project.{id}.shell`               |
| Title        | `project.{id}.title`               |
| Subcategory  | `project.{id}.subcategory`         |
| Location     | `project.{id}.location`            |
| Year         | `project.{id}.year`                |
| Projekt ID   | `project.{id}.projektId` (sr-only) |
| Render       | `project.{id}.render`              |
| Description  | `project.{id}.description`         |
| Main image   | `project.{id}.mainImage`           |
| Gallery n    | `project.{id}.gallery{n}`          |
| Feed heading | `projectFeed.heading`              |

`projektId` is internal metadata (e.g. `25-34 E. Grütter Roggwil`): stored on
the card + `posts.keywords`, rendered only as `sr-only` for Binflow search — not
in the visible meta row.

## Contract (`SectionProjectCard`)

```json
{
  "id": "machbarkeitsstudie-roggwil",
  "title": { "de": "Machbarkeitsstudie …" },
  "subcategory": { "de": "Industrie" },
  "location": { "de": "Roggwil" },
  "year": 2026,
  "projektId": "25-34 E. Grütter Roggwil",
  "renderImage": "/images/aktuell/machbarkeitsstudie-roggwil/render.jpg",
  "mainImage": "/images/aktuell/machbarkeitsstudie-roggwil/main.jpg",
  "gallery": [{ "src": "/images/aktuell/…/gallery-1.jpg" }],
  "phase": "aktuell",
  "category": "aktuell",
  "_orbi": { "component": "SectionProjectCard" }
}
```

Post row also sets `title`, `img` (main), `status.published`, `category`, `year`,
and includes `projektId` in `keywords` when present.

## CLI

```bash
# List (optional filter)
node .agents/skills/project-post/scripts/project-post.mjs list
node .agents/skills/project-post/scripts/project-post.mjs list --category aktuell

# Dry-run create / update
node .agents/skills/project-post/scripts/project-post.mjs create --file ./project.json
node .agents/skills/project-post/scripts/project-post.mjs update --id kebab-id --file ./project.json

# Writes require --confirm + RETURNING
node .agents/skills/project-post/scripts/project-post.mjs create --file ./project.json --confirm
node .agents/skills/project-post/scripts/project-post.mjs update --id kebab-id --file ./project.json --confirm
node .agents/skills/project-post/scripts/project-post.mjs delete --id kebab-id --confirm
node .agents/skills/project-post/scripts/project-post.mjs set-category --id kebab-id --category wohnen --confirm
```

`--confirm` is required for any CMS write. Confirm `projectId` / `connectorId`
via `orbitype-read` context first.

## Workflow

1. Read skill + `SectionProjectCard.schema.ts`
2. `list` — see ids / categories / years
3. Propose payload or category move to the user
4. After approval → mutate with `--confirm`
5. Re-`list` + open the listing slug for that category
6. Optionally extend BSI inventory for the new `{id}`
