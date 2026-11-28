"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import { usePageObservers } from "@/hooks/use-page-observers";
import { useReveal } from "@/hooks/use-reveal";
import { useStatReplay } from "@/hooks/use-stat-replay";
import { useTrackCarousel } from "@/hooks/use-track-carousel";
import { mountFormsRuntime } from "./forms-runtime";
import { usePageBehaviours } from "./use-page-behaviours";

/**
 * Page-scoped effects mounted from inside each page subtree so they run after
 * that subtree hydrates — never against server markup React still owns.
 */
export function PageEffects() {
  const pathname = usePathname();

  return <PageEffectsForRoute key={pathname} />;
}

/** One instance per committed route; client navigation remounts it. */
function PageEffectsForRoute() {
  usePageBehaviours();
  useReveal();
  useStatReplay();
  useTrackCarousel();
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
