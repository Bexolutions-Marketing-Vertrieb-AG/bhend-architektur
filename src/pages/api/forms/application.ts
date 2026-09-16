import type { APIRoute } from "astro"
import { z } from "zod"
import {
  MAIL_FROM_EMAIL,
  MAIL_FROM_NAME,
  MAIL_TO_EMAIL,
} from "astro:env/server"
import { PUBLIC_SITE_NAME } from "astro:env/client"
import { isEmailConfigured, sendEmail } from "~/lib/email"
import { insertContact } from "~/lib/orbitype/contacts"
import { clientKey, rateLimit } from "~/lib/rate-limit"

export const prerender = false

const APPLICATION_TYPES = [
  "Schnuppertag",
  "Bewerbung Lehrstelle",
  "Bewerbung freie Stelle",
  "Spontanbewerbung",
] as const

const schema = z.object({
  applicationType: z.enum(APPLICATION_TYPES),
  date: z.string().trim().max(120).optional().default(""),
  salutation: z.string().trim().max(40).optional().default(""),
  first_name: z.string().trim().min(1).max(120),
  last_name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  cvFilename: z.string().trim().max(260).optional().default(""),
  // Honeypot
  website: z.string().max(200).optional().default(""),
})

async function readBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData()
    const out: Record<string, string> = {}
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") {
        out[key] = value
        continue
      }
      if (key === "cv" && value instanceof File && value.name) {
        out.cvFilename = value.name
      }
    }
    return out
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("application/json")
  ) {
    if (contentType.includes("application/json")) {
      return (await request.json()) as Record<string, string>
    }
    const form = await request.formData()
    return Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, String(v)]),
    )
  }
  try {
    return (await request.json()) as Record<string, string>
  } catch {
    const form = await request.formData()
    return Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, String(v)]),
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`application:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!limited.ok) {
    return json({ ok: false, message: "Too many requests" }, 429, {
      "Retry-After": String(limited.retryAfterSec),
    })
  }

  let raw: Record<string, string>
  try {
    raw = await readBody(request)
  } catch {
    return json({ ok: false, message: "Invalid request body" }, 400)
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      400,
    )
  }

  const data = parsed.data
  if (data.website) {
    return json({ ok: true, message: "Sent", emailed: false })
  }

  const topic = data.applicationType
  const messageLines = [
    `Bewerbungstyp: ${data.applicationType}`,
    data.date ? `Datum: ${data.date}` : "",
    data.salutation ? `Anrede: ${data.salutation}` : "",
    data.cvFilename ? `Lebenslauf (Dateiname): ${data.cvFilename}` : "",
    "",
    data.message,
  ].filter(Boolean)
  const message = messageLines.join("\n")

  let emailed = false
  const to = MAIL_TO_EMAIL
  const from = MAIL_FROM_EMAIL
  if (to && from && isEmailConfigured()) {
    try {
      await sendEmail({
        to,
        from,
        fromName: MAIL_FROM_NAME || PUBLIC_SITE_NAME,
        subject: `Bewerbung: ${data.applicationType} — ${data.first_name} ${data.last_name}`,
        text: [
          `Name: ${data.salutation} ${data.first_name} ${data.last_name}`.trim(),
          `Email: ${data.email}`,
          data.phone ? `Telefon: ${data.phone}` : "",
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      })
      emailed = true
    } catch (error) {
      console.error("[application] email failed:", error)
    }
  }

  try {
    await insertContact({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      topic,
      message,
    })
  } catch (error) {
    console.error("[application] insert failed:", error)
    if (!emailed) {
      return json(
        {
          ok: false,
          message:
            "Bewerbung konnte nicht gespeichert werden. Bitte später erneut versuchen oder per E-Mail melden.",
        },
        502,
      )
    }
  }

  return json({
    ok: true,
    message: emailed
      ? "Bewerbung gesendet"
      : "Bewerbung gespeichert (E-Mail-Provider noch nicht verbunden)",
    emailed,
  })
}

function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  })
}
