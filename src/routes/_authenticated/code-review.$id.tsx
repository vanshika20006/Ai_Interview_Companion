import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Sparkles, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getReview, addReviewComment } from "@/lib/codeReview.functions";

export const Route = createFileRoute("/_authenticated/code-review/$id")({
  head: () => ({ meta: [{ title: "Code Review — Placement AI" }] }),
  component: ReviewDetail,
});

function ReviewDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getReview);
  const commentFn = useServerFn(addReviewComment);
  const { data, isLoading } = useQuery({
    queryKey: ["codeReview", id],
    queryFn: () => fetchFn({ data: { id } }),
  });
  const [body, setBody] = useState("");

  const post = useMutation({
    mutationFn: () => commentFn({ data: { reviewId: id, body } }),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["codeReview", id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }
  if (!data) return <p>Not found.</p>;
  const { review, comments } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/code-review">
          <ArrowLeft className="h-4 w-4" /> All reviews
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{review.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {review.language} · by {review.author}
              </p>
            </div>
            {review.ai_score != null && (
              <Badge variant={review.ai_score >= 80 ? "default" : "secondary"}>
                AI score {review.ai_score}/100
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {review.description && (
            <p className="text-sm text-muted-foreground">{review.description}</p>
          )}
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-xs">
            <code>{review.code}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> AI Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{review.ai_feedback ?? "_No AI feedback._"}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-md border p-3">
              <p className="text-xs font-medium text-muted-foreground">{c.author}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{c.body}</p>
            </div>
          ))}
          <div className="space-y-2 pt-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share feedback…"
              rows={3}
            />
            <Button onClick={() => post.mutate()} disabled={!body.trim() || post.isPending}>
              <Send className="h-4 w-4" /> Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
