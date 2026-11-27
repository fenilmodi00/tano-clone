"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  useHeroCampaign,
  useGroundTone,
  useLenisScroll,
  useConversations,
  useExperiments,
  useHomeMedia,
  useHomeInfo,
  usePageFamily,
  useCaseMedia,
  useForms,
  useCounters,
  useReveal,
  useClientNav,
} from "./motion";

/**
 * Site runtime. Two lifetimes:
 *
 * - Global behaviours (Lenis, ground tone, client-side link routing, the
 *   readiness flags) live in `SiteRuntime` and stay mounted while the App
 *   Router swaps pages, so the smooth-scroll instance, the ground veil and
 *   its `__tanoGround` API are created once.
 * - Page behaviours (reels, tabs, reveals, media autoplay, observers) live in
 *   `PageRuntime`, keyed by pathname. Remounting after the router commits the
 *   new route re-runs each hook against the new DOM — most importantly
 *   `useReveal`, which adds `.rv-in`; without it the reveal CSS leaves every
 *   new page at opacity 0.
 */
export function SiteRuntime() {
  const pathname = usePathname();

  // Global: never remounted by navigation.
  useLenisScroll();
  useGroundTone();
  useClientNav();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-nav-ready", "");
    html.setAttribute("data-ground-ready", "");
  }, []);

  return <PageRuntime key={pathname} />;
}

/** Page-scoped: one instance per committed route. */
function PageRuntime() {
  useHeroCampaign();
  useConversations();
  useExperiments();
  useHomeMedia();
  useHomeInfo();
  usePageFamily();
  useCaseMedia();
  useForms();
  useCounters();
  useReveal();

  useEffect(() => {
    // Scroll reveals: source markup ships data-shown="false" and CSS reveals on true.
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-shown="false"], .hp-reveal[data-shown="false"]'),
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
          (entry.target as HTMLElement).setAttribute("data-inview", entry.isIntersecting ? "true" : "false");
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

  return null;
}
