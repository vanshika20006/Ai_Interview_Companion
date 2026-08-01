import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, Check, Trash2, Inbox, ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Inbox className="h-6 w-6" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            {data?.unread ?? 0} unread of {data?.items.length ?? 0}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mark.mutate({ all: true })}
          disabled={!data?.unread}
        >
          <Check className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Inbox</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (data?.items.length ?? 0) === 0 ? (
            <div className="px-6 py-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No notifications yet.</p>
              <p className="text-xs text-muted-foreground">
                Activity from interviews, achievements, and reviews will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {data!.items.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 ${!n.read_at ? "bg-primary/5" : ""}`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{n.title}</span>
                      {!n.read_at && <Badge variant="secondary">New</Badge>}
                    </div>
                    {n.body && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{n.body}</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {n.type} · {timeAgo(n.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {n.link && (
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          to={n.link}
                          onClick={() => !n.read_at && mark.mutate({ ids: [n.id] })}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {!n.read_at && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => mark.mutate({ ids: [n.id] })}
                        aria-label="Mark read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove.mutate(n.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
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
