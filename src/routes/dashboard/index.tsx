import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Server, ShoppingBag, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ servers: 0, orders: 0 });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [s, o] = await Promise.all([
        supabase.from("servers").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setCounts({ servers: s.count ?? 0, orders: o.count ?? 0 });
    })();
  }, [user]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Welcome back 👋</h1>
      <p className="mt-1 text-muted-foreground">Here's what's happening with your account.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link to="/dashboard/servers" className="glass rounded-2xl p-6 hover:border-primary transition-colors">
          <Server className="h-6 w-6 text-primary" />
          <div className="mt-3 text-3xl font-bold">{counts.servers}</div>
          <div className="text-sm text-muted-foreground">Active servers</div>
        </Link>
        <div className="glass rounded-2xl p-6">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <div className="mt-3 text-3xl font-bold">{counts.orders}</div>
          <div className="text-sm text-muted-foreground">Total orders</div>
        </div>
        <Link to="/dashboard/uptime" className="glass rounded-2xl p-6 hover:border-primary transition-colors">
          <Activity className="h-6 w-6 text-primary" />
          <div className="mt-3 text-3xl font-bold text-success">99.9%</div>
          <div className="text-sm text-muted-foreground">Network uptime</div>
        </Link>
      </div>
    </DashboardLayout>
  );
}
