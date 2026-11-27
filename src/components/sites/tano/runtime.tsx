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
  usePageObservers,
  useHashScroll,
  useRouteScrollReset,
  useScrollMemory,
} from "./motion";

/**
 * Site runtime. Two lifetimes:
 *
 * - Global behaviours (Lenis, ground tone, route scroll reset) live in
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
  usePageFamily();
  useCaseMedia();
  useCounters();
  useReveal();
  usePageObservers();
  useHashScroll();

  // Run after hydration so form enhancement never mutates SSR markup. The
  // boot script owns scroll restoration and releases the loading mask.
  useEffect(() => {
    const cleanup = mountFormsRuntime();
    return () => cleanup?.();
  }, []);

  usePageObservers();

  return null;
}
