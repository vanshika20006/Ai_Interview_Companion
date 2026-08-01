import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { amIAdmin } from "@/lib/admin.functions";
import { amIRecruiter } from "@/lib/recruiter.functions";
import {
  ArrowRight,
  FileText,
  Code2,
  MessagesSquare,
  Flame,
  Lightbulb,
  Sparkles,
  Trophy,
  Briefcase,
  Target,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProblemProgress } from "@/lib/leetcode.functions";
import { getDashboardSummary } from "@/lib/dashboard.functions";
import { LEETCODE_PROBLEMS } from "@/data/leetcode-problems";
import { computeReadiness } from "@/lib/readiness";
import { DailyChallengeCard } from "@/components/daily-challenge-card";
import { WeeklyDigestCard } from "@/components/weekly-digest-card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Placement AI" }] }),
  beforeLoad: async () => {
    // Admins and recruiters have their own landing — keep the student
    // dashboard out of their way.
    try {
      if (await amIAdmin()) throw redirect({ to: "/admin" });
      if (await amIRecruiter()) throw redirect({ to: "/recruiter" });
    } catch (e) {
      // Re-throw redirects; swallow auth-check failures (treat as student)
      if (e && typeof e === "object" && "to" in (e as object)) throw e;
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const fetchSummary = useServerFn(getDashboardSummary);
  const fetchProgress = useServerFn(getProblemProgress);

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => fetchSummary(),
  });
  const { data: progress } = useQuery({
    queryKey: ["problemProgress"],
    queryFn: () => fetchProgress(),
  });

  const totalProblems = LEETCODE_PROBLEMS.length;
  const solved =
    progress?.filter((p) => p.status === "solved").length ?? summary?.problems.solved ?? 0;

  const readiness = computeReadiness({
    atsScore: summary?.resume?.ats_score ?? null,
    avgInterviewScore: summary?.interviews.avgOverall ?? null,
    solvedProblems: solved,
    totalProblems,
    studyPlanCompletionPct: summary?.plan.planPct ?? 0,
    communicationScore: summary?.interviews.avgCommunication ?? null,
    consistencyDays: summary?.streak.current ?? 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground">Your placement readiness, at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/analytics">
              View analytics <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/resume">
              Re-analyze resume <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Readiness hero */}
      {loadingSummary ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <ReadinessHero readiness={readiness} />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          icon={FileText}
          label="Resume ATS"
          value={readiness.breakdown.resume}
          suffix="/100"
          tone="primary"
          hint={summary?.resume ? "Latest analysis" : "Not analyzed yet"}
        />
        <ScoreCard
          icon={MessagesSquare}
          label="Interview Avg"
          value={readiness.breakdown.interview}
          suffix="/100"
          tone="accent"
          hint={`${summary?.interviews.count ?? 0} sessions`}
        />
        <ScoreCard
          icon={Code2}
          label="DSA Roadmap"
          value={readiness.breakdown.coding}
          suffix="%"
          tone="success"
          hint={`${solved} / ${totalProblems} solved`}
        />
        <ScoreCard
          icon={Flame}
          label="Streak"
          value={summary?.streak.current ?? 0}
          suffix=" days"
          tone="warning"
          hint={`Best: ${summary?.streak.best ?? 0}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <DailyChallengeCard />
          <WeeklyDigestCard />
        </div>
        <RecruiterSummary readiness={readiness} interviews={summary?.interviews} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code2 className="h-4 w-4" /> DSA Roadmap Progress
            </CardTitle>
            <CardDescription>
              {solved} of {totalProblems} curated problems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={readiness.breakdown.coding} className="h-2.5" />
            <TopicBreakdown progress={progress ?? []} />
            <Button asChild variant="outline" size="sm">
              <Link to="/leetcode">
                Open roadmap <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" /> Improve your score
            </CardTitle>
            <CardDescription>Personalized next moves</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {readiness.suggestions.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4" /> Next milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <Task done={!!summary?.resume} text="Upload and analyze your resume" />
              <Task done={solved >= 5} text="Solve 5 curated LeetCode problems" />
              <Task
                done={(summary?.interviews.count ?? 0) >= 1}
                text="Run your first AI mock interview"
              />
              <Task done={solved >= 15} text="Reach 15 problems solved" />
              <Task done={(summary?.plan.doneTasks ?? 0) >= 5} text="Complete 5 study plan tasks" />
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReadinessHero({ readiness }: { readiness: ReturnType<typeof computeReadiness> }) {
  const { score, band, hiringProbability, breakdown } = readiness;
  return (
    <Card className="relative overflow-hidden border-primary/20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent" />
      <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-5">
          <ReadinessRing value={score} />
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Placement Readiness
            </div>
            <div className="mt-1 text-3xl font-semibold">
              {score}
              <span className="text-base text-muted-foreground">/100</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              {band}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Pillar icon={Target} label="Hiring odds" value={`${hiringProbability}%`} />
          <Pillar icon={FileText} label="Resume" value={`${breakdown.resume}`} />
          <Pillar icon={MessagesSquare} label="Interview" value={`${breakdown.interview}`} />
          <Pillar icon={Activity} label="Consistency" value={`${breakdown.consistency}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReadinessRing({ value }: { value: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
      <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        className="fill-none stroke-primary transition-all duration-700"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function Pillar({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background/60 p-3 backdrop-blur">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function RecruiterSummary({
  readiness,
  interviews,
}: {
  readiness: ReturnType<typeof computeReadiness>;
  interviews?: { avgCommunication: number | null; avgTechnical: number | null };
}) {
  const rows = [
    { label: "Resume strength", value: readiness.breakdown.resume },
    { label: "Coding strength", value: readiness.breakdown.coding },
    { label: "Communication", value: interviews?.avgCommunication ?? 0 },
    { label: "Technical depth", value: interviews?.avgTechnical ?? 0 },
    { label: "Consistency", value: readiness.breakdown.consistency },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="h-4 w-4" /> Recruiter view
        </CardTitle>
        <CardDescription>How recruiters will see you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium">{r.value}/100</span>
            </div>
            <Progress value={r.value} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  suffix,
  tone,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  tone: "primary" | "accent" | "success" | "warning";
  hint: string;
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning-foreground dark:text-warning",
  } as const;
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-3xl font-semibold">{value}</span>
          <span className="text-sm text-muted-foreground">{suffix}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}

function Task({ done, text }: { done: boolean; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={`h-4 w-4 shrink-0 rounded-full border-2 ${done ? "border-success bg-success" : "border-muted-foreground/40"}`}
      />
      <span className={done ? "text-muted-foreground line-through" : ""}>{text}</span>
    </li>
  );
}

function TopicBreakdown({
  progress,
}: {
  progress: Array<{ problem_slug: string; status: string }>;
}) {
  const byTopic = new Map<string, { solved: number; total: number }>();
  for (const p of LEETCODE_PROBLEMS) {
    const t = byTopic.get(p.topic) ?? { solved: 0, total: 0 };
    t.total += 1;
    byTopic.set(p.topic, t);
  }
  for (const pr of progress) {
    if (pr.status !== "solved") continue;
    const prob = LEETCODE_PROBLEMS.find((p) => p.slug === pr.problem_slug);
    if (!prob) continue;
    const t = byTopic.get(prob.topic)!;
    t.solved += 1;
  }
  const rows = Array.from(byTopic.entries())
    .sort((a, b) => b[1].solved / b[1].total - a[1].solved / a[1].total)
    .slice(0, 6);
  return (
    <div className="grid gap-2.5 text-xs">
      {rows.map(([topic, { solved, total }]) => (
        <div key={topic} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
          <span className="truncate text-muted-foreground">{topic}</span>
          <Progress value={(solved / total) * 100} className="h-1.5" />
          <span className="text-right font-medium">
            {solved}/{total}
          </span>
        </div>
      ))}
    </div>
  );
}
