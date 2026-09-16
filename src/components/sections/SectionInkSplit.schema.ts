import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionInkSplitSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  imageCaption: i18nStringSchema.optional(),
  tone: z.enum(["light", "dark"]).optional(),
  _orbi: orbiSchema,
})

export default sectionInkSplitSchema
