"use client";

import { useEffect, useRef } from "react";
import type { LogoMark } from "./brand-marks";

const LOGO_BAND_MARQUEE_SPEED = 26;
const LOGO_BAND_MARQUEE_EASE_SECONDS = 0.9;
const LOGO_BAND_DRAG_THRESHOLD_PX = 6;
const LOGO_BAND_DRAG_SAMPLE_MS = 90;
const LOGO_BAND_DRAG_CLICK_GUARD_MS = 300;

type Cleanup = () => void;

/** Source MarkMarquee copy count: max(2, ceil(stripWidth / copyWidth) + 1). */
function logoBandCopyCount(stripWidth: number, copyWidth: number): number {
  if (!(stripWidth > 0) || !(copyWidth > 0)) return 2;
  return Math.max(2, Math.ceil(stripWidth / copyWidth) + 1);
}

function createChevron(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("stroke-width", "2.1");
  svg.setAttribute("viewBox", "0 0 8 12");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M1.6 1.4 6.2 6l-4.6 4.6");
  svg.append(path);
  return svg;
}

/** Builds a mark for a generated decorative copy from the band's data. */
function createBandMark(mark: LogoMark, decorative: boolean): HTMLElement {
  const root = mark.href ? document.createElement("a") : document.createElement("span");
  root.className = "wire-cases-mark";

  if (mark.hue !== null) {
    root.dataset.hued = "";
    root.style.setProperty("--mark-hue", mark.hue);
  }

  if (decorative) root.setAttribute("aria-hidden", "true");

  if (root instanceof HTMLAnchorElement && mark.href) {
    root.href = mark.href;
    root.draggable = false;
    if (decorative) root.tabIndex = -1;
  }

  const plate = document.createElement("span");
  plate.className = "wire-cases-mark-plate";

  const image = document.createElement("span");
  image.className = "wire-cases-mark-image";
  if (decorative) {
    image.setAttribute("aria-hidden", "true");
  } else {
    image.setAttribute("role", "img");
    image.setAttribute("aria-label", mark.name);
  }

  const scale = mark.opticalScale / Math.sqrt(mark.aspect / 3);
  image.style.height = `calc(var(--mark-base) * ${scale.toFixed(3)})`;
  image.style.setProperty("--mark-aspect", String(mark.aspect));
  image.style.setProperty(
    "--mark-width",
    `calc(var(--mark-base) * ${(scale * mark.aspect).toFixed(3)})`,
  );
  const mask = `url("${mark.src}")`;
  image.style.setProperty("mask-image", mask);
  image.style.setProperty("-webkit-mask-image", mask);

  plate.append(image);
  root.append(plate);

  if (mark.category !== null) {
    const category = document.createElement("span");
    category.className = "wire-cases-mark-category tano-body-mono-xs";
    category.textContent = mark.category;
    root.append(category);
  }

  if (mark.href) {
    const read = document.createElement("span");
    read.className = "wire-cases-mark-read tano-body-mono-xs";
    read.append(document.createTextNode("Read the case study"));
    const chevron = document.createElement("span");
    chevron.className = "wire-cases-mark-read-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.append(createChevron());
    read.append(chevron);
    root.append(read);
  }

  return root;
}

function createBandCopy(marks: readonly LogoMark[]): HTMLElement {
  const copy = document.createElement("div");
  copy.className = "wire-cases-marks-copy";
  for (const mark of marks) copy.append(createBandMark(mark, true));
  return copy;
}

