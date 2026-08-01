import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Medal, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getLeaderboard } from "@/lib/gamification.functions";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Placement AI" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const fetchLb = useServerFn(getLeaderboard);
  const [scope, setScope] = useState<"weekly" | "monthly" | "all_time">("weekly");
  const [metric, setMetric] = useState<"problems" | "interview" | "activity">("problems");

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", scope, metric],
    queryFn: () => fetchLb({ data: { scope, metric } }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top performers across the community.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Tabs value={scope} onValueChange={(v) => setScope(v as never)}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all_time">All time</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as never)}>
          <TabsList>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Medal className="h-4 w-4 text-primary" /> Ranking
          </CardTitle>
          <CardDescription>By {data?.label ?? "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !data?.entries.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ol className="space-y-2">
              {data.entries.map((e, i) => (
                <li
                  key={e.user_id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${i < 3 ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${i === 0 ? "bg-yellow-500/20 text-yellow-600" : i === 1 ? "bg-zinc-400/20 text-zinc-600" : i === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {i < 3 ? <Crown className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {e.username ? (
                      <Link
                        to="/u/$username"
                        params={{ username: e.username }}
                        className="font-medium hover:underline"
                      >
                        {e.full_name ?? `@${e.username}`}
                      </Link>
                    ) : (
                      <span className="font-medium">{e.full_name ?? "Anonymous"}</span>
                    )}
                  </div>
                  <Badge>{e.score}</Badge>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
