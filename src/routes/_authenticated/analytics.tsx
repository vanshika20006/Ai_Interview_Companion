import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Flame, Trophy, FileText, MessagesSquare, Code2 } from "lucide-react";
import { getAnalytics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Placement AI" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const fetchA = useServerFn(getAnalytics);
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: () => fetchA() });

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  if (!data) return null;

  const radar = data.interviewTrend.length
    ? [
        { dim: "Communication", v: avg(data.interviewTrend.map((i) => i.communication)) },
        { dim: "Technical", v: avg(data.interviewTrend.map((i) => i.technical)) },
        { dim: "Confidence", v: avg(data.interviewTrend.map((i) => i.confidence)) },
        { dim: "Problem-Solving", v: avg(data.interviewTrend.map((i) => i.problem_solving)) },
        { dim: "Overall", v: avg(data.interviewTrend.map((i) => i.overall)) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track every dimension of your placement journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          icon={Flame}
          label="Current streak"
          value={data.streak.current_streak}
          suffix=" days"
        />
        <Stat icon={Trophy} label="Best streak" value={data.streak.best_streak} suffix=" days" />
        <Stat icon={Code2} label="Problems solved" value={data.totals.solved} />
        <Stat
          icon={MessagesSquare}
          label="Avg interview"
          value={data.totals.avgInterview}
          suffix="/100"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" /> Resume ATS Trend
            </CardTitle>
            <CardDescription>Last analyses</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {data.resumeTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.resumeTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty>Analyze a resume to see trends</Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="h-4 w-4" /> LeetCode Cumulative
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data.leetcodeTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.leetcodeTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty>Solve problems to see progress</Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessagesSquare className="h-4 w-4" /> Interview Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data.interviewTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.interviewTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="technical" stroke="hsl(var(--success))" />
                  <Line type="monotone" dataKey="communication" stroke="hsl(var(--warning))" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty>Complete an interview to see scores</Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Productivity</CardTitle>
            <CardDescription>Last 28 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="solved" fill="hsl(var(--primary))" />
                <Bar dataKey="interviews" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {radar.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Skill Radar</CardTitle>
              <CardDescription>Average across all interviews</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="v"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.3)"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function avg(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
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

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
