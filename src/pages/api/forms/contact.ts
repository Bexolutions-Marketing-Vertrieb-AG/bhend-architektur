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

const schema = z
  .object({
    name: z.string().trim().max(240).optional().default(""),
    first_name: z.string().trim().max(120).optional().default(""),
    last_name: z.string().trim().max(120).optional().default(""),
    email: z.email().max(254),
    phone: z.string().trim().max(40).optional().default(""),
    topic: z.string().trim().max(120).optional().default(""),
    message: z.string().trim().min(1).max(5000),
    privacy: z
      .union([z.literal("on"), z.literal("true"), z.literal(true)])
      .optional(),
    website: z.string().max(200).optional().default(""),
  })
  .superRefine((data, ctx) => {
    const hasName = Boolean(data.name || data.first_name)
    if (!hasName) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name is required",
      })
    }
  })

async function readBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    return request.json()
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData()
    return Object.fromEntries(form.entries())
  }
  try {
    return await request.json()
  } catch {
    const form = await request.formData()
    return Object.fromEntries(form.entries())
  }
}

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!limited.ok) {
    return json({ ok: false, message: "Too many requests" }, 429, {
      "Retry-After": String(limited.retryAfterSec),
    })
  }

  let raw: unknown
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

  const fullName = (data.name || `${data.first_name} ${data.last_name}`).trim()
  const parts = fullName.split(/\s+/)
  const first_name = data.first_name || parts[0] || fullName
  const last_name =
    data.last_name || (parts.length > 1 ? parts.slice(1).join(" ") : "—")

  let emailed = false
  const to = MAIL_TO_EMAIL
  const from = MAIL_FROM_EMAIL
  if (to && from && isEmailConfigured()) {
    try {
      await sendEmail({
        to,
        from,
        fromName: MAIL_FROM_NAME || PUBLIC_SITE_NAME,
        replyTo: data.email,
        subject: `Kontakt von ${fullName}`,
        text: [
          `Name: ${fullName}`,
          `Email: ${data.email}`,
          data.phone ? `Telefon: ${data.phone}` : "",
          data.topic ? `Firma: ${data.topic}` : "",
          "",
          data.message,
        ]
          .filter(Boolean)
          .join("\n"),
      })
      emailed = true
    } catch (error) {
      console.error("[contact] email failed:", error)
    }
  }

  try {
    await insertContact({
      first_name,
      last_name,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      message: data.message,
    })
  } catch (error) {
    console.error("[contact] insert failed:", error)
    if (!emailed) {
      return json(
        {
          ok: false,
          message:
            "Nachricht konnte nicht gespeichert werden. Bitte später erneut versuchen oder per E-Mail melden.",
        },
        502,
      )
    }
  }

  return json({
    ok: true,
    message: emailed
      ? "Vielen Dank — Ihre Nachricht wurde übermittelt."
      : "Vielen Dank — Ihre Nachricht wurde gespeichert.",
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
