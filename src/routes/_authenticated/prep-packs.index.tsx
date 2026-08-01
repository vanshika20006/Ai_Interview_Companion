import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ArrowRight, ListChecks, MessageSquare, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PREP_PACKS } from "@/data/company-prep";

export const Route = createFileRoute("/_authenticated/prep-packs/")({
  head: () => ({ meta: [{ title: "Company Prep Packs — Placement AI" }] }),
  component: PrepPacksPage,
});

function PrepPacksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Building2 className="h-6 w-6" /> Company Prep Packs
        </h1>
        <p className="text-sm text-muted-foreground">
          Curated problem sets, behavioral questions, and insider tips for top companies.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PREP_PACKS.map((p) => (
          <Card key={p.slug} className="overflow-hidden transition-shadow hover:shadow-elegant">
            <div className={`h-16 bg-gradient-to-r ${p.color}`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{p.company}</CardTitle>
                <Badge variant="secondary">{p.tag}</Badge>
              </div>
              <CardDescription>
                {p.rounds.length} rounds · {p.problems.length} problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/prep-packs/$slug"
                params={{ slug: p.slug }}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Open pack <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <FeaturePill
          icon={ListChecks}
          title="Problem sets"
          body="Hand-picked problems per company."
        />
        <FeaturePill icon={MessageSquare} title="Behavioral" body="Real questions & LP tags." />
        <FeaturePill icon={BookOpen} title="Insider tips" body="What graders actually look for." />
      </div>
    </div>
  );
}

function FeaturePill({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ListChecks;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
