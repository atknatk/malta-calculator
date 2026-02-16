import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: {
    commentId: string;
    voterId: string;
    voteType: "like" | "dislike";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.commentId ||
    !body.voterId ||
    !["like", "dislike"].includes(body.voteType)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Mevcut oy kontrolu
  const { data: existingVote } = await supabase
    .from("blog_comment_votes")
    .select("id, vote_type")
    .eq("comment_id", body.commentId)
    .eq("voter_id", body.voterId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote_type === body.voteType) {
      // Ayni oy - toggle off
      await supabase
        .from("blog_comment_votes")
        .delete()
        .eq("id", existingVote.id);

      const column = body.voteType === "like" ? "likes" : "dislikes";
      const { data: comment } = await supabase
        .from("blog_comments")
        .select(column)
        .eq("id", body.commentId)
        .single();

      if (comment) {
        await supabase
          .from("blog_comments")
          .update({
            [column]: Math.max(
              0,
              (comment as Record<string, number>)[column] - 1,
            ),
          })
          .eq("id", body.commentId);
      }

      return NextResponse.json({ success: true, action: "removed" });
    } else {
      // Farkli oy - switch
      await supabase
        .from("blog_comment_votes")
        .update({ vote_type: body.voteType })
        .eq("id", existingVote.id);

      const oldColumn =
        existingVote.vote_type === "like" ? "likes" : "dislikes";
      const newColumn = body.voteType === "like" ? "likes" : "dislikes";

      const { data: comment } = await supabase
        .from("blog_comments")
        .select("likes, dislikes")
        .eq("id", body.commentId)
        .single();

      if (comment) {
        await supabase
          .from("blog_comments")
          .update({
            [oldColumn]: Math.max(
              0,
              (comment as Record<string, number>)[oldColumn] - 1,
            ),
            [newColumn]: (comment as Record<string, number>)[newColumn] + 1,
          })
          .eq("id", body.commentId);
      }

      return NextResponse.json({ success: true, action: "changed" });
    }
  }

  // Yeni oy
  const { error: voteError } = await supabase
    .from("blog_comment_votes")
    .insert({
      comment_id: body.commentId,
      voter_id: body.voterId,
      vote_type: body.voteType,
    });

  if (voteError) {
    if (voteError.code === "23505") {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    console.error("Failed to record vote:", voteError);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 },
    );
  }

  const column = body.voteType === "like" ? "likes" : "dislikes";
  const { data: comment } = await supabase
    .from("blog_comments")
    .select(column)
    .eq("id", body.commentId)
    .single();

  if (comment) {
    await supabase
      .from("blog_comments")
      .update({
        [column]: (comment as Record<string, number>)[column] + 1,
      })
      .eq("id", body.commentId);
  }

  return NextResponse.json({ success: true, action: "voted" });
}
