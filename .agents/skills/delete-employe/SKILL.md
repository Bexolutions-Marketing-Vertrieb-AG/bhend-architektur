---
name: delete-employe
description: >-
  Remove a team member from SectionTeamGrid on ueber-uns/team by name.de.
  Use when the user runs /delete-employe or asks to remove a team employee card.
disable-model-invocation: true
---

# /delete-employe — remove team member

Remove one member from `SectionTeamGrid` (`id: teamGrid`) on page slug `ueber-uns/team`.

## Input

| Field  | Required | Notes                                                      |
| ------ | -------- | ---------------------------------------------------------- |
| `name` | yes      | Match against `members[].name.de` (trim, case-insensitive) |

## Workflow

1. Confirm connector:
   ```bash
   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs context
   ```
2. Load page:
   ```bash
   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs query \
     'SELECT id, slug, sections FROM pages WHERE slug = :slug LIMIT 1' \
     --bind slug=ueber-uns/team
   ```
3. Find members whose `name.de` matches:
   - **0** → stop with a clear error
   - **>1** → list matches and abort (ask for exact name)
   - **1** → show the card (name, role, email, phone) and ask for explicit confirmation
4. **Only after confirmation**, set `members` to the filtered array and:
   ```bash
   node .agents/skills/orbitype-publish/scripts/orbitype-sql.mjs mutate \
     "UPDATE pages SET sections = :sections::json, updated_at = CURRENT_TIMESTAMP WHERE slug = :slug RETURNING id, slug" \
     --bind slug=ueber-uns/team
   ```
5. Remove the matching `teamMember({…})` entry from [`src/lib/orbitype/seed-data.mjs`](src/lib/orbitype/seed-data.mjs).
6. Re-query to confirm the name is gone; reload `/ueber-uns/team`.

## Hard rules

- Named bindings; always `RETURNING`
- Never DDL
- Never delete without confirmation
- Do not touch other sections on the page
