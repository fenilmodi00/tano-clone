"use client";

import { useEffect } from "react";

/**
 * Route-scoped DOM observers shared by every page:
 * - `data-shown="false"` markup becomes visible once its reveal root (nearest
 *   horizontal scroller, else the node itself) enters the viewport;
 * - direct main bands get `data-inview` so their keyframes pause offscreen;
 * - muted looping videos start when the route mounts and stop on cleanup.
 *
 * Extracted from SiteRuntime so the composition file only names behaviours.
 */
export function usePageObservers() {
  useEffect(() => {
    // Scroll reveals: source markup ships data-shown="false" and CSS reveals on true.
    // Source Reveal treats the nearest horizontal scroller (the mobile stat row)
    // as its root, so cards offscreen sideways reveal with their row.
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-shown="false"], .hp-reveal[data-shown="false"]',
      ),
    );
    const main = document.querySelector("main");
    const revealGroups = new Map<HTMLElement, HTMLElement[]>();
    for (const el of revealTargets) {
      let root = el;
      for (
        let parent = el.parentElement;
        parent && parent !== main && parent !== document.body;
        parent = parent.parentElement
      ) {
        const overflowX = getComputedStyle(parent).overflowX;
        if (overflowX === "auto" || overflowX === "scroll") {
          root = parent;
          break;
        }
      }
      const group = revealGroups.get(root);
      if (group) group.push(el);
      else revealGroups.set(root, [el]);
    }

    const revealObservers: IntersectionObserver[] = [];
    const revealFrames: number[] = [];
    const showGroup = (root: HTMLElement) => {
      for (const el of revealGroups.get(root) ?? []) el.setAttribute("data-shown", "true");
    };
    for (const root of revealGroups.keys()) {
      const rect = root.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealFrames.push(requestAnimationFrame(() => showGroup(root)));
        continue;
      }
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            showGroup(root);
            reveal.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0 },
      );
      reveal.observe(root);
      revealObservers.push(reveal);
    }

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
      for (const observer of revealObservers) observer.disconnect();
      for (const frame of revealFrames) cancelAnimationFrame(frame);
      visit.disconnect();
      for (const video of videos) video.pause();
    };
  }, []);
}
