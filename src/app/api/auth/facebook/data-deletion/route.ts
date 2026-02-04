import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface FacebookSignedRequest {
  user_id: string;
  algorithm: string;
  issued_at: number;
}

function base64UrlDecode(input: string): string {
  // Replace URL-safe characters and add padding
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function parseSignedRequest(
  signedRequest: string,
  appSecret: string,
): FacebookSignedRequest | null {
  const [encodedSig, payload] = signedRequest.split(".");

  if (!encodedSig || !payload) {
    return null;
  }

  // Decode signature
  const sig = Buffer.from(
    encodedSig.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  );

  // Decode payload
  const data = JSON.parse(base64UrlDecode(payload)) as FacebookSignedRequest;

  if (data.algorithm?.toUpperCase() !== "HMAC-SHA256") {
    console.error("Unknown algorithm:", data.algorithm);
    return null;
  }

  // Verify signature
  const expectedSig = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest();

  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    console.error("Invalid signature");
    return null;
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const signedRequest = formData.get("signed_request") as string;

    if (!signedRequest) {
      return NextResponse.json(
        { error: "Missing signed_request parameter" },
        { status: 400 },
      );
    }

    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appSecret) {
      console.error("FACEBOOK_APP_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const data = parseSignedRequest(signedRequest, appSecret);

    if (!data) {
      return NextResponse.json(
        { error: "Invalid signed_request" },
        { status: 400 },
      );
    }

    const userId = data.user_id;

    // Generate confirmation code
    const confirmationCode = crypto
      .createHash("sha256")
      .update(`${userId}-${Date.now()}`)
      .digest("hex")
      .substring(0, 16)
      .toUpperCase();

    // Log deletion request (Clerk manages actual user data)
    console.log(
      `📋 Facebook data deletion request received for user: ${userId}`,
    );
    console.log(`   Confirmation code: ${confirmationCode}`);

    // Facebook requires a URL where users can check deletion status
    // and a confirmation code
    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://maltacalculator.com"}/data-deletion-status?code=${confirmationCode}`;

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (error) {
    console.error("Facebook data deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint for status check page reference
export async function GET() {
  return NextResponse.json({
    message: "Facebook Data Deletion Callback Endpoint",
    method: "POST",
    description:
      "This endpoint handles Facebook user data deletion requests as per Facebook Platform Terms.",
  });
}
