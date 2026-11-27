"use client";

import { useEffect } from "react";
import { useGroundTone } from "@/hooks/use-ground-tone";
import { useLenisScroll } from "@/hooks/use-lenis";
import { useRouteScrollReset } from "@/hooks/use-route-scroll";
import { useScrollMemory } from "@/hooks/use-scroll-memory";

/**
 * Document-lifetime runtime. Lenis, ground tone, route scroll reset and scroll
 * memory stay mounted while the App Router swaps pages, so the smooth-scroll
 * instance, the ground veil and its `__tanoGround` API are created once.
 * Page-scoped effects mount with each page through `PageEffects`.
 */
export function SiteRuntime() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-nav-ready", "");
    html.setAttribute("data-ground-ready", "");
  }, []);

  return <GlobalRuntime />;
}

/** Singletons that survive navigation. */
function GlobalRuntime() {
  useLenisScroll();
  useGroundTone();
  useRouteScrollReset();
  useScrollMemory();
  return null;
}
