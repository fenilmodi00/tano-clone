"use client";

/**
 * Owner: HomeMedia. DOM behaviours for the home media sections. The SSR
 * markup is treated as content: this module only adds the attributes and
 * custom properties the source runtime adds.
 */

export const CASE_DECK_WIPE_PX = 240;
export const CASE_DECK_GHOST_SPAN = 0.6;
export const BRAND_TAB_INTERVAL_MS = 6000;
export const BRAND_TAB_FADE_MS = 260;
export const COPY_FLASH_MS = 1400;

type Cleanup = () => void;

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/** Source CaseDeck: clamp(1 - (nextTick.top - slotTop) / 240, 0, 1). */
export function caseDeckCover(nextTickTop: number, slotTop: number): number {
  return clamp01(1 - (nextTickTop - slotTop) / CASE_DECK_WIPE_PX);
}

/** Source CaseDeck: next tick passes the slot top within 2px. */
export function isCaseSlotCovered(nextTickTop: number, slotTop: number): boolean {
  return nextTickTop < slotTop + 2;
}

/** Source CaseDeck ghost blend over 0.6 viewport heights. */
export function caseDeckGhostProgress(
  nextTickTop: number,
  slotTop: number,
  viewportHeight: number,
): number {
  return clamp01(1 - (nextTickTop - slotTop) / (viewportHeight * CASE_DECK_GHOST_SPAN));
}

export function caseDeckGhostHue(from: string, to: string, progress: number): string {
  return `color-mix(in oklab, ${from}, ${to} ${Math.round(progress * 100)}%)`;
}

/* ------------------------------------------------------------------------- */
/* Case deck                                                                 */
/* ------------------------------------------------------------------------- */

function mountCaseDecks(): Cleanup {
  const decks = Array.from(document.querySelectorAll<HTMLElement>(".wire-case-banners"));
  const cleanups: Cleanup[] = [];

  for (const deck of decks) {
    let observers: IntersectionObserver[] = [];
    let accents: string[] = [];
    let tops: number[] = [];
    let ghostHue = "";
    let scrollFrame = 0;
    let resizeFrame = 0;

    const slots = () => Array.from(deck.querySelectorAll<HTMLElement>(":scope > .wire-case-slot"));

    const measure = () => {
      const current = slots();
      accents = current.map((slot) => {
        const banner = slot.querySelector<HTMLElement>(".wire-case-banner");
        if (!banner) return "";
        const style = window.getComputedStyle(banner);
        return (
          style.getPropertyValue("--case-accent").trim() ||
          style.getPropertyValue("--case-hue").trim()
        ).trim();
      });
      tops = current.map((slot) => Number.parseFloat(window.getComputedStyle(slot).top));
    };

    const reset = () => {
      for (const observer of observers) observer.disconnect();
      observers = [];
      for (const slot of slots()) {
        delete slot.dataset.covered;
        slot.style.removeProperty("--covered-depth");
        slot.style.removeProperty("--cover");
      }
    };

    const updateGhost = () => {
      const current = slots();
      if (accents.length !== current.length) measure();
      if (current.length === 0) return;

      let hue = accents[0] ?? "";

      for (let index = 1; index < current.length; index += 1) {
        const tick = current[index].querySelector<HTMLElement>(".wire-case-tick");
        const slotTop = tops[index];
        const nextHue = accents[index];
        if (!tick || slotTop === undefined || Number.isNaN(slotTop) || !nextHue) break;

        const progress = caseDeckGhostProgress(
          tick.getBoundingClientRect().top,
          slotTop,
          window.innerHeight,
        );
        if (progress <= 0) break;
        if (progress >= 1) {
          hue = nextHue;
          continue;
        }
        hue = caseDeckGhostHue(hue, nextHue, progress);
        break;
      }

      if (hue && hue !== ghostHue) {
        ghostHue = hue;
        deck.style.setProperty("--ghost-hue", hue);
      }
    };

    const updateCover = () => {
      const current = slots();
      if (tops.length !== current.length) measure();

      current.forEach((slot, index) => {
        const next = current[index + 1];
        const tick = next?.querySelector<HTMLElement>(".wire-case-tick");
        const slotTop = tops[index + 1];
        if (!next || !tick || slotTop === undefined || Number.isNaN(slotTop)) {
          slot.style.removeProperty("--cover");
          return;
        }
        const value = caseDeckCover(tick.getBoundingClientRect().top, slotTop).toFixed(2);
        if (slot.style.getPropertyValue("--cover") !== value)
          slot.style.setProperty("--cover", value);
      });
    };

    const updateCovered = () => {
      const current = slots();
      if (tops.length !== current.length) measure();

      current.forEach((slot, index) => {
        const next = current[index + 1];
        const tick = next?.querySelector<HTMLElement>(".wire-case-tick");
        if (!next || !tick) return;
        const slotTop = Number.parseFloat(window.getComputedStyle(next).top);
        if (Number.isNaN(slotTop)) return;
        slot.dataset.covered = String(isCaseSlotCovered(tick.getBoundingClientRect().top, slotTop));
      });

      const coveredCount = current.filter((slot) => slot.dataset.covered === "true").length;
      current.forEach((slot, index) => {
        if (slot.dataset.covered === "true") {
          slot.style.setProperty("--covered-depth", String(coveredCount - index));
        } else {
          slot.style.removeProperty("--covered-depth");
        }
      });

      updateGhost();
    };

    const init = () => {
      const current = slots();
      accents = [];
      tops = [];
      reset();

      const tallest = Math.max(0, ...current.map((slot) => slot.getBoundingClientRect().height));
      if (tallest > 0) deck.style.setProperty("--case-h", `${Math.round(tallest)}px`);

      measure();

      if (current.length >= 2) {
        current.forEach((slot, index) => {
          const next = current[index + 1];
          if (!next) return;
          const tick = next.querySelector<HTMLElement>(".wire-case-tick");
          if (!tick) return;
          const slotTop = Number.parseFloat(window.getComputedStyle(next).top);
          if (Number.isNaN(slotTop)) return;
          const observer = new IntersectionObserver(updateCovered, {
            rootMargin: `${-(Math.round(slotTop) + 2)}px 0px 0px 0px`,
            threshold: 0,
          });
          observer.observe(tick);
          observers.push(observer);
        });
      }

      updateCover();
      updateCovered();
    };

    const requestScrollUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateGhost();
        updateCover();
      });
    };

    const requestResize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        init();
      });
    };

    const onScrollEnd = () => updateCovered();

    init();

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", requestResize);
    const resizeObserver = new ResizeObserver(requestResize);
    for (const slot of slots()) resizeObserver.observe(slot);

    cleanups.push(() => {
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", requestResize);
      resizeObserver.disconnect();
      reset();
    });
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}

