import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

/** Single press clipping — stable `id` is the Binflow / skill key (never array index). */
export const pressPostSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  title: i18nStringSchema,
  source: i18nStringSchema.optional(),
  body: i18nStringSchema.optional(),
  images: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: i18nStringSchema.optional(),
      }),
    )
    .optional(),
})

export const sectionPressListSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  items: z.array(pressPostSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionPressListSchema
