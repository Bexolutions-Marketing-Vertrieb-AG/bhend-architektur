import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema.optional(),
  text: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
})

export const sectionChecklistSplitSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  listHeading: i18nStringSchema.optional(),
  lead: i18nStringSchema.optional(),
  note: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  imageCaption: i18nStringSchema.optional(),
  tone: z.enum(["light", "dark"]).optional(),
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionChecklistSplitSchema
