"use client";

import { useEffect } from "react";

/** Chart keyframes in source.css that take part in the rewind/replay. */
const REWIND_NAMES: Record<string, true> = {
  "hp-stat-draw": true,
  "hp-stat-fade": true,
  "hp-stat-run": true,
  "hp-stat-grow": true,
  "hp-stat-pop": true,
  "hp-stat-pop-faint": true,
};

/** The `creatorMap` graphic skips the reversible easing and the hold. */
const CREATOR_GRAPHIC = "creatorMap";
const REWIND_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const HOLD_MS = 180;

/**
 * Source StatCard replay: hovering or focusing `main .hp-stat` cards rewinds
 * their chart animations at 0.9×, holds 180ms, then replays them at 0.7×
 * (the `creatorMap` graphic rewinds at 2× and replays at 1.35×, no hold).
 */
export function useStatReplay() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const holds = new Set<() => void>();
    let disposed = false;

    const replay = (card: HTMLElement) => {
      // Source re-reads the pointer capability per trigger: touch devices get no replay at all.
      if (window.matchMedia("(hover: none)").matches) return;

      const creatorMap =
        card.querySelector<SVGElement>(".hp-stat-graphic")?.getAttribute("data-graphic") ===
        CREATOR_GRAPHIC;

      for (const animation of card.getAnimations({ subtree: true })) {
        const animationName = (animation as CSSAnimation).animationName;
        if (typeof animationName !== "string" || !Object.hasOwn(REWIND_NAMES, animationName)) {
          continue;
        }
        // Already rewinding: a second trigger would restart the rewind.
        if (animation.playbackRate < 0) continue;

        // CSS animations only take the symmetric easing for the reverse pass.
        if (!creatorMap && animation.playState === "finished") {
          animation.effect?.updateTiming({ easing: REWIND_EASING });
        }

        animation.playbackRate = creatorMap ? -2 : -0.9;
        animation.play();

        animation.finished
          .then(() => {
            if (creatorMap) return;
            const { promise, resolve } = Promise.withResolvers<void>();
            let timer = 0;
            const cancel = () => {
              window.clearTimeout(timer);
              holds.delete(cancel);
              resolve();
            };
            timer = window.setTimeout(cancel, HOLD_MS);
            holds.add(cancel);
            return promise;
          })
          .then(() => {
            if (disposed || animation.playbackRate >= 0) return;
            animation.playbackRate = creatorMap ? 1.35 : 0.7;
            animation.play();
          })
          .catch((error: unknown) => {
            // Interrupted animations (route change, retrigger) reject with AbortError.
            if (error instanceof DOMException && error.name === "AbortError") return;
            console.error("[useGraphicReplay] unexpected animation rejection", error);
          });
      }
    };

    const cards = Array.from(document.querySelectorAll<HTMLElement>("main .hp-stat"));
    const cleanups: Array<() => void> = [];
    for (const card of cards) {
      const onPointerEnter = () => replay(card);
      const onFocusIn = () => replay(card);
      card.addEventListener("pointerenter", onPointerEnter);
      card.addEventListener("focusin", onFocusIn);
      cleanups.push(() => {
        card.removeEventListener("pointerenter", onPointerEnter);
        card.removeEventListener("focusin", onFocusIn);
      });
    }

    return () => {
      disposed = true;
      for (const cleanup of cleanups) cleanup();
      for (const cancel of holds) cancel();
      holds.clear();
    };
  }, []);
}
