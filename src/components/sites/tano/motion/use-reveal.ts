"use client";

import { useEffect } from "react";

/**
 * Source RevealMotion: split display headings into words, then reveal blocks
 * and `.rv-in` headings in document order with a 70ms stagger (capped at 7).
 * CSS lives in src/styles/tano/reveal.css.
 */
export function useReveal() {
  useEffect(() => {
    // Ported from the source RevealMotion: split headings
    // into word spans, then add .rv-in in document order with a 70ms stagger.
    const revealSelector = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "li",
      "blockquote",
      "figure",
      "img",
      "picture",
      "video",
      "table",
      "hr",
      "details",
      "form",
      "label",
      ".hp-asset",
      ".wire-media",
      ".hp-band-actions",
      ".hp-action",
      ".wire-button",
      ".tano-button",
      ".wire-case-mark",
      ".wire-case-stat",
      ".wire-case-card",
      ".wire-cg-item",
      ".wire-cg",
      ".gd-stage",
      ".gd-frame",
      ".gd-card",
      ".gd-verdict",
      ".gd-code",
      ".gd-spec",
      ".gd-band-actions",
      ".gd-index-link",
      ".gd-pager-link",
    ].join(",");
    const excluded = [
      "[data-rv-skip]",
      ".car",
      ".hp-ticker",
      ".hp-stage",
      ".hp-behind",
      ".hp-logo-band",
      ".hp-testimonials",
      ".hp-comparison-scroll",
      ".hp-tabbar",
      ".wire-cases-marks-strip",
      ".wire-table-scroll",
      ".wire-drawer",
      ".wire-rail",
      ".wire-footer-card",
      ".wire-visually-hidden",
      ".wire-footer-photo",
      ".hp-hairline",
      ".hp-faq-art",
      ".hp-creator-asset",
      ".hp-objective-ground",
    ].join(",");

    const splitHeading = (el: HTMLElement, force = false) => {
      if (el.hasAttribute("data-rv-split")) return;
      if (!force && el.closest("[data-rv-skip]")) return;
      let word = 0;
      const walk = (node: Node) => {
        for (const child of Array.from(node.childNodes)) {
          if (child.nodeType === Node.TEXT_NODE && (child.textContent || "").trim()) {
            const fragment = document.createDocumentFragment();
            for (const token of (child.textContent || "").split(/(\s+)/)) {
              if (!token) continue;
              if (/^\s+$/.test(token)) {
                fragment.appendChild(document.createTextNode(token));
              } else {
                const span = document.createElement("span");
                span.className = "rv-word";
                span.textContent = token;
                span.style.setProperty("--rv-word", String(word++));
                fragment.appendChild(span);
              }
            }
            child.parentNode?.replaceChild(fragment, child);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            if (element.tagName === "BR" || element.classList.contains("rv-mark")) continue;
            walk(child);
          }
        }
      };
      walk(el);
      el.setAttribute("data-rv-split", "");
    };

    const headlineSelector = [
      "main h1",
      "main h2.hp-title",
      "main h2.hp-closing-title",
      "main h1.wire-study-title",
      "main h2.wire-study-title",
      "main .tano-display-lg",
      "main .tano-display-md",
      "main .tano-display-xs",
      "main .tano-display-sm",
    ].join(",");
    for (const heading of Array.from(document.querySelectorAll<HTMLElement>(headlineSelector))) {
      if (heading.closest("[data-rv-skip]") || heading.classList.contains("wire-case-title"))
        continue;
      splitHeading(heading);
    }
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-rv-onload]")))
      el.classList.add("rv-in");

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(`main :is(${revealSelector})`),
    ).filter(
      (el) =>
        !el.closest(`:is(${excluded})`) &&
        !el.parentElement?.closest("[data-rv-split]") &&
        !el.closest("[data-rv-onload]") &&
        !el.classList.contains("rv-word"),
    );

    const revealShown = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          );
        batch.forEach((el, i) => {
          el.style.setProperty("--rv-delay", `${70 * Math.min(i, 7)}ms`);
          el.classList.add("rv-in");
          revealShown.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );
    for (const el of candidates) revealShown.observe(el);
    requestAnimationFrame(() => {
      const above = candidates.filter((el) => el.getBoundingClientRect().top < innerHeight * 0.95);
      above.forEach((el, i) => {
        el.style.setProperty("--rv-delay", `${70 * Math.min(i, 7)}ms`);
        el.classList.add("rv-in");
        revealShown.unobserve(el);
      });
    });

    return () => revealShown.disconnect();
  }, []);
}
