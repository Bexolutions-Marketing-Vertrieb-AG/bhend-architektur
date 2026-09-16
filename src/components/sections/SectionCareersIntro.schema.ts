import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionCareersIntroSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  bodySecondary: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionCareersIntroSchema
