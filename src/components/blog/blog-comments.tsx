"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  Loader2,
  CheckCircle2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { BlogComment, BlogCommentWithReplies } from "@/types/database";

interface BlogCommentsProps {
  slug: string;
  initialComments: BlogCommentWithReplies[];
}

// --- Anonim voter ID yonetimi ---
function getOrCreateVoterId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "mc_voter_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
    document.cookie = `${KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
  return id;
}

function getVotedComments(): Record<string, "like" | "dislike"> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("mc_voted_comments") || "{}");
  } catch {
    return {};
  }
}

function saveVotedComment(
  commentId: string,
  voteType: "like" | "dislike" | null,
): void {
  const voted = getVotedComments();
  if (voteType === null) {
    delete voted[commentId];
  } else {
    voted[commentId] = voteType;
  }
  localStorage.setItem("mc_voted_comments", JSON.stringify(voted));
}

// --- Yorum formu ---
function CommentForm({
  slug,
  parentId,
  onSubmitted,
  onCancel,
  compact,
}: {
  slug: string;
  parentId?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedName = name.trim();
      const trimmedContent = content.trim();

      if (trimmedName.length < 2 || trimmedName.length > 50) {
        setErrorMsg("Name must be 2-50 characters.");
        return;
      }
      if (trimmedContent.length < 5 || trimmedContent.length > 2000) {
        setErrorMsg("Comment must be 5-2000 characters.");
        return;
      }

      setStatus("submitting");
      setErrorMsg("");

      try {
        const res = await fetch("/api/blog/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            authorName: trimmedName,
            content: trimmedContent,
            parentId: parentId || undefined,
            website, // honeypot
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Something went wrong.");
          setStatus("error");
          return;
        }

        setStatus("success");
        setName("");
        setContent("");
        onSubmitted?.();
      } catch {
        setErrorMsg("Network error. Please try again.");
        setStatus("error");
      }
    },
    [name, content, slug, parentId, website, onSubmitted],
  );

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>
          Your comment has been submitted and is pending approval. Thank you!
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot - CSS ile gizli */}
      <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className={cn("flex gap-3", compact ? "flex-col sm:flex-row" : "")}>
        <input
          ref={nameRef}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className={cn(
            "flex h-10 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
            "transition-colors",
            compact ? "sm:w-48" : "w-full sm:w-64",
          )}
        />
      </div>

      <textarea
        placeholder={
          parentId ? "Write your reply..." : "Share your thoughts..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        rows={compact ? 2 : 3}
        className={cn(
          "flex w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
          "transition-colors resize-none",
        )}
      />

      {errorMsg && (
        <p className="text-sm text-red-500 dark:text-red-400">{errorMsg}</p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={status === "submitting"}
          className="gap-2"
        >
          {status === "submitting" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {parentId ? "Reply" : "Submit Comment"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

// --- Tek yorum ---
function CommentItem({
  comment,
  slug,
  voterId,
  votedComments,
  onVoteUpdate,
  activeReplyId,
  onReplyToggle,
  isReply,
}: {
  comment: BlogComment;
  slug: string;
  voterId: string;
  votedComments: Record<string, "like" | "dislike">;
  onVoteUpdate: (
    commentId: string,
    voteType: "like" | "dislike",
    action: "voted" | "removed" | "changed",
  ) => void;
  activeReplyId: string | null;
  onReplyToggle: (id: string | null) => void;
  isReply?: boolean;
}) {
  const [voting, setVoting] = useState(false);
  const myVote = votedComments[comment.id] || null;

  const handleVote = useCallback(
    async (voteType: "like" | "dislike") => {
      if (!voterId || voting) return;
      setVoting(true);

      try {
        const res = await fetch("/api/blog/comments/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentId: comment.id,
            voterId,
            voteType,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          onVoteUpdate(comment.id, voteType, data.action);
        }
      } catch {
        // Sessizce basarisiz
      } finally {
        setVoting(false);
      }
    },
    [comment.id, voterId, voting, onVoteUpdate],
  );

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "group",
        isReply ? "ml-6 sm:ml-10 pl-4 border-l-2 border-border/30" : "",
      )}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary shrink-0">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="font-medium text-sm">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("like")}
            disabled={voting}
            className={cn(
              "h-7 px-2 gap-1 text-xs",
              myVote === "like"
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground",
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("dislike")}
            disabled={voting}
            className={cn(
              "h-7 px-2 gap-1 text-xs",
              myVote === "dislike"
                ? "text-red-500 dark:text-red-400"
                : "text-muted-foreground",
            )}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {comment.dislikes > 0 && <span>{comment.dislikes}</span>}
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onReplyToggle(activeReplyId === comment.id ? null : comment.id)
              }
              className="h-7 px-2 gap-1 text-xs text-muted-foreground"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </Button>
          )}
        </div>

        {/* Reply form */}
        {activeReplyId === comment.id && (
          <div className="mt-2">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              compact
              onCancel={() => onReplyToggle(null)}
              onSubmitted={() => onReplyToggle(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Ana component ---
export function BlogComments({ slug, initialComments }: BlogCommentsProps) {
  const [comments, setComments] =
    useState<BlogCommentWithReplies[]>(initialComments);
  const [votedComments, setVotedComments] = useState<
    Record<string, "like" | "dislike">
  >({});
  const [voterId, setVoterId] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Client-side: voter ID ve taze yorumlari cek
  useEffect(() => {
    setVoterId(getOrCreateVoterId());
    setVotedComments(getVotedComments());

    // API'den taze yorumlari cek
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.comments) {
          setComments(data.comments);
        }
      })
      .catch(() => {
        // Build-time data kullanilmaya devam eder
      });
  }, [slug]);

  const totalCount =
    comments.length + comments.reduce((sum, c) => sum + c.replies.length, 0);

  // Optimistic vote guncelleme
  const handleVoteUpdate = useCallback(
    (
      commentId: string,
      voteType: "like" | "dislike",
      action: "voted" | "removed" | "changed",
    ) => {
      setComments((prev) =>
        prev.map((c) => {
          const updateComment = (comment: BlogComment): BlogComment => {
            if (comment.id !== commentId) return comment;

            if (action === "removed") {
              return {
                ...comment,
                likes:
                  voteType === "like"
                    ? Math.max(0, comment.likes - 1)
                    : comment.likes,
                dislikes:
                  voteType === "dislike"
                    ? Math.max(0, comment.dislikes - 1)
                    : comment.dislikes,
              };
            } else if (action === "changed") {
              return {
                ...comment,
                likes:
                  voteType === "like"
                    ? comment.likes + 1
                    : Math.max(0, comment.likes - 1),
                dislikes:
                  voteType === "dislike"
                    ? comment.dislikes + 1
                    : Math.max(0, comment.dislikes - 1),
              };
            } else {
              // voted
              return {
                ...comment,
                likes: voteType === "like" ? comment.likes + 1 : comment.likes,
                dislikes:
                  voteType === "dislike"
                    ? comment.dislikes + 1
                    : comment.dislikes,
              };
            }
          };

          const updated = updateComment(c) as BlogCommentWithReplies;
          return {
            ...updated,
            replies: c.replies.map(updateComment),
          };
        }),
      );

      // localStorage guncelle
      if (action === "removed") {
        saveVotedComment(commentId, null);
        setVotedComments((prev) => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
      } else {
        saveVotedComment(commentId, voteType);
        setVotedComments((prev) => ({ ...prev, [commentId]: voteType }));
      }
    },
    [votedComments],
  );

  return (
    <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full gap-2 text-left"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Comments{totalCount > 0 ? ` (${totalCount})` : ""}
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Yorum listesi */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-background rounded-xl border border-border/40 space-y-3"
                >
                  <CommentItem
                    comment={comment}
                    slug={slug}
                    voterId={voterId}
                    votedComments={votedComments}
                    onVoteUpdate={handleVoteUpdate}
                    activeReplyId={activeReplyId}
                    onReplyToggle={setActiveReplyId}
                  />

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="space-y-3 mt-3">
                      {comment.replies.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          slug={slug}
                          voterId={voterId}
                          votedComments={votedComments}
                          onVoteUpdate={handleVoteUpdate}
                          activeReplyId={activeReplyId}
                          onReplyToggle={setActiveReplyId}
                          isReply
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}

          {/* Yorum yazma */}
          {showForm ? (
            <div className="pt-2">
              <CommentForm
                slug={slug}
                onCancel={() => setShowForm(false)}
                onSubmitted={() => setShowForm(false)}
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Leave a Comment
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
