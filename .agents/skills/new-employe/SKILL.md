---
name: new-employe
description: >-
  Add a team member to SectionTeamGrid on ueber-uns/team. Asks for name, role,
  email (required), studies, image, and phone; appends to members[] and syncs
  seed. Use when the user runs /new-employe or asks to add a team employee.
disable-model-invocation: true
---

# /new-employe — add team member

Append one member to `SectionTeamGrid` (`id: teamGrid`) on page slug `ueber-uns/team`.

## Contract (required fields)

Ask for any missing inputs before mutating:

| Field     | Required    | Notes                                        |
| --------- | ----------- | -------------------------------------------- |
| `name`    | yes         | Display name (DE). Identity key = `name.de`. |
| `role`    | yes         | Job title under the name                     |
| `email`   | **yes**     | Used for `mailto:` on the Mail control       |
| `studies` | no          | List of strings; empty = no collapsible      |
| `image`   | recommended | Path e.g. `/images/team/jane-doe.jpg`        |
| `phone`   | no          | e.g. `+41 62 798 0000`                       |

Defaults: `imageAlt` = name, `mailLabel` = `{ de: "Mail", en: "Mail" }`, mirror `en` = `de` for i18n strings.

CMS object shape:

```json
{
  "name": { "de": "…", "en": "…" },
  "role": { "de": "…", "en": "…" },
  "studies": [{ "de": "…", "en": "…" }],
  "image": "/images/team/….jpg",
  "imageAlt": { "de": "…", "en": "…" },
  "phone": "+41 …",
  "email": "name@bhend-architektur.ch",
  "mailLabel": { "de": "Mail", "en": "Mail" }
}
```

## Workflow

1. Confirm connector:
   ```bash
   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs context
   ```
   Match `ORBITYPE_EXPECTED_PROJECT_ID` / `ORBITYPE_EXPECTED_CONNECTOR_ID`.
2. Load page:
   ```bash
   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs query \
     'SELECT id, slug, sections FROM pages WHERE slug = :slug LIMIT 1' \
     --bind slug=ueber-uns/team
   ```
3. Locate section `id === "teamGrid"`. Reject if `members[].name.de` already matches `name` (trim, case-insensitive).
4. Build the member object; show the JSON and proposed append position to the user.
5. **Only after explicit confirmation**, mutate with `RETURNING`:
   ```bash
   node .agents/skills/orbitype-publish/scripts/orbitype-sql.mjs mutate \
     "UPDATE pages SET sections = :sections::json, updated_at = CURRENT_TIMESTAMP WHERE slug = :slug RETURNING id, slug" \
     --bind slug=ueber-uns/team
   ```
   Pass full `sections` JSON (other sections unchanged; only `members` appended).
6. Sync [`src/lib/orbitype/seed-data.mjs`](src/lib/orbitype/seed-data.mjs): add a matching `teamMember({…})` call inside `teamSections()`.
7. Re-query; tell the user to reload `/ueber-uns/team`.

## Hard rules

- Named bindings only; always `RETURNING`
- Never DDL
- Never invent an email — required input
- Do not mutate other pages or sections
