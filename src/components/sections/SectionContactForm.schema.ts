import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionContactFormSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  lead: i18nStringSchema.optional(),
  submitLabel: i18nStringSchema.optional(),
  namePlaceholder: i18nStringSchema.optional(),
  emailPlaceholder: i18nStringSchema.optional(),
  phonePlaceholder: i18nStringSchema.optional(),
  companyPlaceholder: i18nStringSchema.optional(),
  messagePlaceholder: i18nStringSchema.optional(),
  /** Google Maps embed URL (iframe src) */
  mapEmbedUrl: z.string().min(1).optional(),
  mapTitle: i18nStringSchema.optional(),
  successMessage: i18nStringSchema.optional(),
  errorMessage: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionContactFormSchema
