/**
 * Firebase Cloud Messaging (HTTP v1) gönderici (sunucu)
 * iOS bildirimleri FCM üzerinden APNs'e, Android bildirimleri doğrudan
 * cihaza gider. firebase-admin bağımlılığı yerine servis hesabı JWT'si
 * Node crypto ile imzalanır.
 *
 * Env: FCM_SERVICE_ACCOUNT_JSON (servis hesabı JSON'u; ham ya da base64)
 */
import { createSign } from "crypto";

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

export interface PushMessage {
  title: string;
  body: string;
  /** Uygulamanın derin bağlantı için okuduğu alanlar (yalnızca string) */
  data?: Record<string, string>;
}

export type PushResult = "sent" | "unregistered" | "failed" | "disabled";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

let cachedToken: { value: string; expiresAt: number } | null = null;

export function parseServiceAccount(
  raw: string | undefined,
): ServiceAccount | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const json = trimmed.startsWith("{")
    ? trimmed
    : Buffer.from(trimmed, "base64").toString("utf8");
  try {
    const parsed = JSON.parse(json) as Partial<ServiceAccount>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }
    return parsed as ServiceAccount;
  } catch {
    return null;
  }
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Google OAuth için RS256 imzalı servis hesabı JWT'si */
export function buildServiceAccountJwt(
  account: ServiceAccount,
  nowSeconds: number,
): string {
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: FCM_SCOPE,
      aud: TOKEN_URL,
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(account.private_key).toString("base64url");
  return `${header}.${claims}.${signature}`;
}

async function getAccessToken(account: ServiceAccount): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const assertion = buildServiceAccountJwt(
    account,
    Math.floor(Date.now() / 1000),
  );
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) {
    throw new Error(`FCM OAuth failed: ${response.status}`);
  }
  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

export function isPushConfigured(): boolean {
  return parseServiceAccount(process.env.FCM_SERVICE_ACCOUNT_JSON) !== null;
}

/** Tek cihaza push gönderir. Geçersiz token "unregistered" döner. */
export async function sendPush(
  fcmToken: string,
  message: PushMessage,
): Promise<PushResult> {
  const account = parseServiceAccount(process.env.FCM_SERVICE_ACCOUNT_JSON);
  if (!account) return "disabled";

  try {
    const accessToken = await getAccessToken(account);
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            notification: { title: message.title, body: message.body },
            data: message.data ?? {},
            apns: { payload: { aps: { sound: "default" } } },
          },
        }),
      },
    );

    if (response.ok) return "sent";
    // 404 UNREGISTERED / 400 INVALID_ARGUMENT: token artık geçerli değil
    if (response.status === 404 || response.status === 400) {
      return "unregistered";
    }
    console.error("FCM send failed:", response.status, await response.text());
    return "failed";
  } catch (error) {
    console.error("FCM send error:", error);
    return "failed";
  }
}
