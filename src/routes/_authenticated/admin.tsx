import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Lock,
  Shield,
  Search,
  Crown,
  Users,
  FileText,
  MessagesSquare,
  Code2,
  Briefcase,
  Flame,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  amIAdmin,
  adminCanClaim,
  claimFirstAdmin,
  adminListUsers,
  adminSetRole,
  adminAnalytics,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Placement AI" }] }),
  component: AdminPage,
});

const MANAGED_ROLES = ["admin", "moderator", "recruiter"] as const;

function AdminPage() {
  const checkAdmin = useServerFn(amIAdmin);
  const checkClaim = useServerFn(adminCanClaim);
  const claim = useServerFn(claimFirstAdmin);
  const list = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetRole);
  const analytics = useServerFn(adminAnalytics);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["amIAdmin"],
    queryFn: () => checkAdmin(),
  });
  const { data: canClaim } = useQuery({
    queryKey: ["adminCanClaim"],
    queryFn: () => checkClaim(),
    enabled: !roleLoading && !isAdmin,
  });

  const claimMut = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => {
      toast.success("You are now admin");
      qc.invalidateQueries({ queryKey: ["amIAdmin"] });
      qc.invalidateQueries({ queryKey: ["adminCanClaim"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { data: users, isFetching } = useQuery({
    queryKey: ["adminUsers", submitted],
    queryFn: () => list({ data: { search: submitted || undefined } }),
    enabled: !!isAdmin,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: () => analytics(),
    enabled: !!isAdmin,
    staleTime: 30_000,
  });

  const roleMut = useMutation({
    mutationFn: (args: { userId: string; role: (typeof MANAGED_ROLES)[number]; grant: boolean }) =>
      setRole({ data: args }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
      qc.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (roleLoading) return <Skeleton className="h-64 w-full" />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              {canClaim ? <Crown className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <h1 className="text-xl font-semibold">Admin panel</h1>
            {canClaim ? (
              <>
                <p className="max-w-md text-sm text-muted-foreground">
                  No admin exists yet. Claim the admin seat to manage users and roles.
                </p>
                <Button onClick={() => claimMut.mutate()} disabled={claimMut.isPending}>
                  {claimMut.isPending ? "Claiming…" : "Claim admin"}
                </Button>
              </>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                This area is restricted to admins. Contact an existing admin to be granted access.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin console</h1>
          <p className="text-sm text-muted-foreground">
            Platform analytics, users, and content moderation.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab loading={statsLoading} stats={stats} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users & roles</CardTitle>
              <CardDescription>Search by email or name, then toggle roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(search);
                }}
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>

              {isFetching ? (
                <Skeleton className="h-48 w-full" />
              ) : !users?.length ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
              ) : (
                <div className="divide-y rounded-md border">
                  {users.map((u) => (
                    <div
                      key={u.user_id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {u.full_name || u.email || u.user_id}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(u.roles ?? []).map((r) => (
                            <Badge key={r} variant="secondary" className="text-[10px] uppercase">
                              {r}
                            </Badge>
                          ))}
                          {!u.roles?.length && (
                            <span className="text-xs text-muted-foreground">no roles</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        {MANAGED_ROLES.map((role) => {
                          const has = (u.roles ?? []).includes(role);
                          return (
                            <label key={role} className="flex items-center gap-2 text-xs">
                              <Switch
                                checked={has}
                                disabled={roleMut.isPending}
                                onCheckedChange={(checked) =>
                                  roleMut.mutate({ userId: u.user_id, role, grant: checked })
                                }
                              />
                              <span className="capitalize">{role}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentTab stats={stats} loading={statsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold leading-tight">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({
  loading,
  stats,
}: {
  loading: boolean;
  stats: Awaited<ReturnType<typeof adminAnalytics>> | undefined;
}) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  const t = stats.totals ?? {};
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={t.users ?? 0} />
        <StatCard
          icon={MessagesSquare}
          label="Interviews"
          value={t.interviews ?? 0}
          hint={`${t.completed_interviews ?? 0} completed`}
        />
        <StatCard icon={FileText} label="Resumes" value={t.resumes ?? 0} />
        <StatCard icon={Code2} label="Problems solved" value={t.problems_solved ?? 0} />
        <StatCard icon={Briefcase} label="Shortlists" value={t.shortlists ?? 0} />
        <StatCard icon={Users} label="Study groups" value={t.study_groups ?? 0} />
        <StatCard icon={Flame} label="Active streaks" value={t.active_streaks ?? 0} />
        <StatCard icon={TrendingUp} label="Community posts" value={t.posts ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Signups — last 14 days</CardTitle>
            <CardDescription>Daily new profiles created on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.signups ?? []}>
                <defs>
                  <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v: string) => v.slice(5)}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <RTooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  fill="url(#signupFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role distribution</CardTitle>
            <CardDescription>Granted roles across users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.roles ?? {}).length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned yet.</p>
            ) : (
              Object.entries(stats.roles ?? {})
                .sort((a, b) => Number(b[1]) - Number(a[1]))
                .map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                    <span className="text-sm font-medium">{Number(count)}</span>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent signups</CardTitle>
          <CardDescription>Latest 8 accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats.recent_users?.length ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {stats.recent_users.map((u) => (
                <div
                  key={u.user_id}
                  className="flex items-center justify-between gap-3 p-3 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {u.full_name || u.email || u.user_id}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function ContentTab({
  loading,
  stats,
}: {
  loading: boolean;
  stats: Awaited<ReturnType<typeof adminAnalytics>> | undefined;
}) {
  if (loading || !stats) return <Skeleton className="h-64 w-full" />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top community posts</CardTitle>
          <CardDescription>Ranked by likes.</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats.content?.top_posts?.length ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {stats.content.top_posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span className="truncate font-medium">{p.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    ♥ {p.like_count} · 💬 {p.comment_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent completed interviews</CardTitle>
          <CardDescription>Last 5 finished sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats.content?.recent_interviews?.length ? (
            <p className="text-sm text-muted-foreground">No interviews yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {stats.content.recent_interviews.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{i.role || "Interview"}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(i.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary">{i.overall_score ?? "—"}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
