import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as Icons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trophy, Award } from "lucide-react";
import { getMyAchievements, getMyStreak } from "@/lib/gamification.functions";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Placement AI" }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const fetchA = useServerFn(getMyAchievements);
  const fetchS = useServerFn(getMyStreak);
  const { data: ach, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => fetchA(),
  });
  const { data: streak } = useQuery({ queryKey: ["streak"], queryFn: () => fetchS() });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          Badges and streaks earned through consistent practice.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Current streak</div>
              <div className="text-2xl font-semibold">{streak?.current_streak ?? 0} days</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Best streak</div>
              <div className="text-2xl font-semibold">{streak?.best_streak ?? 0} days</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Badges earned</div>
              <div className="text-2xl font-semibold">
                {ach?.filter((a) => a.earned_at).length ?? 0}/{ach?.length ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge collection</CardTitle>
          <CardDescription>Earn by hitting milestones across the app.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              {ach?.map((a) => {
                const Icon =
                  (Icons[a.icon as keyof typeof Icons] as React.ComponentType<{
                    className?: string;
                  }>) ?? Trophy;
                const earned = !!a.earned_at;
                return (
                  <div
                    key={a.code}
                    className={`rounded-xl border p-4 text-center transition ${earned ? "bg-gradient-to-br from-primary/10 to-accent border-primary/30 shadow-sm" : "opacity-50 grayscale"}`}
                  >
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${earned ? "bg-primary/15 text-primary" : "bg-muted"}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.description}</div>
                    {earned && (
                      <div className="mt-2 text-[10px] uppercase tracking-wider text-primary">
                        Earned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
