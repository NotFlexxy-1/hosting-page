import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Key, Save } from "lucide-react";

export const Route = createFileRoute("/admin/pterodactyl")({ component: Page });

function Page() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [panelUrl, setPanelUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !isAdmin) nav({ to: "/dashboard" }); }, [isAdmin, loading, nav]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("app_settings").select("*").eq("key", "pterodactyl").maybeSingle().then(({ data }) => {
      const v = (data?.value ?? {}) as { panel_url?: string; api_key?: string };
      setPanelUrl(v.panel_url ?? "https://panel.nebryx.cloud");
      setApiKey(v.api_key ?? "");
    });
  }, [isAdmin]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("app_settings").upsert({ key: "pterodactyl", value: { panel_url: panelUrl, api_key: apiKey }, is_secret: true, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Pterodactyl config saved");
  };

  if (!isAdmin) return null;
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold flex items-center gap-2"><Key className="h-7 w-7 text-primary" /> Setup Pterodactyl API</h1>
      <p className="mt-1 text-muted-foreground">Used so customers can manage their game servers from the dashboard.</p>
      <div className="mt-6 max-w-xl glass rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm mb-1">Panel URL</label>
          <input value={panelUrl} onChange={(e) => setPanelUrl(e.target.value)} placeholder="https://panel.nebryx.cloud" className="w-full rounded-xl bg-input px-4 py-3 border border-border outline-none" />
        </div>
        <div>
          <label className="block text-sm mb-1">Application API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="ptla_..." className="w-full rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <p className="mt-1 text-xs text-muted-foreground">Stored encrypted in your backend. Only admins can view it.</p>
        </div>
        <button onClick={save} disabled={busy} className="rounded-xl bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow inline-flex items-center gap-1"><Save className="h-4 w-4" /> {busy ? "Saving..." : "Save"}</button>
      </div>
    </DashboardLayout>
  );
}