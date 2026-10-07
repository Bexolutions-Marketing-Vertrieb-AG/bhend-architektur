/**
 * Posts created before this instant keep their indexed URL
 * `/posts/<id>/<legacy-title-slug>` forever. Posts created from this instant
 * on use the clean rule in `src/lib/post-slug.ts`.
 */
export const POST_SLUG_V2_SINCE = "2026-10-08T00:00:00Z"
