# Implementation prompts

Copy-paste prompts for agents when starting or operating a site from the Astro + Orbitype template. Fill `{placeholders}` before sending.

---

## Prompt 0 — Clone and initialize

```text
Clona / usa el template Astro+Orbitype y arranca un proyecto NUEVO con estos datos:

- package name (kebab-case): {name}
- PUBLIC_SITE_NAME: {siteName}
- PUBLIC_SITE_DESCRIPTION: {description}
- PUBLIC_ORGANIZATION_NAME: {orgName}
- PUBLIC_SITE_URL (producción): https://www.{domain}
- default locale: {locale}
- owner/team: {owner}
- Orbitype projectId (si existe): {projectId}
- Orbitype connectorId (si existe): {connectorId}

Reglas:
1. NO modifiques un repo de cliente existente salvo que te lo pida explícitamente.
2. pnpm install && pnpm run setup (nunca `pnpm setup`).
3. Ejecuta bootstrap / project:init con los datos de arriba: reescribe package.json,
   .env.example (placeholders), README.md y menciones genéricas en docs de arranque.
   No reescribas ADRs históricos ni metas de neutralidad del template upstream.
4. Deja ORBITYPE_MOCK=true. Seed debe ser GENÉRICO (welcome), no copy de otro cliente.
5. pnpm dev → home OK en mock.
6. Entrega: checklist de variables Vercel (docs/template/ENV.md o equivalente) y
   próximos pasos cms:install — no ejecutes DDL contra producción sin aprobación.
7. Al implementar secciones editables: sigue docs/BSI.md (inventario + data-bf-*).
```

---

## Prompt 1 — Connect live CMS (authorized machine)

```text
Conecta Orbitype en local (máquina autorizada):

1. En .env: ORBITYPE_API_SQL_KEY y ORBITYPE_SQL_API_KEY = misma key de authoring;
   ORBITYPE_EXPECTED_PROJECT_ID y ORBITYPE_EXPECTED_CONNECTOR_ID si se conocen.
2. Verifica contexto (CLI context / orbitype_get_context) = IDs esperados.
3. pnpm run cms:install && pnpm run cms:seed (o cms:setup). Confirma connector.
   Toda mutación con RETURNING. Sin DDL desde rutas HTTP ni e2e.
4. ORBITYPE_MOCK=false; pnpm dev; home desde live.
5. Resume projectId, connectorId y qué tablas se crearon.
```

---

## Prompt 2 — Page from Figma

```text
Implementa la página del frame Figma node-id {nodeId} en este repo.

- FIGMA_API_KEY y FIGMA_FILE_KEY del .env del proyecto (ignora nombres cacheados
  de otros archivos, p.ej. “Zima”).
- Contenido editorial en Orbitype; Section*.astro + Zod sidecar; rutas vía
  [...slug].astro — sin rutas marketing físicas.
- BSI (docs/BSI.md): filas en binflow/surface-inventory.yaml + markers
  data-bf-id / data-bf-kind / data-bf-section en raíces editables; locators por
  componentId (nunca índice de sections[]); prop names camelCase estándar;
  backgrounds con data-bf-presentation="background". Sin loader client-side.
- Tras implementar: fidelity check #1 y #2 vs export/screenshot Figma.
- Actualiza seed Y publica CMS (o di explícitamente “solo mock”).
- CTAs: usa el contrato del proyecto (mailto / #reservieren / OpenTable) —
  no inventes hrefs; CTA como chrome (no kind copy).
- Verifica con pnpm run typecheck / tests relevantes.
```

---

## Prompt 3 — Shipping phrases

```text
Actualiza cambios
→ git fetch origin. Si hay trabajo local, stash -u. Merge origin/develop
  (y origin/main en develop si main va adelante). Restaura stash.
→ NO commit, NO push, NO PR. Resume qué se trajo.

Sube cambios
→ fetch y compara HEAD vs origin/develop y origin/main.
→ Si local va detrás: stash si hace falta, merge remoto en develop SIN reset --hard,
  restaura stash, PARA. Resume y pide otro “Sube cambios” tras revisar.
→ Si up to date: commit (sin .env), push origin/develop, PR a main, merge,
  quédate en develop.
Un solo remote origin = el repo linkeado a Vercel.
```

---

## Prompt 4 — Post-deploy sanity (no secret)

