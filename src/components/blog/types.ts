import type { I18nString } from "~/types/i18n"

export interface BlogTocItem {
  id?: string
  label?: I18nString
}

export interface BlogBlock {
  id?: string
  heading?: I18nString
  body?: I18nString
  paragraphs?: I18nString[]
}

export interface BlogFaqItem {
  question?: I18nString
  answer?: I18nString
}

export interface BlogAuthorBox {
  name?: I18nString
  role?: I18nString
  credentials?: I18nString[]
}
