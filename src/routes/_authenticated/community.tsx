import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Plus, Heart, MessageCircle, Search, Loader2, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  ROOMS,
  listPosts,
  createPost,
  toggleLike,
  toggleSavePost,
} from "@/lib/community.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({ meta: [{ title: "Community — Placement AI" }] }),
  component: CommunityPage,
});

function CommunityPage() {
  const qc = useQueryClient();
  const fetchPosts = useServerFn(listPosts);
  const create = useServerFn(createPost);
  const like = useServerFn(toggleLike);
  const savePost = useServerFn(toggleSavePost);

  const [room, setRoom] = useState<string>("DSA");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [newRoom, setNewRoom] = useState<string>("DSA");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", room, search],
    queryFn: () => fetchPosts({ data: { room, search: search || undefined } }),
  });

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel("community-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
        qc.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const createMut = useMutation({
    mutationFn: () => create({ data: { room: newRoom as never, title, body } }),
    onSuccess: () => {
      toast.success("Posted!");
      setOpen(false);
      setTitle("");
      setBody("");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const likeMut = useMutation({
    mutationFn: (args: { post_id: string; liked: boolean }) => like({ data: args }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
  const saveMut = useMutation({
    mutationFn: (args: { post_id: string; saved: boolean }) => savePost({ data: args }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Community</h1>
          <p className="text-sm text-muted-foreground">
            Discuss prep, share experiences, and learn together.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Select value={newRoom} onValueChange={setNewRoom}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              <Textarea
                rows={6}
                placeholder="Write your post…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMut.mutate()}
                disabled={createMut.isPending || !title.trim() || !body.trim()}
              >
                {createMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={room} onValueChange={setRoom}>
        <TabsList className="flex flex-wrap h-auto">
          {ROOMS.map((r) => (
            <TabsTrigger key={r} value={r}>
              {r}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : !posts?.length ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            Be the first to post in {room}.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="transition hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    <Link
                      to="/community/$postId"
                      params={{ postId: p.id }}
                      className="hover:underline"
                    >
                      {p.title}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">
                    {p.room}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.author?.full_name || p.author?.email || "Anonymous"} ·{" "}
                  {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{p.body}</p>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1.5"
                    onClick={() => likeMut.mutate({ post_id: p.id, liked: p.liked })}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${p.liked ? "fill-primary text-primary" : ""}`}
                    />{" "}
                    {p.like_count}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 gap-1.5" asChild>
                    <Link to="/community/$postId" params={{ postId: p.id }}>
                      <MessageCircle className="h-3.5 w-3.5" /> {p.comment_count}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    onClick={() => saveMut.mutate({ post_id: p.id, saved: p.saved })}
                  >
                    {p.saved ? (
                      <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
