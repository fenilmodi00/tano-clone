import { useEffect } from "react";

import {
  FAQ_CATEGORY_ROWS_GZ,
  FAQ_CLEAR_GZ,
  FAQ_EMPTY_GZ,
  STEP_DURATIONS,
  STEP_SCENES_GZ,
} from "../home/info-sections";

type Cleanup = () => void;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";
const PLAY_GLYPH = `<svg viewBox="0 0 14 14" width="100%" height="100%" fill="none" aria-hidden="true" focusable="false"><path d="M3.00283.5c-.27961 0-.55454.071214-.7989.206831-.24906.127096-.45929.319089-.60841.555799-.1514.24031-.23403.51751-.23893.80149l-.00007 0v9.86318h-.00007l.00014.0086c.0049.284.08753.5612.23893.8015.14912.2367.35935.4287.60841.5558.24436.1356.51929.2068.7989.2068.2838 0 .56278-.0734.80987-.213.00575-.0032.01143-.0066.01704-.0101L11.806 8.34363c.2475-.12503.4564-.3152.604-.55027.1528-.24322.2339-.52462.2339-.81185s-.0811-.56863-.2339-.81185c-.1478-.23533-.357-.42566-.6048-.55069L3.82831.722179C3.82317.719019 3.81796.715952 3.8127.71298 3.56561.573367 3.28663.5 3.00283.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" /></svg>`;

/* Source Cursor timing from the live home bundle: a 1200 ms beat grid with a
   3200 ms scene tail outside the cursor animation. */
const CURSOR_BEAT_MS = 1200;
const CURSOR_TAIL_MS = 3200;
const CURSOR_CLICK_MS = 140;
const CURSOR_APPROACH_MS = 160;
const CURSOR_TRAVEL_MS = 1000;
const CURSOR_HOLD_MS = 600;
const CURSOR_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";

function parseElement(html: string): HTMLElement | null {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const first = template.content.firstElementChild;
  return first instanceof HTMLElement ? first : null;
}

