import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Briefcase,
  Code2,
  MessagesSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { listBookmarks, removeBookmark } from "@/lib/bookmarks.functions";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Placement AI" }] }),
  component: BookmarksPage,
});

const TYPE_META: Record<string, { label: string; icon: typeof Bookmark }> = {
  job: { label: "Jobs", icon: Briefcase },
  post: { label: "Community", icon: MessagesSquare },
  problem: { label: "Problems", icon: Code2 },
  interview: { label: "Interviews", icon: MessagesSquare },
  resource: { label: "Resources", icon: FileText },
};

function BookmarksPage() {
  const qc = useQueryClient();
  const fetchBookmarks = useServerFn(listBookmarks);
  const removeFn = useServerFn(removeBookmark);
  const [tab, setTab] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => fetchBookmarks({ data: {} }),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter((b) => tab === "all" || b.item_type === tab);
  const counts = (data ?? []).reduce<Record<string, number>>((acc, b) => {
    acc[b.item_type] = (acc[b.item_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Bookmark className="h-6 w-6 text-primary" /> Bookmarks
        </h1>
        <p className="text-sm text-muted-foreground">
          Saved jobs, problems, posts and resources in one place.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">
            All{" "}
            <Badge variant="secondary" className="ml-1.5">
              {data?.length ?? 0}
            </Badge>
          </TabsTrigger>
          {Object.entries(TYPE_META).map(([k, m]) => (
            <TabsTrigger key={k} value={k}>
              {m.label}{" "}
              {counts[k] ? (
                <Badge variant="secondary" className="ml-1.5">
                  {counts[k]}
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="font-medium">Nothing saved yet</div>
              <div className="text-sm text-muted-foreground">
                Bookmark items from Jobs, Community or your roadmap to keep them handy.
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/jobs">Browse jobs</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/leetcode">Open roadmap</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((b) => {
            const meta = TYPE_META[b.item_type] ?? { label: b.item_type, icon: Bookmark };
            const Icon = meta.icon;
            return (
              <Card key={b.id} className="group transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <CardTitle className="text-base font-medium leading-tight">
                          {b.title}
                        </CardTitle>
                        {b.subtitle && (
                          <CardDescription className="mt-0.5">{b.subtitle}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-60 hover:opacity-100"
                      onClick={() => del.mutate(b.id)}
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <Badge variant="secondary" className="text-[10px]">
                    {meta.label}
                  </Badge>
                  {b.url && (
                    <Button asChild size="sm" variant="ghost">
                      <a href={b.url} target="_blank" rel="noopener noreferrer">
                        Open <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
