/**
 * Cloudflare R2 (S3 uyumlu) istemcisi — bordro PDF arşivi
 * Bucket'ta Bucket Lock (saklama kuralı) açık olmalı: yüklenen nesne saklama
 * süresi boyunca silinemez ve üzerine yazılamaz.
 */
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface R2Config {
  accountId: string;
  /** Bucket jurisdiction ("eu" vb.); jurisdiction'lı bucket'lar kendi endpoint'inden erişilir */
  jurisdiction: string | null;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

function readConfig(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_PAYSLIP_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  const jurisdiction = process.env.R2_JURISDICTION?.trim().toLowerCase() || null;
  return { accountId, jurisdiction, accessKeyId, secretAccessKey, bucket };
}

export function isR2Configured(): boolean {
  return readConfig() !== null;
}

let cached: { client: S3Client; bucket: string } | null = null;

function getR2(): { client: S3Client; bucket: string } {
  if (cached) return cached;
  const config = readConfig();
  if (!config) {
    throw new Error("R2 is not configured (R2_* environment variables)");
  }
  cached = {
    client: new S3Client({
      region: "auto",
      endpoint: config.jurisdiction
        ? `https://${config.accountId}.${config.jurisdiction}.r2.cloudflarestorage.com`
        : `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
    bucket: config.bucket,
  };
  return cached;
}

export interface R2ObjectInfo {
  size: number;
  sha256: string | null;
}

/** Nesne varsa boyutunu ve yüklenirken yazılan SHA-256 metadata'sını döndürür */
export async function headR2Object(key: string): Promise<R2ObjectInfo | null> {
  const { client, bucket } = getR2();
  try {
    const head = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    return {
      size: head.ContentLength ?? 0,
      sha256: head.Metadata?.sha256 ?? null,
    };
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } })
      .$metadata?.httpStatusCode;
    if (status === 404) return null;
    throw error;
  }
}

/** PDF'i yükler; R2 SHA-256 checksum'ı doğrular, metadata'ya da yazılır */
export async function putR2Pdf(
  key: string,
  body: Buffer,
  sha256Hex: string,
  metadata: Record<string, string> = {},
): Promise<void> {
  const { client, bucket } = getR2();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "application/pdf",
      ChecksumSHA256: Buffer.from(sha256Hex, "hex").toString("base64"),
      Metadata: { ...metadata, sha256: sha256Hex },
    }),
  );
}

/** Kısa ömürlü indirme bağlantısı (bucket herkese açık değildir) */
export async function getR2DownloadUrl(
  key: string,
  filename: string,
  expiresIn = 300,
): Promise<string> {
  const { client, bucket } = getR2();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
    }),
    { expiresIn },
  );
}
