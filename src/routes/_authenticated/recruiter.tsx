import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  Search,
  Building2,
  GraduationCap,
  ExternalLink,
  Lock,
  Bookmark,
  StickyNote,
  Save,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  amIRecruiter,
  searchStudents,
  toggleShortlist,
  listShortlist,
  updateShortlistEntry,
} from "@/lib/recruiter.functions";

const STATUSES = ["new", "contacted", "interviewing", "offer", "rejected"] as const;
type Status = (typeof STATUSES)[number];
const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline" | "destructive"> = {
  new: "secondary",
  contacted: "outline",
  interviewing: "default",
  offer: "default",
  rejected: "destructive",
};

export const Route = createFileRoute("/_authenticated/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter — Placement AI" }] }),
  component: RecruiterPage,
});

function RecruiterPage() {
  const fetchRole = useServerFn(amIRecruiter);
  const search = useServerFn(searchStudents);
  const toggle = useServerFn(toggleShortlist);
  const fetchShort = useServerFn(listShortlist);
  const [skills, setSkills] = useState("");
  const [query, setQuery] = useState("");
  const [minAts, setMinAts] = useState<number | "">("");

  const qc = useQueryClient();
  const updateEntry = useServerFn(updateShortlistEntry);
  const { data: isRecruiter, isLoading: roleLoading } = useQuery({
    queryKey: ["recruiterRole"],
    queryFn: () => fetchRole(),
  });
  const { data: shortlist } = useQuery({
    queryKey: ["shortlist"],
    queryFn: () => fetchShort(),
    enabled: !!isRecruiter,
  });

  const [results, setResults] = useState<Awaited<ReturnType<typeof search>> | null>(null);
  const searchMut = useMutation({
    mutationFn: () =>
      search({
        data: {
          search: query || undefined,
          skills: skills
            ? skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
          minAts: typeof minAts === "number" ? minAts : undefined,
        },
      }),
    onSuccess: (r) => setResults(r),
    onError: (e: Error) => toast.error(e.message),
  });
  const shortMut = useMutation({
    mutationFn: (args: { id: string; on: boolean }) =>
      toggle({ data: { student_user_id: args.id, shortlisted: args.on } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shortlist"] }),
  });
  const entryMut = useMutation({
    mutationFn: (args: { id: string; notes?: string; status?: Status }) =>
      updateEntry({ data: { student_user_id: args.id, notes: args.notes, status: args.status } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shortlist"] });
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (roleLoading) return <Skeleton className="h-64 w-full" />;
  if (!isRecruiter) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">Recruiter mode</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              This area is restricted to users with the recruiter role. Contact an admin to be
              granted access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shortEntries = shortlist ?? [];
  const shortMap = new Map(shortEntries.map((e) => [e.student_user_id, e]));
  const shortSet = new Set(shortMap.keys());
  const shortlistedResults = (results ?? []).filter((s) => shortSet.has(s.user_id));

  const renderCard = (s: NonNullable<typeof results>[number]) => {
    const entry = shortMap.get(s.user_id);
    return (
      <Card key={s.user_id}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{s.full_name ?? `@${s.username}`}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                {s.college && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {s.college}
                  </span>
                )}
                {s.branch && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {s.branch} {s.graduation_year ?? ""}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge variant={s.ats >= 80 ? "default" : "secondary"}>ATS {s.ats}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground">{s.problems_solved} problems solved</div>
          <div className="flex flex-wrap gap-1">
            {(s.skills ?? []).slice(0, 6).map((sk: string) => (
              <Badge key={sk} variant="outline" className="text-[10px]">
                {sk}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link to="/u/$username" params={{ username: s.username! }}>
                View <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant={shortSet.has(s.user_id) ? "default" : "outline"}
              onClick={() => shortMut.mutate({ id: s.user_id, on: shortSet.has(s.user_id) })}
            >
              {shortSet.has(s.user_id) ? "Shortlisted" : "Shortlist"}
            </Button>
          </div>
          {entry && (
            <TrackerPanel
              studentId={s.user_id}
              status={(entry.status as Status) ?? "new"}
              notes={entry.notes ?? ""}
              onSave={(payload) => entryMut.mutate({ id: s.user_id, ...payload })}
              saving={entryMut.isPending}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Find students</h1>
        <p className="text-sm text-muted-foreground">
          Search public student portfolios by skill, score, and more.
        </p>
      </div>

      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="shortlist">
            <Bookmark className="mr-2 h-4 w-4" />
            Shortlist ({shortSet.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_140px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Username search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Input
                placeholder="Skills (comma-separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min ATS"
                value={minAts}
                onChange={(e) => setMinAts(e.target.value ? Number(e.target.value) : "")}
                min={0}
                max={100}
              />
              <Button onClick={() => searchMut.mutate()} disabled={searchMut.isPending}>
                Search
              </Button>
            </CardContent>
          </Card>

          {results === null ? (
            <p className="text-sm text-muted-foreground">Run a search to find candidates.</p>
          ) : !results.length ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No matching students.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">{results.map(renderCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="shortlist" className="space-y-4">
          {!shortEntries.length ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No shortlisted students yet. Use search to add some.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {shortlistedResults.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {shortlistedResults.map(renderCard)}
                </div>
              )}
              {shortEntries
                .filter((e) => !shortlistedResults.some((r) => r.user_id === e.student_user_id))
                .map((e) => (
                  <Card key={e.student_user_id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-mono text-xs">
                        {e.student_user_id}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Run a search to load full profile. Status & notes editable below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TrackerPanel
                        studentId={e.student_user_id}
                        status={(e.status as Status) ?? "new"}
                        notes={e.notes ?? ""}
                        onSave={(payload) => entryMut.mutate({ id: e.student_user_id, ...payload })}
                        saving={entryMut.isPending}
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrackerPanel({
  studentId,
  status,
  notes,
  onSave,
  saving,
}: {
  studentId: string;
  status: Status;
  notes: string;
  onSave: (payload: { status?: Status; notes?: string }) => void;
  saving: boolean;
}) {
  const [localStatus, setLocalStatus] = useState<Status>(status);
  const [localNotes, setLocalNotes] = useState(notes);
  useEffect(() => {
    setLocalStatus(status);
    setLocalNotes(notes);
  }, [studentId, status, notes]);
  const dirty = localStatus !== status || localNotes !== notes;

  return (
    <div className="mt-3 space-y-2 rounded-md border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <StickyNote className="h-3.5 w-3.5" /> Tracker
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[status]} className="text-[10px] uppercase">
            {status}
          </Badge>
          <Select
            value={localStatus}
            onValueChange={(v) => {
              const next = v as Status;
              setLocalStatus(next);
              onSave({ status: next });
            }}
          >
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value)}
        placeholder="Notes about this candidate…"
        rows={3}
        className="text-xs"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="secondary"
          disabled={!dirty || saving}
          onClick={() => onSave({ notes: localNotes, status: localStatus })}
        >
          <Save className="mr-1 h-3 w-3" /> Save notes
        </Button>
      </div>
    </div>
  );
}
