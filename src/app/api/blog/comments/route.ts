import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { organizeIntoThreads } from "@/lib/blog/get-comments";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX_GET = 30;
const RATE_LIMIT_MAX_POST = 5;

function checkRateLimit(ip: string, max: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, RATE_LIMIT_MAX_GET)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("blog_slug", slug)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }

  const threads = organizeIntoThreads(data ?? []);
  return NextResponse.json({ comments: threads });
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, RATE_LIMIT_MAX_POST)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: {
    slug: string;
    authorName: string;
    content: string;
    parentId?: string;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bot'lar doldurur, sessizce basarili doner
  if (body.website) {
    return NextResponse.json({
      success: true,
      message: "Comment submitted for review.",
    });
  }

  if (!body.slug || typeof body.slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  if (
    !body.authorName ||
    body.authorName.trim().length < 2 ||
    body.authorName.trim().length > 50
  ) {
    return NextResponse.json(
      { error: "Name must be 2-50 characters" },
      { status: 400 },
    );
  }
  if (
    !body.content ||
    body.content.trim().length < 5 ||
    body.content.trim().length > 2000
  ) {
    return NextResponse.json(
      { error: "Comment must be 5-2000 characters" },
      { status: 400 },
    );
  }

  const authorName = body.authorName.trim().replace(/<[^>]*>/g, "");
  const content = body.content.trim().replace(/<[^>]*>/g, "");

  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_comments").insert({
    blog_slug: body.slug,
    author_name: authorName,
    content: content,
    parent_id: body.parentId || null,
    is_approved: false,
  });

  if (error) {
    console.error("Failed to submit comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Comment submitted for review. It will appear once approved.",
  });
}
