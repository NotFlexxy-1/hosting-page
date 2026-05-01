
-- Settings table (admin-controlled key/value)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON public.app_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Extra columns on servers
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS panel_type TEXT;
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS panel_id TEXT;
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS billing_cycle_months INT NOT NULL DEFAULT 1;

-- Payments table (manual confirmations)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_cents INT NOT NULL DEFAULT 0,
  note TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Docs table
CREATE TABLE IF NOT EXISTS public.docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Getting Started',
  body TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docs public read" ON public.docs FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage docs" ON public.docs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
