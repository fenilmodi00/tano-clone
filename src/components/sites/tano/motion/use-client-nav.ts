"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Preserve the source's client-side navigation: internal links push through
 * the App Router instead of reloading the document (keeps Lenis + overlays).
 */
export function useClientNav() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (href.startsWith("/talk-to-us")) return; // drawer owns this click
      if (href.startsWith("#")) return;
      const url = new URL(anchor.href, location.href);
      if (url.pathname === location.pathname && url.hash) return;
      event.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
}
