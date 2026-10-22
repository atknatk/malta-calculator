/**
 * Bordro erişim çerezleri (HMAC imzalı)
 * Değer "<expiresAt>.<signature>" biçimindedir; istemci elle "true" yazarak
 * PIN / captcha adımını atlayamaz.
 */
import { createHmac, timingSafeEqual } from "crypto";

export const ACCESS_SCOPE = {
  EMPLOYEE: "payslip_auth", // PIN (doğum tarihi) ile çalışan görüntülemesi
  VERIFY: "payslip_verify", // QR doğrulama (captcha)
} as const;

export type AccessScope = (typeof ACCESS_SCOPE)[keyof typeof ACCESS_SCOPE];

function getSecret(): string {
  const secret =
    process.env.PAYSLIP_ACCESS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("Missing PAYSLIP_ACCESS_SECRET environment variable");
  }
  return secret;
}

function sign(scope: AccessScope, payslipId: string, expiresAt: number): string {
  return createHmac("sha256", getSecret())
    .update(`${scope}:${payslipId}:${expiresAt}`)
    .digest("base64url");
}

export function accessCookieName(scope: AccessScope, payslipId: string): string {
  return `${scope}_${payslipId}`;
}

export function createAccessCookieValue(
  scope: AccessScope,
  payslipId: string,
  maxAgeSeconds: number,
  now = Date.now(),
): string {
  const expiresAt = now + maxAgeSeconds * 1000;
  return `${expiresAt}.${sign(scope, payslipId, expiresAt)}`;
}

export function isValidAccessCookie(
  scope: AccessScope,
  payslipId: string,
  value: string | undefined,
  now = Date.now(),
): boolean {
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);
  if (!signature || !Number.isFinite(expiresAt) || expiresAt < now) {
    return false;
  }
  const expected = Buffer.from(sign(scope, payslipId, expiresAt));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function accessCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: maxAgeSeconds,
  };
}
