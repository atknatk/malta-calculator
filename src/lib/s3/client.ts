import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "malta-calculator";

// Allowed file types for logos
const ALLOWED_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

// Allowed file types for PDFs
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload company logo to S3
 */
export async function uploadCompanyLogo(
  companyId: string,
  file: File,
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Allowed: JPEG, PNG, WebP, SVG",
    };
  }

  // Validate file size
  if (file.size > MAX_LOGO_SIZE) {
    return {
      success: false,
      error: "File too large. Maximum size: 2MB",
    };
  }

  try {
    const extension = file.name.split(".").pop() || "png";
    const key = `calculator/logos/${companyId}/logo.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "max-age=31536000", // 1 year cache
    });

    await s3Client.send(command);

    // Generate public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-central-1"}.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}

/**
 * Upload payslip PDF to S3
 */
export async function uploadPayslipPDF(
  companyId: string,
  payslipId: string,
  pdfBuffer: Buffer,
): Promise<UploadResult> {
  try {
    const key = `calculator/payslips/${companyId}/${payslipId}.pdf`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      CacheControl: "max-age=31536000",
    });

    await s3Client.send(command);

    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "eu-central-1"}.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error("S3 PDF upload error:", error);
    return {
      success: false,
      error: "Failed to upload PDF",
    };
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("S3 delete error:", error);
    return false;
  }
}

/**
 * Generate presigned URL for direct upload (client-side upload)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600, // 1 hour
): Promise<{ url: string; key: string } | null> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return { url, key };
  } catch (error) {
    console.error("Presigned URL error:", error);
    return null;
  }
}

export { s3Client, BUCKET_NAME };
