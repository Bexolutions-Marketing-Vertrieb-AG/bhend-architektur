import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionMapSchema = z.object({
  id: z.string().optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  mapEmbedUrl: z.string().min(1).optional(),
  mapTitle: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionMapSchema
