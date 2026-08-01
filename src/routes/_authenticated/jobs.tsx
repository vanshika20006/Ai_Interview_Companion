import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Briefcase,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Sparkles,
  MapPin,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { listJobs, generateJobRecommendations, toggleSaveJob } from "@/lib/jobs.functions";

export const Route = createFileRoute("/_authenticated/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Placement AI" }] }),
  component: JobsPage,
});

const FILTERS = ["All", "Internship", "Full Time", "Fresher", "Saved"];

function JobsPage() {
  const qc = useQueryClient();
  const fetchJobs = useServerFn(listJobs);
  const gen = useServerFn(generateJobRecommendations);
  const save = useServerFn(toggleSaveJob);
  const [filter, setFilter] = useState("All");

  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: () => fetchJobs() });

  const genMut = useMutation({
    mutationFn: () => gen({}),
    onSuccess: (r) => {
      toast.success(`${r.count} new jobs matched`);
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveMut = useMutation({
    mutationFn: (args: { id: string; saved: boolean }) => save({ data: args }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const filtered = useMemo(() => {
    const j = jobs ?? [];
    if (filter === "All") return j;
    if (filter === "Saved") return j.filter((x) => x.saved);
    return j.filter((x) => x.employment_type === filter);
  }, [jobs, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Smart Job Matches</h1>
          <p className="text-sm text-muted-foreground">
            AI-curated opportunities based on your skills, resume, and DSA progress.
          </p>
        </div>
        <Button onClick={() => genMut.mutate()} disabled={genMut.isPending}>
          {genMut.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Matching…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Refresh matches
            </>
          )}
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f}>
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : !filtered.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              {jobs?.length
                ? "No jobs match this filter."
                : "No jobs yet — click 'Refresh matches' to generate."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((j) => (
            <Card key={j.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{j.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {j.company}
                      {j.location ? (
                        <>
                          <span className="opacity-40">·</span>
                          <MapPin className="h-3.5 w-3.5" />
                          {j.location}
                        </>
                      ) : null}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={
                        j.match_pct >= 80 ? "default" : j.match_pct >= 60 ? "secondary" : "outline"
                      }
                    >
                      {j.match_pct}% match
                    </Badge>
                    {j.employment_type && (
                      <Badge variant="outline" className="text-[10px]">
                        {j.employment_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3">{j.description}</p>
                {j.matched_skills?.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-success mb-1">
                      Matched skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {j.matched_skills.slice(0, 6).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {j.missing_skills?.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-warning mb-1">
                      Missing skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {j.missing_skills.slice(0, 5).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] border-warning/40">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 mt-auto">
                  <Button asChild size="sm" className="flex-1">
                    <a href={j.apply_url ?? "#"} target="_blank" rel="noopener noreferrer">
                      Apply <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => saveMut.mutate({ id: j.id, saved: !j.saved })}
                  >
                    {j.saved ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
