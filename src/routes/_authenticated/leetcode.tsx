import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ExternalLink,
  Search,
  Bookmark,
  BookmarkCheck,
  NotebookPen,
  RotateCcw,
  Check,
  Circle,
  Clock,
} from "lucide-react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  LEETCODE_PROBLEMS,
  LEETCODE_TOPICS,
  COMPANIES,
  type LeetCodeProblem,
} from "@/data/leetcode-problems";
import { getProblemProgress, upsertProblemProgress } from "@/lib/leetcode.functions";

const searchSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/leetcode")({
  head: () => ({ meta: [{ title: "LeetCode Roadmap — Placement AI" }] }),
  validateSearch: searchSchema,
  component: LeetCodePage,
});

type ProgressRow = {
  problem_slug: string;
  status: string;
  revision_count: number;
  bookmarked: boolean;
  notes: string | null;
};

function LeetCodePage() {
  const qc = useQueryClient();
  const initial = Route.useSearch();
  const fetchProgress = useServerFn(getProblemProgress);
  const upsert = useServerFn(upsertProblemProgress);

  const { data: progress } = useQuery({
    queryKey: ["problemProgress"],
    queryFn: () => fetchProgress(),
  });
  const progressMap = useMemo(
    () => new Map((progress ?? []).map((p) => [p.problem_slug, p as ProgressRow])),
    [progress],
  );

  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>(initial.topic ?? "all");
  const [difficulty, setDifficulty] = useState<string>(initial.difficulty ?? "all");
  const [company, setCompany] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notesFor, setNotesFor] = useState<LeetCodeProblem | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const filtered = useMemo(() => {
    return LEETCODE_PROBLEMS.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (topic !== "all" && p.topic !== topic) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (company !== "all" && !p.companies.includes(company)) return false;
      if (statusFilter !== "all") {
        const s = progressMap.get(p.slug)?.status ?? "not_started";
        if (statusFilter === "bookmarked") {
          if (!progressMap.get(p.slug)?.bookmarked) return false;
        } else if (s !== statusFilter) return false;
      }
      return true;
    });
  }, [q, topic, difficulty, company, statusFilter, progressMap]);

  const solved = (progress ?? []).filter((p) => p.status === "solved").length;
  const total = LEETCODE_PROBLEMS.length;

  async function update(
    slug: string,
    patch: {
      status?: "not_started" | "in_progress" | "solved";
      bookmarked?: boolean;
      revision_count?: number;
      notes?: string | null;
    },
  ) {
    try {
      await upsert({ data: { problem_slug: slug, ...patch } });
      qc.invalidateQueries({ queryKey: ["problemProgress"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">LeetCode Roadmap</h1>
          <p className="text-sm text-muted-foreground">
            {LEETCODE_PROBLEMS.length} curated problems across {LEETCODE_TOPICS.length} topics.
          </p>
        </div>
        <div className="min-w-48 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-medium">
              {solved}/{total}
            </span>
          </div>
          <Progress value={(solved / total) * 100} className="h-2" />
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search problems..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <FilterSelect
            v={topic}
            on={setTopic}
            placeholder="All topics"
            opts={[{ v: "all", l: "All topics" }, ...LEETCODE_TOPICS.map((t) => ({ v: t, l: t }))]}
          />
          <FilterSelect
            v={difficulty}
            on={setDifficulty}
            placeholder="All difficulty"
            opts={[
              { v: "all", l: "All difficulty" },
              { v: "Easy", l: "Easy" },
              { v: "Medium", l: "Medium" },
              { v: "Hard", l: "Hard" },
            ]}
          />
          <FilterSelect
            v={company}
            on={setCompany}
            placeholder="All companies"
            opts={[{ v: "all", l: "All companies" }, ...COMPANIES.map((c) => ({ v: c, l: c }))]}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {[
          { v: "all", l: "All" },
          { v: "not_started", l: "Not started" },
          { v: "in_progress", l: "In progress" },
          { v: "solved", l: "Solved" },
          { v: "bookmarked", l: "Bookmarked" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setStatusFilter(f.v)}
            className={`rounded-full border px-3 py-1 text-xs ${statusFilter === f.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="hidden grid-cols-[1fr_140px_100px_140px_180px] gap-3 border-b bg-muted/30 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div>Problem</div>
          <div>Topic</div>
          <div>Difficulty</div>
          <div>Companies</div>
          <div className="text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No problems match these filters.
          </div>
        ) : (
          filtered.map((p) => {
            const pr = progressMap.get(p.slug);
            const status = pr?.status ?? "not_started";
            return (
              <div
                key={p.slug}
                className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/30 md:grid-cols-[1fr_140px_100px_140px_180px] md:items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon status={status} />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.pattern} · {p.estimatedMinutes} min
                      {pr && pr.revision_count > 0 ? ` · ${pr.revision_count} revisions` : ""}
                    </div>
                  </div>
                </div>
                <div className="text-xs">
                  <Badge variant="secondary">{p.topic}</Badge>
                </div>
                <div>
                  <DifficultyBadge d={p.difficulty} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.companies.slice(0, 2).map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px]">
                      {c}
                    </Badge>
                  ))}
                  {p.companies.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{p.companies.length - 2}</span>
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Bookmark"
                    onClick={() => update(p.slug, { bookmarked: !pr?.bookmarked })}
                  >
                    {pr?.bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Notes"
                    onClick={() => {
                      setNotesFor(p);
                      setNotesDraft(pr?.notes ?? "");
                    }}
                  >
                    <NotebookPen className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Needs revision"
                    onClick={() =>
                      update(p.slug, { revision_count: (pr?.revision_count ?? 0) + 1 })
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "solved" ? "default" : "outline"}
                    onClick={() =>
                      update(p.slug, { status: status === "solved" ? "in_progress" : "solved" })
                    }
                  >
                    {status === "solved" ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Solved
                      </>
                    ) : (
                      "Mark solved"
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" asChild title="Open in LeetCode">
                    <a href={p.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={!!notesFor} onOpenChange={(o) => !o && setNotesFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes — {notesFor?.title}</DialogTitle>
            <DialogDescription>Save your approach, edge cases, and complexity.</DialogDescription>
          </DialogHeader>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            className="min-h-40 w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="My approach: ..."
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNotesFor(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!notesFor) return;
                await update(notesFor.slug, { notes: notesDraft });
                toast.success("Notes saved");
                setNotesFor(null);
              }}
            >
              Save notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({
  v,
  on,
  placeholder,
  opts,
}: {
  v: string;
  on: (v: string) => void;
  placeholder: string;
  opts: Array<{ v: string; l: string }>;
}) {
  return (
    <Select value={v} onValueChange={on}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {opts.map((o) => (
          <SelectItem key={o.v} value={o.v}>
            {o.l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "solved")
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="h-3.5 w-3.5" />
      </div>
    );
  if (status === "in_progress")
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning">
        <Clock className="h-3.5 w-3.5" />
      </div>
    );
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Circle className="h-3.5 w-3.5" />
    </div>
  );
}

function DifficultyBadge({ d }: { d: "Easy" | "Medium" | "Hard" }) {
  const cls =
    d === "Easy"
      ? "bg-success/15 text-success"
      : d === "Medium"
        ? "bg-warning/15 text-warning-foreground dark:text-warning"
        : "bg-destructive/15 text-destructive";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{d}</span>;
}
