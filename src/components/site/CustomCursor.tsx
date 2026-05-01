import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('a, button, [role="button"], input, textarea, select')) {
        ringRef.current?.classList.add("is-hover");
      } else {
        ringRef.current?.classList.remove("is-hover");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
