import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Bell, Check, Trash2, Inbox, ExternalLink, Sparkles, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { listNotifications, markRead, deleteNotification } from "@/lib/notifications.functions";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Placement AI" }] }),
  component: NotificationsPage,
});

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotificationsPage() {
  const qc = useQueryClient();
  const fetchFn = useServerFn(listNotifications);
  const markFn = useServerFn(markRead);
  const delFn = useServerFn(deleteNotification);

  const [tab, setTab] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchFn(),
  });

  const mark = useMutation({
    mutationFn: (vars: { ids?: string[]; all?: boolean }) => markFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const rawItems = data?.items ?? [];
  const filtered = rawItems.filter((n) => {
    if (tab === "unread") return !n.read_at;
    if (tab === "all") return true;
    return n.type === tab;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Inbox className="h-6 w-6" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            {data?.unread ?? 0} unread of {rawItems.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mark.mutate({ all: true })}
            disabled={!data?.unread}
          >
            <Check className="mr-1.5 h-4 w-4" /> Mark all read
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {data?.unread ? <Badge variant="secondary" className="ml-1 text-[10px]">{data.unread}</Badge> : null}
          </TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Inbox</span>
            {filtered.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                Showing {filtered.length} notification{filtered.length > 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-60" />
              <p className="mt-2 text-sm font-medium text-foreground">No notifications found.</p>
              <p className="text-xs text-muted-foreground">
                {tab === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "Activity from interviews, study groups, and achievements will show up here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${!n.read_at ? "bg-primary/5" : "hover:bg-muted/40"}`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-sm">{n.title}</span>
                      {!n.read_at && <Badge variant="secondary" className="text-[10px]">New</Badge>}
                    </div>
                    {n.body && (
                      <p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">{n.body}</p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {n.type} · {timeAgo(n.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {n.link && (
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link
                          to={n.link}
                          onClick={() => !n.read_at && mark.mutate({ ids: [n.id] })}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    {!n.read_at && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => mark.mutate({ ids: [n.id] })}
                        aria-label="Mark read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => remove.mutate(n.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

