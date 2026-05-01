import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  plan_id: string;
  name: string;
  price_cents: number;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (plan_id: string) => void;
  setQty: (plan_id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | undefined>(undefined);
const KEY = "nebryx_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (item) => setItems((prev) => {
    const ex = prev.find((p) => p.plan_id === item.plan_id);
    if (ex) return prev.map((p) => p.plan_id === item.plan_id ? { ...p, quantity: p.quantity + 1 } : p);
    return [...prev, { ...item, quantity: 1 }];
  });
  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.plan_id !== id));
  const setQty: CartCtx["setQty"] = (id, q) => setItems((p) => p.map((i) => i.plan_id === id ? { ...i, quantity: Math.max(1, q) } : i));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price_cents * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
}
