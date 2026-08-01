import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Code2, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { listReviews, createReview } from "@/lib/codeReview.functions";

export const Route = createFileRoute("/_authenticated/code-review/")({
  head: () => ({ meta: [{ title: "Code Review — Placement AI" }] }),
  component: CodeReviewPage,
});

const LANGS = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "csharp", "sql"];

function CodeReviewPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fetchFn = useServerFn(listReviews);
  const createFn = useServerFn(createReview);

  const { data, isLoading } = useQuery({
    queryKey: ["codeReviews"],
    queryFn: () => fetchFn(),
  });

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createFn({ data: { title, language: language as "javascript", description, code } }),
    onSuccess: (r) => {
      toast.success("AI reviewed your code");
      qc.invalidateQueries({ queryKey: ["codeReviews"] });
      setOpen(false);
      setTitle("");
      setDescription("");
      setCode("");
      navigate({ to: "/code-review/$id", params: { id: r.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Code2 className="h-6 w-6" /> Peer Code Review
          </h1>
          <p className="text-sm text-muted-foreground">
            Share a snippet, get instant AI feedback, and discuss with the community.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> New review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit code for review</DialogTitle>
              <DialogDescription>
                AI will score your code 0–100 and suggest improvements. The community can comment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Binary search refactor"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                <div>
                  <Label>Context (optional)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this do? What do you want feedback on?"
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Code</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  className="font-mono text-xs"
                  placeholder="Paste your code here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => create.mutate()}
                disabled={create.isPending || title.length < 3 || code.length < 10}
              >
                <Sparkles className="h-4 w-4" />
                {create.isPending ? "Reviewing…" : "Submit for AI review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to share a snippet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data!.map((r) => (
            <Card key={r.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  {r.ai_score != null && (
                    <Badge variant={r.ai_score >= 80 ? "default" : "secondary"}>
                      {r.ai_score}/100
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {r.language} · by {r.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {r.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                )}
                <Button asChild variant="link" className="mt-2 h-auto p-0">
                  <Link to="/code-review/$id" params={{ id: r.id }}>
                    Open review <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
