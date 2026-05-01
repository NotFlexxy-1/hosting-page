import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const observed = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(".scroll-reveal").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };
    observeAll();

    // Re-scan when new nodes (e.g. async-loaded cards) are added.
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // Failsafe: after 1.5s, force-reveal anything still hidden so async-loaded
    // content never gets stuck at opacity:0 if the IntersectionObserver missed it.
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.is-visible)")
        .forEach((el) => el.classList.add("is-visible"));
    }, 1500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);
}
