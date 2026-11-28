import { useEffect } from "react";

type Cleanup = () => void;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const PLAY_GLYPH = `<svg viewBox="0 0 14 14" width="100%" height="100%" fill="none" aria-hidden="true" focusable="false"><path d="M3.00283.5c-.27961 0-.55454.071214-.7989.206831-.24906.127096-.45929.319089-.60841.555799-.1514.24031-.23403.51751-.23893.80149l-.00007 0v9.86318h-.00007l.00014.0086c.0049.284.08753.5612.23893.8015.14912.2367.35935.4287.60841.5558.24436.1356.51929.2068.7989.2068.2838 0 .56278-.0734.80987-.213.00575-.0032.01143-.0066.01704-.0101L11.806 8.34363c.2475-.12503.4564-.3152.604-.55027.1528-.24322.2339-.52462.2339-.81185s-.0811-.56863-.2339-.81185c-.1478-.23533-.357-.42566-.6048-.55069L3.82831.722179C3.82317.719019 3.81796.715952 3.8127.71298 3.56561.573367 3.28663.5 3.00283.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" /></svg>`;
const INTERVAL_MS = 5000;

/**
 * Tracking carousel shared by the home and use-case pages: one live
 * `[data-live="true"]` card, 5 s beats while in view, arrows and pause/play.
 */
export function useTrackCarousel(): void {
  useEffect(() => {
    const cleanups: Cleanup[] = [];
    setupTracks(cleanups);
    return () => {
      for (let index = cleanups.length - 1; index >= 0; index -= 1) cleanups[index]?.();
    };
  }, []);
}

function setupTracks(cleanups: Cleanup[]): void {
  const reducedMedia = window.matchMedia(REDUCED_QUERY);

  for (const track of Array.from(document.querySelectorAll<HTMLElement>(".hp-track"))) {
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".hp-track-card"));
    if (cards.length < 2) continue;
    const stage = track.querySelector<HTMLElement>(".hp-track-stage");
    const playButtons = Array.from(
      track.querySelectorAll<HTMLButtonElement>('[data-control="play"]'),
    );
    const previousButtons = Array.from(
      track.querySelectorAll<HTMLButtonElement>('[data-direction="previous"]'),
    );
    const nextButtons = Array.from(
      track.querySelectorAll<HTMLButtonElement>('[data-direction="next"]'),
    );
    const pauseGlyphs = new Map<HTMLButtonElement, string>();
    for (const button of playButtons) {
      pauseGlyphs.set(button, button.querySelector("span")?.innerHTML ?? "");
    }

    let index = Math.max(
      0,
      cards.findIndex((card) => card.dataset.live === "true"),
    );
    let left = INTERVAL_MS;
    let since = 0;
    let timer = 0;
    let inView = false;
    let reduced = reducedMedia.matches;
    let explicitPaused = false;

    const syncCards = () => {
      cards.forEach((card, position) => {
        const live = position === index;
        card.dataset.live = String(live);
        if (live) card.removeAttribute("aria-hidden");
        else card.setAttribute("aria-hidden", "true");
        card.toggleAttribute("inert", !live);
      });
    };

    const syncPlay = () => {
      const playing = !explicitPaused && !reduced;
      for (const button of playButtons) {
        button.setAttribute("aria-label", playing ? "Pause" : "Play");
        const span = button.querySelector("span");
        if (span) span.innerHTML = playing ? (pauseGlyphs.get(button) ?? "") : PLAY_GLYPH;
      }
    };

    const schedule = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
      if (since) {
        left = Math.max(0, left - (performance.now() - since));
        since = 0;
      }
      if (!inView || reduced || explicitPaused) return;
      since = performance.now();
      timer = window.setTimeout(() => {
        timer = 0;
        since = 0;
        index = (index + 1) % cards.length;
        left = INTERVAL_MS;
        syncCards();
        schedule();
      }, left);
    };

    const pick = (raw: number) => {
      index = ((raw % cards.length) + cards.length) % cards.length;
      left = INTERVAL_MS;
      since = 0;
      syncCards();
      schedule();
    };

    const onPrevious = () => pick(index - 1);
    const onNext = () => pick(index + 1);
    const onToggle = () => {
      explicitPaused = !explicitPaused;
      syncPlay();
      schedule();
    };

    for (const button of previousButtons) button.addEventListener("click", onPrevious);
    for (const button of nextButtons) button.addEventListener("click", onNext);
    for (const button of playButtons) button.addEventListener("click", onToggle);

    syncCards();
    syncPlay();

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || entry.isIntersecting === inView) return;
        inView = entry.isIntersecting;
        syncPlay();
        schedule();
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    io.observe(stage ?? track);

    const onReducedChange = () => {
      reduced = reducedMedia.matches;
      syncPlay();
      schedule();
    };
    reducedMedia.addEventListener("change", onReducedChange);

    cleanups.push(() => {
      if (timer) window.clearTimeout(timer);
      io.disconnect();
      reducedMedia.removeEventListener("change", onReducedChange);
      for (const button of previousButtons) button.removeEventListener("click", onPrevious);
      for (const button of nextButtons) button.removeEventListener("click", onNext);
      for (const button of playButtons) button.removeEventListener("click", onToggle);
    });
  }
}
