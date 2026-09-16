# Sections cookbook

How to author a new section component and publish matching CMS JSON.

## Rules of thumb

1. One file: `src/components/sections/SectionName.astro`
2. Typed `Props` with `locale: Locale` and optional-safe fields
3. Never fetch; never import `src/lib/orbitype/`
4. Render CMS HTML only through `<SafeHtml />`
5. 60–100 lines target, 150 hard max
6. Put the JSON snippet in a leading comment — human-readable key first, `_orbi` last
7. No `@apply` inside `<style>` blocks; no hardcoded hex colours

No registration file. The registry globs `Section*.astro` by filename.

## Add a section checklist

1. Create the `.astro` file with typed props and a leading JSON comment
2. Confirm the filename matches `_orbi.component` exactly (case included)
3. Append JSON via MCP/`sql_crud_execute` with `RETURNING`
4. Re-read the row; confirm a flat array
5. Open the page
6. `pnpm run typecheck && pnpm run lint`

## Starter catalogue

| Component               | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `SectionSpacer`         | Vertical space (`height: number`)       |
| `SectionProse`          | Heading + rich text                     |
| `SectionQuote`          | Pull quote                              |
| `SectionHero`           | Above-the-fold band                     |
| `SectionFeatureGrid`    | Feature cards                           |
| `SectionCta`            | Conversion band                         |
| `SectionFeatureCallout` | Highlight / default callout (`variant`) |
| `SectionWelcome`        | First-run setup wizard                  |
| `SectionTeamGrid`       | Team portrait grid (`members[]`)        |

## Team members (`SectionTeamGrid`)

Each card is one object in `members[]` (not a separate section). Alta/baja via skills `/new-employe` and `/delete-employe`.

```json
{
  "id": "teamGrid",
  "members": [
    {
      "name": { "de": "Stefanie Burren", "en": "Stefanie Burren" },
      "role": {
        "de": "Zeichnerin EFZ Architektur",
        "en": "Zeichnerin EFZ Architektur"
      },
      "studies": [],
      "image": "/images/team/stefanie-burren.jpg",
      "imageAlt": { "de": "Stefanie Burren", "en": "Stefanie Burren" },
      "phone": "+41 62 798 1071",
      "email": "stefanie.burren@bhend-architektur.ch",
      "mailLabel": { "de": "Mail", "en": "Mail" }
    }
  ],
  "_orbi": { "component": "SectionTeamGrid" }
}
```

`email` is required and drives `mailto:` on the Mail control. `studies` (optional) open under `<details>` when non-empty.

## Example: SectionFeatureCallout

```json
{
  "title": { "en": "Why teams switch", "de": "Warum Teams wechseln" },
  "content": {
    "en": "<p>Run content and automation in one place.</p>",
    "de": "<p>Content und Automatisierung an einem Ort.</p>"
  },
  "variant": "highlight",
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

Unknown `_orbi.component` values render `DebugPanel.astro` with the payload and the list of known section names — never a blank page or a 500.
