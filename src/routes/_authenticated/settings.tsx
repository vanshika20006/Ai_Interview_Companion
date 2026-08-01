import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Moon, Sun, Monitor, Share2, Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getMyPublicProfile, upsertPublicProfile } from "@/lib/publicProfile.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Placement AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchPP = useServerFn(getMyPublicProfile);
  const savePP = useServerFn(upsertPublicProfile);

  const { data: pp } = useQuery({ queryKey: ["myPublicProfile"], queryFn: () => fetchPP() });

  const [form, setForm] = useState({
    username: "",
    headline: "",
    bio: "",
    is_public: false,
    show_email: false,
    show_resume_score: true,
    show_problems: true,
    show_interview: true,
    show_badges: true,
  });

  useEffect(() => {
    if (pp) {
      setForm({
        username: pp.username ?? "",
        headline: pp.headline ?? "",
        bio: pp.bio ?? "",
        is_public: pp.is_public,
        show_email: pp.show_email,
        show_resume_score: pp.show_resume_score,
        show_problems: pp.show_problems,
        show_interview: pp.show_interview,
        show_badges: pp.show_badges,
      });
    }
  }, [pp]);

  const saveMut = useMutation({
    mutationFn: () => savePP({ data: form }),
    onSuccess: () => {
      toast.success("Public profile updated");
      qc.invalidateQueries({ queryKey: ["myPublicProfile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  const publicUrl = form.username
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${form.username}`
    : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Account, theme, and public portfolio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" /> Public portfolio
          </CardTitle>
          <CardDescription>
            Make your placement profile shareable at /u/your-username.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                })
              }
              placeholder="your-handle"
            />
            <p className="text-xs text-muted-foreground">3-32 lowercase letters, numbers, _ or -</p>
          </div>
          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. Final year CS · Open to SDE roles"
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="A short intro for recruiters…"
              maxLength={2000}
            />
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <Toggle
              label="Make profile public"
              v={form.is_public}
              on={(v) => setForm({ ...form, is_public: v })}
            />
            <Toggle
              label="Show email"
              v={form.show_email}
              on={(v) => setForm({ ...form, show_email: v })}
            />
            <Toggle
              label="Show resume ATS score"
              v={form.show_resume_score}
              on={(v) => setForm({ ...form, show_resume_score: v })}
            />
            <Toggle
              label="Show problems solved"
              v={form.show_problems}
              on={(v) => setForm({ ...form, show_problems: v })}
            />
            <Toggle
              label="Show interview scores"
              v={form.show_interview}
              on={(v) => setForm({ ...form, show_interview: v })}
            />
            <Toggle
              label="Show badges"
              v={form.show_badges}
              on={(v) => setForm({ ...form, show_badges: v })}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => saveMut.mutate()}
              disabled={saveMut.isPending || form.username.length < 3}
            >
              {saveMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save profile
            </Button>
            {pp?.is_public && publicUrl && (
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("Link copied");
                }}
              >
                <Share2 className="mr-1.5 h-4 w-4" /> Copy share link
              </Button>
            )}
          </div>
          {publicUrl && <p className="text-xs text-muted-foreground">Public URL: {publicUrl}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Choose how Placement AI looks.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {[
            { v: "light", icon: Sun, l: "Light" },
            { v: "dark", icon: Moon, l: "Dark" },
            { v: "system", icon: Monitor, l: "System" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTheme(t.v)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border px-4 py-3 text-sm ${theme === t.v ? "border-primary bg-accent" : "hover:bg-accent"}`}
            >
              <t.icon className="h-4 w-4" /> {t.l}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">Sign out</CardTitle>
          <CardDescription>You'll need to sign in again.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm font-normal">{label}</Label>
      <Switch checked={v} onCheckedChange={on} />
    </div>
  );
}
