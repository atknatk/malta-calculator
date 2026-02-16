import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogComment, BlogCommentWithReplies } from "@/types/database";

/**
 * Build zamaninda onaylanmis yorumlari ceker ve thread yapisina cevirir.
 * BlogArticleFooter (async server component) icinde kullanilir.
 */
export async function getApprovedComments(
  slug: string,
): Promise<BlogCommentWithReplies[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("blog_slug", slug)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch blog comments:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return organizeIntoThreads(data);
}

/**
 * Duz yorum listesini parent/reply thread yapisina cevirir.
 * Tek seviye nesting destekler.
 */
export function organizeIntoThreads(
  comments: BlogComment[],
): BlogCommentWithReplies[] {
  const topLevel: BlogCommentWithReplies[] = [];
  const replyMap = new Map<string, BlogComment[]>();

  for (const comment of comments) {
    if (comment.parent_id === null) {
      topLevel.push({ ...comment, replies: [] });
    } else {
      const existing = replyMap.get(comment.parent_id) ?? [];
      existing.push(comment);
      replyMap.set(comment.parent_id, existing);
    }
  }

  for (const parent of topLevel) {
    parent.replies = replyMap.get(parent.id) ?? [];
  }

  return topLevel;
}
