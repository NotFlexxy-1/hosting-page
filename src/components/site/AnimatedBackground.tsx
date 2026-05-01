export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}
