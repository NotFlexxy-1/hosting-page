import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plug, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/extra-apis")({ component: Page });

interface Row { id: string; key: string; value: { name?: string; api_key?: string; url?: string }; }

function Page() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => { if (!loading && !isAdmin) nav({ to: "/dashboard" }); }, [isAdmin, loading, nav]);

  const load = () => supabase.from("app_settings").select("id, key, value").like("key", "extra_api:%").then(({ data }) => setItems(((data as Row[]) ?? [])));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    if (!slug) return toast.error("Name required");
    const { error } = await supabase.from("app_settings").upsert({ key: `extra_api:${slug}`, value: { name, url, api_key: apiKey }, is_secret: true, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return toast.error(error.message);
    setName(""); setUrl(""); setApiKey(""); toast.success("API added"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Remove this API?")) return;
    await supabase.from("app_settings").delete().eq("id", id);
    load();
  };

  if (!isAdmin) return null;
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold flex items-center gap-2"><Plug className="h-7 w-7 text-primary" /> Setup Extra APIs</h1>
      <p className="mt-1 text-muted-foreground">Store named API endpoints + keys for use elsewhere in the app.</p>

      <form onSubmit={add} className="mt-6 glass rounded-2xl p-5 grid gap-3 md:grid-cols-[1fr_2fr_2fr_auto]">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. proxmox)" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
        <input type="password" required value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API key" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
        <button className="rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow inline-flex items-center gap-1"><Plus className="h-4 w-4" /> Add</button>
      </form>

      <div className="mt-6 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold">{it.value?.name ?? it.key.replace("extra_api:", "")}</div>
              <div className="text-xs text-muted-foreground truncate">{it.value?.url ?? "—"} · key hidden</div>
            </div>
            <button onClick={() => remove(it.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No extra APIs yet.</p>}
      </div>
    </DashboardLayout>
  );
}