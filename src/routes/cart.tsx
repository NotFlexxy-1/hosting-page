import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Nebryx.Cloud" }] }),
  component: Cart,
});

function Cart() {
  const { items, remove, setQty, clear, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  const purchase = async () => {
    if (!user) { toast.error("Please sign in to purchase"); nav({ to: "/auth" }); return; }
    if (items.length === 0) return;
    setBusy(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({ user_id: user.id, total_cents: total, status: "pending" }).select().single();
      if (error) throw error;
      const rows = items.map((i) => ({ order_id: order.id, plan_id: i.plan_id, plan_name: i.name, price_cents: i.price_cents, quantity: i.quantity }));
      const { error: e2 } = await supabase.from("order_items").insert(rows);
      if (e2) throw e2;
      clear();
      toast.success("Order placed! Our team will contact you on Discord.");
      nav({ to: "/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pt-16 pb-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold flex items-center gap-3"><ShoppingBag className="h-8 w-8 text-primary" /> Your Cart</h1>
          <p className="mt-2 text-muted-foreground">Review your items and complete your purchase.</p>

          {items.length === 0 ? (
            <div className="mt-12 glass rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link to="/plans" className="mt-4 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow">Browse plans</Link>
            </div>
          ) : (
            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {items.map((i) => (
                  <div key={i.plan_id} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">{i.name}</div>
                      <div className="text-sm text-muted-foreground">${(i.price_cents / 100).toFixed(2)} / mo</div>
                    </div>
                    <input type="number" min={1} value={i.quantity} onChange={(e) => setQty(i.plan_id, parseInt(e.target.value || "1"))} className="w-16 rounded-lg bg-input px-2 py-1 text-center border border-border" />
                    <div className="font-bold w-20 text-right">${((i.price_cents * i.quantity) / 100).toFixed(2)}</div>
                    <button onClick={() => remove(i.plan_id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="glass rounded-2xl p-6 h-fit sticky top-24">
                <h2 className="font-semibold">Order summary</h2>
                <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${(total / 100).toFixed(2)}</span></div>
                <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Setup</span><span className="text-success">Free</span></div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold"><span>Total</span><span className="text-gradient">${(total / 100).toFixed(2)}/mo</span></div>
                <button onClick={purchase} disabled={busy} className="mt-6 w-full rounded-xl bg-gradient-primary px-4 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-50">
                  {busy ? "Processing..." : "Purchase now"}
                </button>
                <a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground">After purchase, join our Discord →</a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
