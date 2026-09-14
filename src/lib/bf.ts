/**
 * Attrs-only Binflow markers. No inventory loading / discovery.
 * @see docs/template/BSI.md
 */
export type BfAttrs = {
  "data-bf-id": string
  "data-bf-kind": string
  "data-bf-section": string
  "data-bf-presentation"?: string
}

export function bf(
  id: string,
  kind: string,
  section: string,
  options?: { presentation?: "background" },
): BfAttrs {
  const attrs: BfAttrs = {
    "data-bf-id": id,
    "data-bf-kind": kind,
    "data-bf-section": section,
  }
  if (options?.presentation) {
    attrs["data-bf-presentation"] = options.presentation
  }
  return attrs
}
