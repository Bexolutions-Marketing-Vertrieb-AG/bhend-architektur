import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { PROJECT_CATEGORIES } from "~/config/projects"

const projectCardItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  title: i18nStringSchema,
  subcategory: i18nStringSchema.optional(),
  location: i18nStringSchema.optional(),
  year: z.union([z.number().int(), z.string()]).optional(),
  renderImage: z.string().optional(),
  renderImageAlt: i18nStringSchema.optional(),
  description: i18nStringSchema.optional(),
  mainImage: z.string().optional(),
  mainImageAlt: i18nStringSchema.optional(),
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: i18nStringSchema.optional(),
      }),
    )
    .optional(),
  phase: z.enum(["aktuell", "referenz"]).optional(),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  projektId: z.string().min(1).optional(),
})

export const sectionProjectFeedSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  category: z.enum(PROJECT_CATEGORIES),
  /** Injected at render time by [...slug].astro — not authored in CMS */
  projects: z.array(projectCardItemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionProjectFeedSchema
