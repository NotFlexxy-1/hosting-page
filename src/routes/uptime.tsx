import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/uptime")({
  head: () => ({ meta: [{ title: "Uptime — Nebryx.Cloud" }, { name: "description", content: "Live status and 60-day uptime history for all Nebryx.Cloud services." }] }),
  component: Uptime,
});

interface Monitor { id: string; name: string; url: string; }
interface Check { monitor_id: string; check_date: string; status: string; }

const DAYS = 60;

function dateRange() {
  const arr: string[] = [];
  const today = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function Uptime() {
  useScrollReveal();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);

  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from("uptime_monitors").select("*").eq("active", true).order("sort_order");
      setMonitors((m as Monitor[]) ?? []);
      const since = new Date(); since.setDate(since.getDate() - DAYS);
      const { data: c } = await supabase.from("uptime_checks").select("monitor_id, check_date, status").gte("check_date", since.toISOString().slice(0, 10));
      setChecks((c as Check[]) ?? []);
    })();
  }, []);

  const dates = dateRange();
  const allUp = checks.length > 0 && checks.every((c) => c.status === "up");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pt-16 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center scroll-reveal">
            <p className="text-sm uppercase tracking-widest text-primary">Status</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold">{allUp ? "All systems operational" : "Live system status"}</h1>
            <p className="mt-3 text-muted-foreground">Last 60 days. Updated daily.</p>
          </div>

          <div className="mt-12 space-y-4">
            {monitors.map((m, idx) => {
              const cmap = new Map(checks.filter((c) => c.monitor_id === m.id).map((c) => [c.check_date, c.status]));
              const recent = dates.slice(-30);
              const ups = dates.reduce((s, d) => s + (cmap.get(d) === "up" ? 1 : 0), 0);
              const pct = Math.round((ups / dates.length) * 100);
              return (
                <div key={m.id} className="scroll-reveal glass rounded-2xl p-5" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.url}</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-success">{pct}%</span>
                      <span className="text-muted-foreground"> uptime</span>
                    </div>
                  </div>
                  <div className="flex gap-[3px]">
                    {dates.map((d) => {
                      const st = cmap.get(d);
                      const cls = st === "down" ? "bg-destructive" : st === "degraded" ? "bg-warning" : st === "up" ? "bg-success" : "bg-muted";
                      return (
                        <div
                          key={d}
                          title={`${d}: ${st ?? "no data"}`}
                          className={`flex-1 h-9 rounded-sm ${cls} hover:scale-y-110 transition-transform`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                    <span>{dates[0]}</span>
                    <span>Today</span>
                  </div>
                </div>
              );
            })}
            {monitors.length === 0 && <div className="text-center text-muted-foreground">No monitors configured yet.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
