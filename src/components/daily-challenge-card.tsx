import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Calendar, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDailyChallenge } from "@/lib/daily-challenge";
import { getProblemProgress } from "@/lib/leetcode.functions";

export function DailyChallengeCard() {
  const problem = getDailyChallenge();
  const fetchProgress = useServerFn(getProblemProgress);
  const { data: progress } = useQuery({
    queryKey: ["problemProgress"],
    queryFn: () => fetchProgress(),
    staleTime: 60_000,
  });

  const status = progress?.find((p) => p.problem_slug === problem.slug)?.status ?? "todo";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const toneByDiff: Record<string, string> = {
    Easy: "bg-success/15 text-success border-success/30",
    Medium: "bg-warning/15 text-warning border-warning/30",
    Hard: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <Card className="relative overflow-hidden border-primary/30">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" /> Daily Challenge · {today}
          </CardDescription>
          {status === "solved" && (
            <Badge className="gap-1 bg-success/15 text-success border-success/30" variant="outline">
              <Flame className="h-3 w-3" /> Solved today
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-semibold leading-snug">{problem.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className={toneByDiff[problem.difficulty]}>
            {problem.difficulty}
          </Badge>
          <Badge variant="secondary">{problem.topic}</Badge>
          <Badge variant="secondary">{problem.pattern}</Badge>
          <span>· ~{problem.estimatedMinutes} min</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/leetcode">
              {status === "solved" ? "Review roadmap" : "Solve now"}
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={problem.url} target="_blank" rel="noopener noreferrer">
              Open on LeetCode <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
