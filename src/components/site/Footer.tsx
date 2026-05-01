import { Link } from "@tanstack/react-router";

const LOGO = "https://i.postimg.cc/RZNsLQxw/Nebryx-Cloud.png";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 px-4 py-12">
      <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img src={LOGO} alt="Nebryx.Cloud" className="h-7 w-7 rounded-md" />
            <span>Nebryx<span className="text-primary">.Cloud</span></span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            Built by Builders, For Builders. Powerful infrastructure at honest prices — no bloat, no upsells, no dark patterns.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/plans" className="hover:text-foreground">Plans</Link></li>
            <li><Link to="/docs" className="hover:text-foreground">Docs</Link></li>
            <li><Link to="/uptime" className="hover:text-foreground">Uptime</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Community</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="hover:text-foreground">Discord</a></li>
            <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} Nebryx.Cloud — All systems operational.</span>
        <span>Built by Builders, For Builders.</span>
      </div>
    </footer>
  );
}
