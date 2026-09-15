---
name: press-post
description: >-
  Create or delete Presse / Extern press-post items on the Orbitype page
  ueber-uns/presse-extern (SectionPressList items[]). Use when adding,
  removing, or listing press clippings; never invents Binflow ids from
  array index — always use the item kebab-case id.
---

# Press-post (create / delete)

Press clippings live on CMS page slug **`ueber-uns/presse-extern`**, section
**`id: pressList`**, component **`SectionPressList`**. Each item is a
**press-post** with a stable kebab-case **`id`** (contract:
`pressPostSchema` in `SectionPressList.schema.ts`).

## Binflow identity

Markers use the item `id`, never `items[n]`:

| Surface     | `data-bf-id`                    |
| ----------- | ------------------------------- |
| Item shell  | `pressList.press.{id}.shell`    |
| Title       | `pressList.press.{id}.title`    |
| Source line | `pressList.press.{id}.source`   |
| Body        | `pressList.press.{id}.body`     |
| Image n     | `pressList.press.{id}.image{n}` |

Locator base:

```text
orbitype:pages/ueber-uns/presse-extern/sections/pressList/items@de
```

After create/delete, update `binflow/surface-inventory.yaml` sample rows if
operators rely on inventory for that clipping.

## Contract (`pressPost`)

```json
{
  "id": "baureportage-bornapark",
  "title": { "de": "Baureportage Bornapark", "en": "Baureportage Bornapark" },
  "source": {
    "de": "Wiggertaler, September 2025",
    "en": "Wiggertaler, September 2025"
  },
  "body": { "de": "", "en": "" },
  "images": [
    {
      "src": "/images/presse-extern/baureportage-bornapark-1.jpg",
      "alt": { "de": "…" }
    }
  ]
}
```

Rules:

- `id` required, kebab-case, unique within the page
- Do not invent external article URLs as CTA hrefs
- Images under `public/images/presse-extern/` (or CMS media URLs)

## CLI

```bash
# List ids + titles (read-only)
node .agents/skills/press-post/scripts/press-post.mjs list

# Dry-run create (prints resulting items; no write)
node .agents/skills/press-post/scripts/press-post.mjs create --file ./press.json

# Create after explicit user approval
node .agents/skills/press-post/scripts/press-post.mjs create --file ./press.json --confirm

# Dry-run delete
node .agents/skills/press-post/scripts/press-post.mjs delete --id baureportage-bornapark

# Delete after explicit user approval
node .agents/skills/press-post/scripts/press-post.mjs delete --id baureportage-bornapark --confirm
```

`--confirm` is required for any CMS write. Always `RETURNING`. Confirm
`projectId` / `connectorId` via `orbitype-read` context first.

## Workflow

1. Read skill + `SectionPressList.schema.ts`
2. `list` — see existing ids
3. Propose payload / delete target to the user
4. After approval → `create` / `delete` with `--confirm`
5. Re-`list` + open `/ueber-uns/presse-extern`
6. Optionally extend BSI inventory for the new `{id}`
