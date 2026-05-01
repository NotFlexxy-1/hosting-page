import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, Save, X, Server } from "lucide-react";

export const Route = createFileRoute("/admin/plans")({ component: Page });

interface Plan {
  id: string; name: string; category: string; description: string | null;
  price_cents: number; ram_gb: number | null; cpu_cores: number | null; storage_gb: number | null;
  features: unknown; popular: boolean | null; active: boolean | null; sort_order: number | null;
}

const empty = { name: "", category: "VPS", description: "", price_cents: 0, ram_gb: 0, cpu_cores: 0, storage_gb: 0, features: "", popular: false, active: true, sort_order: 0 };

function Page() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (!loading && !isAdmin) nav({ to: "/dashboard" }); }, [isAdmin, loading, nav]);
  const load = () => supabase.from("plans").select("*").order("sort_order").then(({ data }) => setPlans((data as Plan[]) ?? []));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const startEdit = (p: Plan) => {
    setEditing(p.id);
    setForm({
      name: p.name, category: p.category, description: p.description ?? "",
      price_cents: p.price_cents, ram_gb: p.ram_gb ?? 0, cpu_cores: Number(p.cpu_cores ?? 0), storage_gb: p.storage_gb ?? 0,
      features: Array.isArray(p.features) ? (p.features as string[]).join(", ") : "",
      popular: !!p.popular, active: p.active !== false, sort_order: p.sort_order ?? 0,
    });
  };

  const save = async () => {
    const payload = {
      ...form,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const { error } = editing
      ? await supabase.from("plans").update(payload).eq("id", editing)
      : await supabase.from("plans").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); setCreating(false); setForm(empty); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete plan?")) return;
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  if (!isAdmin) return null;
  const showForm = editing || creating;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Server className="h-7 w-7 text-primary" /> Manage Plans</h1>
        {!showForm && (
          <button onClick={() => { setCreating(true); setForm(empty); }} className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow inline-flex items-center gap-1"><Plus className="h-4 w-4" /> New plan</button>
        )}
      </div>

      {showForm && (
        <div className="mt-6 glass rounded-2xl p-5 grid gap-3 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-xl bg-input px-4 py-3 border border-border outline-none md:col-span-2" />
          <input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: +e.target.value })} placeholder="Price (cents, e.g. 100 = $1)" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} placeholder="Sort order" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input type="number" value={form.ram_gb} onChange={(e) => setForm({ ...form, ram_gb: +e.target.value })} placeholder="RAM GB" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input type="number" value={form.cpu_cores} onChange={(e) => setForm({ ...form, cpu_cores: +e.target.value })} placeholder="vCPU" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input type="number" value={form.storage_gb} onChange={(e) => setForm({ ...form, storage_gb: +e.target.value })} placeholder="Storage GB" className="rounded-xl bg-input px-4 py-3 border border-border outline-none" />
          <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (comma separated)" className="rounded-xl bg-input px-4 py-3 border border-border outline-none md:col-span-2" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button onClick={() => { setEditing(null); setCreating(false); setForm(empty); }} className="rounded-xl px-4 py-2 text-sm border border-border inline-flex items-center gap-1"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={save} className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow inline-flex items-center gap-1"><Save className="h-4 w-4" /> Save</button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {plans.map((p) => (
          <div key={p.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">{p.name} <span className="text-xs text-muted-foreground">· {p.category}</span></div>
              <div className="text-xs text-muted-foreground truncate">${(p.price_cents/100).toFixed(2)}/mo · {p.ram_gb ?? "-"}GB / {p.cpu_cores ?? "-"} vCPU / {p.storage_gb ?? "-"}GB {p.active === false && "· (inactive)"}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}