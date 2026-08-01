import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Download, Save, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  listBuilderResumes,
  createBuilderResume,
  getBuilderResume,
  updateBuilderResume,
  deleteBuilderResume,
  type ResumeBuilderData,
} from "@/lib/resumeBuilder.functions";
import { ResumePreview } from "@/components/resume-preview";
import { toUserMessage } from "@/lib/errors";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({ meta: [{ title: "Resume Builder — Placement AI" }] }),
  component: BuilderPage,
});

const EMPTY: ResumeBuilderData = {
  personal: {
    full_name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    links: [],
    summary: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
};

function BuilderPage() {
  const list = useServerFn(listBuilderResumes);
  const create = useServerFn(createBuilderResume);
  const get = useServerFn(getBuilderResume);
  const update = useServerFn(updateBuilderResume);
  const remove = useServerFn(deleteBuilderResume);

  const {
    data: resumes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["builderResumes"],
    queryFn: () => list(),
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && resumes && resumes.length > 0) setActiveId(resumes[0].id);
  }, [resumes, activeId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume Builder</h1>
          <p className="text-sm text-muted-foreground">
            Build, preview, and export your resume as PDF.
          </p>
        </div>
        <Button
          onClick={async () => {
            try {
              const r = await create({ data: { title: "Untitled resume", template: "modern" } });
              await refetch();
              setActiveId(r.id);
              toast.success("Created new resume");
            } catch (e) {
              toast.error(toUserMessage(e));
            }
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New resume
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your resumes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </>
            ) : resumes && resumes.length > 0 ? (
              resumes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${activeId === r.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{r.title}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {r.template}
                  </Badge>
                </button>
              ))
            ) : (
              <p className="px-2 py-4 text-xs text-muted-foreground">
                No resumes yet. Create one to start.
              </p>
            )}
          </CardContent>
        </Card>

        {activeId ? (
          <Editor
            key={activeId}
            id={activeId}
            getFn={get}
            updateFn={update}
            removeFn={remove}
            onDeleted={async () => {
              setActiveId(null);
              await refetch();
            }}
            onRenamed={async () => {
              await refetch();
            }}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Create your first resume to start editing.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

type GetFn = ReturnType<typeof useServerFn<typeof getBuilderResume>>;
type UpdateFn = ReturnType<typeof useServerFn<typeof updateBuilderResume>>;
type RemoveFn = ReturnType<typeof useServerFn<typeof deleteBuilderResume>>;

function Editor({
  id,
  getFn,
  updateFn,
  removeFn,
  onDeleted,
  onRenamed,
}: {
  id: string;
  getFn: GetFn;
  updateFn: UpdateFn;
  removeFn: RemoveFn;
  onDeleted: () => void;
  onRenamed: () => void;
}) {
  const { data: row, isLoading } = useQuery({
    queryKey: ["builderResume", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<"modern" | "minimal" | "compact">("modern");
  const [data, setData] = useState<ResumeBuilderData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!row) return;
    setTitle(row.title);
    setTemplate((row.template as "modern" | "minimal" | "compact") ?? "modern");
    setData({ ...EMPTY, ...((row.data as Partial<ResumeBuilderData>) ?? {}) });
  }, [row]);

  const save = async () => {
    setSaving(true);
    try {
      await updateFn({ data: { id, title, template, data } });
      toast.success("Saved");
      onRenamed();
    } catch (e) {
      toast.error(toUserMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: "a4", compress: true });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`${title || "resume"}.pdf`);
    } catch (e) {
      toast.error(toUserMessage(e));
    } finally {
      setExporting(false);
    }
  };

  const dataMemo = useMemo(() => data, [data]);

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xs" />
          <Select
            value={template}
            onValueChange={(v) => setTemplate(v as "modern" | "minimal" | "compact")}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={save} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}{" "}
              Save
            </Button>
            <Button onClick={exportPdf} disabled={exporting}>
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}{" "}
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete resume"
              onClick={async () => {
                if (!confirm("Delete this resume?")) return;
                await removeFn({ data: { id } });
                onDeleted();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-4 space-y-3">
                <Grid2>
                  <Field
                    label="Full name"
                    value={data.personal.full_name}
                    onChange={(v) =>
                      setData({ ...data, personal: { ...data.personal, full_name: v } })
                    }
                  />
                  <Field
                    label="Headline"
                    value={data.personal.headline}
                    onChange={(v) =>
                      setData({ ...data, personal: { ...data.personal, headline: v } })
                    }
                  />
                  <Field
                    label="Email"
                    value={data.personal.email}
                    onChange={(v) => setData({ ...data, personal: { ...data.personal, email: v } })}
                  />
                  <Field
                    label="Phone"
                    value={data.personal.phone}
                    onChange={(v) => setData({ ...data, personal: { ...data.personal, phone: v } })}
                  />
                  <Field
                    label="Location"
                    value={data.personal.location}
                    onChange={(v) =>
                      setData({ ...data, personal: { ...data.personal, location: v } })
                    }
                  />
                </Grid2>
                <div>
                  <Label>Summary</Label>
                  <Textarea
                    rows={4}
                    value={data.personal.summary}
                    onChange={(e) =>
                      setData({ ...data, personal: { ...data.personal, summary: e.target.value } })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-4 space-y-3">
                {data.experience.map((e, i) => (
                  <ItemCard
                    key={i}
                    onRemove={() =>
                      setData({ ...data, experience: data.experience.filter((_, j) => j !== i) })
                    }
                  >
                    <Grid2>
                      <Field
                        label="Company"
                        value={e.company}
                        onChange={(v) => updateAt(data, setData, "experience", i, { company: v })}
                      />
                      <Field
                        label="Role"
                        value={e.role}
                        onChange={(v) => updateAt(data, setData, "experience", i, { role: v })}
                      />
                      <Field
                        label="Start"
                        value={e.start}
                        onChange={(v) => updateAt(data, setData, "experience", i, { start: v })}
                      />
                      <Field
                        label="End"
                        value={e.end}
                        onChange={(v) => updateAt(data, setData, "experience", i, { end: v })}
                      />
                      <Field
                        label="Location"
                        value={e.location}
                        onChange={(v) => updateAt(data, setData, "experience", i, { location: v })}
                      />
                    </Grid2>
                    <BulletEditor
                      bullets={e.bullets}
                      onChange={(b) => updateAt(data, setData, "experience", i, { bullets: b })}
                    />
                  </ItemCard>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData({
                      ...data,
                      experience: [
                        ...data.experience,
                        { company: "", role: "", location: "", start: "", end: "", bullets: [""] },
                      ],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add experience
                </Button>
              </TabsContent>

              <TabsContent value="projects" className="mt-4 space-y-3">
                {data.projects.map((p, i) => (
                  <ItemCard
                    key={i}
                    onRemove={() =>
                      setData({ ...data, projects: data.projects.filter((_, j) => j !== i) })
                    }
                  >
                    <Grid2>
                      <Field
                        label="Name"
                        value={p.name}
                        onChange={(v) => updateAt(data, setData, "projects", i, { name: v })}
                      />
                      <Field
                        label="Tech stack"
                        value={p.tech}
                        onChange={(v) => updateAt(data, setData, "projects", i, { tech: v })}
                      />
                      <Field
                        label="Link"
                        value={p.link}
                        onChange={(v) => updateAt(data, setData, "projects", i, { link: v })}
                      />
                    </Grid2>
                    <BulletEditor
                      bullets={p.bullets}
                      onChange={(b) => updateAt(data, setData, "projects", i, { bullets: b })}
                    />
                  </ItemCard>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData({
                      ...data,
                      projects: [...data.projects, { name: "", tech: "", link: "", bullets: [""] }],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add project
                </Button>
              </TabsContent>

              <TabsContent value="education" className="mt-4 space-y-3">
                {data.education.map((ed, i) => (
                  <ItemCard
                    key={i}
                    onRemove={() =>
                      setData({ ...data, education: data.education.filter((_, j) => j !== i) })
                    }
                  >
                    <Grid2>
                      <Field
                        label="School"
                        value={ed.school}
                        onChange={(v) => updateAt(data, setData, "education", i, { school: v })}
                      />
                      <Field
                        label="Degree"
                        value={ed.degree}
                        onChange={(v) => updateAt(data, setData, "education", i, { degree: v })}
                      />
                      <Field
                        label="Field"
                        value={ed.field}
                        onChange={(v) => updateAt(data, setData, "education", i, { field: v })}
                      />
                      <Field
                        label="Start"
                        value={ed.start}
                        onChange={(v) => updateAt(data, setData, "education", i, { start: v })}
                      />
                      <Field
                        label="End"
                        value={ed.end}
                        onChange={(v) => updateAt(data, setData, "education", i, { end: v })}
                      />
                      <Field
                        label="Score / CGPA"
                        value={ed.score}
                        onChange={(v) => updateAt(data, setData, "education", i, { score: v })}
                      />
                    </Grid2>
                  </ItemCard>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData({
                      ...data,
                      education: [
                        ...data.education,
                        { school: "", degree: "", field: "", start: "", end: "", score: "" },
                      ],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add education
                </Button>
              </TabsContent>

              <TabsContent value="skills" className="mt-4 space-y-3">
                <Label>Skills (comma-separated)</Label>
                <Textarea
                  rows={3}
                  value={data.skills.join(", ")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </TabsContent>

              <TabsContent value="achievements" className="mt-4 space-y-3">
                <BulletEditor
                  bullets={data.achievements}
                  onChange={(b) => setData({ ...data, achievements: b })}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="overflow-auto">
          <CardContent className="p-4">
            <div className="origin-top-left scale-[0.65] xl:scale-[0.7]">
              <div ref={previewRef}>
                <ResumePreview data={dataMemo} template={template} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative rounded-lg border p-3 pr-10">
      {children}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Remove item"
        className="absolute right-1 top-1"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (b: string[]) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={b}
            onChange={(e) => onChange(bullets.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder="Use action verbs + quantified impact"
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove bullet"
            onClick={() => onChange(bullets.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...bullets, ""])}>
        <Plus className="mr-2 h-4 w-4" /> Add bullet
      </Button>
    </div>
  );
}

function updateAt<K extends "experience" | "projects" | "education">(
  data: ResumeBuilderData,
  setData: (d: ResumeBuilderData) => void,
  key: K,
  index: number,
  patch: Partial<ResumeBuilderData[K][number]>,
) {
  const arr = [...data[key]];
  arr[index] = { ...arr[index], ...patch } as ResumeBuilderData[K][number];
  setData({ ...data, [key]: arr });
}
