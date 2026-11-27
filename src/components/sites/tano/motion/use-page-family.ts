"use client";

import { useEffect } from "react";

import { mountPageFamilies } from "../pages/behaviours";

/** Owner: PageFamilies. Mounts non-home page behaviour and returns its cleanup. */
export function usePageFamily(): void {
  useEffect(() => mountPageFamilies(), []);

  useEffect(() => {
    if (location.pathname !== "/talk-to-us") return;
    const image = document.querySelector<HTMLImageElement>(".wire-contact-art img");
    if (!image) return;
    const media = window.matchMedia("(max-width: 767px)");
    const desktop = image.getAttribute("src") || "/sites/tano/images/talk-to-us-glass.jpg";
    const sync = () => {
      image.src = media.matches ? "/sites/tano/images/talk-to-us-sm-glass.jpg" : desktop;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
}