```text
Tras un deploy a Production/Preview:

1. Para /, y 1–2 slugs clave: fetch HTML, extrae link stylesheet /_astro/*.css,
   cada uno debe ser HTTP 200.
2. Si hay 404: NO digas al cliente que haga hard refresh como solución.
   Indica Purge CDN (All content + CDN/ISR/Image) y revisa Skew Protection +
   adapter skewProtection: true.
3. Opcional: si hay Workflow CMS, prueba POST /api/revalidate con secret —
   eso es frescura de contenido, no fix de CSS.
```

---

## Prompt 5 — Reservation / CTA pass

```text
Audita CTAs de reserva e inquiry en seed + CMS live:

- “Tisch / Jetzt reservieren” → contrato OpenTable o #reservieren (uno solo).
- “anfragen” (salas) → mailto: acordado o formulario.
- No dejes /kontakt como href muerto si el destino real es mail u OpenTable.
- Speisekarte / Getränkekarte / Weinkarte → URLs de PDF canónicas o settings CMS,
  no paths con fecha que se pudren sin proceso de actualización.
Reporta divergencias seed vs live.
```

---

## Prompt 6 — Cookie / consent

```text
Banner de cookies solo en home (o según producto):

- Aparece tras delay acordado; Verstanden + Escape cierran.
- Persistencia: una vez por día calendario (cookie 1P + localStorage).
- Script inline temprano si ya dismissed → no flash.
- E2E: limpia storage una vez al inicio del test, NO en cada reload.
```

---

## Prompt 7 — SEO cutover (URL migration / replace live site)

```text
Cutover SEO antes de marcar “migración live” o reemplazo de URLs (docs/SEO.md):

1. Inventario: lista URLs productivas del sitio viejo (sitemap WP, GSC, crawl).
   Matriz old_path → new_path (o página más cercana; NUNCA todo al homepage).
2. Código: mapa 301 permanente (middleware Astro o vercel.json), un hop, tests
   del normalizador. getSiteUrl() con fallback = dominio de producción (nunca
   localhost). Canonicals SSR absolutos; sitemaps solo URLs 200; robots → índice.
3. Vercel Production: PUBLIC_SITE_URL=https://www.{domain} (no localhost ni
   *.vercel.app). Alinear www vs apex con redirects y canonicals.
4. Gate curl (dominio real o preview prod-like, no solo localhost):
   - 20+ legacy → 301 + Location correcto, sin chains
   - grep -i localhost en HTML home, 3 posts, sitemap → vacío
   - robots.txt apunta a sitemap 200
5. Post-deploy GSC (ops): quitar sitemap WP viejo, enviar el nuevo, Validate Fix
   en 404, Request Indexing top ~10 URLs. Primer paso = 301, no “penalty” ni
   on-page SEO.
```

---

## Prompt 8 — BSI label / retrofit (Binflow / Telegram)

```text
Etiqueta superficies editables con BSI (docs/BSI.md) — greenfield o retrofit:

1. Asegura binflow/surface-inventory.yaml (version 1); project_key del clone.
   bf_id = {area}.{section}.{field}. Minimal Home: shell, heading, body,
   image|background, cta si existe; chrome/nav/footer/overlay si aplica.
2. En .astro: data-bf-id, data-bf-kind, data-bf-section en raíces editables
   (no cada span). Backgrounds CSS: data-bf-presentation="background".
3. Locators por componentId (_orbi.component / id), NUNCA sections[i].
   publication_target orbitype_pages; notes si hay dual-write Git.
4. Prop names camelCase (heading, body, ctaLabel…); samples únicos por copy.
5. Sin scripts de discovery client-side; el sitio debe funcionar sin BSI.
6. Retrofit: no cambies el diseño visual; conserva nombres heurísticos existentes.
7. Verifica HTML Production/Preview: data-bf-* presentes en raíces declaradas.
```

---

## Suggested first-week order for a new client

1. Prompt 0 (init)
2. Vercel + ENV checklist (`ENV.md`)
3. Prompt 1 (CMS) when keys exist
4. Prompt 2 per Figma page (**with BSI labeling**)
5. Prompt 8 if retrofitting unlabeled surfaces or completing inventory
6. Prompt 5 (CTAs) before launch
7. **Prompt 7 (SEO cutover)** before marking URL migration / replace-live as done
8. Prompt 4 after first Production deploy
9. Prompt 3 for ongoing ship
