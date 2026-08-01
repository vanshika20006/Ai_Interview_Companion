import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProfile, upsertProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Placement AI" }] }),
  component: ProfilePage,
});

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "SDE",
  "ML Engineer",
];

function ProfilePage() {
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getProfile);
  const saveProfile = useServerFn(upsertProfile);

  const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  const [form, setForm] = useState({
    full_name: "",
    college: "",
    degree: "",
    branch: "",
    graduation_year: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    target_roles: [] as string[],
    preferred_companies: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      full_name: data.full_name ?? "",
      college: data.college ?? "",
      degree: data.degree ?? "",
      branch: data.branch ?? "",
      graduation_year: data.graduation_year?.toString() ?? "",
      skills: (data.skills ?? []).join(", "),
      github: data.github ?? "",
      linkedin: data.linkedin ?? "",
      portfolio: data.portfolio ?? "",
      target_roles: data.target_roles ?? [],
      preferred_companies: (data.preferred_companies ?? []).join(", "),
    });
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile({
        data: {
          full_name: form.full_name || null,
          college: form.college || null,
          degree: form.degree || null,
          branch: form.branch || null,
          graduation_year: form.graduation_year ? parseInt(form.graduation_year, 10) : null,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          github: form.github || null,
          linkedin: form.linkedin || null,
          portfolio: form.portfolio || null,
          target_roles: form.target_roles,
          preferred_companies: form.preferred_companies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      toast.success("Profile saved");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function toggleRole(r: string) {
    setForm((f) => ({
      ...f,
      target_roles: f.target_roles.includes(r)
        ? f.target_roles.filter((x) => x !== r)
        : [...f.target_roles, r],
    }));
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-sm text-muted-foreground">
          Used to personalize resume analysis, job match, and AI feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal</CardTitle>
            <CardDescription>Basic details from your resume.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <F
              label="Full name"
              v={form.full_name}
              on={(v) => setForm({ ...form, full_name: v })}
            />
            <F label="College" v={form.college} on={(v) => setForm({ ...form, college: v })} />
            <F
              label="Degree"
              v={form.degree}
              on={(v) => setForm({ ...form, degree: v })}
              placeholder="B.Tech, M.Sc..."
            />
            <F
              label="Branch"
              v={form.branch}
              on={(v) => setForm({ ...form, branch: v })}
              placeholder="CSE, ECE..."
            />
            <F
              label="Graduation year"
              v={form.graduation_year}
              on={(v) => setForm({ ...form, graduation_year: v })}
              type="number"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills & links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <F
              label="Skills (comma separated)"
              v={form.skills}
              on={(v) => setForm({ ...form, skills: v })}
              placeholder="React, Node.js, Python, SQL"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <F label="GitHub URL" v={form.github} on={(v) => setForm({ ...form, github: v })} />
              <F
                label="LinkedIn URL"
                v={form.linkedin}
                on={(v) => setForm({ ...form, linkedin: v })}
              />
              <F
                label="Portfolio URL"
                v={form.portfolio}
                on={(v) => setForm({ ...form, portfolio: v })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Career targets</CardTitle>
            <CardDescription>Pick the roles you're preparing for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {TARGET_ROLES.map((r) => {
                const on = form.target_roles.includes(r);
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => toggleRole(r)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <F
              label="Preferred companies (comma separated)"
              v={form.preferred_companies}
              on={(v) => setForm({ ...form, preferred_companies: v })}
              placeholder="Google, Amazon, Razorpay"
            />
            <div className="flex flex-wrap gap-1.5">
              {form.preferred_companies
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
                .map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save profile
          </Button>
        </div>
      </form>
    </div>
  );
}

function F({
  label,
  v,
  on,
  type = "text",
  placeholder,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
