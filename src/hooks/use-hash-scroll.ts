"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll to the URL fragment after the page and its reveal layer have hydrated. */
export function useHashScroll(): void {
  const pathname = usePathname();

  useEffect(() => {
    let timer = 0;
    let cancelled = false;
    let tries = 0;

    const scroll = () => {
      if (cancelled) return;
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) {
        if (tries++ < 120) timer = window.setTimeout(scroll, 50);
        return;
      }
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    };

    const onHashChange = () => {
      tries = 0;
      window.clearTimeout(timer);
      scroll();
    };

    scroll();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);
}
