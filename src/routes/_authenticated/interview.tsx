import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Play, Clock, Trophy, MessagesSquare, TrendingUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  startInterview,
  listInterviews,
  getInterviewAnalytics,
  deleteInterview,
} from "@/lib/interview.functions";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "AI Interview — Placement AI" }] }),
  component: InterviewPage,
});

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
  "Data Analyst",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TYPES = ["Technical", "HR", "Behavioral", "System Design"];

function InterviewPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchList = useServerFn(listInterviews);
  const fetchAnalytics = useServerFn(getInterviewAnalytics);
  const start = useServerFn(startInterview);
  const remove = useServerFn(deleteInterview);

  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Technical");
  const [count, setCount] = useState(5);

  const { data: list, isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => fetchList(),
  });
  const { data: analytics } = useQuery({
    queryKey: ["interviewAnalytics"],
    queryFn: () => fetchAnalytics(),
  });

  const startMutation = useMutation({
    mutationFn: () =>
      start({
        data: {
          role: role as never,
          difficulty: difficulty as never,
          interview_type: type as never,
          total_questions: count,
        },
      }),
    onSuccess: (data) => {
      toast.success("Interview ready");
      qc.invalidateQueries({ queryKey: ["interviews"] });
      navigate({ to: "/interview/$id", params: { id: data.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Session deleted");
      qc.invalidateQueries({ queryKey: ["interviews"] });
      qc.invalidateQueries({ queryKey: ["interviewAnalytics"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Interview Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Practice with role-specific questions and instant Gemini-powered feedback.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={MessagesSquare} label="Attempts" value={analytics?.attempts ?? 0} />
        <Stat icon={TrendingUp} label="Avg score" value={analytics?.avg ?? 0} suffix="/100" />
        <Stat icon={Trophy} label="Best score" value={analytics?.best ?? 0} suffix="/100" />
        <Stat
          icon={Clock}
          label="In progress"
          value={list?.filter((i) => i.status === "in_progress").length ?? 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Start a new session</CardTitle>
            <CardDescription>Pick role, difficulty, and interview type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Role">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Questions">
              <Select value={String(count)} onValueChange={(v) => setCount(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Button
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
              className="w-full"
            >
              {startMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating questions…
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start interview
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Review past interviews and feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : !list?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No interviews yet — start your first session.
              </p>
            ) : (
              list.slice(0, 10).map((iv) => (
                <div
                  key={iv.id}
                  className="group flex items-center gap-2 rounded-lg border bg-card p-3 transition hover:border-primary hover:shadow-sm"
                >
                  <Link to="/interview/$id" params={{ id: iv.id }} className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{iv.role}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {iv.interview_type} · {iv.difficulty} ·{" "}
                          {formatDistanceToNow(new Date(iv.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      {iv.status === "completed" ? (
                        <Badge variant="default">{iv.overall_score}/100</Badge>
                      ) : (
                        <Badge variant="secondary">In progress</Badge>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Delete this interview session?")) deleteMutation.mutate(iv.id);
                    }}
                    disabled={deleteMutation.isPending}
                    aria-label="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {analytics && analytics.categories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Strong categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {analytics.strong.map((c) => (
                <Badge
                  key={c.type}
                  className="bg-success/15 text-success border-success/30"
                  variant="outline"
                >
                  {c.type} · {c.avg}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Areas to improve</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {analytics.weak.map((c) => (
                <Badge key={c.type} variant="outline" className="border-warning/30 text-warning">
                  {c.type} · {c.avg}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">
            {value}
            {suffix}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
