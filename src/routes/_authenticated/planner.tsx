import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarDays,
  Loader2,
  RefreshCw,
  CheckCircle2,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateWeeklyPlan, getCurrentPlan, updateTaskStatus } from "@/lib/planner.functions";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({ meta: [{ title: "Study Planner — Placement AI" }] }),
  component: PlannerPage,
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function PlannerPage() {
  const qc = useQueryClient();
  const fetchPlan = useServerFn(getCurrentPlan);
  const gen = useServerFn(generateWeeklyPlan);
  const update = useServerFn(updateTaskStatus);

  const { data, isLoading } = useQuery({ queryKey: ["currentPlan"], queryFn: () => fetchPlan() });

  const genMut = useMutation({
    mutationFn: () => gen({}),
    onSuccess: () => {
      toast.success("Plan generated");
      qc.invalidateQueries({ queryKey: ["currentPlan"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updMut = useMutation({
    mutationFn: (args: { task_id: string; status: "done" | "skipped" | "pending" }) =>
      update({ data: args }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentPlan"] }),
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Weekly Study Planner</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Generate a personalized 7-day prep plan based on your resume, skills, and DSA
              progress.
            </p>
            <Button size="lg" onClick={() => genMut.mutate()} disabled={genMut.isPending}>
              {genMut.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate my plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { plan, tasks } = data;
  const done = tasks.filter((t) => t.status === "done").length;
  const skipped = tasks.filter((t) => t.status === "skipped").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">This week's plan</h1>
          <p className="text-sm text-muted-foreground">{plan.summary}</p>
        </div>
        <Button variant="outline" onClick={() => genMut.mutate()} disabled={genMut.isPending}>
          {genMut.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Regenerate
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span>
              Progress: <strong>{done}</strong> done · {skipped} skipped ·{" "}
              {tasks.length - done - skipped} pending
            </span>
            <span className="font-medium">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-2 h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DAYS.map((d, idx) => {
          const dayTasks = tasks.filter((t) => t.day_index === idx);
          return (
            <Card key={d} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{d}</CardTitle>
                <CardDescription className="text-xs">
                  {dayTasks[0]?.topic ?? "Rest"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                {dayTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No tasks</p>
                ) : (
                  dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-md border p-2 text-xs ${t.status === "done" ? "border-success/40 bg-success/5" : t.status === "skipped" ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span
                          className={`font-medium ${t.status === "done" ? "line-through" : ""}`}
                        >
                          {t.title}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {t.estimated_minutes}m
                        </Badge>
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {t.kind}
                        {t.problem_slug ? ` · ${t.problem_slug}` : ""}
                      </div>
                      {t.status === "pending" && (
                        <div className="mt-1.5 flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => updMut.mutate({ task_id: t.id, status: "done" })}
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Done
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => updMut.mutate({ task_id: t.id, status: "skipped" })}
                          >
                            <SkipForward className="mr-1 h-3 w-3" /> Skip
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
