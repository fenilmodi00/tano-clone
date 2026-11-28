"use client";

/**
 * Brand-quote tab controller shared by the home brand band and the guide /
 * compare detail templates. Mounted once per committed route from the page
 * runtime; the SSR markup is treated as content and only enhanced here.
 */

const BRAND_TAB_INTERVAL_MS = 6000;
const BRAND_TAB_FADE_MS = 260;

type Cleanup = () => void;

export function mountBrandTabs(): () => void {
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
