import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/hooks/uptime-check")({
  server: {
    handlers: {
      POST: async () => {
        const { data: monitors } = await supabaseAdmin.from("uptime_monitors").select("id, url, active").eq("active", true);
        const today = new Date().toISOString().slice(0, 10);
        const results: { id: string; status: string; ms: number }[] = [];

        await Promise.all((monitors ?? []).map(async (m) => {
          const start = Date.now();
          let status: "up" | "down" | "degraded" = "down";
          try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 8000);
            const res = await fetch(m.url, { method: "GET", signal: ctrl.signal, redirect: "follow" });
            clearTimeout(timer);
            const ms = Date.now() - start;
            if (res.ok) status = ms > 3000 ? "degraded" : "up";
            else if (res.status >= 500) status = "down";
            else status = "up"; // 4xx but reachable
            results.push({ id: m.id, status, ms });
          } catch {
            results.push({ id: m.id, status: "down", ms: Date.now() - start });
          }
        }));

        // Upsert today's check (one row per monitor per day - keep latest)
        for (const r of results) {
          // delete then insert today's record for that monitor
          await supabaseAdmin.from("uptime_checks").delete().eq("monitor_id", r.id).eq("check_date", today);
          await supabaseAdmin.from("uptime_checks").insert({ monitor_id: r.id, check_date: today, status: r.status, response_ms: r.ms });
        }

        return Response.json({ ok: true, checked: results.length, at: new Date().toISOString() });
      },
      GET: async () => Response.json({ ok: true, hint: "POST to run a check" }),
    },
  },
});