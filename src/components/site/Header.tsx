import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const LOGO = "https://i.postimg.cc/RZNsLQxw/Nebryx-Cloud.png";

const NAV = [
  { to: "/" as const, label: "Home" },
  { to: "/plans" as const, label: "Plans" },
  { to: "/docs" as const, label: "Docs" },
  { to: "/about" as const, label: "About" },
  { to: "/uptime" as const, label: "Uptime" },
];

export function Header() {
  const loc = useLocation();
  const { user } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-7xl glass rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img src={LOGO} alt="Nebryx.Cloud" className="h-7 w-7 rounded-md" />
          <span>Nebryx<span className="text-primary">.Cloud</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg">
            Discord
          </a>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">{count}</span>
            )}
          </Link>
          {user ? (
            <Link to="/dashboard" className="ml-1 inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="ml-1 inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Sign in
            </Link>
          )}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden mx-auto max-w-7xl mt-2 glass rounded-2xl p-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-secondary">{n.label}</Link>
          ))}
          <a href="https://discord.gg/hGGYKRFtCZ" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg text-sm hover:bg-secondary">Discord</a>
        </div>
      )}
    </header>
  );
}
