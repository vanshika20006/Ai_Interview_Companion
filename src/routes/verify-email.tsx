import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/verify-email")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Verify your email — AI Placement Companion" },
      { name: "description", content: "Confirm your email address to access your account." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      if (data.user.email_confirmed_at || data.user.confirmed_at) {
        navigate({ to: "/dashboard" });
        return;
      }
      setEmail(data.user.email ?? null);
      setChecking(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "USER_UPDATED" &&
        (session?.user.email_confirmed_at || session?.user.confirmed_at)
      ) {
        toast.success("Email verified!");
        navigate({ to: "/dashboard" });
      }
      if (event === "SIGNED_OUT") navigate({ to: "/auth" });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleResend() {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setResending(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email sent — check your inbox.");
  }

  async function handleRefresh() {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) return toast.error(error.message);
    if (data.user?.email_confirmed_at || data.user?.confirmed_at) {
      toast.success("Email verified!");
      navigate({ to: "/dashboard" });
    } else {
      toast.info("Not verified yet — please click the link in your email.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            {checking ? (
              "Loading…"
            ) : (
              <>
                We sent a confirmation link to{" "}
                <span className="font-medium text-foreground">{email}</span>. Click it to activate
                your account.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleRefresh} className="w-full" disabled={checking}>
            I've verified — continue
          </Button>
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full"
            disabled={resending || checking}
          >
            {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Resend email
          </Button>
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <button
              onClick={handleSignOut}
              className="hover:text-foreground underline-offset-4 hover:underline"
            >
              Use a different account
            </button>
            <Link to="/" className="hover:text-foreground underline-offset-4 hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
