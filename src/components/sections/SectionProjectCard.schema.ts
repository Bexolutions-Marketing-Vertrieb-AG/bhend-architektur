import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { PROJECT_CATEGORIES } from "~/config/projects"

const galleryItemSchema = z.object({
  src: z.string().min(1),
  alt: i18nStringSchema.optional(),
})

export const sectionProjectCardSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
    title: i18nStringSchema,
    subcategory: i18nStringSchema.optional(),
    location: i18nStringSchema.optional(),
    year: z.union([z.number().int(), z.string()]).optional(),
    /** Internal Binflow / CMS identifier — not shown in visible UI */
    projektId: z.string().min(1).optional(),
    renderImage: z.string().optional(),
    renderImageAlt: i18nStringSchema.optional(),
    description: i18nStringSchema.optional(),
    mainImage: z.string().optional(),
    mainImageAlt: i18nStringSchema.optional(),
    gallery: z.array(galleryItemSchema).optional(),
    phase: z.enum(["aktuell", "referenz"]).optional(),
    category: z.enum(PROJECT_CATEGORIES).optional(),
    _orbi: orbiSchema,
  })
  .superRefine((data, ctx) => {
    const phase =
      data.phase ??
      (data.category === "aktuell"
        ? "aktuell"
        : data.category
          ? "referenz"
          : undefined)
    if (phase === "aktuell" && !(data.renderImage ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        message: "renderImage is required for aktuell projects",
        path: ["renderImage"],
      })
    }
    if (phase === "referenz") {
      const description =
        typeof data.description === "string"
          ? data.description
          : data.description &&
            typeof data.description === "object" &&
            (data.description.de || data.description.en)
      if (!description) {
        ctx.addIssue({
          code: "custom",
          message: "description is required for referenz projects",
          path: ["description"],
        })
      }
    }
  })

export default sectionProjectCardSchema
