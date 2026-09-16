import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionCultureBandSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  subheading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionCultureBandSchema
