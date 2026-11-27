import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Source SmoothScroll (`0ef8lriq_goox.js`): ReactLenis with the site's
 * options, disabled for coarse pointers and reduced motion. The shipped site
 * also leaves the contact sheet alone — it has its own viewport-height
 * layout, so the document must not be scroll-hijacked there.
 */

const DISABLE_QUERY = "(pointer: coarse), (prefers-reduced-motion: reduce)";
const CONTACT_ROUTE = "/talk-to-us";

// A single MediaQueryList keeps the external-store snapshot stable between
// renders (useSyncExternalStore compares snapshots by identity).
let disableQuery: MediaQueryList | null = null;

function mediaQuery(): MediaQueryList {
  if (!disableQuery) disableQuery = window.matchMedia(DISABLE_QUERY);
  return disableQuery;
}

function subscribe(onChange: () => void): () => void {
  const query = mediaQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useLenisScroll(): (() => void) | void {
  const pathname = usePathname();
  const disabled = useSyncExternalStore(
    subscribe,
    () => mediaQuery().matches,
    () => true, // SSR: assume the safe, native-scroll path until measured.
  );
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const onContactSheet = path === CONTACT_ROUTE || path.startsWith(`${CONTACT_ROUTE}/`);

  useEffect(() => {
    if (disabled || onContactSheet) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.14,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      // The drawer and mobile menu lock the body while open.
      prevent: () => document.body.style.overflow === "hidden",
    });

    const root = document.documentElement;
    root.classList.add("lenis");

    return () => {
      lenis.destroy();
      for (const name of [
        "lenis",
        "lenis-smooth",
        "lenis-scrolling",
        "lenis-stopped",
        "lenis-locked",
        "lenis-autoToggle",
      ]) {
        root.classList.remove(name);
      }
    };
  }, [disabled, onContactSheet]);
}
