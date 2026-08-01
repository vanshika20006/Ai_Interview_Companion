import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, Check, Inbox } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listNotifications, markRead } from "@/lib/notifications.functions";

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationsMenu() {
  const qc = useQueryClient();
  const fetchFn = useServerFn(listNotifications);
  const markFn = useServerFn(markRead);
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchFn(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const mark = useMutation({
    mutationFn: (ids?: string[]) => markFn({ data: ids ? { ids } : { all: true } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const items = (data?.items ?? []).slice(0, 8);
  const unread = data?.unread ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unread > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs"
              onClick={() => mark.mutate(undefined)}
            >
              <Check className="h-3 w-3" /> Mark all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <Inbox className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <ul className="max-h-96 overflow-auto">
            {items.map((n) => (
              <li key={n.id}>
                <Link
                  to={n.link ?? "/notifications"}
                  onClick={() => !n.read_at && mark.mutate([n.id])}
                  className={`block px-3 py-2.5 text-sm hover:bg-accent ${
                    !n.read_at ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!n.read_at && <span className="h-2 w-2 rounded-full bg-primary" />}
                    <span className="line-clamp-1 flex-1 font-medium">{n.title}</span>
                  </div>
                  {n.body && <p className="line-clamp-1 text-xs text-muted-foreground">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <DropdownMenuSeparator />
        <Link
          to="/notifications"
          className="block px-3 py-2 text-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Open inbox {data?.items.length ? `(${data.items.length})` : ""}
        </Link>
        {unread === 0 && items.length > 0 && (
          <Badge variant="secondary" className="m-2">
            All read
          </Badge>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
