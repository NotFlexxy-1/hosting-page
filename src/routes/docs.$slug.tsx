import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/docs/$slug")({
  component: DocPage,
});

interface Doc { id: string; slug: string; title: string; category: string; body: string; updated_at: string; }

// Tiny markdown-ish renderer (headings, code, paragraphs, lists)
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { code.push(lines[i]); i++; }
      i++;
      out.push(<pre key={key++} className="my-4 rounded-xl bg-secondary/70 p-4 overflow-x-auto text-sm"><code data-lang={lang}>{code.join("\n")}</code></pre>);
      continue;
    }
    if (line.startsWith("# ")) { out.push(<h1 key={key++} className="text-3xl font-bold mt-6 mb-3">{line.slice(2)}</h1>); i++; continue; }
    if (line.startsWith("## ")) { out.push(<h2 key={key++} className="text-2xl font-semibold mt-6 mb-2">{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith("### ")) { out.push(<h3 key={key++} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>); i++; continue; }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].slice(2)); i++; }
      out.push(<ul key={key++} className="list-disc pl-6 space-y-1 my-3">{items.map((t, k) => <li key={k}>{t}</li>)}</ul>);
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    // paragraph: bold + inline code
    const html = line
      .replace(/`([^`]+)`/g, '<code class="bg-secondary/70 px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out.push(<p key={key++} className="my-3 leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: html }} />);
    i++;
  }
  return out;
}

function DocPage() {
  const { slug } = Route.useParams();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setDoc(null); setNotFound(false);
    supabase.from("docs").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      if (data) setDoc(data as Doc); else setNotFound(true);
    });
  }, [slug]);

  if (notFound) return (
    <div className="glass rounded-2xl p-8">
      <p className="text-sm text-muted-foreground">Doc not found.</p>
      <Link to="/docs" className="mt-3 inline-flex items-center gap-1 text-primary"><ArrowLeft className="h-4 w-4" /> Back to docs</Link>
    </div>
  );
  if (!doc) return <div className="glass rounded-2xl p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="glass rounded-2xl p-8 prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-widest text-primary">Docs › {doc.category}</div>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">{doc.title}</h1>
      <div className="text-xs text-muted-foreground mt-1">Last updated {new Date(doc.updated_at).toLocaleDateString()}</div>
      <div className="mt-6">{renderMarkdown(doc.body)}</div>
    </div>
  );
}