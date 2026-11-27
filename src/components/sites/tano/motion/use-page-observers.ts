"use client";

import { useEffect } from "react";

/**
 * Route-scoped DOM observers shared by every page:
 * - `data-shown="false"` markup becomes visible once it enters the viewport;
 * - direct main bands get `data-inview` so their keyframes pause offscreen;
 * - muted looping videos start when the route mounts and stop on cleanup.
 *
 * Extracted from SiteRuntime so the composition file only names behaviours.
 */
export function usePageObservers() {
  useEffect(() => {
    // Scroll reveals: source markup ships data-shown="false" and CSS reveals on true.
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-shown="false"], .hp-reveal[data-shown="false"]',
      ),
    );
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).setAttribute("data-shown", "true");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
    for (const el of revealTargets) reveal.observe(el);

    // Mark bands inview so their keyframes run only while visible.
    const bands = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > div"));
    const visit = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).setAttribute(
            "data-inview",
            entry.isIntersecting ? "true" : "false",
          );
        }
      },
      { rootMargin: "15% 0px 15% 0px", threshold: 0 },
    );
    for (const band of bands) visit.observe(band);

    // Autoplay the source's muted, looping media where the browser allows it.
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("main video"));
    for (const video of videos) {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }

    return () => {
      reveal.disconnect();
      visit.disconnect();
      for (const video of videos) video.pause();
    };
  }, []);
}
