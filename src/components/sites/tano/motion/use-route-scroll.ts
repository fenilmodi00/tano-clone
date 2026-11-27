"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll contract for a route change.
 *
 * Next's `<Link>` defaults to *maintaining* the scroll offset when the target
 * page is visible at that offset, so a deep-scrolled subpage can land in the
 * next page's footer. Every committed pathname starts at the top instead;
 * hash links are owned by `useHashScroll`.
 */

type ScrollMode = "auto" | "smooth";

/** Move the document to the top, through Lenis when it owns the scroll. */
export function scrollPageToTop(mode: ScrollMode = "auto"): void {
  const lenis = window.__tanoLenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: mode === "auto", force: true });
    if (mode === "auto") {
      // Lenis is display-synced; also reset the native scroller so the
      // browser's own scroll restoration cannot re-apply the old offset.
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: mode });
}

/**
 * Reset the scroll position on every client-side pathname change, after the
 * new route commits and before the browser paints it. Mount once, next to the
 * other document-lifetime behaviours.
 */
export function useRouteScrollReset(): void {
  const pathname = usePathname();
  const committed = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (committed.current === null) {
      committed.current = pathname;
      return;
    }
    if (committed.current === pathname) return;
    committed.current = pathname;
    if (window.location.hash) return;
    scrollPageToTop();
  }, [pathname]);
}