/* ------------------------------------------------------------------------- */
/* Brand tabs                                                                */
/* ------------------------------------------------------------------------- */

function mountBrandTabs(): Cleanup {
  const bars = Array.from(document.querySelectorAll<HTMLElement>(".hp-brand-bar"));
  const cleanups: Cleanup[] = [];

  for (const bar of bars) {
    const section =
      bar.closest<HTMLElement>(".hp-brands-band") ?? bar.closest<HTMLElement>("section");
    const tabs = Array.from(bar.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    if (!section || tabs.length === 0) continue;

    const card = section.querySelector<HTMLElement>(".hp-brand-card");
    const stage = section.querySelector<HTMLElement>(".hp-brand-stage");
    const shots = Array.from(stage?.querySelectorAll<HTMLElement>(".hp-brand-shot") ?? []);
    const marks = Array.from(stage?.querySelectorAll<HTMLElement>(".hp-brand-media-mark") ?? []);
    const ghosts = Array.from(
      section.querySelectorAll<HTMLElement>(".hp-brand-quote-slot > .hp-brand-quote-ghost"),
    );
    const liveQuote = section.querySelector<HTMLElement>(".hp-brand-quote-live");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const generatedFills = new Set<HTMLElement>();

    let index = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
    );
    let timer = 0;
    let fadeTimer = 0;
    let inView = false;
    let inside = false;
    let ratio75 = false;
    let held = false;

    if (liveQuote) liveQuote.dataset.quoteIndex = String(index);

    const running = () => inView && !held && !reduced.matches;

    const clearTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    const clearFade = () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
      fadeTimer = 0;
    };

    const setFading = (value: boolean) => {
      if (card) card.setAttribute("data-fading", String(value));
    };

    const setLive = (next: number) => {
      shots.forEach((shot, shotIndex) =>
        shot.setAttribute("data-live", String(shotIndex === next)),
      );
      marks.forEach((mark, markIndex) =>
        mark.setAttribute("data-live", String(markIndex === next)),
      );
    };

    const renderQuote = (next: number) => {
      if (!liveQuote) return;
      const ghost = ghosts[next];
      if (!ghost) return;
      if (liveQuote.dataset.quoteIndex === String(next)) return;

      const raw = ghost.textContent?.trim() ?? "";
      const quote = raw
        .replace(/^[\u201c"]/, "")
        .replace(/[\u201d"]$/, "")
        .trim();
      if (!quote) return;

      const words = quote.split(/\s+/).filter(Boolean);
      const fragment = document.createDocumentFragment();

      const open = document.createElement("span");
      open.className = "hp-brand-word hp-brand-quote-mark";
      open.setAttribute("aria-hidden", "true");
      open.textContent = "\u201c";
      fragment.append(open);

      words.forEach((word, wordIndex) => {
        const span = document.createElement("span");
        span.className = "hp-brand-word";
        span.style.setProperty("--d", `${(wordIndex + 1) * 40}ms`);
        span.textContent = word + (wordIndex < words.length - 1 ? " " : "");
        fragment.append(span);
      });

      const close = document.createElement("span");
      close.className = "hp-brand-word hp-brand-quote-mark";
      close.setAttribute("aria-hidden", "true");
      close.style.setProperty("--d", `${(words.length + 1) * 40}ms`);
      close.textContent = "\u201d";
      fragment.append(close);

      liveQuote.setAttribute("data-reduced", String(reduced.matches));
      liveQuote.replaceChildren(fragment);
      liveQuote.dataset.quoteIndex = String(next);
    };

    const updateTabs = () => {
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.dataset.active = String(active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;

        const rule = tab.querySelector<HTMLElement>(".hp-brand-tab-rule");
        if (!rule) return;

        if (!active) {
          rule.querySelectorAll<HTMLElement>(".hp-brand-tab-fill").forEach((fill) => {
            generatedFills.delete(fill);
            fill.remove();
          });
          return;
        }

        let fill = rule.querySelector<HTMLElement>(".hp-brand-tab-fill");
        if (!fill) {
          fill = document.createElement("span");
          fill.className = "hp-brand-tab-fill";
          fill.dataset.homeMediaFill = "true";
          generatedFills.add(fill);
          rule.append(fill);
        }
        fill.dataset.paused = running() ? "false" : "true";
        fill.style.setProperty("--hp-brand-duration", `${BRAND_TAB_INTERVAL_MS}ms`);
        fill.style.setProperty("--hp-brand-count", String(tabs.length));
        fill.style.setProperty("--hp-brand-index", String(index));
      });
    };

    function scheduleTimer() {
      clearTimer();
      if (!running() || tabs.length < 2) return;
      timer = window.setTimeout(() => select((index + 1) % tabs.length), BRAND_TAB_INTERVAL_MS);
    }

    function select(next: number) {
      if (next < 0 || next >= tabs.length) return;
      const changed = next !== index;
      index = next;
      updateTabs();
      card?.setAttribute("aria-labelledby", tabs[index].id);

      if (!changed) {
        scheduleTimer();
        return;
      }

      if (reduced.matches) {
        clearFade();
        setFading(false);
        setLive(index);
        renderQuote(index);
        scheduleTimer();
        return;
      }

      setFading(true);
      clearFade();
      fadeTimer = window.setTimeout(() => {
        fadeTimer = 0;
        setLive(index);
        renderQuote(index);
        setFading(false);
      }, BRAND_TAB_FADE_MS);
      scheduleTimer();
    }

    const resetOnLeave = () => {
      clearTimer();
      clearFade();
      setFading(false);
      index = 0;
      updateTabs();
      setLive(0);
      renderQuote(0);
    };

    const recomputeView = () => {
      const next = inside || ratio75;
      const previous = inView;
      inView = next;
      if (next && !previous) {
        updateTabs();
        scheduleTimer();
      } else if (!next && previous) {
        resetOnLeave();
      }
    };

    const arriveObserver = new IntersectionObserver(
      ([entry]) => {
        inside = entry?.isIntersecting === true;
        recomputeView();
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    const ratioObserver = new IntersectionObserver(
      ([entry]) => {
        ratio75 = (entry?.intersectionRatio ?? 0) >= 0.75;
        recomputeView();
      },
      { threshold: [0, 0.75] },
    );
    arriveObserver.observe(section);
    ratioObserver.observe(section);

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const tab = event.target.closest<HTMLButtonElement>(".hp-brand-tab");
      if (!tab || !bar.contains(tab)) return;
      const next = tabs.indexOf(tab);
      if (next >= 0) select(next);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.target instanceof Element)) return;
      const active = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (active < 0) return;

      let next = -1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (active + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = (active - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next < 0) return;

      event.preventDefault();
      select(next);
      tabs[next].focus();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element) || !event.target.matches(":focus-visible")) return;
      held = true;
      updateTabs();
      scheduleTimer();
    };

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && bar.contains(next)) return;
      held = false;
      updateTabs();
      scheduleTimer();
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        clearTimer();
        clearFade();
        setFading(false);
        setLive(index);
        renderQuote(index);
      } else {
        scheduleTimer();
      }
      updateTabs();
    };

    bar.addEventListener("click", onClick);
    bar.addEventListener("keydown", onKeyDown);
    bar.addEventListener("focusin", onFocusIn);
    bar.addEventListener("focusout", onFocusOut);
    reduced.addEventListener("change", onReducedChange);

    updateTabs();
    setLive(index);

    cleanups.push(() => {
      clearTimer();
      clearFade();
      arriveObserver.disconnect();
      ratioObserver.disconnect();
      bar.removeEventListener("click", onClick);
      bar.removeEventListener("keydown", onKeyDown);
      bar.removeEventListener("focusin", onFocusIn);
      bar.removeEventListener("focusout", onFocusOut);
      reduced.removeEventListener("change", onReducedChange);
      setFading(false);
      for (const fill of generatedFills) {
        if (fill.hasAttribute("data-home-media-fill")) fill.remove();
      }
      generatedFills.clear();
    });
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}