async function expandPayload(payload: string): Promise<string> {
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

function setupSteps(scenes: readonly string[], cleanups: Cleanup[]): void {
  const title = document.getElementById("loop-title");
  const root = title?.closest("section")?.querySelector<HTMLElement>(".hp-pp");
  const stage = root?.querySelector<HTMLElement>(".hp-pp-stage");
  if (!root || !stage) return;

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(".hp-steps-seg-button"));
  const count = Math.min(buttons.length, scenes.length);
  if (count === 0) return;

  const durations: readonly number[] = STEP_DURATIONS.slice(0, count);
  const slides = Array.from(root.querySelectorAll<HTMLElement>(".hp-pp-slide"));
  const copy = root.querySelector<HTMLElement>(".hp-pp-copy");
  const playButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-control="play"]'));
  const previousButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-direction="previous"]'),
  );
  const nextButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-direction="next"]'),
  );
  const pauseGlyphs = new Map<HTMLButtonElement, string>();
  for (const button of playButtons) {
    pauseGlyphs.set(button, button.querySelector("span")?.innerHTML ?? "");
  }

  const originalStage = stage.innerHTML;
  const originalCount = stage.style.getPropertyValue("--hp-steps-count");
  const originalActive = stage.style.getPropertyValue("--hp-steps-active");
  const originalLive = copy?.getAttribute("aria-live") ?? null;

  const reducedMedia = window.matchMedia(REDUCED_QUERY);
  let reduced = reducedMedia.matches;
  let index = 0;
  let left = durations[0] ?? 12200;
  let since = 0;
  let timer = 0;
  let leavingTimer = 0;
  let leavingFrame: HTMLElement | null = null;
  let currentFrame: HTMLElement | null = null;
  let inView = false;
  let hasLeft = false;
  let explicitPaused = false;
  let cursorAnimation: Animation | null = null;

  const running = () => inView && !reduced && !explicitPaused;

  const stopCursor = () => {
    cursorAnimation?.cancel();
    cursorAnimation = null;
    const cursor = currentFrame?.querySelector<HTMLElement>(".hp-pp-cursor");
    if (cursor) cursor.style.opacity = "0";
  };

  /* Source Cursor: a linear 1200 ms beat clock, 140 ms press, 160 ms approach,
     1000 ms travel, 600 ms tail hold, then an 8% fade while drifting 40/60 px.
     The cursor exists only where the scene carries .hp-pp-cursor + targets
     (inputs); no cursor is invented for other steps. */
  const startCursor = (frame: HTMLElement, stepDuration: number) => {
    stopCursor();
    const cursor = frame.querySelector<HTMLElement>(".hp-pp-cursor");
    const scene = frame.querySelector<HTMLElement>(".hp-pp-scene");
    if (!cursor || !scene || reduced || stepDuration <= CURSOR_TAIL_MS) return;

    const stops: Array<{ target: HTMLElement; at: number }> = [];
    for (const target of Array.from(frame.querySelectorAll<HTMLElement>("[data-cursor]"))) {
      let at = Number.NaN;
      for (
        let node: HTMLElement | null = target;
        node && node !== frame;
        node = node.parentElement
      ) {
        const raw = node.style.getPropertyValue("--win") || node.style.getPropertyValue("--at");
        if (!raw) continue;
        const value = Number.parseFloat(raw);
        if (Number.isFinite(value)) {
          at = value;
          break;
        }
      }
      if (Number.isFinite(at)) stops.push({ target, at });
    }
    if (stops.length === 0) return;
    stops.sort((a, b) => a.at - b.at);

    const duration = stepDuration - CURSOR_TAIL_MS;
    const origin = scene.getBoundingClientRect();
    const pointFor = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      return {
        x: rect.left - origin.left + rect.width / 2,
        y: rect.top - origin.top + rect.height * 0.55,
      };
    };
    const at = (ms: number) => Math.min(Math.max(ms / duration, 0), 1);
    const transform = (point: { x: number; y: number }, scale = 1) =>
      `translate(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px) scale(${scale})`;

    const first = pointFor(stops[0].target);
    let home = { x: first.x + origin.width * 0.12, y: first.y + origin.height * 0.16 };
    const keyframes: Keyframe[] = [{ transform: transform(home), opacity: 0, offset: 0 }];
    let reached = 0;
    for (const stop of stops) {
      const location = pointFor(stop.target);
      const clickAt = CURSOR_BEAT_MS * stop.at - CURSOR_CLICK_MS;
      const arriveAt = Math.max(reached, clickAt - CURSOR_APPROACH_MS);
      const leaveAt = Math.max(reached, arriveAt - CURSOR_TRAVEL_MS);
      keyframes.push({
        transform: transform(home),
        opacity: reached === 0 ? 0 : 1,
        offset: at(leaveAt),
        easing: CURSOR_EASE,
      });
      keyframes.push({ transform: transform(location), opacity: 1, offset: at(arriveAt) });
      keyframes.push({ transform: transform(location, 0.86), opacity: 1, offset: at(clickAt) });
      keyframes.push({
        transform: transform(location),
        opacity: 1,
        offset: at(clickAt + CURSOR_CLICK_MS),
      });
      home = location;
      reached = clickAt + CURSOR_CLICK_MS;
    }

    const holdAt = at(reached + CURSOR_HOLD_MS);
    const exit = { x: home.x + 40, y: home.y + 60 };
    keyframes.push({ transform: transform(home), opacity: 1, offset: holdAt });
    keyframes.push({ transform: transform(exit), opacity: 0, offset: Math.min(holdAt + 0.08, 1) });
    keyframes.push({ transform: transform(exit), opacity: 0, offset: 1 });

    /* Offsets must never go backwards; the source clamps the same way. */
    let previous = 0;
    for (const keyframe of keyframes) {
      const value = Math.max(
        typeof keyframe.offset === "number" ? keyframe.offset : previous,
        previous,
      );
      keyframe.offset = value;
      previous = value;
    }

    cursorAnimation = cursor.animate(keyframes, { duration, fill: "forwards" });
    if (!running()) cursorAnimation.pause();
  };

  const setFrameRunning = (frame: HTMLElement, active: boolean) => {
    const scene = frame.querySelector<HTMLElement>(".hp-pp-scene");
    if (!scene) return;
    if (active && !reduced) scene.setAttribute("data-running", "true");
    else scene.removeAttribute("data-running");
    if (reduced) scene.setAttribute("data-reduced", "");
    else scene.removeAttribute("data-reduced");
  };

  const makeFrame = (step: number, direction: number, leaving = false): HTMLElement | null => {
    const frame = parseElement(scenes[step % scenes.length] ?? scenes[0] ?? "");
    if (!frame) return null;
    frame.setAttribute("data-direction", String(direction));
    if (leaving) frame.setAttribute("data-leaving", "");
    else frame.removeAttribute("data-leaving");
    if (window.matchMedia(MOBILE_QUERY).matches) frame.removeAttribute("data-room");
    setFrameRunning(frame, false);
    return frame;
  };

  const syncPlayButtons = () => {
    const playing = !explicitPaused && !reduced;
    for (const button of playButtons) {
      button.setAttribute("aria-label", playing ? "Pause" : "Play");
      const span = button.querySelector("span");
      if (span) span.innerHTML = playing ? (pauseGlyphs.get(button) ?? "") : PLAY_GLYPH;
    }
  };

  const updateFills = () => {
    buttons.forEach((button, position) => {
      const fill = button.querySelector<HTMLElement>(".hp-steps-seg-fill");
      if (!fill) return;
      fill.dataset.paused = String(!running());
      fill.style.setProperty("--hp-steps-index", String(position));
      fill.style.setProperty("--hp-steps-duration", `${durations[position] ?? 0}ms`);
    });
  };

  const restartFill = () => {
    const rule = buttons[index]?.querySelector<HTMLElement>(".hp-steps-seg-rule");
    const fill = rule?.querySelector<HTMLElement>(".hp-steps-seg-fill");
    if (!rule || !fill) return;
    const replacement = fill.cloneNode(true) as HTMLElement;
    replacement.dataset.paused = String(!running());
    replacement.style.setProperty("--hp-steps-index", String(index));
    replacement.style.setProperty("--hp-steps-duration", `${durations[index] ?? 0}ms`);
    rule.appendChild(replacement);
    fill.remove();
  };

  const syncButtons = () => {
    buttons.forEach((button, position) => {
      const live = position === index;
      button.dataset.state = position < index ? "done" : live ? "live" : "idle";
      if (live) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.closest("li")?.toggleAttribute("data-live", live);
    });
    updateFills();
  };

  const syncSlides = () => {
    slides.forEach((slide, position) => {
      const live = position === index;
      slide.dataset.live = String(live);
      if (live) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
    });
  };

  const syncScene = () => {
    stage.style.setProperty("--hp-steps-count", String(count));
    stage.style.setProperty("--hp-steps-active", String(index));
  };

  const sync = () => {
    syncButtons();
    syncSlides();
    syncScene();
    syncPlayButtons();
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
    if (!running() || count < 2) return;
    since = performance.now();
    timer = window.setTimeout(() => {
      timer = 0;
      since = 0;
      select(index + 1, 1, false);
    }, left);
  };

  const select = (raw: number, direction: number, manual: boolean) => {
    const next = ((raw % count) + count) % count;
    if (next === index && !manual) return;
    const frame = makeFrame(next, direction);
    if (!frame) return;

    if (since) {
      left = Math.max(0, left - (performance.now() - since));
      since = 0;
    }
    if (timer) {
      window.clearTimeout(timer);
      timer = 0;
    }
    if (leavingFrame?.parentElement === stage) leavingFrame.remove();
    if (leavingTimer) window.clearTimeout(leavingTimer);
    if (currentFrame) {
      stopCursor();
      currentFrame.setAttribute("data-leaving", "");
      currentFrame.setAttribute("data-direction", String(direction));
      setFrameRunning(currentFrame, false);
      leavingFrame = currentFrame;
      leavingTimer = window.setTimeout(() => {
        leavingFrame?.remove();
        leavingFrame = null;
        leavingTimer = 0;
      }, 420);
    }

    index = next;
    left = durations[index] ?? durations[0] ?? 0;
    stage.appendChild(frame);
    currentFrame = frame;
    setFrameRunning(frame, running());
    startCursor(frame, left);
    sync();
    restartFill();
    if (copy) copy.setAttribute("aria-live", manual ? "polite" : "off");
    schedule();
  };

  const resetOnArrival = () => {
    if (leavingFrame?.parentElement === stage) leavingFrame.remove();
    if (leavingTimer) {
      window.clearTimeout(leavingTimer);
      leavingTimer = 0;
    }
    leavingFrame = null;
    const frame = makeFrame(0, 1);
    if (frame) {
      currentFrame?.remove();
      currentFrame = frame;
      stage.appendChild(frame);
      setFrameRunning(frame, true);
      startCursor(frame, durations[0] ?? 12200);
    }
    index = 0;
    left = durations[0] ?? 12200;
    since = 0;
    sync();
    restartFill();
    if (copy) copy.setAttribute("aria-live", "off");
    schedule();
  };

  const updateRunning = () => {
    if (currentFrame) setFrameRunning(currentFrame, running());
    if (cursorAnimation) {
      if (running()) cursorAnimation.play();
      else cursorAnimation.pause();
    }
    syncPlayButtons();
    updateFills();
    schedule();
  };

  const initial = makeFrame(0, 1);
  if (!initial) return;
  currentFrame = initial;
  stage.replaceChildren(initial);
  startCursor(initial, left);
  sync();
  restartFill();

  const onPrevious = () => select(index - 1, -1, true);
  const onNext = () => select(index + 1, 1, true);
  const onToggle = () => {
    explicitPaused = !explicitPaused;
    updateRunning();
  };
  const onStep = (position: number) => () => {
    select(position, position < index ? -1 : 1, true);
  };
  const stepHandlers = buttons.map((_button, position) => onStep(position));

  for (const button of previousButtons) button.addEventListener("click", onPrevious);
  for (const button of nextButtons) button.addEventListener("click", onNext);
  for (const button of playButtons) button.addEventListener("click", onToggle);
  buttons.forEach((button, position) => button.addEventListener("click", stepHandlers[position]));

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry || entry.isIntersecting === inView) return;
      inView = entry.isIntersecting;
      if (!inView) {
        hasLeft = true;
        if (currentFrame) setFrameRunning(currentFrame, false);
        cursorAnimation?.pause();
        updateFills();
        schedule();
        return;
      }
      if (hasLeft) {
        hasLeft = false;
        resetOnArrival();
      } else {
        updateRunning();
      }
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0 },
  );
  io.observe(stage);

  const onReducedChange = () => {
    reduced = reducedMedia.matches;
    updateRunning();
  };
  reducedMedia.addEventListener("change", onReducedChange);

  cleanups.push(() => {
    stopCursor();
    if (timer) window.clearTimeout(timer);
    if (leavingTimer) window.clearTimeout(leavingTimer);
    io.disconnect();
    reducedMedia.removeEventListener("change", onReducedChange);
    for (const button of previousButtons) button.removeEventListener("click", onPrevious);
    for (const button of nextButtons) button.removeEventListener("click", onNext);
    for (const button of playButtons) button.removeEventListener("click", onToggle);
    buttons.forEach((button, position) =>
      button.removeEventListener("click", stepHandlers[position]),
    );
    stage.innerHTML = originalStage;
    if (originalCount) stage.style.setProperty("--hp-steps-count", originalCount);
    else stage.style.removeProperty("--hp-steps-count");
    if (originalActive) stage.style.setProperty("--hp-steps-active", originalActive);
    else stage.style.removeProperty("--hp-steps-active");
    if (copy) {
      if (originalLive === null) copy.removeAttribute("aria-live");
      else copy.setAttribute("aria-live", originalLive);
    }
  });
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
    let left = 5000;
    let since = 0;
    let timer = 0;
    let inView = false;
    let reduced = reducedMedia.matches;
    let explicitPaused = false;

    const running = () => inView && !reduced && !explicitPaused;

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
      if (!running()) return;
      since = performance.now();
      timer = window.setTimeout(() => {
        timer = 0;
        since = 0;
        index = (index + 1) % cards.length;
        left = 5000;
        syncCards();
        schedule();
      }, left);
    };

    const pick = (raw: number) => {
      index = ((raw % cards.length) + cards.length) % cards.length;
      left = 5000;
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

function setupFaqs(
  categoryRows: readonly string[],
  emptyHtml: string,
  clearHtml: string,
  cleanups: Cleanup[],
): void {
  const normalize = (value: string) => value.toLowerCase().replace(/[\u2018\u2019]/g, "'");

  for (const stack of Array.from(document.querySelectorAll<HTMLElement>(".hp-faq-stack"))) {
    const card = stack.querySelector<HTMLElement>(".hp-faq-card");
    const list = stack.querySelector<HTMLElement>(".hp-faq-rows");
    const tabs = Array.from(stack.querySelectorAll<HTMLButtonElement>(".hp-faq-tab"));
    if (!card || !list || tabs.length === 0) continue;

    const input = stack.querySelector<HTMLInputElement>(".hp-faq-search-input");
    const search = stack.querySelector<HTMLElement>(".hp-faq-search");
    const labels = tabs.map((tab) => (tab.textContent ?? "").trim());
    const isHomeSet =
      labels.join("|") === "Getting started|Creators|Content and results" &&
      categoryRows.length === tabs.length;

    const categoryOf = new Map<HTMLElement, number>();
    if (isHomeSet) {
      const byTriggerId = new Map<string, number>();
      categoryRows.forEach((html, category) => {
        const holder = document.createElement("template");
        holder.innerHTML = html;
        holder.content.querySelectorAll<HTMLElement>(".hp-faq-row").forEach((row) => {
          const trigger = row.querySelector<HTMLElement>(".hp-faq-trigger");
          if (trigger?.id) byTriggerId.set(trigger.id, category);
        });
      });
      list.innerHTML = categoryRows.join("");
      list.querySelectorAll<HTMLElement>(".hp-faq-row").forEach((row) => {
        const trigger = row.querySelector<HTMLElement>(".hp-faq-trigger");
        categoryOf.set(row, trigger?.id ? (byTriggerId.get(trigger.id) ?? 0) : 0);
      });
    }

    let active = tabs.findIndex((tab) => tab.dataset.active === "true");
    if (active < 0) active = 0;

    const panel =
      stack.querySelector<HTMLElement>("#faq-panel") ?? (list.parentElement as HTMLElement | null);
    let empty = card.querySelector<HTMLElement>(".hp-faq-empty");
    if (!empty) {
      const parsed = parseElement(emptyHtml);
      if (parsed) {
        parsed.hidden = true;
        card.insertBefore(parsed, panel ?? list);
        empty = parsed;
      }
    }

    let clear = search?.querySelector<HTMLButtonElement>(".hp-faq-search-clear") ?? null;
    if (!clear && search) {
      const parsed = parseElement(clearHtml);
      if (parsed instanceof HTMLButtonElement) {
        parsed.hidden = true;
        search.appendChild(parsed);
        clear = parsed;
      }
    }

    const status = card.querySelector<HTMLElement>(":scope > .wire-visually-hidden[aria-live]");

    const closeAll = () => {
      for (const trigger of Array.from(
        stack.querySelectorAll<HTMLButtonElement>(".hp-faq-trigger"),
      )) {
        trigger.setAttribute("aria-expanded", "false");
        const answer = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
        answer?.setAttribute("data-open", "false");
        answer?.setAttribute("inert", "");
      }
    };

    const syncTabs = (searching: boolean) => {
      const tablist = tabs[0]?.parentElement;
      if (tablist) tablist.dataset.searching = String(searching);
      tabs.forEach((tab, position) => {
        const isActive = !searching && position === active;
        tab.dataset.active = String(isActive);
        tab.setAttribute("aria-selected", String(isActive));
        if (searching) tab.tabIndex = position === 0 ? 0 : -1;
        else tab.tabIndex = isActive ? 0 : -1;
      });
      if (!panel) return;
      if (searching) {
        panel.removeAttribute("role");
        panel.removeAttribute("aria-labelledby");
        return;
      }
      panel.setAttribute("role", "tabpanel");
      const tab = tabs[active];
      if (tab?.id) panel.setAttribute("aria-labelledby", tab.id);
    };

    const filterRows = () => {
      const raw = input?.value ?? "";
      const tokens = normalize(raw).trim().split(/\s+/).filter(Boolean);
      const searching = tokens.length > 0;
      let visible = 0;
      for (const row of Array.from(list.querySelectorAll<HTMLElement>(".hp-faq-row"))) {
        const category = categoryOf.get(row);
        const inCategory = categoryOf.size === 0 || category === undefined || category === active;
        const text = normalize(row.textContent ?? "");
        const match = searching ? tokens.every((token) => text.includes(token)) : inCategory;
        row.hidden = !match;
        if (match) visible += 1;
      }
      syncTabs(searching);
      if (empty) empty.hidden = !(searching && visible === 0);
      if (clear) clear.hidden = raw.length === 0;
      if (status) {
        status.textContent = searching
          ? `${visible} question${visible === 1 ? "" : "s"} match${visible === 1 ? "es" : ""}`
          : "";
      }
    };

    const selectTab = (position: number, focusTab: boolean) => {
      const next = Math.max(0, Math.min(tabs.length - 1, position));
      if (input && input.value) input.value = "";
      active = next;
      closeAll();
      filterRows();
      if (focusTab) tabs[next]?.focus();
    };

    const onDocumentClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (clear && (target === clear || clear.contains(target))) {
        if (input) {
          input.value = "";
          filterRows();
          input.focus();
        }
        return;
      }
      const tab = target.closest<HTMLButtonElement>(".hp-faq-tab");
      if (!tab || !tabs.includes(tab)) return;
      selectTab(tabs.indexOf(tab), false);
    };

    const onDocumentInput = (event: Event) => {
      if (!input || event.target !== input) return;
      filterRows();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }
      const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (current < 0) return;
      event.preventDefault();
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (current + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = (current - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") next = 0;
      else next = tabs.length - 1;
      selectTab(next, true);
    };

    const tablist = tabs[0]?.parentElement;
    tablist?.addEventListener("keydown", onKeyDown as EventListener);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("input", onDocumentInput);

    filterRows();

    cleanups.push(() => {
      tablist?.removeEventListener("keydown", onKeyDown as EventListener);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("input", onDocumentInput);
    });
  }
}

export function setupBrands(cards: Readonly<Record<string, string>>, cleanups: Cleanup[]): void {
  const reducedMedia = window.matchMedia(REDUCED_QUERY);

  for (const bar of Array.from(document.querySelectorAll<HTMLElement>(".hp-brand-bar"))) {
    const section =
      bar.closest<HTMLElement>(".hp-brands-band") ?? bar.closest<HTMLElement>("section");
    const tabs = Array.from(bar.querySelectorAll<HTMLButtonElement>(".hp-brand-tab"));
    if (!section || tabs.length === 0) continue;
    const stage = section.querySelector<HTMLElement>(".hp-brand-stage");
    const card = stage?.querySelector<HTMLElement>(".hp-brand-card");
    if (!stage || !card) continue;

    const labels = tabs.map(
      (tab) =>
        tab.querySelector<HTMLImageElement>(".hp-brand-tab-mark")?.alt?.trim() ||
        (tab.textContent ?? "").trim(),
    );
    const secondCard = cards[labels.join("|")];
    if (tabs.length > 1 && !secondCard) continue;

    const initialCard = card.innerHTML;
    const shots = Array.from(stage.querySelectorAll<HTMLElement>(".hp-brand-shot"));
    const marks = Array.from(stage.querySelectorAll<HTMLElement>(".hp-brand-media-mark"));
    let selected = 0;
    let shown = 0;
    let left = 6000;
    let since = 0;
    let timer = 0;
    let fadeTimer = 0;
    let inView = false;
    let reduced = reducedMedia.matches;

    const running = () => inView && !reduced;

    const syncMedia = () => {
      shots.forEach((shot, position) => {
        shot.dataset.live = String(position === shown);
      });
      marks.forEach((mark, position) => {
        mark.dataset.live = String(position === shown);
      });
      const tab = tabs[shown];
      if (tab?.id) card.setAttribute("aria-labelledby", tab.id);
    };

    const syncTabs = () => {
      tabs.forEach((tab, position) => {
        const active = position === selected;
        tab.dataset.active = String(active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        const rule = tab.querySelector<HTMLElement>(".hp-brand-tab-rule");
        if (!rule) return;
        rule.replaceChildren();
        if (!active) return;
        const fill = document.createElement("span");
        fill.className = "hp-brand-tab-fill";
        fill.dataset.paused = String(!running());
        fill.style.setProperty("--hp-brand-duration", "6000ms");
        fill.style.setProperty("--hp-brand-count", String(tabs.length));
        fill.style.setProperty("--hp-brand-index", String(position));
        rule.appendChild(fill);
      });
    };

    const syncPaused = () => {
      const fill = tabs[selected]?.querySelector<HTMLElement>(".hp-brand-tab-fill");
      if (fill) fill.dataset.paused = String(!running());
    };

    const showCard = (position: number) => {
      card.dataset.fading = "false";
      card.innerHTML = position === 0 ? initialCard : (secondCard ?? initialCard);
      syncMedia();
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
      syncPaused();
      if (!running() || tabs.length < 2) return;
      since = performance.now();
      timer = window.setTimeout(() => {
        timer = 0;
        since = 0;
        selected = (selected + 1) % tabs.length;
        syncTabs();
        if (reduced) {
          shown = selected;
          showCard(shown);
        } else {
          card.dataset.fading = "true";
          if (fadeTimer) window.clearTimeout(fadeTimer);
          fadeTimer = window.setTimeout(() => {
            shown = selected;
            showCard(shown);
            fadeTimer = 0;
          }, 260);
        }
        left = 6000;
        schedule();
      }, left);
    };

    const select = (raw: number) => {
      const next = ((raw % tabs.length) + tabs.length) % tabs.length;
      if (next === selected) return;
      selected = next;
      syncTabs();
      if (reduced) {
        shown = selected;
        showCard(shown);
      } else {
        card.dataset.fading = "true";
        if (fadeTimer) window.clearTimeout(fadeTimer);
        fadeTimer = window.setTimeout(() => {
          shown = selected;
          showCard(shown);
          fadeTimer = 0;
        }, 260);
      }
      left = 6000;
      since = 0;
      schedule();
    };

    const tabHandlers = tabs.map((_tab, position) => () => select(position));
    tabs.forEach((tab, position) => tab.addEventListener("click", tabHandlers[position]));

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }
      const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (current < 0) return;
      event.preventDefault();
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (current + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = (current - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") next = 0;
      else next = tabs.length - 1;
      select(next);
      tabs[next]?.focus();
    };
    bar.addEventListener("keydown", onKeyDown as EventListener);

    syncTabs();
    syncMedia();

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || entry.isIntersecting === inView) return;
        inView = entry.isIntersecting;
        if (!inView) {
          selected = 0;
          shown = 0;
          if (fadeTimer) {
            window.clearTimeout(fadeTimer);
            fadeTimer = 0;
          }
          card.dataset.fading = "false";
          showCard(0);
          syncTabs();
        }
        schedule();
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    io.observe(section);

    const onReducedChange = () => {
      reduced = reducedMedia.matches;
      if (reduced) {
        if (fadeTimer) window.clearTimeout(fadeTimer);
        fadeTimer = 0;
        shown = selected;
        card.dataset.fading = "false";
        showCard(shown);
      }
      syncTabs();
      schedule();
    };
    reducedMedia.addEventListener("change", onReducedChange);

    cleanups.push(() => {
      if (timer) window.clearTimeout(timer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      io.disconnect();
      reducedMedia.removeEventListener("change", onReducedChange);
      tabs.forEach((tab, position) => tab.removeEventListener("click", tabHandlers[position]));
      bar.removeEventListener("keydown", onKeyDown as EventListener);
      card.dataset.fading = "false";
      card.innerHTML = initialCard;
    });
  }
}

function setupComparison(cleanups: Cleanup[]): void {
  for (const button of Array.from(document.querySelectorAll<HTMLButtonElement>(".hp-table-info"))) {
    const noteId = button.getAttribute("aria-describedby");
    const note = noteId ? document.getElementById(noteId) : null;
    if (!note) continue;
    let hovered = false;
    let focused = false;

    const isOpen = () => button.getAttribute("aria-expanded") === "true";
    const setOpen = (open: boolean) => {
      button.setAttribute("aria-expanded", String(open));
      note.dataset.open = open ? "true" : "false";
    };
    const dismiss = () => {
      note.dataset.dismissed = "true";
    };
    const clearDismiss = () => {
      delete note.dataset.dismissed;
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !isOpen()) return;
      if (note.contains(target) || button.contains(target)) return;
      setOpen(false);
      clearDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isOpen()) {
        setOpen(false);
        dismiss();
      } else if (hovered || focused) {
        dismiss();
      }
    };
    const onClick = () => {
      clearDismiss();
    };
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = (event: MouseEvent) => {
      const related = event.relatedTarget;
      if (related instanceof Node && (button.contains(related) || note.contains(related))) return;
      hovered = false;
      if (!focused) clearDismiss();
    };
    const onFocus = () => {
      focused = true;
    };
    const onBlur = () => {
      focused = false;
      if (!hovered) clearDismiss();
    };

    button.addEventListener("click", onClick);
    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mouseleave", onLeave);
    note.addEventListener("mouseenter", onEnter);
    note.addEventListener("mouseleave", onLeave);
    button.addEventListener("focus", onFocus);
    button.addEventListener("blur", onBlur);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    cleanups.push(() => {
      button.removeEventListener("click", onClick);
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
      note.removeEventListener("mouseenter", onEnter);
      note.removeEventListener("mouseleave", onLeave);
      button.removeEventListener("focus", onFocus);
      button.removeEventListener("blur", onBlur);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  }
}

/** Owner: HomeInfo. Mounts DOM behaviour and returns its cleanup. */
export function useHomeInfo(): (() => void) | void {
  useEffect(() => {
    let cancelled = false;
    const cleanups: Cleanup[] = [];

    void (async () => {
      try {
        const [scenes, faqRows, empty, clear] = await Promise.all([
          Promise.all(STEP_SCENES_GZ.map(expandPayload)),
          Promise.all(FAQ_CATEGORY_ROWS_GZ.map(expandPayload)),
          expandPayload(FAQ_EMPTY_GZ),
          expandPayload(FAQ_CLEAR_GZ),
        ]);
        if (cancelled) return;

        setupSteps(scenes, cleanups);
        setupFaqs(faqRows, empty, clear, cleanups);
        setupTracks(cleanups);
        setupComparison(cleanups);
      } catch (error) {
        // Keep the server-rendered markup usable if a payload cannot be expanded.
        console.warn("HomeInfo: captured content could not be expanded", error);
      }
    })();

    return () => {
      cancelled = true;
      for (let index = cleanups.length - 1; index >= 0; index -= 1) {
        const cleanup = cleanups[index];
        if (cleanup) cleanup();
      }
    };
  }, []);
}
