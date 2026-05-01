import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Server, Settings, ShieldAlert, LogOut, Activity, Home, Key, Plug } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, loading, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const items = [
    { to: "/dashboard", icon: Home, label: "Overview" },
    { to: "/dashboard/servers", icon: Server, label: "Servers" },
    { to: "/dashboard/uptime", icon: Activity, label: "Uptime" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];
  const adminItems = [
    { to: "/admin/users", icon: ShieldAlert, label: "Manage Users" },
    { to: "/admin/plans", icon: Server, label: "Manage Plans" },
    { to: "/admin/uptime", icon: Activity, label: "Uptime Utilities" },
    { to: "/admin/pterodactyl", icon: Key, label: "Setup Ptero API" },
    { to: "/admin/extra-apis", icon: Plug, label: "Setup Extra APIs" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-sidebar p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg px-2 py-2">
          <img src="https://i.postimg.cc/RZNsLQxw/Nebryx-Cloud.png" alt="Nebryx.Cloud" className="h-7 w-7 rounded-md" />
          <span>Nebryx<span className="text-primary">.Cloud</span></span>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((i) => {
            const active = loc.pathname === i.to;
            return (
              <Link key={i.to} to={i.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                <i.icon className="h-4 w-4" /> {i.label}
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <div className="mt-6 px-3 text-[10px] uppercase tracking-widest text-primary">Admins Only</div>
              {adminItems.map((i) => {
                const active = loc.pathname === i.to;
                return (
                  <Link key={i.to} to={i.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                    <i.icon className="h-4 w-4" /> {i.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
        <div className="mt-auto">
          <div className="text-xs text-muted-foreground px-3 mb-2 truncate">{user.email}</div>
          <button onClick={() => signOut().then(() => nav({ to: "/" }))} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
