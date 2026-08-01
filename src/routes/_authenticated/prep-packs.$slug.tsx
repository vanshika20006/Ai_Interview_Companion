import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, MessageSquare, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { findPrepPack } from "@/data/company-prep";

export const Route = createFileRoute("/_authenticated/prep-packs/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} prep — Placement AI` }],
  }),
  loader: ({ params }): import("@/data/company-prep").PrepPack => {
    const pack = findPrepPack(params.slug);
    if (!pack) throw notFound();
    return pack;
  },
  component: PrepDetail,
  notFoundComponent: () => <p>Pack not found.</p>,
  errorComponent: ({ error }) => <p>{error.message}</p>,
});

function PrepDetail() {
  const pack = Route.useLoaderData() as import("@/data/company-prep").PrepPack;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/prep-packs">
          <ArrowLeft className="h-4 w-4" /> All packs
        </Link>
      </Button>

      <div className={`rounded-2xl bg-gradient-to-r ${pack.color} p-6 text-white shadow-elegant`}>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {pack.tag}
        </Badge>
        <h1 className="mt-2 text-3xl font-bold">{pack.company} Prep Pack</h1>
        <p className="text-sm text-white/80">
          {pack.rounds.length} rounds · {pack.problems.length} problems · {pack.behavioral.length}{" "}
          behaviorals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interview Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {pack.rounds.map((r, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topics to master</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pack.topics.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Practice Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {pack.problems.map((p) => (
              <li key={p.title} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      p.difficulty === "Easy"
                        ? "secondary"
                        : p.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {p.difficulty}
                  </Badge>
                  <span className="text-sm">{p.title}</span>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open <ExternalLink className="inline h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" /> Behavioral Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {pack.behavioral.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4" /> Insider Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {pack.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