/* ------------------------------------------------------------------------- */
/* Closing cards                                                             */
/* ------------------------------------------------------------------------- */

function mountClosingCards(): Cleanup {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".hp-closing-cards"));
  const cleanups: Cleanup[] = [];

  for (const container of cards) {
    const seenObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) container.setAttribute("data-seen", "true");
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    const inviewObserver = new IntersectionObserver(
      ([entry]) => {
        container.setAttribute("data-inview", entry?.isIntersecting ? "true" : "false");
      },
      { rootMargin: "200px 0px" },
    );
    seenObserver.observe(container);
    inviewObserver.observe(container);

    cleanups.push(() => {
      seenObserver.disconnect();
      inviewObserver.disconnect();
    });
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}

/* ------------------------------------------------------------------------- */
/* Tracking copy buttons                                                     */
/* ------------------------------------------------------------------------- */

function mountCopyButtons(): Cleanup {
  const timers = new Map<HTMLButtonElement, number>();
  const labels = new WeakMap<HTMLButtonElement, string>();

  const onClick = async (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>(".hp-tm-copy");
    if (!button) return;

    const field = button.closest(".hp-tm-field");
    const value = field?.querySelector<HTMLElement>(".hp-tm-field-value")?.textContent?.trim();
    if (!value) return;
    if (!navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }

    const existing = timers.get(button);
    if (existing) window.clearTimeout(existing);
    if (!labels.has(button)) labels.set(button, button.getAttribute("aria-label") ?? "Copy");
    button.dataset.copied = "true";
    button.setAttribute("aria-label", `${labels.get(button) ?? "Copy"} copied`);

    const timeout = window.setTimeout(() => {
      timers.delete(button);
      delete button.dataset.copied;
      const label = labels.get(button);
      if (label) button.setAttribute("aria-label", label);
    }, COPY_FLASH_MS);
    timers.set(button, timeout);
  };

  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    for (const [button, timeout] of timers) {
      window.clearTimeout(timeout);
      delete button.dataset.copied;
      const label = labels.get(button);
      if (label) button.setAttribute("aria-label", label);
    }
    timers.clear();
  };
}

export function mountHomeMediaSections(): Cleanup {
  const cleanups: Cleanup[] = [
    mountCaseDecks(),
    mountBrandTabs(),
    mountClosingCards(),
    mountCopyButtons(),
  ];

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
