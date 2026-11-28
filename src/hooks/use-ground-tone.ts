import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { clamp, onScrollRaf, prefersReducedMotion } from "@/lib/motion";

/**
 * Source GroundShift (`0ef8lriq_goox.js:63198`).
 *
 * Dark bands are the visible `[data-ground-dark]` elements. The route's first
 * declared band owns the first paint; after that the tone is sampled at 45% of
 * the viewport while the visitor scrolls. The change is covered by the fixed
 * `.wire-ground-veil`: its opacity rises to .5, the ground variables snap to
 * the new tone behind it, and it fades out again. Without an animatable veil
 * the variables themselves tween instead.
 */

export type GroundTone = "dark" | "light";

interface Band {
  bottom: number;
  top: number;
}

interface TanoGroundApi {
  /** Tone currently committed to the page. */
  readonly tone: GroundTone;
  /** Pin a tone, animated like a band crossing. Clears on route change. */
  setGroundTone(tone: GroundTone): void;
  /** Drop the pin and return to the tone under the 45% line. */
  clearGroundTone(): void;
  /** Re-measure bands (after content or images change height). */
  refresh(): void;
}

declare global {
  interface Window {
    __tanoGround?: TanoGroundApi;
  }
}

const TONE_LINE = 0.45;
const GROUND_READY_ATTR = "data-ground-ready";
const GROUND_MOVING_ATTR = "data-ground-moving";
const GROUND_SWAP_ATTR = "data-ground-swap";
const GROUND_SWAP_MS = 320;
const NEAR_ATTR = "data-ground-near";
const NEAR_LIMIT = 300;

// `o`, `EASE_IN`, `EASE_OUT` in the source bundle.
const VEIL_IN_EASE = "cubic-bezier(0.11, 0, 0.5, 0)";
const VEIL_OUT_EASE = "cubic-bezier(0.5, 1, 0.89, 1)";

function readNumber(element: HTMLElement, property: string, fallback: number): number {
  const raw = window.getComputedStyle(element).getPropertyValue(property).trim();
  if (!raw) return fallback;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

/** Read a `<time>` custom property (`600ms` or `.6s`). */
function readTime(element: HTMLElement, property: string, fallback: number): number {
  const raw = window.getComputedStyle(element).getPropertyValue(property).trim();
  if (!raw) return fallback;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value : value * 1000;
}

function collectBands(): Band[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-ground-dark]"))
    .filter((element) => element.getClientRects().length > 0)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return {
        top,
        bottom:
          element.dataset.groundDark === "open" ? Number.POSITIVE_INFINITY : top + rect.height,
      };
    });
}

/**
 * The tone for the first paint. The route's first declared band wins, so a
 * short dark hero can never be overridden by the 45% line falling below it.
 * A route with no declared band (the full-screen contact sheet) keeps the
 * source's sampled tone.
 */
function resolveTopTone(): GroundTone {
  const main = document.querySelector<HTMLElement>("main");
  if (!main || !main.firstElementChild) return "dark";
  const first = main.querySelector<HTMLElement>("[data-ground], [data-ground-dark]");
  if (first) {
    if (first.hasAttribute("data-ground-dark") || first.dataset.ground === "dark") return "dark";
    if (first.dataset.ground === "light") return "light";
  }
  const line = TONE_LINE * window.innerHeight;
  return collectBands().some((band) => line >= band.top && line < band.bottom) ? "dark" : "light";
}

function isVisible(element: Element, width: number, height: number): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width && rect.width > 0
  );
}

function hasOwnText(element: Element): boolean {
  return Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
  );
}

