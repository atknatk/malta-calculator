/**
 * Cloudflare Turnstile sunucu doğrulaması
 * Env: NEXT_PUBLIC_TURNSTILE_SITE_KEY (widget) + TURNSTILE_SECRET_KEY (sunucu)
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}

/**
 * Turnstile token'ını doğrular. Anahtarlar tanımlı değilse doğrulama atlanır
 * (yerel geliştirme / env eklenmeden önceki deploy) ve uyarı loglanır.
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<boolean> {
  if (!isTurnstileEnabled()) {
    console.warn("Turnstile is not configured; skipping captcha check");
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

export function getClientIp(headers: Headers): string | null {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}
