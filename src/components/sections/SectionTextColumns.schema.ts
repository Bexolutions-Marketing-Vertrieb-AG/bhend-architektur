import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema.optional(),
  text: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
})

export const sectionTextColumnsSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionTextColumnsSchema
