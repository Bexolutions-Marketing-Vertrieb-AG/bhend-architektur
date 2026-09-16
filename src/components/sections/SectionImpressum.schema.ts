import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const blockSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  heading: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
})

export const sectionImpressumSchema = z.object({
  id: z.string().optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  contactHeading: i18nStringSchema.optional(),
  /** Multiline street address (no email/phone) */
  address: i18nStringSchema.optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  /** Optional explicit tel: target; defaults from phone digits */
  phoneTel: z.string().optional(),
  blocks: z.array(blockSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionImpressumSchema
