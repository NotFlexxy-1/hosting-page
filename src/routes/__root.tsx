import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CustomCursor } from "@/components/site/CustomCursor";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nebryx.Cloud — CHEAP & RELIABLE" },
      { name: "description", content: "Free VPS & Minecraft servers, premium hosting from $1/month. Built by Builders, For Builders." },
      { property: "og:title", content: "Nebryx.Cloud — CHEAP & RELIABLE" },
      { property: "og:description", content: "Free VPS & Minecraft servers, premium hosting from $1/month. Built by Builders, For Builders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nebryx.Cloud — CHEAP & RELIABLE" },
      { name: "twitter:description", content: "Free VPS & Minecraft servers, premium hosting from $1/month. Built by Builders, For Builders." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/949b11bb-5ea3-42e7-abab-1e257fff39f4/id-preview-dce57bd1--eaed5fdd-ddf1-4c0f-966f-b96a5b442b37.lovable.app-1777617959145.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/949b11bb-5ea3-42e7-abab-1e257fff39f4/id-preview-dce57bd1--eaed5fdd-ddf1-4c0f-966f-b96a5b442b37.lovable.app-1777617959145.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <AnimatedBackground />
        <CustomCursor />
        <Outlet />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
