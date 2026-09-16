import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"
import { RESERVATION_MODES } from "~/lib/reservation"

const tocItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  label: i18nStringSchema,
})

const blockSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  heading: i18nStringSchema.optional(),
  /** Plain text; newlines preserved */
  body: i18nStringSchema.optional(),
  /** Optional extra paragraphs after body */
  paragraphs: z.array(i18nStringSchema).optional(),
})

const faqItemSchema = z.object({
  question: i18nStringSchema,
  answer: i18nStringSchema,
})

const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case")

export const sectionBlogArticleSchema = z.object({
  id: z.string().optional(),
  title: i18nStringSchema.optional(),
  heading: i18nStringSchema.optional(),
  subheading: i18nStringSchema.optional(),
  image: z.string().optional(),
  imageAlt: i18nStringSchema.optional(),
  tocLabel: i18nStringSchema.optional(),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(blockSchema).optional(),
  faqHeading: i18nStringSchema.optional(),
  faq: z.array(faqItemSchema).optional(),
  faqAnchorId: kebabId.optional(),
  midCtaLabel: i18nStringSchema.optional(),
  summaryHeading: i18nStringSchema.optional(),
  summaryBody: i18nStringSchema.optional(),
  summaryAnchorId: kebabId.optional(),
  closingHeading: i18nStringSchema.optional(),
  closingBody: i18nStringSchema.optional(),
  closingCtaLabel: i18nStringSchema.optional(),
  closingAnchorId: kebabId.optional(),
  reservationMode: z.enum(RESERVATION_MODES).optional(),
  reservationTarget: z.string().optional(),
  ctaHref: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionBlogArticleSchema
