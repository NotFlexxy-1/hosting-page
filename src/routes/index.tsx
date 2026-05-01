import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, ShieldCheck, Server, Boxes, ArrowRight, Activity } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nebryx.Cloud — Hosting that scales with your community" },
      { name: "description", content: "Free VPS & Minecraft servers earned through invites or boosts. Premium hosting from $1/month." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Zap, title: "Instant deploy", desc: "Spin up a server in seconds via /create on Discord." },
  { icon: ShieldCheck, title: "DDoS protected", desc: "Network-level mitigation on every node." },
  { icon: Server, title: "Modern hardware", desc: "NVMe storage and Ryzen processors." },
  { icon: Boxes, title: "Flexible plans", desc: "Free, booster perks, or paid — your choice." },
];

const STATS = [
  { v: "99.9%", l: "Uptime SLA" },
  { v: "1,200", l: "Active Servers" },
  { v: "6", l: "Global Nodes" },
  { v: "43s", l: "Avg Deploy" },
  { v: "3 min", l: "Support Response" },
];

const TIMELINE = [
  { y: "2023", t: "The Idea", d: "Frustrated by expensive and slow VPS providers, our founders started building their own infrastructure stack in a small apartment in Chennai." },
  { y: "Early 2024", t: "First Node Goes Live", d: "Singapore Node 1 came online with 10 beta customers. 100% uptime in the first month." },
  { y: "Mid 2024", t: "Minecraft Hosting Added", d: "Our Minecraft offering launched after 3 months of testing custom JVM configs." },
  { y: "2025", t: "Global Expansion", d: "Frankfurt, Tokyo, New York, São Paulo, and Johannesburg nodes came online. 1,000+ active servers." },
  { y: "2026", t: "nebryx.cloud Launches", d: "New brand, new website, same obsession with uptime and performance." },
];

function Index() {
  useScrollReveal();
  const [planCount, setPlanCount] = useState<number | null>(null);
  useEffect(() => { supabase.from("plans").select("id", { count: "exact", head: true }).then(({ count }) => setPlanCount(count ?? 6)); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="px-4 pt-16 pb-24 text-center">
          <div className="mx-auto max-w-5xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              All systems operational
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Hosting that scales <br />
              <span className="text-gradient">with your community.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Free VPS & Minecraft servers earned through invites or boosts. Premium hosting from <span className="font-semibold text-foreground">$1/month</span>.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/plans" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                View all plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/uptime" className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 font-semibold">
                <Activity className="h-4 w-4" /> Status page
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-4 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="scroll-reveal glass rounded-2xl p-6 text-left hover:border-primary/50 transition-colors" style={{ transitionDelay: `${i * 60}ms` }}>
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl text-center scroll-reveal">
            <p className="text-sm uppercase tracking-widest text-primary">Our Mission</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold">Democratize Infrastructure.</h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl mx-auto">
              We believe powerful hosting shouldn't be a luxury for well-funded teams. Every indie developer, every student, every small studio deserves access to fast, reliable, and affordable infrastructure.
            </p>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
              Nebryx Cloud was built from the ground up with a single obsession: giving you the best possible performance at the lowest possible honest price — without the bloat, the upsells, or the dark patterns.
            </p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link to="/plans" className="rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Get Started</Link>
              <a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="rounded-xl glass px-6 py-3 font-semibold">Talk to Us</a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-5 gap-6 scroll-reveal">
            {STATS.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12 scroll-reveal">
              <p className="text-sm uppercase tracking-widest text-primary">Our Story</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold">From apartment to global network.</h2>
            </div>
            <div className="relative pl-8 border-l border-border/60">
              {TIMELINE.map((item, i) => (
                <div key={i} className="scroll-reveal mb-10 relative" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="absolute -left-[42px] top-1 h-4 w-4 rounded-full bg-gradient-primary shadow-glow" />
                  <div className="text-sm font-mono text-primary">{item.y}</div>
                  <h3 className="mt-1 text-xl font-semibold">{item.t}</h3>
                  <p className="mt-2 text-muted-foreground">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl glass rounded-3xl p-10 md:p-14 text-center scroll-reveal shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to deploy?</h2>
            <p className="mt-3 text-muted-foreground">Browse {planCount ?? 6} plans across VPS, Minecraft, and Web hosting.</p>
            <Link to="/plans" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
              Choose your plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
