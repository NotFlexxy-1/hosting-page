import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/uptime")({ component: Page });

interface Monitor { id: string; name: string; url: string; }
interface Check { monitor_id: string; check_date: string; status: string; }

function Page() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);
  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from("uptime_monitors").select("*").eq("active", true).order("sort_order");
      setMonitors((m as Monitor[]) ?? []);
      const since = new Date(); since.setDate(since.getDate() - 60);
      const { data: c } = await supabase.from("uptime_checks").select("monitor_id, check_date, status").gte("check_date", since.toISOString().slice(0, 10));
      setChecks((c as Check[]) ?? []);
    })();
  }, []);
  const dates: string[] = [];
  for (let i = 59; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().slice(0, 10)); }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Uptime</h1>
      <p className="mt-1 text-muted-foreground">Live status of all Nebryx.Cloud services.</p>
      <div className="mt-8 space-y-4">
        {monitors.map((m) => {
          const cmap = new Map(checks.filter((c) => c.monitor_id === m.id).map((c) => [c.check_date, c.status]));
          const ups = dates.reduce((s, d) => s + (cmap.get(d) === "up" ? 1 : 0), 0);
          const pct = Math.round((ups / dates.length) * 100);
          return (
            <div key={m.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div><div className="font-semibold">{m.name}</div><div className="text-xs text-muted-foreground">{m.url}</div></div>
                <div className="text-sm"><span className="font-bold text-success">{pct}%</span></div>
              </div>
              <div className="flex gap-[3px]">
                {dates.map((d) => {
                  const st = cmap.get(d);
                  const cls = st === "down" ? "bg-destructive" : st === "degraded" ? "bg-warning" : st === "up" ? "bg-success" : "bg-muted";
                  return <div key={d} title={`${d}: ${st ?? "no data"}`} className={`flex-1 h-8 rounded-sm ${cls}`} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
