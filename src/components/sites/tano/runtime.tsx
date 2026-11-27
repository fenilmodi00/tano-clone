"use client";

import { useEffect, useState } from "react";
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
  mountFormsRuntime,
  useCounters,
  useReveal,
  useHashScroll,
  useClientNav,
  useScrollMemory,
} from "./motion";

/**
 * Site runtime. Two lifetimes:
 *
 * - Global behaviours (Lenis, ground tone, client-side link routing) live in
 *   `GlobalRuntime` and stay mounted while the App Router swaps pages, so the
 *   smooth-scroll instance, the ground veil and its `__tanoGround` API are
 *   created once. `useForms` is document-scoped for the same reason.
 * - Page behaviours (reels, tabs, reveals, media autoplay, observers) live in
 *   `PageRuntime`, keyed by pathname. Remounting after the router commits the
 *   new route re-runs each hook against the new DOM — most importantly
 *   `useReveal`, which adds `.rv-in`; without it the reveal CSS leaves every
 *   new page at opacity 0.
 */
export function SiteRuntime() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-nav-ready", "");
    html.setAttribute("data-ground-ready", "");
  }, []);

  return (
    <>
      <GlobalRuntime />
      <RouteRuntime />
    </>
  );
}

/**
 * Singletons that survive navigation. Split from `SiteRuntime` so a pathname
 * update re-renders only this subtree and the route subtree below, never the
 * document-lifetime mounts above.
 */
function GlobalRuntime() {
  useLenisScroll();
  useGroundTone();
  useClientNav();
  useScrollMemory();
  return null;
}

/** Subscribes to the route and remounts the page hooks after each commit. */
function RouteRuntime() {
  const pathname = usePathname();
  return <PageRuntime key={pathname} />;
}

/** Page-scoped: one instance per committed route. */
function PageRuntime() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    const start = () => {
      // Next streams route markup after the shell; if page effects mutate it
      // before hydration finishes React regenerates the tree and silently
      // discards every listener. Wait one beat past load so hydration wins.
      window.setTimeout(() => {
        frame = requestAnimationFrame(() => setReady(true));
      }, 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", start);
    };
  }, []);

  if (!ready) return null;
  return <PageHooks />;
}

/** Effects only mount after hydration, so they never mutate markup React is hydrating. */
function PageHooks() {
  useHeroCampaign();
  useConversations();
  useExperiments();
  useHomeMedia();
  useHomeInfo();
  usePageFamily();
  useCaseMedia();
  useCounters();
  useReveal();
  useHashScroll();

  // Run after hydration, restore a full-reload scroll offset before the
  // loading mask is removed, then bind forms against the settled markup.
  useEffect(() => {
    const target = Number(window.__tanoRestoreY || 0);
    let frame = 0;
    let tries = 0;
    const restore = () => {
      const ready = document.documentElement.scrollHeight >= target + window.innerHeight;
      if (target > 0 && !ready && tries++ < 120) {
        frame = requestAnimationFrame(restore);
        return;
      }
      if (target > 0) window.scrollTo(0, target);
      delete window.__tanoRestoreY;
      document.documentElement.setAttribute("data-page-ready", "");
    };
    frame = requestAnimationFrame(restore);
    const cleanup = mountFormsRuntime();
    return () => {
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, []);

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

  return null;
}
