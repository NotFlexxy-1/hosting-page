import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [
    { title: "Docs — Nebryx.Cloud" },
    { name: "description", content: "Guides for VPS, Minecraft, network and security on Nebryx.Cloud." },
  ]}),
  component: DocsLayout,
});

interface Doc { id: string; slug: string; title: string; category: string; sort_order: number; }

function DocsLayout() {
  const loc = useLocation();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("docs").select("id, slug, title, category, sort_order").order("sort_order").then(({ data }) => setDocs((data as Doc[]) ?? []));
  }, []);

  const grouped = useMemo(() => {
    const filtered = q ? docs.filter((d) => d.title.toLowerCase().includes(q.toLowerCase())) : docs;
    const map = new Map<string, Doc[]>();
    filtered.forEach((d) => {
      if (!map.has(d.category)) map.set(d.category, []);
      map.get(d.category)!.push(d);
    });
    return Array.from(map.entries());
  }, [docs, q]);

  const isIndex = loc.pathname === "/docs" || loc.pathname === "/docs/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pt-10 pb-24">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-[260px_1fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="glass rounded-2xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search docs..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-input border border-border outline-none focus:border-primary text-sm" />
              </div>
              <nav className="mt-4 space-y-5">
                {grouped.map(([cat, items]) => (
                  <div key={cat}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">{cat}</div>
                    <ul className="space-y-1">
                      {items.map((d) => {
                        const active = loc.pathname === `/docs/${d.slug}`;
                        return (
                          <li key={d.id}>
                            <Link to="/docs/$slug" params={{ slug: d.slug }} className={`block px-2 py-1.5 rounded-md text-sm ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
                              {d.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {docs.length === 0 && <div className="text-sm text-muted-foreground">No docs yet.</div>}
              </nav>
            </div>
          </aside>
          <article className="min-w-0">
            {isIndex ? (
              <div className="glass rounded-2xl p-8">
                <p className="text-sm uppercase tracking-widest text-primary">Documentation</p>
                <h1 className="mt-2 text-4xl font-bold">Welcome to the Nebryx Docs</h1>
                <p className="mt-3 text-muted-foreground">Pick a guide from the left, or start with the <Link to="/docs/$slug" params={{ slug: "quick-start" }} className="text-primary hover:underline">Quick Start</Link>.</p>
              </div>
            ) : <Outlet />}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}