/**
 * Bordro snapshot'ı ve parmak izi
 * Yayınlama anında belge verisi dondurulur; SHA-256 ile içeriğin sonradan
 * değişmediği doğrulanır. Hash, anahtarları sıralı kanonik JSON üzerinden
 * alınır (jsonb'de anahtar sırası korunmadığı için).
 */
import { createHash } from "crypto";
import type { PayslipDocumentProps } from "@/app/payslip/[id]/_components/payslip-document";

export const PAYSLIP_SNAPSHOT_VERSION = 1;

export interface PayslipSnapshot {
  version: number;
  issuedAt: string;
  document: PayslipDocumentProps;
}

/** Anahtarları sıralı, undefined değerleri atılmış deterministik JSON */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => (item === undefined ? "null" : canonicalJson(item))).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
}

export function hashSnapshot(snapshot: PayslipSnapshot): string {
  return createHash("sha256").update(canonicalJson(snapshot)).digest("hex");
}

/**
 * Snapshot oluşturur. JSON gidiş-dönüşü, veritabanından okunacak değerle
 * birebir aynı yapıyı (undefined'sız) garanti eder.
 */
export function createSnapshot(
  document: PayslipDocumentProps,
  issuedAt: string,
): { snapshot: PayslipSnapshot; contentHash: string } {
  const snapshot = JSON.parse(
    JSON.stringify({
      version: PAYSLIP_SNAPSHOT_VERSION,
      issuedAt,
      document,
    }),
  ) as PayslipSnapshot;
  return { snapshot, contentHash: hashSnapshot(snapshot) };
}

export function verifySnapshot(
  snapshot: PayslipSnapshot | null | undefined,
  contentHash: string | null | undefined,
): boolean {
  if (!snapshot || !contentHash) return false;
  return hashSnapshot(snapshot) === contentHash;
}

/** Ekranda gösterilecek kısa parmak izi: 4'lü gruplar halinde ilk 16 hane */
export function formatFingerprint(contentHash: string): string {
  return (
    contentHash
      .substring(0, 16)
      .toUpperCase()
      .match(/.{1,4}/g)
      ?.join(" ") ?? ""
  );
}
