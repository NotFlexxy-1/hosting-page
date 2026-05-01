import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setName(data.display_name ?? ""); setDiscord(data.discord_username ?? ""); setAvatar(data.avatar_url ?? ""); }
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ display_name: name, discord_username: discord, avatar_url: avatar, updated_at: new Date().toISOString() }).eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile and Discord link.</p>
      <form onSubmit={save} className="mt-8 max-w-lg space-y-4">
        <div>
          <label className="block text-sm mb-1">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-sm mb-1">Discord username</label>
          <input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="username" className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className="w-full rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={user?.email ?? ""} disabled className="w-full rounded-xl bg-muted px-4 py-3 border border-border opacity-60" />
        </div>
        <button disabled={busy} className="rounded-xl bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow disabled:opacity-50">{busy ? "Saving..." : "Save changes"}</button>
        <a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">Join our Discord →</a>
      </form>
    </DashboardLayout>
  );
}
