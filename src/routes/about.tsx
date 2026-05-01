import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Eye, Users, Recycle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Nebryx.Cloud" }, { name: "description", content: "Built by Builders, For Builders. Meet the team behind Nebryx.Cloud." }] }),
  component: About,
});

const VALUES = [
  { icon: Zap, t: "Performance First", d: "Every infrastructure decision is made through the lens of performance. Slower is never acceptable. NVMe-only. Always." },
  { icon: Eye, t: "Radical Transparency", d: "Our pricing is what it is. Our uptime data is public. We don't hide behind marketing — we fix things and tell you what happened." },
  { icon: Users, t: "Community-Driven", d: "Our Discord community shapes our roadmap. Feature requests, bug reports, and honest feedback directly influence what we build next." },
  { icon: Recycle, t: "Long-Term Thinking", d: "We're not chasing a quick exit. We're building infrastructure our children could run. Doing things right, not just fast." },
];

const STACK = [
  { e: "🐧", t: "Linux KVM", s: "Virtualization" },
  { e: "💾", t: "NVMe SSD", s: "Storage" },
  { e: "🔥", t: "Pterodactyl", s: "Game Panel" },
  { e: "🌐", t: "Anycast DNS", s: "Network" },
  { e: "🛡️", t: "Cloud DDoS", s: "Protection" },
  { e: "⚙️", t: "Ryzen CPUs", s: "Compute" },
];

interface Staff { id: string; name: string; role: string; bio: string | null; avatar_url: string | null; discord: string | null; category: string | null; emoji: string | null; }

function About() {
  useScrollReveal();
  const [staff, setStaff] = useState<Staff[]>([]);
  useEffect(() => { supabase.from("staff").select("*").order("sort_order").then(({ data }) => setStaff((data as Staff[]) ?? [])); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pt-16 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center scroll-reveal">
            <p className="text-sm uppercase tracking-widest text-primary">About Us</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold">Built by Builders,<br /><span className="text-gradient">For Builders.</span></h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl mx-auto">
              We started Nebryx Cloud because we were frustrated by overpriced, underperforming hosting providers. We knew we could do better — so we did.
            </p>
          </div>

          <section className="mt-20">
            <div className="text-center scroll-reveal">
              <p className="text-sm uppercase tracking-widest text-primary">What We Stand For</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">Our Core Values</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {VALUES.map((v, i) => (
                <div key={v.t} className="scroll-reveal glass rounded-2xl p-6" style={{ transitionDelay: `${i * 60}ms` }}>
                  <v.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold">{v.t}</h3>
                  <p className="mt-2 text-muted-foreground">{v.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="text-center scroll-reveal">
              <p className="text-sm uppercase tracking-widest text-primary">Under the Hood</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">Our Tech Stack</h2>
              <p className="mt-3 text-muted-foreground">We use the best tools — not just the most popular ones.</p>
            </div>
            <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {STACK.map((s, i) => (
                <div key={s.t} className="scroll-reveal glass rounded-2xl p-5 text-center" style={{ transitionDelay: `${i * 40}ms` }}>
                  <div className="text-3xl">{s.e}</div>
                  <div className="mt-2 font-semibold text-sm">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.s}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="text-center scroll-reveal">
              <p className="text-sm uppercase tracking-widest text-primary">The Team</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">Who's Behind This</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">A small team with a big obsession. Engineers, gamers, and builders — just like you.</p>
            </div>
            {Array.from(new Set(staff.map((s) => s.category ?? "Team"))).map((cat) => {
              const members = staff.filter((s) => (s.category ?? "Team") === cat);
              return (
                <div key={cat} className="mt-12">
                  <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-primary scroll-reveal">{cat}</h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {members.map((s, i) => (
                      <div key={s.id} className="animate-fade-up glass rounded-2xl p-6 text-center" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary grid place-items-center text-3xl shadow-glow">
                          {s.emoji || s.name.charAt(0)}
                        </div>
                        <h4 className="mt-4 font-semibold">{s.name}</h4>
                        <div className="text-xs text-primary">{s.role}</div>
                        {s.bio && <p className="mt-2 text-xs text-muted-foreground">{s.bio}</p>}
                        {s.discord && <div className="mt-2 text-xs text-muted-foreground">@{s.discord}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
