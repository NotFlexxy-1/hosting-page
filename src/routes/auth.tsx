import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hexagon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Nebryx.Cloud" }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { display_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-elegant">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-xl">
          <Hexagon className="h-7 w-7 text-primary" /> Nebryx<span className="text-primary">.Cloud</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-center">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{mode === "signin" ? "Sign in to manage your servers." : "Start deploying in seconds."}</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
          )}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-primary px-4 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-50">
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
