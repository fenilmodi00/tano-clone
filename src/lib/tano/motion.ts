/**
 * Shared motion primitives for the cloned Tano site.
 *
 * The source keeps these inline in its bundles. They live here so the scroll
 * driven behaviour modules (ground tone, decks, marquees) share one clamp,
 * one reduced-motion probe and one rAF scroll scheduler.
 */

/** Keep a number inside an inclusive range. Defaults to a 0–1 unit interval. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation between two numbers. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** True when the visitor asked the OS to remove non-essential motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Collapse native `scroll`/`resize` bursts into one callback per animation
 * frame. The callback runs at most once per frame and the cleanup removes
 * both listeners and any queued frame.
 */
export function onScrollRaf(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}
