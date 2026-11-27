"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGroundTone } from "@/hooks/use-ground-tone";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import { useLenisScroll } from "@/hooks/use-lenis";
import { usePageObservers } from "@/hooks/use-page-observers";
import { useReveal } from "@/hooks/use-reveal";
import { useRouteScrollReset } from "@/hooks/use-route-scroll";
import { useScrollMemory } from "@/hooks/use-scroll-memory";
import { useStatReplay } from "@/hooks/use-stat-replay";
import { useConversations } from "@/app/_home/hooks/use-conversations";
import { useCounters } from "@/app/_home/hooks/use-counters";
import { useExperiments } from "@/app/_home/hooks/use-experiments";
import { useHeroCampaign } from "@/app/_home/hooks/use-hero-campaign";
import { useHomeInfo } from "@/app/_home/hooks/use-home-info";
import { useHomeMedia } from "@/app/_home/hooks/use-home-media";
import { useCaseStudyMedia } from "@/components/sites/tano/motion/use-case-media";
import { mountFormsRuntime } from "./forms-runtime";
import { usePageBehaviours } from "./use-page-behaviours";

/**
 * Site runtime. Two lifetimes:
 *
 * - Global behaviours (Lenis, ground tone, route scroll reset) live in
 *   `GlobalRuntime` and stay mounted while the App Router swaps pages, so the
 *   smooth-scroll instance, the ground veil and its `__tanoGround` API are
 *   created once. Form enhancement is document-scoped for the same reason.
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
  useRouteScrollReset();
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
  usePageBehaviours();
  useCaseStudyMedia();
  useCounters();
  useReveal();
  useStatReplay();
  usePageObservers();
  useHashScroll();

  // Run after hydration so form enhancement never mutates SSR markup. The
  // boot script owns scroll restoration and releases the loading mask.
  useEffect(() => {
    const cleanup = mountFormsRuntime();
    return () => cleanup?.();
  }, []);

  return null;
}
