import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPageHeroSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema,
  heading: i18nStringSchema,
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionPageHeroSchema
