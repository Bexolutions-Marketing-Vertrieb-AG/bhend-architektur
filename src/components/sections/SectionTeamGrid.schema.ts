import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const memberSchema = z.object({
  name: i18nStringSchema,
  roles: z.array(i18nStringSchema).optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mailLabel: i18nStringSchema.optional(),
})

export const sectionTeamGridSchema = z.object({
  id: z.string().optional(),
  members: z.array(memberSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionTeamGridSchema
