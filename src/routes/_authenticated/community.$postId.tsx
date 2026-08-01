import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { getPost, addComment, toggleLike } from "@/lib/community.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/community/$postId")({
  head: () => ({ meta: [{ title: "Post — Placement AI" }] }),
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const qc = useQueryClient();
  const fetchPost = useServerFn(getPost);
  const add = useServerFn(addComment);
  const like = useServerFn(toggleLike);
  const [body, setBody] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost({ data: { id: postId } }),
  });

  useEffect(() => {
    const ch = supabase
      .channel(`post-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["post", postId] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [postId, qc]);

  const addMut = useMutation({
    mutationFn: () => add({ data: { post_id: postId, body } }),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const likeMut = useMutation({
    mutationFn: () => like({ data: { post_id: postId, liked: !!data?.liked } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["post", postId] }),
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (!data) return <p>Not found</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/community">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{data.post.title}</CardTitle>
            <Badge variant="secondary">{data.post.room}</Badge>
          </div>
          <CardDescription>
            {data.post.author?.full_name || data.post.author?.email || "Anonymous"} ·{" "}
            {formatDistanceToNow(new Date(data.post.created_at), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="whitespace-pre-wrap text-sm">{data.post.body}</div>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => likeMut.mutate()}>
            <Heart className={`h-4 w-4 ${data.liked ? "fill-primary text-primary" : ""}`} />{" "}
            {data.post.like_count}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comments ({data.comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              rows={2}
              placeholder="Add a comment…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button
              size="icon"
              onClick={() => addMut.mutate()}
              disabled={addMut.isPending || !body.trim()}
            >
              {addMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {data.comments.map((c) => (
            <div key={c.id} className="rounded-md border bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground mb-1">
                {c.author?.full_name || c.author?.email || "Anonymous"} ·{" "}
                {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
              </div>
              <div className="text-sm whitespace-pre-wrap">{c.body}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
