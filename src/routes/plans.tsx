import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ShoppingCart, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export const Route = createFileRoute("/plans")({
  head: () => ({ meta: [{ title: "Plans — Nebryx.Cloud" }, { name: "description", content: "VPS, Minecraft, and Web hosting plans starting at $1/month." }] }),
  component: Plans,
});

interface Plan {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_cents: number;
  ram_gb: number | null;
  cpu_cores: number | null;
  storage_gb: number | null;
  features: string[] | unknown;
  popular: boolean | null;
}

function Plans() {
  useScrollReveal();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [cat, setCat] = useState<string>("All");
  const { add } = useCart();

  useEffect(() => {
    supabase.from("plans").select("*").eq("active", true).order("sort_order").then(({ data }) => setPlans((data as Plan[]) ?? []));
  }, []);

  const cats = ["All", ...Array.from(new Set(plans.map((p) => p.category)))];
  const shown = cat === "All" ? plans : plans.filter((p) => p.category === cat);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pt-16 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center scroll-reveal">
            <p className="text-sm uppercase tracking-widest text-primary">Pricing</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold">Choose your plan</h1>
            <p className="mt-4 text-muted-foreground">Honest pricing. No hidden fees. Cancel anytime.</p>
          </div>

          <div className="mt-10 flex justify-center gap-2 flex-wrap scroll-reveal">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${cat === c ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => {
              const features = Array.isArray(p.features) ? (p.features as string[]) : [];
              return (
                <div key={p.id} className={`animate-fade-up relative glass rounded-2xl p-6 flex flex-col ${p.popular ? "border-primary shadow-glow" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                      <Sparkles className="h-3 w-3" /> POPULAR
                    </span>
                  )}
                  <div className="text-xs uppercase text-primary">{p.category}</div>
                  <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${(p.price_cents / 100).toFixed(2)}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {p.ram_gb && <div className="rounded-lg bg-secondary py-2"><div className="text-sm font-bold">{p.ram_gb}GB</div><div className="text-[10px] text-muted-foreground">RAM</div></div>}
                    {p.cpu_cores && <div className="rounded-lg bg-secondary py-2"><div className="text-sm font-bold">{p.cpu_cores}</div><div className="text-[10px] text-muted-foreground">vCPU</div></div>}
                    {p.storage_gb && <div className="rounded-lg bg-secondary py-2"><div className="text-sm font-bold">{p.storage_gb}GB</div><div className="text-[10px] text-muted-foreground">NVMe</div></div>}
                  </div>
                  <ul className="mt-5 space-y-2 text-sm flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { add({ plan_id: p.id, name: p.name, price_cents: p.price_cents }); toast.success(`${p.name} added to cart`); }}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
