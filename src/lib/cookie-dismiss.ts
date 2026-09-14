/**
 * Cookie / consent dismiss storage helpers for e2e.
 * Clear dismiss keys ONCE at test start — never via addInitScript on every navigation.
 */
export const COOKIE_DISMISS_STORAGE_KEYS = [
  "cookie-consent",
  "cookie_dismissed",
  "consent-dismissed",
] as const

/**
 * Clear dismiss markers once. Call from test.beforeAll / first test setup only.
 */
export async function clearCookieDismissStorageOnce(
  clear: (key: string) => Promise<void> | void,
  keys: readonly string[] = COOKIE_DISMISS_STORAGE_KEYS,
): Promise<void> {
  for (const key of keys) {
    await clear(key)
  }
}
