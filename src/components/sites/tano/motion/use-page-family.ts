"use client";

import { useEffect } from "react";

import { mountPageFamilies } from "../pages/behaviours";

/** Owner: PageFamilies. Mounts non-home page behaviour and returns its cleanup. */
export function usePageFamily(): void {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let raf = 0;
    let tries = 0;
    // The App Router can stream the page shell before the replica markup is in
    // the DOM. Retry until the first page-family root exists, then bind once.
    const start = () => {
      const ready = document.querySelector(".hp-pp, .hp-adloop, .hp-faq, .hp-rail, .hp-ccar");
      if (ready) {
        cleanup = mountPageFamilies();
        return;
      }
      if (tries++ < 180) raf = requestAnimationFrame(start);
    };
    start();
    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/talk-to-us") return;
    const image = document.querySelector<HTMLImageElement>(".wire-contact-art img");
    if (!image) return;
    const media = window.matchMedia("(max-width: 767px)");
    const desktop = image.getAttribute("src") || "/sites/tano/images/talk-to-us-glass.jpg";
    const sync = () => {
      image.src = media.matches ? "/sites/tano/images/talk-to-us-sm-glass.jpg" : desktop;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
}