/** Mounts the source marquee behaviour on one `.wire-cases-marks` band. */
function mountMarkBand(band: HTMLElement, marks: readonly LogoMark[]): Cleanup {
  const strip = band.querySelector<HTMLElement>(".wire-cases-marks-strip");
  const run = band.querySelector<HTMLElement>(".wire-cases-marks-run");
  if (!strip || !run) return () => {};

  const generated = new Set<HTMLElement>();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let copyWidth = 0;
  let raf = 0;
  let lastFrame = 0;
  let offset = 0;
  let speed = LOGO_BAND_MARQUEE_SPEED;
  let visible = false;
  let held = false;
  let dragging = false;
  let pointerId: number | null = null;
  let dragDistance = 0;
  let samples: Array<{ x: number; t: number }> = [];
  let clickGuard: { timer: number; swallow: (event: MouseEvent) => void } | null = null;

  const writeTransform = () => {
    if (!(copyWidth > 0)) return;
    offset = ((offset % copyWidth) + copyWidth) % copyWidth;
    run.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const syncCopies = () => {
    const first = run.firstElementChild as HTMLElement | null;
    copyWidth = first?.getBoundingClientRect().width ?? 0;
    if (!(copyWidth > 0) || !(strip.clientWidth > 0)) return;

    const target = logoBandCopyCount(strip.clientWidth, copyWidth);
    while (run.children.length > target) {
      const last = run.lastElementChild as HTMLElement | null;
      if (!last || !generated.has(last)) break;
      generated.delete(last);
      last.remove();
    }
    while (run.children.length < target) {
      const copy = createBandCopy(marks);
      generated.add(copy);
      run.append(copy);
    }
  };

  const tick = (now: number) => {
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(Math.max((now - lastFrame) / 1000, 0), 0.05);
    lastFrame = now;

    if (!dragging) {
      if (reduced.matches) speed = 0;
      const targetSpeed = !visible || held || reduced.matches ? 0 : LOGO_BAND_MARQUEE_SPEED;
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt / LOGO_BAND_MARQUEE_EASE_SECONDS));
      offset += speed * dt;
    }
    writeTransform();
    raf = window.requestAnimationFrame(tick);
  };

  const start = () => {
    if (raf || reduced.matches) return;
    lastFrame = 0;
    raf = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    lastFrame = 0;
  };

  const onFocusIn = (event: FocusEvent) => {
    if (event.target instanceof Element && event.target.matches(":focus-visible")) held = true;
  };
  const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && strip.contains(next)) return;
    held = false;
  };
  const onReducedChange = () => {
    speed = 0;
    if (reduced.matches) stop();
    else if (visible) start();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    dragDistance = 0;
    samples = [{ x: event.clientX, t: event.timeStamp }];
    speed = 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const previous = samples[samples.length - 1];
    if (!previous) return;
    const dx = event.clientX - previous.x;
    offset -= dx;
    dragDistance += Math.abs(dx);
    if (dragDistance > LOGO_BAND_DRAG_THRESHOLD_PX && !strip.hasPointerCapture(event.pointerId)) {
      strip.setPointerCapture(event.pointerId);
    }
    samples.push({ x: event.clientX, t: event.timeStamp });
    samples = samples.filter((sample) => event.timeStamp - sample.t <= LOGO_BAND_DRAG_SAMPLE_MS);
    if (samples.length === 0) samples = [{ x: event.clientX, t: event.timeStamp }];
    writeTransform();
  };

  /** Source MarkMarquee: release velocity from the last 90ms of pointer samples. */
  const finishDrag = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    const first = samples[0];
    const seconds = first ? (event.timeStamp - first.t) / 1000 : 0;
    if (first && seconds > 0) speed = -(event.clientX - first.x) / seconds;
    if (pointerId !== null && strip.hasPointerCapture(pointerId)) {
      strip.releasePointerCapture(pointerId);
    }
    pointerId = null;
    if (dragDistance <= LOGO_BAND_DRAG_THRESHOLD_PX) return;
    // A drag must not activate the mark's case-study link.
    if (clickGuard) {
      window.clearTimeout(clickGuard.timer);
      window.removeEventListener("click", clickGuard.swallow, { capture: true });
    }
    const swallow = (click: MouseEvent) => {
      click.preventDefault();
      click.stopPropagation();
    };
    const timer = window.setTimeout(() => {
      window.removeEventListener("click", swallow, { capture: true });
      if (clickGuard?.swallow === swallow) clickGuard = null;
    }, LOGO_BAND_DRAG_CLICK_GUARD_MS);
    window.addEventListener("click", swallow, { capture: true, once: true });
    clickGuard = { timer, swallow };
  };

  const onDragStart = (event: DragEvent) => event.preventDefault();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting === true;
    if (visible) {
      syncCopies();
      writeTransform();
      start();
    } else {
      stop();
    }
  });
  io.observe(strip);

  const ro = new ResizeObserver(() => {
    syncCopies();
    writeTransform();
    if (visible && !raf) start();
  });
  ro.observe(strip);
  ro.observe(run);

  strip.addEventListener("focusin", onFocusIn);
  strip.addEventListener("focusout", onFocusOut);
  strip.addEventListener("pointerdown", onPointerDown);
  strip.addEventListener("pointermove", onPointerMove);
  strip.addEventListener("dragstart", onDragStart);
  window.addEventListener("pointerup", finishDrag);
  window.addEventListener("pointercancel", finishDrag);
  reduced.addEventListener("change", onReducedChange);

  syncCopies();
  writeTransform();
  const initFrame = window.requestAnimationFrame(() => {
    syncCopies();
    writeTransform();
  });

  return () => {
    stop();
    window.cancelAnimationFrame(initFrame);
    io.disconnect();
    ro.disconnect();
    strip.removeEventListener("focusin", onFocusIn);
    strip.removeEventListener("focusout", onFocusOut);
    strip.removeEventListener("pointerdown", onPointerDown);
    strip.removeEventListener("pointermove", onPointerMove);
    strip.removeEventListener("dragstart", onDragStart);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    if (clickGuard) {
      window.clearTimeout(clickGuard.timer);
      window.removeEventListener("click", clickGuard.swallow, { capture: true });
      clickGuard = null;
    }
    reduced.removeEventListener("change", onReducedChange);
    for (const copy of generated) copy.remove();
    generated.clear();
    run.style.removeProperty("transform");
  };
}

/**
 * Client island for one logo band. The anchor locates the nearest
 * `.wire-cases-marks` ancestor so each band owns its own marquee state.
 */
export function LogoBandMotion({ marks }: { marks: readonly LogoMark[] }) {
  const anchor = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const band = anchor.current?.closest<HTMLElement>(".wire-cases-marks");
    if (!band) return;
    return mountMarkBand(band, marks);
  }, [marks]);

  return <span ref={anchor} hidden />;
}
