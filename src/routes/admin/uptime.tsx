import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Activity } from "lucide-react";

export const Route = createFileRoute("/admin/uptime")({ component: Page });

interface Monitor { id: string; name: string; url: string; active: boolean; }

function Page() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => { if (!loading && !isAdmin) nav({ to: "/dashboard" }); }, [isAdmin, loading, nav]);
  const load = () => supabase.from("uptime_monitors").select("*").order("sort_order").then(({ data }) => setMonitors((data as Monitor[]) ?? []));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("uptime_monitors").insert({ name, url, sort_order: monitors.length + 1 });
    if (error) return toast.error(error.message);
    setName(""); setUrl(""); toast.success("Monitor added"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Remove monitor?")) return;
    const { error } = await supabase.from("uptime_monitors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const toggle = async (id: string, active: boolean) => {
    await supabase.from("uptime_monitors").update({ active: !active }).eq("id", id);
    load();
  };

  if (!isAdmin) return null;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold flex items-center gap-2"><Activity className="h-7 w-7 text-primary" /> Uptime Utilities</h1>
      <p className="mt-1 text-muted-foreground">Admin-only: add or remove sites shown on the public uptime page.</p>

      <form onSubmit={add} className="mt-8 glass rounded-2xl p-5 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" className="rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
        <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="rounded-xl bg-input px-4 py-3 border border-border focus:border-primary outline-none" />
        <button className="rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add</button>
      </form>

      <div className="mt-6 space-y-2">
        {monitors.map((m) => (
          <div key={m.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{m.name} {!m.active && <span className="text-xs text-muted-foreground">(inactive)</span>}</div>
              <div className="text-xs text-muted-foreground">{m.url}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(m.id, m.active)} className="text-xs text-muted-foreground hover:text-foreground px-2">{m.active ? "Disable" : "Enable"}</button>
              <button onClick={() => remove(m.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
