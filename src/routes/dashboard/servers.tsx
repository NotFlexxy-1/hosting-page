import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Server, Gamepad2, HardDrive, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard/servers")({ component: Page });

interface S { id: string; name: string; status: string; suspended: boolean; expires_at: string | null; panel_type: string | null; }

function Page() {
  const { user } = useAuth();
  const [servers, setServers] = useState<S[]>([]);
  const [panelUrl, setPanelUrl] = useState("https://panel.nebryx.cloud");

  useEffect(() => {
    if (!user) return;
    supabase.from("servers").select("id, name, status, suspended, expires_at, panel_type").eq("user_id", user.id).then(({ data }) => setServers((data as S[]) ?? []));
    supabase.from("app_settings").select("value").eq("key", "pterodactyl").maybeSingle().then(({ data }) => {
      const v = (data?.value ?? {}) as { panel_url?: string };
      if (v.panel_url) setPanelUrl(v.panel_url);
    });
  }, [user]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">My Servers</h1>
      <p className="mt-1 text-muted-foreground">Manage your VPS and game servers.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <a href={panelUrl} target="_blank" rel="noreferrer" className="glass rounded-2xl p-6 hover:border-primary transition-colors group">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-semibold text-lg">Game Panel (Pterodactyl)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage Minecraft and other game servers.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary group-hover:underline">Open <ExternalLink className="h-3 w-3" /></span>
        </a>
        <a href="https://pve.nebryx.cloud" target="_blank" rel="noreferrer" className="glass rounded-2xl p-6 hover:border-primary transition-colors group">
          <HardDrive className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-semibold text-lg">Proxmox VE</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage your VPS instances.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary group-hover:underline">Open <ExternalLink className="h-3 w-3" /></span>
        </a>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Assigned to you</h2>
      <div className="mt-3 space-y-3">
        {servers.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Server className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No servers assigned yet. After payment, an admin will provision and link your server here.</p>
            <Link to="/plans" className="mt-4 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow">Browse plans</Link>
          </div>
        ) : servers.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.suspended ? "Suspended" : s.status} {s.expires_at && `• Renews ${new Date(s.expires_at).toLocaleDateString()}`} {s.panel_type && `• ${s.panel_type}`}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs ${s.suspended ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>{s.suspended ? "Suspended — pay to unsuspend" : "Active"}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
