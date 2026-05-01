import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldAlert, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: Page });

interface Profile { id: string; email: string | null; display_name: string | null; }
interface RoleRow { user_id: string; role: string; }
interface ServerRow { id: string; user_id: string; name: string; suspended: boolean; }

function Page() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [servers, setServers] = useState<ServerRow[]>([]);

  useEffect(() => { if (!loading && !isAdmin) nav({ to: "/dashboard" }); }, [isAdmin, loading, nav]);

  const load = async () => {
    const [p, r, s] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("servers").select("id, user_id, name, suspended"),
    ]);
    setProfiles((p.data as Profile[]) ?? []);
    setRoles((r.data as RoleRow[]) ?? []);
    setServers((s.data as ServerRow[]) ?? []);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggleAdmin = async (uid: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) return toast.error(error.message);
    }
    toast.success("Updated"); load();
  };
  const giveServer = async (uid: string) => {
    const name = prompt("Server name?"); if (!name) return;
    const { error } = await supabase.from("servers").insert({ user_id: uid, name, status: "active", expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString() });
    if (error) return toast.error(error.message);
    toast.success("Server created"); load();
  };
  const toggleSuspend = async (id: string, sus: boolean) => {
    const { error } = await supabase.from("servers").update({ suspended: !sus }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const deleteServer = async (id: string) => {
    if (!confirm("Delete this server?")) return;
    const { error } = await supabase.from("servers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  if (!isAdmin) return null;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldAlert className="h-7 w-7 text-primary" /> Manage Users</h1>
      <p className="mt-1 text-muted-foreground">Admin-only: manage roles, servers, and suspensions.</p>
      <div className="mt-8 space-y-3">
        {profiles.map((p) => {
          const isAdm = roles.some((r) => r.user_id === p.id && r.role === "admin");
          const userServers = servers.filter((s) => s.user_id === p.id);
          return (
            <div key={p.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-semibold">{p.display_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{p.email}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => giveServer(p.id)} className="rounded-lg glass px-3 py-1.5 text-xs flex items-center gap-1"><Plus className="h-3 w-3" /> Give server</button>
                  <button onClick={() => toggleAdmin(p.id, !isAdm)} className={`rounded-lg px-3 py-1.5 text-xs ${isAdm ? "bg-destructive/20 text-destructive" : "bg-gradient-primary text-primary-foreground"}`}>
                    {isAdm ? "Remove admin" : "Make admin"}
                  </button>
                </div>
              </div>
              {userServers.length > 0 && (
                <div className="mt-3 space-y-1">
                  {userServers.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                      <span>{s.name} {s.suspended && <span className="text-destructive text-xs">(suspended)</span>}</span>
                      <div className="flex gap-2">
                        <button onClick={() => toggleSuspend(s.id, s.suspended)} className="text-xs text-muted-foreground hover:text-foreground">{s.suspended ? "Unsuspend" : "Suspend"}</button>
                        <button onClick={() => deleteServer(s.id)} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Auto-suspension: servers with expires_at in the past are flagged. Set expires_at when issuing servers; toggle suspended manually or via a scheduled job.</p>
    </DashboardLayout>
  );
}
