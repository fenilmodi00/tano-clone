"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Client island for the closing band's preview-card fan. The source marks the
 * deck `data-seen` once it arrives and `data-inview` while it is near the
 * viewport; its CSS hides the cards until `data-seen` is set. Keeping the
 * observers on the deck itself means every ClosingBand instance gets them,
 * not just the home media runtime.
 */
export function ClosingCardDeck({ children }: { children: ReactNode }) {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        deck.setAttribute("data-seen", "true");
        seen.disconnect();
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    const inview = new IntersectionObserver(
      ([entry]) => {
        deck.setAttribute("data-inview", entry?.isIntersecting ? "true" : "false");
      },
      { rootMargin: "200px 0px" },
    );

    seen.observe(deck);
    inview.observe(deck);

    return () => {
      seen.disconnect();
      inview.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className="hp-closing-cards" ref={deckRef}>
      {children}
    </div>
  );
}
