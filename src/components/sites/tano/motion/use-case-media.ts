/** Owner: CaseMedia. Mounts case-study film, gate and reel behaviour. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { caseMediaForPath, type CaseFilm, type CaseReelFilm } from "../media/case-films";

const PAUSE_GLYPH =
  '<svg aria-hidden="true" fill="none" focusable="false" height="100%" viewBox="0 0 14 14" width="100%"><rect fill="currentColor" height="13" rx="1.25" width="4" x="2" y="0.5" /><rect fill="currentColor" height="13" rx="1.25" width="4" x="8" y="0.5" /></svg>';
const PLAY_GLYPH =
  '<svg aria-hidden="true" fill="none" focusable="false" height="100%" viewBox="0 0 14 14" width="100%"><path fill="currentColor" d="M3.8 1.7 12 7l-8.2 5.3V1.7Z" /></svg>';

const REEL_SNAP_DELAY = 180;
const REEL_SNAP_DURATION = 420;
const REEL_WHEEL_IDLE = 140;
const REEL_SCROLL_TRAVEL = 4;

function injectFilm(frame: HTMLElement, film: CaseFilm, signal: AbortSignal): HTMLVideoElement {
  frame.querySelectorAll("mux-player").forEach((placeholder) => placeholder.remove());
  frame.querySelector<HTMLElement>('template[id="tano-player-theme"]')?.remove();

  const existing = frame.querySelector<HTMLVideoElement>("[data-case-film-video]");
  if (existing) return existing;

  const video = document.createElement("video");
  video.className = "wire-study-video-player";
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.poster = film.poster;
  video.src = film.src ?? "";
  video.setAttribute("data-case-film-video", film.id);
  video.setAttribute("aria-label", film.title);
  video.setAttribute("controlslist", "nodownload");

  video.addEventListener(
    "loadedmetadata",
    () => {
      frame.setAttribute("data-video-ready", "true");
      frame.removeAttribute("data-video-error");
    },
    { signal },
  );
  video.addEventListener(
    "error",
    () => {
      frame.setAttribute("data-video-error", "true");
      frame.removeAttribute("data-video-ready");
    },
    { signal },
  );

  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting && !video.paused) video.pause();
    },
    { threshold: 0 },
  );
  visibility.observe(frame);
  signal.addEventListener("abort", () => visibility.disconnect(), { once: true });

  frame.append(video);
  return video;
}

function wireGate(frame: HTMLElement, film: CaseFilm, signal: AbortSignal): void {
  frame.dataset.gateState = "locked";
  const poster = frame.querySelector<HTMLImageElement>(".wire-study-video-poster img");
  if (poster) {
    poster.src = film.poster;
    poster.removeAttribute("srcset");
  }

  const form = frame.querySelector<HTMLFormElement>(".wire-study-video-gate-form");
  if (!form) return;

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.checkValidity()) {
        form.reportValidity();
        frame.dataset.gateState = "invalid";
        return;
      }
      const input = form.querySelector<HTMLInputElement>('input[type="email"]');
      if (input) input.value = "";
      form.hidden = true;
      frame.dataset.gateState = "disclosed";

      const gate = frame.querySelector<HTMLElement>(".wire-study-video-gate");
      const promise = gate?.querySelector<HTMLElement>(".tano-body-md");
      if (promise) promise.textContent = "This private film is not mirrored in this archive.";
      if (gate && !gate.querySelector(".wire-study-video-gate-note")) {
        const note = document.createElement("p");
        note.className = "wire-study-video-gate-note tano-body-sm";
        note.setAttribute("role", "status");
        note.textContent = film.note ?? "This private film is not mirrored in this archive.";
        gate.append(note);
      }
    },
    { capture: true, signal },
  );

  form.addEventListener(
    "input",
    () => {
      if (frame.dataset.gateState === "invalid") frame.dataset.gateState = "locked";
    },
    { signal },
  );
}

function wrapIndex(target: number, total: number, stride: number): number {
  if (total <= 0) return 0;
  let next = target < 0 ? total + target : target >= total ? target - total : target;
  // Keep the front card inside the middle copies so a full cycle of cards
  // remains on both sides. Shifting by `stride` is visually invisible because
  // every copy of the ring is identical.
  if (next < stride && next + stride < total) next += stride;
  else if (next >= total - stride && next - stride >= stride) next -= stride;
  return Math.max(0, Math.min(total - 1, next));
}

function hydrateFigures(figs: HTMLElement, signal: AbortSignal, cleanups: Array<() => void>): void {
  const band = figs.closest<HTMLElement>(".wire-figs-band") ?? figs;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const runs = Array.from(figs.querySelectorAll<HTMLElement>(".wire-figs-run"));
  const duplicate = runs[1];
  let arrived = false;
  let settled = false;
  let held = false;
  let hidden = document.hidden;
  let reduced = reducedQuery.matches;

  const sync = () => {
    if (!hidden && !held && (arrived || settled)) delete figs.dataset.paused;
    else figs.dataset.paused = "true";
  };

  const applyMotion = () => {
    figs.dataset.motion = reduced ? "still" : "drift";
    // The still rail is scroll-snapped; the echo run exists only for drift.
    if (duplicate) duplicate.style.display = reduced ? "none" : "";
    sync();
  };

  applyMotion();

  const arrive = new IntersectionObserver(
    ([entry]) => {
      arrived = Boolean(entry?.isIntersecting);
      sync();
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0 },
  );
  arrive.observe(band);
  cleanups.push(() => arrive.disconnect());

  const leave = new IntersectionObserver(
    ([entry]) => {
      settled = Boolean(entry && entry.intersectionRatio >= 0.75);
      sync();
    },
    { threshold: [0, 0.75] },
  );
  leave.observe(band);
  cleanups.push(() => leave.disconnect());

  figs.addEventListener(
    "focusin",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(":focus-visible")) return;
      held = true;
      sync();
    },
    { signal },
  );
  figs.addEventListener(
    "focusout",
    (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && figs.contains(next)) return;
      held = false;
      sync();
    },
    { signal },
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      hidden = document.hidden;
      sync();
    },
    { signal },
  );

  reducedQuery.addEventListener(
    "change",
    () => {
      reduced = reducedQuery.matches;
      applyMotion();
    },
    { signal },
  );

  cleanups.push(() => {
    delete figs.dataset.paused;
    if (duplicate) duplicate.style.display = "";
  });
}

function hydrateReel(
  reel: HTMLElement,
  films: readonly CaseReelFilm[],
  signal: AbortSignal,
  cleanups: Array<() => void>,
): void {
  const track = reel.querySelector<HTMLElement>(".wire-reel-track");
  if (!track) return;
  const cards = Array.from(track.children).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node.classList.contains("wire-reel-card"),
  );
  const count = films.length;
  if (cards.length === 0 || count === 0) return;

  const total = cards.length;
  const stride = count;
  const videos = new Map<HTMLElement, HTMLVideoElement>();

  for (const [index, card] of cards.entries()) {
    const film = films[index % count];
    if (!film) continue;
    card.dataset.filmHandle = film.handle;
    card.dataset.filmIndex = String(index % count);

    const poster = card.querySelector<HTMLImageElement>(".wire-reel-poster");
    if (poster) {
      poster.src = film.poster;
      poster.removeAttribute("srcset");
      poster.removeAttribute("sizes");
    }

    const avatar = card.querySelector<HTMLImageElement>(".wire-reel-avatar-face img");
    if (avatar) {
      if (film.avatar) avatar.src = film.avatar;
      else avatar.remove();
    }

    const video = card.querySelector<HTMLVideoElement>("video.wire-reel-clip");
    if (!video) continue;
    videos.set(card, video);
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";
    video.removeAttribute("src");
    video.setAttribute("data-film-handle", film.handle);

    video.addEventListener(
      "loadeddata",
      () => {
        if (card.dataset.front !== "true") return;
        const wrap = card.querySelector<HTMLElement>(".wire-reel-video");
        if (wrap) wrap.dataset.ready = "true";
        maybePlay();
      },
      { signal },
    );
    video.addEventListener(
      "playing",
      () => {
        const wrap = card.querySelector<HTMLElement>(".wire-reel-video");
        if (wrap) wrap.dataset.playing = "true";
      },
      { signal },
    );
    video.addEventListener(
      "pause",
      () => {
        const wrap = card.querySelector<HTMLElement>(".wire-reel-video");
        if (wrap) wrap.dataset.playing = "false";
      },
      { signal },
    );
    video.addEventListener(
      "error",
      () => {
        const wrap = card.querySelector<HTMLElement>(".wire-reel-video");
        if (wrap) wrap.dataset.error = "true";
      },
      { signal },
    );
  }

  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 768px)");
  let reduced = reducedQuery.matches;
  let paused = reduced;
  let inView = true;

  // The source starts the ring on the featured film (the copy the server
  // marked as front) in the middle cycle, then scroll shifts it by ±2 cards.
  const serverFront = cards.findIndex((card) => card.dataset.front === "true");
  const feature = serverFront >= 0 ? ((serverFront % count) + count) % count : 0;
  const base = Math.max(0, Math.min(2 * count + feature, total - 1));
  let frontIndex = serverFront >= 0 ? serverFront : base;
  let position = base;
  let step = 0;
  let cardWidth = 0;
  let animation = 0;
  let snapTimer = 0;
  let wheelTimer = 0;
  let pointerId: number | null = null;
  let dragging = false;

  const controls = reel.parentElement?.querySelector<HTMLElement>(".wire-reel-controls") ?? reel;
  const playButton = controls.querySelector<HTMLButtonElement>('[data-control="play"]');
  const syncButton = () => {
    reel.dataset.paused = paused ? "true" : "false";
    if (!playButton) return;
    playButton.setAttribute("aria-label", paused ? "Play" : "Pause");
    playButton.setAttribute("data-state", paused ? "paused" : "playing");
    playButton.innerHTML = paused ? PLAY_GLYPH : PAUSE_GLYPH;
  };

  const cancelAnimation = () => {
    if (!animation) return;
    window.cancelAnimationFrame(animation);
    animation = 0;
  };

  const clearSnapTimer = () => {
    if (!snapTimer) return;
    window.clearTimeout(snapTimer);
    snapTimer = 0;
  };

  const clearWheelTimer = () => {
    if (!wheelTimer) return;
    window.clearTimeout(wheelTimer);
    wheelTimer = 0;
  };

  const offsetFor = (index: number) => reel.clientWidth / 2 - cardWidth / 2 - index * step;

  const measure = () => {
    const first = cards[0];
    const second = cards[1];
    if (!first) return;
    cardWidth = first.offsetWidth;
    step = second ? second.offsetLeft - first.offsetLeft : cardWidth;
    if (step <= 0) step = cardWidth;
  };

  const maybePlay = () => {
    const card = cards[frontIndex];
    const video = card ? videos.get(card) : undefined;
    if (!card || !video) return;
    const shouldPlay = !paused && inView && !document.hidden;
    if (!shouldPlay) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) {
      const film = films[frontIndex % count];
      if (!film) return;
      video.src = film.src;
      video.load();
    }
    video.play().catch(() => {});
  };

  const liveRegion = controls.querySelector<HTMLElement>('[aria-live="polite"]');

  const announce = (card: HTMLElement) => {
    if (!liveRegion) return;
    const brand =
      card.querySelector<HTMLElement>(".wire-reel-mono[data-quiet]")?.textContent?.trim() ||
      card.querySelector<HTMLElement>(".wire-reel-logo")?.getAttribute("aria-label") ||
      "";
    const handle = card.dataset.filmHandle ?? films[frontIndex % count]?.handle ?? "";
    liveRegion.textContent = brand ? `${handle}, ${brand}` : handle;
  };

  const syncFront = (announceFront: boolean) => {
    for (const [index, card] of cards.entries()) {
      const front = index === frontIndex;
      card.dataset.front = front ? "true" : "false";
      if (front) card.removeAttribute("aria-hidden");
      else card.setAttribute("aria-hidden", "true");

      if (front) continue;
      const video = videos.get(card);
      if (!video) continue;
      video.pause();
      video.removeAttribute("src");
      const wrap = card.querySelector<HTMLElement>(".wire-reel-video");
      if (wrap) {
        wrap.dataset.ready = "false";
        wrap.removeAttribute("data-playing");
      }
    }

    const frontCard = cards[frontIndex];
    const frontVideo = frontCard ? videos.get(frontCard) : undefined;
    if (frontCard && frontVideo) {
      const film = films[frontIndex % count];
      const wrap = frontCard.querySelector<HTMLElement>(".wire-reel-video");
      if (film && frontVideo.getAttribute("src") !== film.src) {
        frontVideo.src = film.src;
        frontVideo.load();
        if (wrap) wrap.dataset.ready = "false";
      }
    }
    if (announceFront && frontCard) announce(frontCard);
    maybePlay();
  };

  const render = (next: number, announceFront = true) => {
    position = Math.max(0, Math.min(total - 1, next));
    track.style.transform = `translate3d(${offsetFor(position).toFixed(1)}px, 0, 0)`;
    for (const [index, card] of cards.entries()) {
      card.style.setProperty(
        "--reel-scale",
        String(1 - 0.16 * Math.min(Math.abs(index - position), 1)),
      );
    }

    const nextFront = Math.max(0, Math.min(total - 1, Math.round(position)));
    if (nextFront === frontIndex) return;
    frontIndex = nextFront;
    syncFront(announceFront);
  };

  const animateTo = (target: number, animate = true) => {
    cancelAnimation();
    if (!animate || reduced) {
      render(target);
      return;
    }
    const from = position;
    const distance = target - from;
    if (Math.abs(distance) < 0.001) {
      render(target);
      return;
    }
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / REEL_SNAP_DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      render(from + distance * eased);
      if (progress < 1) {
        animation = window.requestAnimationFrame(tick);
      } else {
        animation = 0;
        render(target);
      }
    };
    animation = window.requestAnimationFrame(tick);
  };

  const goTo = (target: number, animate = true) => {
    clearSnapTimer();
    clearWheelTimer();
    animateTo(wrapIndex(target, total, stride), animate);
  };

  const updateFromScroll = () => {
    if (!desktopQuery.matches) return;
    cancelAnimation();
    const rect = reel.getBoundingClientRect();
    const progress = Math.min(
      Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0),
      1,
    );
    render(base + (progress - 0.5) * REEL_SCROLL_TRAVEL);
  };

  const scheduleScrollSnap = () => {
    clearSnapTimer();
    snapTimer = window.setTimeout(() => {
      snapTimer = 0;
      if (!desktopQuery.matches || !inView) return;
      animateTo(Math.round(position));
    }, REEL_SNAP_DELAY);
  };

  const onScroll = () => {
    if (dragging) return;
    if (!desktopQuery.matches || reduced || !inView) return;
    updateFromScroll();
    scheduleScrollSnap();
  };

  const remeasure = () => {
    measure();
    render(position, false);
  };

  measure();
  if (desktopQuery.matches) {
    updateFromScroll();
    scheduleScrollSnap();
  } else {
    render(base);
  }
  syncButton();
  syncFront(false);

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      reel.dataset.inview = inView ? "true" : "false";
      maybePlay();
      if (inView && desktopQuery.matches && !reduced && !dragging) {
        updateFromScroll();
        scheduleScrollSnap();
      }
    },
    { rootMargin: "200px", threshold: 0 },
  );
  observer.observe(reel);
  cleanups.push(() => observer.disconnect());

  window.addEventListener("scroll", onScroll, { passive: true, signal });

  const resizeObserver =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(remeasure);
  resizeObserver?.observe(reel);
  cleanups.push(() => resizeObserver?.disconnect());

  playButton?.addEventListener(
    "click",
    () => {
      paused = !paused;
      syncButton();
      maybePlay();
    },
    { signal },
  );

  for (const button of Array.from(
    controls.querySelectorAll<HTMLButtonElement>("[data-direction]"),
  )) {
    button.addEventListener(
      "click",
      () => {
        const direction = button.dataset.direction === "previous" ? -1 : 1;
        goTo(Math.round(position) + direction);
      },
      { signal },
    );
  }

  for (const [index, card] of cards.entries()) {
    card.querySelector<HTMLElement>(".wire-reel-video")?.addEventListener(
      "click",
      () => {
        if (index !== frontIndex) goTo(index, false);
      },
      { signal },
    );
  }

  let startX = 0;
  let startPosition = 0;
  let dragged = false;

  reel.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startPosition = position;
      dragged = false;
      dragging = true;
      cancelAnimation();
      clearSnapTimer();
      clearWheelTimer();
      try {
        reel.setPointerCapture(event.pointerId);
      } catch {
        /* pointer capture is a nicety; dragging still works without it. */
      }
    },
    { signal },
  );

  reel.addEventListener(
    "pointermove",
    (event) => {
      if (pointerId !== event.pointerId) return;
      const delta = event.clientX - startX;
      if (!dragged && Math.abs(delta) < 6) return;
      dragged = true;
      reel.dataset.dragging = "true";
      render(startPosition - delta / (step || 1));
    },
    { signal },
  );

  const endDrag = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    dragging = false;
    delete reel.dataset.dragging;
    if (!dragged) return;
    try {
      if (reel.hasPointerCapture(event.pointerId)) reel.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    reel.addEventListener(
      "click",
      (click) => {
        click.preventDefault();
        click.stopPropagation();
      },
      { capture: true, once: true, signal },
    );
    goTo(Math.round(position));
    dragged = false;
  };

  reel.addEventListener("pointerup", endDrag, { signal });
  reel.addEventListener("pointercancel", endDrag, { signal });

  reel.addEventListener(
    "wheel",
    (event) => {
      if (!desktopQuery.matches) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      cancelAnimation();
      clearSnapTimer();
      render(position + event.deltaX / (step || 1));
      clearWheelTimer();
      wheelTimer = window.setTimeout(() => {
        wheelTimer = 0;
        animateTo(Math.round(position));
      }, REEL_WHEEL_IDLE);
    },
    { passive: false, signal },
  );

  const onVisibility = () => maybePlay();
  document.addEventListener("visibilitychange", onVisibility, { signal });
  const onReducedChange = () => {
    reduced = reducedQuery.matches;
    paused = reduced;
    cancelAnimation();
    clearSnapTimer();
    clearWheelTimer();
    if (reduced) {
      render(Math.round(position), false);
    } else if (desktopQuery.matches) {
      updateFromScroll();
      scheduleScrollSnap();
    }
    syncButton();
    maybePlay();
  };
  reducedQuery.addEventListener("change", onReducedChange, { signal });
  const onDesktopChange = () => {
    cancelAnimation();
    clearSnapTimer();
    clearWheelTimer();
    if (!desktopQuery.matches) return;
    updateFromScroll();
    scheduleScrollSnap();
  };
  desktopQuery.addEventListener("change", onDesktopChange, { signal });

  reel.dataset.reelReady = "true";
  cleanups.push(() => {
    cancelAnimation();
    clearSnapTimer();
    clearWheelTimer();
    for (const video of videos.values()) {
      video.pause();
      video.removeAttribute("src");
    }
    track.style.removeProperty("transform");
    for (const [index, card] of cards.entries()) {
      card.dataset.front = index === serverFront ? "true" : "false";
      if (index === serverFront) card.removeAttribute("aria-hidden");
      else card.setAttribute("aria-hidden", "true");
      card.style.removeProperty("--reel-scale");
    }
    delete reel.dataset.reelReady;
    delete reel.dataset.inview;
    delete reel.dataset.paused;
  });
}

