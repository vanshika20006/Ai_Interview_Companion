import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { analyzeResume, getLatestAnalysis } from "@/lib/resume.functions";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — Placement AI" }] }),
  component: ResumePage,
});

function ResumePage() {
  const qc = useQueryClient();
  const fetchAnalysis = useServerFn(getLatestAnalysis);
  const runAnalyze = useServerFn(analyzeResume);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["latestAnalysis"],
    queryFn: () => fetchAnalysis(),
  });

  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      setText(await file.text());
      return;
    }
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      try {
        const pdfjs = await import("pdfjs-dist");
        const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        (
          pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }
        ).GlobalWorkerOptions.workerSrc = workerSrc;
        const buf = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buf }).promise;
        let out = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          out += tc.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
        }
        setText(out);
      } catch (err) {
        console.error(err);
        toast.error("Could not parse PDF. Try pasting the text below.");
      }
      return;
    }
    toast.error("Unsupported file. Upload .pdf or .txt or paste below.");
  }

  async function handleAnalyze() {
    if (text.trim().length < 50) return toast.error("Resume text is too short (min 50 chars).");
    setAnalyzing(true);
    try {
      await runAnalyze({ data: { file_name: fileName || "Pasted resume", raw_text: text } });
      toast.success("Analysis complete");
      qc.invalidateQueries({ queryKey: ["latestAnalysis"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  // Page-wide drag-and-drop fallback: works even if the browser's file picker hangs or is blocked.
  useEffect(() => {
    function onDragEnter(e: DragEvent) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
    }
    function onDragOver(e: DragEvent) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
    }
    function onDragLeave(e: DragEvent) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setIsDragging(false);
    }
    function onDrop(e: DragEvent) {
      if (!e.dataTransfer?.files?.length) return;
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    }
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  function openPicker() {
    try {
      inputRef.current?.click();
    } catch {
      toast.error(
        "File picker unavailable. Drag your file onto this page or paste the text below.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page-wide drag overlay: visual cue that drop-anywhere works */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-primary bg-background/90 px-10 py-8 text-center shadow-lg">
            <Upload className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-2 text-base font-semibold">Drop your resume anywhere</div>
            <div className="text-xs text-muted-foreground">PDF, TXT or MD</div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Resume Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Upload your resume to get an ATS score, missing keywords, and actionable suggestions
          powered by Gemini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload or paste your resume</CardTitle>
          <CardDescription>
            Drag & drop, browse, or paste — whichever works best. PDF or TXT, max 50,000 characters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone is a plain div — clicking it does NOT open the picker, so a hung picker can't block drag-and-drop. */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
            }`}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm font-medium">{fileName || "Drag your resume here"}</div>
            <div className="text-xs text-muted-foreground">
              PDF, TXT, MD · drop anywhere on this page
            </div>
            <Button type="button" variant="outline" size="sm" onClick={openPicker} className="mt-1">
              <FolderOpen className="mr-2 h-4 w-4" /> Browse files
            </Button>
          </div>
          <input
            ref={inputRef}
            id="resume-file-input"
            type="file"
            accept=".pdf,.txt,.md,application/pdf,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or paste your resume text here..."
            className="min-h-40 w-full resize-y rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{text.length} characters</span>
            <Button onClick={handleAnalyze} disabled={analyzing || text.length < 50} size="lg">
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Analyze Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : analysis ? (
        <AnalysisReport analysis={analysis} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <FileText className="h-8 w-8" />
            <div className="text-sm">No analysis yet. Upload a resume to get started.</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type AnalysisRow = {
  ats_score: number;
  summary: string | null;
  strengths: unknown;
  weaknesses: unknown;
  missing_keywords: unknown;
  missing_skills: unknown;
  role_match: unknown;
  suggestions: unknown;
  recommended_topics: unknown;
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? (v as unknown[]).filter((x): x is string => typeof x === "string") : [];
}
function asRoleMatch(v: unknown): Array<{ role: string; match_percent: number }> {
  if (!Array.isArray(v)) return [];
  return v.flatMap((item) => {
    if (item && typeof item === "object" && "role" in item && "match_percent" in item) {
      const r = (item as Record<string, unknown>).role;
      const m = (item as Record<string, unknown>).match_percent;
      if (typeof r === "string" && typeof m === "number") return [{ role: r, match_percent: m }];
    }
    return [];
  });
}

function AnalysisReport({ analysis }: { analysis: AnalysisRow }) {
  const strengths = asStringArray(analysis.strengths);
  const weaknesses = asStringArray(analysis.weaknesses);
  const missingKw = asStringArray(analysis.missing_keywords);
  const missingSkills = asStringArray(analysis.missing_skills);
  const suggestions = asStringArray(analysis.suggestions);
  const topics = asStringArray(analysis.recommended_topics);
  const roleMatch = asRoleMatch(analysis.role_match);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">ATS Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-5xl font-bold text-gradient">
            {analysis.ats_score}
            <span className="text-xl text-muted-foreground">/100</span>
          </div>
          <Progress value={analysis.ats_score} className="h-2.5" />
          {analysis.summary && <p className="text-sm text-muted-foreground">{analysis.summary}</p>}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Role match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roleMatch.length === 0 ? (
            <p className="text-sm text-muted-foreground">No role match data.</p>
          ) : (
            roleMatch.map((r) => (
              <div key={r.role} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{r.role}</div>
                  <Progress value={r.match_percent} className="h-1.5" />
                </div>
                <div className="text-sm font-semibold">{r.match_percent}%</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <BulletCard icon={CheckCircle2} title="Strengths" items={strengths} tone="success" />
      <BulletCard icon={AlertCircle} title="Weaknesses" items={weaknesses} tone="destructive" />
      <BulletCard icon={Sparkles} title="Suggestions" items={suggestions} tone="primary" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Missing keywords</CardTitle>
        </CardHeader>
        <CardContent>
          {missingKw.length === 0 ? (
            <p className="text-sm text-muted-foreground">Looks great!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingKw.map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Missing skills</CardTitle>
        </CardHeader>
        <CardContent>
          {missingSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No critical gaps detected.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((k) => (
                <Badge key={k}>{k}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Recommended LeetCode topics</CardTitle>
          <CardDescription>Based on your resume's tech stack and target roles.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <a
              key={t}
              href={`/leetcode?topic=${encodeURIComponent(t)}`}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:bg-accent"
            >
              {t} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BulletCard({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone: "success" | "destructive" | "primary";
}) {
  const toneMap = {
    success: "text-success",
    destructive: "text-destructive",
    primary: "text-primary",
  } as const;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-4 w-4 ${toneMap[tone]}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${toneMap[tone]}`}
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
