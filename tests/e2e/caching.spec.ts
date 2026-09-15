import { expect, test } from "@playwright/test"

test.describe("caching", () => {
  test("API probe is never CDN-cached", async ({ request }) => {
    // Side-effect-free endpoint. Middleware forces cache.set(false) on /api/**
    // and the route sets no-store headers explicitly.
    const response = await request.get("/api/health/cache-probe", {
      failOnStatusCode: false,
    })

    expect(response.status()).toBe(204)

    const headers = response.headers()
    const cacheControl = [
      headers["cache-control"],
      headers["cdn-cache-control"],
      headers["vercel-cdn-cache-control"],
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    expect(cacheControl).toMatch(/no-store/)
    expect(cacheControl).not.toMatch(/s-maxage=\d+/)
  })

  test("home page renders (CDN hit verified on Vercel post-deploy)", async ({
    request,
  }) => {
    const response = await request.get("/")
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('data-bf-id="home.hero.shell"')
    expect(body).toContain("BHEND ARCHITEKTUR")
  })
})
