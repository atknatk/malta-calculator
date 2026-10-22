import { randomBytes } from "crypto";

// Generate a short random token (6-8 chars, alphanumeric, URL-safe)
export function generateShortToken(length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"; // No O/0/I/l/1 for clarity
  const bytes = randomBytes(length);
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}
