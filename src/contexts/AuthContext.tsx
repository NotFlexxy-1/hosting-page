import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  refreshRole: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkRole = async (uid: string | undefined) => {
    if (!uid) { setIsAdmin(false); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setIsAdmin(!!data?.some((r) => r.role === "admin"));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setTimeout(() => checkRole(sess?.user?.id), 0);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      checkRole(sess?.user?.id).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{
      user, session, loading, isAdmin,
      refreshRole: () => checkRole(user?.id),
      signOut: async () => { await supabase.auth.signOut(); },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}
