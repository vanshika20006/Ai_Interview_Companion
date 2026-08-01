import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, Eye, EyeOff, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { bootstrapMyRole } from "@/lib/admin.functions";
import { GraduationCap, Briefcase } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — AI Placement Companion" },
      {
        name: "description",
        content: "Sign in or create your account to access AI-powered placement preparation.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const initialTab = search.mode === "signup" ? "signup" : "signin";

  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signupRole, setSignupRole] = useState<"student" | "recruiter">("student");
  const [loading, setLoading] = useState(false);

  async function bootstrap(): Promise<string> {
    try {
      const granted = await bootstrapMyRole();
      if (granted === "admin") toast.success("Admin access granted");
      else if (granted === "recruiter") toast.success("Recruiter access granted");
      return granted ?? "none";
    } catch {
      return "none";
    }
  }

  function landingFor(role: string): string {
    if (role === "admin") return "/admin";
    if (role === "recruiter") return "/recruiter";
    return "/dashboard";
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    const role = await bootstrap();
    navigate({ to: search.redirect ?? landingFor(role) });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirmPassword) return toast.error("Passwords don't match");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName, signup_role: signupRole },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (!data.session) {
      toast.success("Account created — check your email to verify.");
      navigate({ to: "/verify-email" });
      return;
    }
    toast.success("Account created — you're in!");
    const role = await bootstrap();
    navigate({ to: landingFor(role) });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="hidden flex-col justify-between rounded-3xl bg-gradient-hero p-10 text-white shadow-elegant lg:flex">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">Placement AI</span>
          </Link>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold leading-tight">
              Your AI-powered companion for landing the right placement.
            </h2>
            <p className="text-sm text-white/80">
              Resume analysis, mock interviews, a curated LeetCode roadmap, and personalized
              analytics — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Stat label="Curated problems" value="45+" />
            <Stat label="AI models" value="Gemini" />
            <Stat label="Free tier" value="∞" />
          </div>
        </div>

        <Card className="border-none shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in or create your account to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <RoleOption
                        active={signupRole === "student"}
                        icon={<GraduationCap className="h-4 w-4" />}
                        label="Student"
                        desc="Prep for placements"
                        onClick={() => setSignupRole("student")}
                      />
                      <RoleOption
                        active={signupRole === "recruiter"}
                        icon={<Briefcase className="h-4 w-4" />}
                        label="Recruiter"
                        desc="Find candidates"
                        onClick={() => setSignupRole("recruiter")}
                      />
                    </div>
                  </div>
                  <Field
                    id="name"
                    label="Full name"
                    value={fullName}
                    onChange={setFullName}
                    required
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <PasswordField
                    value={password}
                    onChange={setPassword}
                    onGenerate={(pwd) => {
                      setPassword(pwd);
                      setConfirmPassword(pwd);
                    }}
                    label="Password (min 8)"
                  />
                  <ConfirmPasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    password={password}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoleOption({
  active,
  icon,
  label,
  desc,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition ${
        active
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-input hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

function generateStrongPassword(length = 16): string {
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_=+?";
  const all = lower + upper + digits + symbols;
  const pick = (set: string) => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return set[buf[0] % set.length];
  };
  const required = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  const rest = Array.from({ length: length - required.length }, () => pick(all));
  const chars = [...required, ...rest];
  // Fisher–Yates shuffle with crypto randomness
  for (let i = chars.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function PasswordField({
  value,
  onChange,
  onGenerate,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  onGenerate?: (pwd: string) => void;
  label: string;
}) {
  const [show, setShow] = useState(false);

  function handleGenerate() {
    const pwd = generateStrongPassword(16);
    if (onGenerate) onGenerate(pwd);
    else onChange(pwd);
    setShow(true);
    navigator.clipboard?.writeText(pwd).then(
      () => toast.success("Strong password generated & copied"),
      () => toast.success("Strong password generated"),
    );
  }

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Password copied");
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="password">{label}</Label>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Wand2 className="h-3 w-3" /> Generate strong password
        </button>
      </div>
      <div className="relative">
        <Input
          id="password"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="pr-20"
          autoComplete="new-password"
        />
        <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
              aria-label="Copy password"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmPasswordField({
  value,
  onChange,
  password,
}: {
  value: string;
  onChange: (v: string) => void;
  password: string;
}) {
  const [show, setShow] = useState(false);
  const mismatch = value.length > 0 && value !== password;
  const match = value.length > 0 && value === password;
  return (
    <div className="space-y-1.5">
      <Label htmlFor="confirm-password">Confirm password</Label>
      <div className="relative">
        <Input
          id="confirm-password"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="pr-10"
          autoComplete="new-password"
          aria-invalid={mismatch || undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-1 my-auto h-7 w-7"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      </div>
      {mismatch && <p className="text-xs text-destructive">Passwords don't match</p>}
      {match && <p className="text-xs text-emerald-600 dark:text-emerald-400">Passwords match</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}
