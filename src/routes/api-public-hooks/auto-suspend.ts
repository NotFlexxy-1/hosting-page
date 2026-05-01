import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/hooks/auto-suspend")({
  server: {
    handlers: {
      POST: async () => {
        const now = new Date().toISOString();
        const { data, error } = await supabaseAdmin
          .from("servers")
          .update({ suspended: true, status: "suspended" })
          .lt("expires_at", now)
          .eq("suspended", false)
          .select("id");
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        return Response.json({ ok: true, suspended: data?.length ?? 0 });
      },
    },
  },
});