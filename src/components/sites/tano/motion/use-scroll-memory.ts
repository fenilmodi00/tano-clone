"use client";

import { useEffect } from "react";

const KEY = "tano:scroll:";

/** Persist the last scroll offset so a full reload can restore it exactly. */
export function useScrollMemory(): void {
  useEffect(() => {
    let frame = 0;
    const save = () => {
      frame = 0;
      try {
        sessionStorage.setItem(`${KEY}${location.pathname}`, String(window.scrollY));
      } catch {
        // storage can be unavailable in private modes; native restoration remains.
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(save);
    };
    frame = requestAnimationFrame(save);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
    };
  }, []);
}
