
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Team';
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS emoji TEXT;

DELETE FROM public.staff;

INSERT INTO public.staff (category, name, role, bio, discord, emoji, sort_order) VALUES
('Founders & Infrastructure Lead', 'Rejuan Rahmin Rafi (NotFlexxy)', 'Founder', 'Built the first node from scratch. Obsessed with latency and uptime.', 'notflexxy', '🧑‍💻', 1),
('Founders & Infrastructure Lead', 'Pranav (Startup_Gaming)', 'Owner', 'Co-leads infrastructure and product direction.', 'startup_gaming', '👑', 2),
('Founders & Infrastructure Lead', 'VoidFlamer', 'Co-Owner', 'Co-leads operations and growth.', 'voidflamer', '🔥', 3),
('Founders & Infrastructure Lead', 'KingXD', 'Co-Owner', 'Co-leads community and partnerships.', 'kingxd', '👑', 4),
('Founders & Infrastructure Lead', 'Shubham', 'Co-Owner', 'Co-leads engineering.', 'shubham', '⚙️', 5),

('Customer Success', 'Vayd', 'Customer Success', 'Real human who actually reads your tickets.', 'vayd', '👩‍🔧', 10),
('Customer Success', 'Naksh', 'Customer Success', 'Average response time under 3 minutes.', 'naksh', '🎧', 11),
('Customer Success', 'Aunu', 'Customer Success', 'No copy-paste replies.', 'aunu', '💬', 12),
('Customer Success', 'SAM', 'Customer Success', '24/7 support coverage.', 'sam', '🛠️', 13),
('Customer Success', 'NafiGamer', 'Customer Success', 'Helps with game server setup.', 'nafigamer', '🎮', 14),

('Network & Security', 'Vayd', 'Network & Security', 'Keeps the DDoS shields up.', 'vayd', '🛡️', 20),
('Network & Security', 'Naksh', 'Network & Security', '24/7 on-call.', 'naksh', '🛡️', 21),
('Network & Security', 'Aunu', 'Network & Security', 'Network routes.', 'aunu', '🛡️', 22),
('Network & Security', 'SAM', 'Network & Security', 'Infrastructure.', 'sam', '🛡️', 23),
('Network & Security', 'NafiGamer', 'Network & Security', 'Hardening and audits.', 'nafigamer', '🛡️', 24);
