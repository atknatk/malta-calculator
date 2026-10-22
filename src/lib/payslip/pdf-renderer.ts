/**
 * Sunucu tarafı bordro PDF'i (Cloudflare Browser Rendering)
 * Cloudflare'in headless Chromium'u, imzalı ve kısa ömürlü bağlantıyla
 * /archive-render/[id] sayfasını açar ve print stilleriyle A4 PDF üretir.
 * Böylece arşivdeki PDF, ekrandaki bordroyla aynı bileşenden çizilir.
 */
import {
  ACCESS_SCOPE,
  createAccessCookieValue,
} from "@/lib/payslip/access-cookie";

const RENDER_LINK_TTL_SECONDS = 300;
const RENDER_TIMEOUT_MS = 60_000;

function getRenderBaseUrl(): string | null {
  const explicit = process.env.PAYSLIP_RENDER_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return production ? `https://${production}` : null;
}

export function isPdfRendererConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_BROWSER_RENDERING_TOKEN &&
      getRenderBaseUrl(),
  );
}

/** Cloudflare'in açacağı imzalı çizim bağlantısı */
export function buildRenderUrl(payslipId: string, now = Date.now()): string {
  const baseUrl = getRenderBaseUrl();
  if (!baseUrl) throw new Error("PAYSLIP_RENDER_BASE_URL is not set");
  const token = createAccessCookieValue(
    ACCESS_SCOPE.RENDER,
    payslipId,
    RENDER_LINK_TTL_SECONDS,
    now,
  );
  return `${baseUrl}/archive-render/${payslipId}?t=${encodeURIComponent(token)}`;
}

/** Yayınlanmış bordronun PDF'ini üretir */
export async function renderPayslipPdf(payslipId: string): Promise<Buffer> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_BROWSER_RENDERING_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Browser Rendering is not configured");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/pdf`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: buildRenderUrl(payslipId),
        gotoOptions: { waitUntil: "networkidle2", timeout: 30_000 },
        // Sayfa hazır olduğunda işaretlenir (bkz. archive-render sayfası)
        waitForSelector: { selector: "[data-payslip-document]", timeout: 15_000 },
        pdfOptions: {
          format: "a4",
          printBackground: true,
          preferCSSPageSize: true,
        },
      }),
      signal: AbortSignal.timeout(RENDER_TIMEOUT_MS),
    },
  );

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || !contentType.includes("application/pdf")) {
    const detail = (await response.text().catch(() => "")).substring(0, 300);
    throw new Error(
      `PDF render failed (${response.status}): ${detail || contentType}`,
    );
  }

  const pdf = Buffer.from(await response.arrayBuffer());
  if (pdf.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new Error("PDF render returned an invalid document");
  }
  return pdf;
}
