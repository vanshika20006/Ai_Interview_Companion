import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Github, Linkedin, Globe, Share2, Sparkles, ArrowLeft, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getPublicProfileByUsername } from "@/lib/publicProfile.functions";

export const Route = createFileRoute("/u/$username")({
  ssr: true,
  loader: async ({ params }) => {
    const data = await getPublicProfileByUsername({ data: { username: params.username } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.profile?.full_name ?? params.username} — Placement AI Portfolio` },
      {
        name: "description",
        content: loaderData?.pp?.headline ?? loaderData?.pp?.bio ?? "Placement portfolio",
      },
      {
        property: "og:title",
        content: `${loaderData?.profile?.full_name ?? params.username} — Placement Portfolio`,
      },
      {
        property: "og:description",
        content: loaderData?.pp?.headline ?? "Public placement portfolio",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="text-xl font-semibold">Profile not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This portfolio is private or doesn't exist.
      </p>
      <Button asChild className="mt-4">
        <Link to="/">Home</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <p className="p-8 text-sm text-destructive">{(error as Error).message}</p>
  ),
  component: PublicProfile,
});

function PublicProfile() {
  const data = Route.useLoaderData();
  const { pp, profile, stats, badges } = data;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share)
      navigator
        .share({ title: `${profile?.full_name ?? pp.username}'s portfolio`, url })
        .catch(() => {});
    else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Placement AI</span>
          </Link>
          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-primary" />
          <CardContent className="-mt-12 space-y-3 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground text-2xl font-bold shadow-elegant">
              {(profile?.full_name ?? pp.username)[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{profile?.full_name ?? `@${pp.username}`}</h1>
              <p className="text-sm text-muted-foreground">
                @{pp.username}
                {pp.headline ? ` · ${pp.headline}` : ""}
              </p>
            </div>
            {pp.bio && <p className="text-sm">{pp.bio}</p>}
            {profile && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {profile.college && <span>{profile.college}</span>}
                {profile.degree && (
                  <span>
                    · {profile.degree} {profile.branch ?? ""}
                  </span>
                )}
                {profile.graduation_year && <span>· {profile.graduation_year}</span>}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {profile?.github && (
                <Button asChild size="sm" variant="outline">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                  </a>
                </Button>
              )}
              {profile?.linkedin && (
                <Button asChild size="sm" variant="outline">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-1.5 h-3.5 w-3.5" /> LinkedIn
                  </a>
                </Button>
              )}
              {profile?.portfolio && (
                <Button asChild size="sm" variant="outline">
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-1.5 h-3.5 w-3.5" /> Portfolio
                  </a>
                </Button>
              )}
              {pp.show_email && profile?.email && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.best_ats !== null && <Stat label="Resume ATS" value={`${stats.best_ats}/100`} />}
          <Stat label="Problems solved" value={String(stats.problems_solved)} />
          {stats.best_interview !== null && (
            <Stat label="Best interview" value={`${stats.best_interview}/100`} />
          )}
        </div>

        {profile?.skills && profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {profile.skills.map((s: string) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {badges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Achievements
              </CardTitle>
              <CardDescription>{badges.length} badges earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                {badges.map(
                  (b: {
                    achievement_code: string;
                    achievements: { title: string; description: string; icon: string } | null;
                  }) => {
                    const a = b.achievements!;
                    const Icon =
                      (Icons[a.icon as keyof typeof Icons] as React.ComponentType<{
                        className?: string;
                      }>) ?? Trophy;
                    return (
                      <div
                        key={b.achievement_code}
                        className="rounded-xl border bg-gradient-to-br from-primary/10 to-accent border-primary/30 p-3 text-center"
                      >
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-xs font-semibold">{a.title}</div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-muted-foreground pt-4">
          <Link to="/" className="hover:underline">
            Powered by Placement AI Companion
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