export function useGroundTone(): (() => void) | void {
  const pathname = usePathname();

  // The route's first declared band owns the first paint. Layout effects run
  // before the browser paints the committed page, so a navigation from a light
  // band never flashes the new page light before the passive effect measures it.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const tone = resolveTopTone();
    const value = tone === "dark" ? 1 : 0;
    html.style.setProperty("--ground-t", value.toFixed(3));
    html.style.setProperty("--ink-t", value.toFixed(3));
    html.dataset.groundTone = tone;
    html.removeAttribute(GROUND_MOVING_ATTR);
    html.removeAttribute(GROUND_SWAP_ATTR);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let bands = collectBands();
    let inkValue = clamp(readNumber(html, "--ink-t", 1));
    let committed: GroundTone = inkValue >= 0.5 ? "dark" : "light";
    let resolvedDark: boolean | null = null;
    let override: GroundTone | null = null;
    let frame = 0;
    let readyFrame = 0;
    let swapTimer = 0;
    let veilAnimation: Animation | null = null;
    let nearElements: HTMLElement[] = [];
    let createdVeil = false;
    let userScrolled = false;

    const writeValues = (ground: number, ink: number) => {
      html.style.setProperty("--ground-t", ground.toFixed(3));
      html.style.setProperty("--ink-t", ink.toFixed(3));
    };

    const commitTone = (tone: GroundTone) => {
      committed = tone;
      if (html.dataset.groundTone !== tone) html.dataset.groundTone = tone;
    };

    const clearNear = () => {
      for (const element of nearElements) element.removeAttribute(NEAR_ATTR);
      nearElements = [];
    };

    const markNear = () => {
      clearNear();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const roots = document.querySelectorAll<HTMLElement>("main > *, .wire-nav, .wire-footer");

      for (const root of roots) {
        if (!isVisible(root, width, height)) continue;
        for (const element of root.querySelectorAll("*")) {
          if (nearElements.length >= NEAR_LIMIT) return;
          if (
            (element instanceof SVGElement || hasOwnText(element)) &&
            isVisible(element, width, height)
          ) {
            element.setAttribute(NEAR_ATTR, "");
            nearElements.push(element as HTMLElement);
          }
        }
      }
    };

    const startSwap = () => {
      markNear();
      html.setAttribute(GROUND_SWAP_ATTR, "");
      window.clearTimeout(swapTimer);
      swapTimer = window.setTimeout(() => {
        html.removeAttribute(GROUND_SWAP_ATTR);
        clearNear();
      }, GROUND_SWAP_MS);
    };

    // The veil lives inside `.wire-veiled` (as in the source DOM) so it
    // inherits the brand ground tokens and sits in that stacking context.
    let veil = document.querySelector<HTMLElement>(".wire-ground-veil");
    if (!veil) {
      veil = document.createElement("div");
      veil.className = "wire-ground-veil";
      veil.setAttribute("aria-hidden", "true");
      veil.style.opacity = "0";
      const host = document.querySelector<HTMLElement>(".wire-veiled") ?? document.body;
      host.appendChild(veil);
      createdVeil = true;
    }

    const stopVeil = () => {
      veilAnimation?.cancel();
      veilAnimation = null;
      veil?.style.setProperty("opacity", "0");
    };

    const stopFrame = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const snap = (tone: GroundTone) => {
      stopFrame();
      stopVeil();
      const target = tone === "dark" ? 1 : 0;
      inkValue = target;
      writeValues(target, target);
      commitTone(tone);
      html.removeAttribute(GROUND_MOVING_ATTR);
      html.removeAttribute(GROUND_SWAP_ATTR);
      window.clearTimeout(swapTimer);
      clearNear();
    };

    const finishMoving = () => {
      html.removeAttribute(GROUND_MOVING_ATTR);
    };

    const animateVeil = (
      from: number,
      to: number,
      easing: string,
      duration: number,
      done: () => void,
    ) => {
      if (!veil) {
        done();
        return;
      }
      const animation = veil.animate([{ opacity: from }, { opacity: to }], {
        duration: Math.max(1, Math.abs(to - from) * duration),
        easing,
        fill: "forwards",
      });
      veilAnimation = animation;
      animation.onfinish = () => {
        veil.style.opacity = String(to);
        animation.cancel();
        if (veilAnimation === animation) veilAnimation = null;
        done();
      };
    };

    const crossfade = (next: GroundTone) => {
      const duration = readTime(html, "--ground-ms", 600);
      const target = next === "dark" ? 1 : 0;
      stopFrame();

      const from = Number.parseFloat(window.getComputedStyle(veil as HTMLElement).opacity) || 0;
      veilAnimation?.cancel();
      veilAnimation = null;
      if (veil) veil.style.opacity = String(from);
      html.setAttribute(GROUND_MOVING_ATTR, "");

      // An interrupted swap that returns to the committed tone only has to
      // clear the veil; the ground behind it is already correct.
      if (next === committed) {
        animateVeil(from, 0, VEIL_OUT_EASE, duration, finishMoving);
        return;
      }

      if (veil) veil.dataset.tone = next;
      animateVeil(from, 0.5, VEIL_IN_EASE, duration, () => {
        if (!reducedQuery.matches) startSwap();
        inkValue = target;
        writeValues(target, target);
        commitTone(next);

        // The veil now shows the old ground while fading out over the new one,
        // keeping the composite continuous at the midpoint.
        if (veil) veil.dataset.tone = next === "dark" ? "light" : "dark";
        animateVeil(0.5, 0, VEIL_OUT_EASE, duration, finishMoving);
      });
    };

    const transitionTo = (next: GroundTone) => {
      if (prefersReducedMotion() || !veil || typeof veil.animate !== "function") {
        snap(next);
        return;
      }
      crossfade(next);
    };

    const resolveTone = (): GroundTone => {
      if (override) return override;
      if (window.scrollY <= 0) return resolveTopTone();
      const line = window.scrollY + TONE_LINE * window.innerHeight;
      return bands.some((band) => line >= band.top && line < band.bottom) ? "dark" : "light";
    };

    const evaluate = (force = false) => {
      // The route's first paint is owned by resolveTopTone until the visitor
      // actually scrolls; layout shifts below the fold must not flip it.
      if (!force && !userScrolled) return;
      const dark = resolveTone() === "dark";
      if (!force && dark === resolvedDark) return;
      resolvedDark = dark;
      transitionTo(dark ? "dark" : "light");
    };

    // First application is always a snap: the page must never fade in from
    // an arbitrary previous tone (or from the SSR default).
    bands = collectBands();
    const initial = resolveTopTone();
    resolvedDark = initial === "dark";
    snap(initial);
    readyFrame = window.requestAnimationFrame(() => {
      readyFrame = 0;
      html.setAttribute(GROUND_READY_ATTR, "");
    });

    const stopScroll = onScrollRaf(() => {
      if (window.scrollY > 0) userScrolled = true;
      evaluate();
    });

    const remeasure = () => {
      bands = collectBands();
      evaluate();
    };
    window.addEventListener("resize", remeasure);
    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);

    const onReducedChange = () => {
      if (!reducedQuery.matches) return;
      const next = userScrolled ? resolveTone() : resolveTopTone();
      resolvedDark = next === "dark";
      snap(next);
    };
    reducedQuery.addEventListener("change", onReducedChange);

    const api: TanoGroundApi = {
      get tone() {
        return committed;
      },
      setGroundTone(tone) {
        if (tone !== "dark" && tone !== "light") return;
        override = tone;
        bands = collectBands();
        const dark = tone === "dark";
        if (dark === resolvedDark && tone === committed) return;
        resolvedDark = dark;
        transitionTo(tone);
      },
      clearGroundTone() {
        override = null;
        bands = collectBands();
        evaluate(true);
      },
      refresh() {
        remeasure();
      },
    };
    window.__tanoGround = api;

    return () => {
      stopScroll();
      window.removeEventListener("resize", remeasure);
      resizeObserver.disconnect();
      reducedQuery.removeEventListener("change", onReducedChange);
      if (readyFrame) window.cancelAnimationFrame(readyFrame);
      readyFrame = 0;
      stopFrame();
      stopVeil();
      window.clearTimeout(swapTimer);
      html.removeAttribute(GROUND_MOVING_ATTR);
      html.removeAttribute(GROUND_SWAP_ATTR);
      clearNear();
      if (createdVeil) veil?.remove();
      if (window.__tanoGround === api) delete window.__tanoGround;
    };
  }, [pathname]);
}