export function useCaseStudyMedia(): (() => void) | void {
  const pathname = usePathname();
  useEffect(() => {
    const media = caseMediaForPath(pathname);
    if (!media) return;

    const controller = new AbortController();
    const { signal } = controller;
    const cleanups: Array<() => void> = [];
    const createdVideos: HTMLVideoElement[] = [];
    let disposed = false;

    // The shared SiteRuntime effect calls play() on every `main video` at mount.
    // Case films do not autoplay in the source, so inject them after that pass.
    const frame = window.requestAnimationFrame(() => {
      if (disposed) return;
      const root = document.querySelector("main");
      if (!root) return;

      const figures = Array.from(root.querySelectorAll<HTMLElement>(".wire-study-video"));
      for (const [index, figure] of figures.entries()) {
        const film = media.films[index];
        if (!film) continue;
        const container = figure.querySelector<HTMLElement>(".wire-study-video-frame");
        if (!container) continue;
        container.dataset.caseFilm = film.id;
        if (!film.src || container.hasAttribute("data-gated")) {
          wireGate(container, film, signal);
          continue;
        }
        createdVideos.push(injectFilm(container, film, signal));
      }

      for (const reel of Array.from(
        root.querySelectorAll<HTMLElement>(
          ".wire-study-films .wire-reel, .wire-films-band .wire-reel",
        ),
      )) {
        hydrateReel(reel, media.reels, signal, cleanups);
      }

      for (const figs of Array.from(
        root.querySelectorAll<HTMLElement>(
          '.wire-figs[data-motion="drift"], .wire-figs[data-motion="still"]',
        ),
      )) {
        hydrateFigures(figs, signal, cleanups);
      }
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      controller.abort();
      for (const cleanup of cleanups) cleanup();
      for (const video of createdVideos) {
        video.pause();
        video.remove();
      }
    };
  }, [pathname]);
}
