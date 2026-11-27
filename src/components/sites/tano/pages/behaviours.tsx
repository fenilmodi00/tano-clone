"use client";

/**
 * DOM behaviours for the non-home page families (owner: PageFamilies).
 *
 * Each worker is idempotent and scoped to markup that the shared runtime does
 * not already own:
 *   - FAQ glyph state + search for stacks without category tabs (guides,
 *     compare). Home FAQ stacks with tabs are owned by HomeInfo/global
 *     interactions; we only mirror the glyph rotation there.
 *   - Page rail scrollspy (privacy, webinars, legal case-study pages).
 *   - Offscreen pause for page-family loops the shared runtime does not mark
 *     (`.hp-hero-glow`, `.hp-ct-row`, `.hp-ccar`).
 *   - For-creators closing films `data-seen`.
 *   - Use-case ad-loop connector path + dots (source AdLoopPath geometry).
 *   - Use-case pitch-deck clock, step/segment state and controls. The stage
 *     scene content is left to HomeInfo's shared `.hp-pp` scenes; only the
 *     states/timer the source drives from JavaScript are reproduced here.
 */

type Cleanup = () => void;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const FAQ_EMPTY_HTML =
  '<p class="hp-faq-empty tano-body-md">No question matches that. <a class="hp-faq-empty-link" href="/talk-to-us">Ask the team</a></p>';
const FAQ_CLEAR_HTML =
  '<button aria-label="Clear the search" class="hp-faq-search-clear" type="button"><svg viewBox="0 0 14 14" width="100%" height="100%" fill="none" aria-hidden="true" focusable="false"><path d="M8 1.5c0-.552285-.44772-1-1-1s-1 .447715-1 1V6H1.5c-.552285 0-1 .44772-1 1s.447715 1 1 1H6v4.5c0 .5523.44772 1 1 1s1-.4477 1-1V8h4.5c.5523 0 1-.44772 1-1s-.4477-1-1-1H8V1.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button>';
const PLAY_GLYPH =
  '<svg viewBox="0 0 14 14" width="100%" height="100%" fill="none" aria-hidden="true" focusable="false"><path d="M3 1.4 12.2 7 3 12.6Z" fill="currentColor"></path></svg>';

function parseElement(html: string): HTMLElement | null {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const first = template.content.firstElementChild;
  return first instanceof HTMLElement ? first : null;
}

/* ------------------------------------------------------------------------- */
/* FAQ                                                                       */
/* ------------------------------------------------------------------------- */

/** Source FAQ glyph is rotated from its own `data-expanded`, not aria state. */
function mountFaqGlyphs(cleanups: Cleanup[]): void {
  const triggers = () =>
    Array.from(document.querySelectorAll<HTMLButtonElement>(".hp-faq-trigger"));

  const sync = () => {
    for (const trigger of triggers()) {
      const glyph = trigger.querySelector<HTMLElement>(".hp-faq-glyph");
      if (!glyph) continue;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      if (glyph.getAttribute("data-expanded") !== String(expanded)) {
        glyph.setAttribute("data-expanded", String(expanded));
      }
    }
  };

  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-expanded", "data-open"],
  });
  cleanups.push(() => observer.disconnect());
}

/**
 * Guide/compare FAQ has no category tabs, so HomeInfo's tab-aware search
 * skips it and the global interaction only hides rows by raw substring.
 * This ports the source filter (tokens ANDed across question + answer), the
 * clear button, the empty state and the live-region wording.
 */
function mountFaqSearch(cleanups: Cleanup[]): void {
  const normalize = (value: string) => value.toLowerCase().replace(/[\u2018\u2019]/g, "'");

  for (const stack of Array.from(document.querySelectorAll<HTMLElement>(".hp-faq-stack"))) {
    if (stack.querySelector(".hp-faq-tab")) continue;
    const card = stack.querySelector<HTMLElement>(".hp-faq-card");
    const list = stack.querySelector<HTMLElement>(".hp-faq-rows");
    const input = stack.querySelector<HTMLInputElement>(".hp-faq-search-input");
    const search = stack.querySelector<HTMLElement>(".hp-faq-search");
    if (!card || !list || !input || !search) continue;

    const panel = list.parentElement;
    const status = card.querySelector<HTMLElement>(":scope > .wire-visually-hidden[aria-live]");

    let empty = card.querySelector<HTMLElement>(".hp-faq-empty");
    if (!empty) {
      empty = parseElement(FAQ_EMPTY_HTML);
      if (empty) {
        empty.hidden = true;
        card.insertBefore(empty, panel ?? list);
      }
    }

    let clear = search.querySelector<HTMLButtonElement>(".hp-faq-search-clear");
    if (!clear) {
      const parsed = parseElement(FAQ_CLEAR_HTML);
      if (parsed instanceof HTMLButtonElement) {
        parsed.hidden = true;
        search.appendChild(parsed);
        clear = parsed;
      }
    }

    const filter = () => {
      const raw = input.value;
      const tokens = normalize(raw).trim().split(/\s+/).filter(Boolean);
      const searching = tokens.length > 0;
      let visible = 0;
      for (const row of Array.from(list.querySelectorAll<HTMLElement>(".hp-faq-row"))) {
        const text = normalize(row.textContent ?? "");
        const match = !searching || tokens.every((token) => text.includes(token));
        row.hidden = !match;
        if (match) visible += 1;
      }
      if (empty) empty.hidden = !(searching && visible === 0);
      if (clear) clear.hidden = raw.length === 0;
      if (status) {
        status.textContent = searching
          ? `${visible} question${visible === 1 ? " matches" : "s match"}`
          : "";
      }
    };

    const onInput = (event: Event) => {
      if (event.target !== input) return;
      // Run after the shared document handler so the source wording wins.
      window.setTimeout(filter, 0);
    };
    const onClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!clear || !(target === clear || clear.contains(target))) return;
      input.value = "";
      filter();
      input.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !input.value) return;
      event.preventDefault();
      input.value = "";
      filter();
    };

    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    filter();

    cleanups.push(() => {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    });
  }
}

/* ------------------------------------------------------------------------- */
/* Page rail                                                                 */
/* ------------------------------------------------------------------------- */

/** Source PageRail: the active section is the last one above innerHeight/3. */
function mountRails(cleanups: Cleanup[]): void {
  for (const rail of Array.from(document.querySelectorAll<HTMLElement>(".wire-rail"))) {
    const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>(".wire-rail-link"));
    if (links.length === 0) continue;
    const sections = links
      .map((link) => {
        const id = (link.getAttribute("href") ?? "").replace(/^#/, "");
        return document.getElementById(id);
      })
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) continue;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let active = sections[0]?.id ?? "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section.id;
      }
      for (const link of links) {
        const current = (link.getAttribute("href") ?? "") === `#${active}`;
        link.setAttribute("aria-current", String(current));
      }
    };
    const request = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    cleanups.push(() => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    });
  }
}

/* ------------------------------------------------------------------------- */
/* Offscreen pause + creator closing films                                   */
/* ------------------------------------------------------------------------- */

const OFFSCREEN_TARGETS = ".hp-hero-glow, .hp-ct-row, .hp-ccar, .hp-scale-window, .hp-convo-agent";

/** Source OffscreenPause: rootMargin 200px, sets data-inview true/false. */
function mountOffscreenPause(cleanups: Cleanup[]): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(OFFSCREEN_TARGETS));
  if (targets.length === 0) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).setAttribute(
          "data-inview",
          entry.isIntersecting ? "true" : "false",
        );
      }
    },
    { rootMargin: "200px 0px" },
  );
  for (const target of targets) observer.observe(target);
  cleanups.push(() => observer.disconnect());
}

/** For-creators closing films fade in once their play zone arrives. */
function mountCreatorFilms(cleanups: Cleanup[]): void {
  for (const films of Array.from(document.querySelectorAll<HTMLElement>(".hp-cl-films"))) {
    if (films.hasAttribute("data-seen")) continue;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        films.setAttribute("data-seen", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0.05 },
    );
    observer.observe(films);
    cleanups.push(() => observer.disconnect());
  }
}

/* ------------------------------------------------------------------------- */
/* Ad-loop connector                                                         */
/* ------------------------------------------------------------------------- */

type Point = [number, number];

function offsetRect(element: HTMLElement, root: HTMLElement): DOMRect {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== root) {
    left += node.offsetLeft;
    top += node.offsetTop;
    const parent: Element | null = node.offsetParent;
    node = parent instanceof HTMLElement ? parent : null;
  }
  return new DOMRect(left, top, element.offsetWidth, element.offsetHeight);
}

/** Port of the source AdLoopPath geometry: orthogonals with 14px rounded corners. */
function adLoopGeometry(loop: HTMLElement): { d: string; length: number; width: number; height: number } | null {
  const figures = Array.from(loop.querySelectorAll<HTMLElement>(".hp-adloop-figure-wrap")).map(
    (element) => offsetRect(element, loop),
  );
  const back = loop.querySelector<HTMLElement>(".hp-adloop-back");
  if (figures.length < 2 || !back) return null;
  const first = figures[0];
  const last = figures[figures.length - 1];
  const backRect = offsetRect(back, loop);
  const center = (rect: DOMRect): Point => [rect.left + rect.width / 2, rect.top + rect.height / 2];

  let points: Point[];
  if (Math.abs((first.top ?? 0) - last.top) < 24) {
    const right = last.right + 18;
    const bottom = backRect.bottom + 40;
    const left = first.left - 18;
    const [, centreY] = center(last);
    const [firstX, firstY] = center(first);
    points = [
      ...figures.map(center),
      [right, centreY],
      [right, bottom],
      [left, bottom],
      [left, firstY],
      [firstX, firstY],
    ];
  } else {
    const right = Math.max(...figures.map((rect) => rect.right)) + 12;
    const chain: Point[] = [];
    figures.forEach((rect, index) => {
      const [x, y] = center(rect);
      chain.push([x, y]);
      if (index === figures.length - 1) return;
      const next = center(figures[index + 1] ?? rect);
      chain.push([right, y], [right, next[1]]);
    });
    const [lastX, lastY] = center(last);
    const [firstX, firstY] = center(first);
    points = [...chain.slice(0, -1), [lastX, lastY], [right, lastY], [right, firstY], [firstX, firstY]];
  }

  let length = 0;
  const commands: string[] = [];
  points.forEach(([x, y], index) => {
    const previous = points[index - 1] ?? [x, y];
    const next = points[index + 1];
    length += Math.hypot(x - previous[0], y - previous[1]);
    if (index === 0) {
      commands.push(`M${x.toFixed(1)} ${y.toFixed(1)}`);
      return;
    }
    if (!next) {
      commands.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
      return;
    }
    const incoming = Math.hypot(x - previous[0], y - previous[1]);
    const outgoing = Math.hypot(next[0] - x, next[1] - y);
    const radius = Math.min(14, incoming / 2, outgoing / 2);
    const beforeX = x - ((x - previous[0]) / (incoming || 1)) * radius;
    const beforeY = y - ((y - previous[1]) / (incoming || 1)) * radius;
    const afterX = x + ((next[0] - x) / (outgoing || 1)) * radius;
    const afterY = y + ((next[1] - y) / (outgoing || 1)) * radius;
    commands.push(
      `L${beforeX.toFixed(1)} ${beforeY.toFixed(1)}`,
      `Q${x.toFixed(1)} ${y.toFixed(1)} ${afterX.toFixed(1)} ${afterY.toFixed(1)}`,
    );
  });

  return {
    d: commands.join(" "),
    length,
    width: loop.offsetWidth,
    height: loop.offsetHeight,
  };
}

function mountAdLoops(cleanups: Cleanup[]): void {
  const reduced = window.matchMedia(REDUCED_QUERY);

  for (const loop of Array.from(document.querySelectorAll<HTMLElement>(".hp-adloop"))) {
    if (loop.querySelector(".hp-adloop-path")) continue;
    let svg: SVGSVGElement | null = null;
    let playObserver: IntersectionObserver | null = null;

    const build = () => {
      const geometry = adLoopGeometry(loop);
      if (!geometry) return;
      if (svg) {
        svg.remove();
        svg = null;
      }
      const ns = "http://www.w3.org/2000/svg";
      const next = document.createElementNS(ns, "svg") as SVGSVGElement;
      next.setAttribute("aria-hidden", "true");
      next.setAttribute("class", "hp-adloop-path");
      next.setAttribute("width", String(geometry.width));
      next.setAttribute("height", String(geometry.height));
      next.setAttribute("viewBox", `0 0 ${geometry.width} ${geometry.height}`);
      const id = `page-family-adloop-${Math.random().toString(36).slice(2, 9)}`;
      const path = document.createElementNS(ns, "path");
      path.setAttribute("class", "hp-adloop-string");
      path.setAttribute("d", geometry.d);
      path.setAttribute("id", id);
      next.append(path);
      if (!reduced.matches) {
        const count = Math.max(4, Math.round(geometry.length / 150));
        const duration = geometry.length / 72;
        for (let index = 0; index < count; index += 1) {
          const dot = document.createElementNS(ns, "circle");
          dot.setAttribute("class", "hp-adloop-dot");
          dot.setAttribute("r", "3");
          const motion = document.createElementNS(ns, "animateMotion");
          motion.setAttribute("begin", `${(-(index * duration) / count).toFixed(2)}s`);
          motion.setAttribute("dur", `${duration.toFixed(2)}s`);
          motion.setAttribute("repeatCount", "indefinite");
          const mpath = document.createElementNS(ns, "mpath");
          mpath.setAttribute("href", `#${id}`);
          motion.append(mpath);
          dot.append(motion);
          next.append(dot);
        }
      }
      loop.prepend(next);
      svg = next;

      playObserver?.disconnect();
      playObserver = new IntersectionObserver(
        ([entry]) => {
          if (!svg) return;
          if (entry?.isIntersecting && !reduced.matches) svg.unpauseAnimations();
          else svg.pauseAnimations();
        },
        { rootMargin: "0px 0px -40% 0px", threshold: 0 },
      );
      playObserver.observe(loop);
    };

    build();
    const resize = new ResizeObserver(build);
    resize.observe(loop);
    const onReduced = () => build();
    reduced.addEventListener("change", onReduced);

    cleanups.push(() => {
      resize.disconnect();
      playObserver?.disconnect();
      reduced.removeEventListener("change", onReduced);
      svg?.remove();
    });
  }
}

/* ------------------------------------------------------------------------- */
/* Use-case pitch deck                                                       */
/* ------------------------------------------------------------------------- */

function setupPitchDeck(root: HTMLElement, cleanups: Cleanup[]): void {
  const segButtons = Array.from(root.querySelectorAll<HTMLButtonElement>(".hp-steps-seg-button"));
  const slides = Array.from(root.querySelectorAll<HTMLElement>(".hp-pp-slide"));
  const stage = root.querySelector<HTMLElement>(".hp-pp-stage");
  const copy = root.querySelector<HTMLElement>(".hp-pp-copy");
  if (segButtons.length === 0 || slides.length === 0 || !stage) return;

  const durations = segButtons.map((button) => {
    const fill = button.querySelector<HTMLElement>(".hp-steps-seg-fill");
    const value = Number.parseFloat(fill?.style.getPropertyValue("--hp-steps-duration") ?? "");
    return Number.isFinite(value) && value > 0 ? value : 11600;
  });
  const playButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-control="play"]'));
  const previousButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-direction="previous"]'));
  const nextButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-direction="next"]'));
  const pauseGlyphs = new Map<HTMLButtonElement, string>();
  for (const button of playButtons) pauseGlyphs.set(button, button.querySelector("span")?.innerHTML ?? "");

  const reducedMedia = window.matchMedia(REDUCED_QUERY);
  let index = Math.max(
    0,
    segButtons.findIndex((button) => button.getAttribute("aria-current") === "step"),
  );
  let left = durations[index] ?? 11600;
  let since = 0;
  let timer = 0;
  let inView = false;
  let explicitPaused = false;
  let reduced = reducedMedia.matches;
  let touched = false;
  let restart = false;

  const running = () => inView && !reduced && !explicitPaused;

  const syncPlay = () => {
    const playing = !explicitPaused && !reduced;
    for (const button of playButtons) {
      button.setAttribute("aria-label", playing ? "Pause" : "Play");
      const span = button.querySelector("span");
      if (span) span.innerHTML = playing ? pauseGlyphs.get(button) ?? "" : PLAY_GLYPH;
    }
  };

  const syncFills = () => {
    segButtons.forEach((button, position) => {
      const fill = button.querySelector<HTMLElement>(".hp-steps-seg-fill");
      if (!fill) return;
      fill.dataset.paused = String(!running());
      fill.style.setProperty("--hp-steps-index", String(position));
      fill.style.setProperty("--hp-steps-duration", `${durations[position] ?? 0}ms`);
    });
    if (restart) {
      restart = false;
      const rule = segButtons[index]?.querySelector<HTMLElement>(".hp-steps-seg-rule");
      const fill = rule?.querySelector<HTMLElement>(".hp-steps-seg-fill");
      if (rule && fill) {
        const replacement = fill.cloneNode(true) as HTMLElement;
        replacement.dataset.paused = String(!running());
        replacement.style.setProperty("--hp-steps-index", String(index));
        replacement.style.setProperty("--hp-steps-duration", `${durations[index] ?? 0}ms`);
        fill.remove();
        rule.append(replacement);
      }
    }
  };

  const sync = () => {
    segButtons.forEach((button, position) => {
      const live = position === index;
      const segment = button.closest(".hp-steps-seg");
      if (live) segment?.setAttribute("data-live", "true");
      else segment?.removeAttribute("data-live");
      if (live) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.dataset.state = position < index ? "done" : live ? "live" : "idle";
    });
    slides.forEach((slide, position) => {
      const live = position === index;
      slide.dataset.live = String(live);
      if (live) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
    });
    stage.style.setProperty("--hp-steps-active", String(index));
    // The scene's CSS animations are gated on [data-running]; without it the
    // process demo looks frozen. Keep it in lockstep with the deck clock.
    for (const scene of Array.from(root.querySelectorAll<HTMLElement>(".hp-pp-scene"))) {
      if (running()) scene.setAttribute("data-running", "true");
      else scene.removeAttribute("data-running");
    }
    if (copy) copy.setAttribute("aria-live", touched ? "polite" : "off");
    syncFills();
    syncPlay();
  };

  const schedule = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
    if (since) {
      left = Math.max(0, left - (performance.now() - since));
      since = 0;
    }
    if (!running()) return;
    since = performance.now();
    timer = window.setTimeout(() => {
      timer = 0;
      since = 0;
      index = (index + 1) % segButtons.length;
      left = durations[index] ?? 11600;
      restart = true;
      sync();
      schedule();
    }, left);
  };

  const pick = (raw: number, direction?: number) => {
    const size = segButtons.length;
    const next = ((raw % size) + size) % size;
    touched = true;
    stage.setAttribute("data-direction", String(direction ?? (next < index ? -1 : 1)));
    index = next;
    left = durations[index] ?? 11600;
    since = 0;
    restart = true;
    sync();
    schedule();
  };

  const onPlay = () => {
    explicitPaused = !explicitPaused;
    syncPlay();
    schedule();
  };

  const listeners: Array<() => void> = [];
  previousButtons.forEach((button) => {
    const handler = () => pick(index - 1, -1);
    button.addEventListener("click", handler);
    listeners.push(() => button.removeEventListener("click", handler));
  });
  nextButtons.forEach((button) => {
    const handler = () => pick(index + 1, 1);
    button.addEventListener("click", handler);
    listeners.push(() => button.removeEventListener("click", handler));
  });
  playButtons.forEach((button) => {
    button.addEventListener("click", onPlay);
    listeners.push(() => button.removeEventListener("click", onPlay));
  });
  segButtons.forEach((button, position) => {
    const handler = () => pick(position);
    button.addEventListener("click", handler);
    listeners.push(() => button.removeEventListener("click", handler));
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      const next = entry?.isIntersecting === true;
      if (next === inView) return;
      inView = next;
      if (inView && !touched && !reduced) {
        index = 0;
        left = durations[0] ?? 11600;
        restart = true;
      }
      sync();
      schedule();
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0 },
  );
  observer.observe(stage);

  const onReduced = () => {
    reduced = reducedMedia.matches;
    if (reduced) {
      if (timer) window.clearTimeout(timer);
      timer = 0;
      restart = true;
    }
    sync();
    schedule();
  };
  reducedMedia.addEventListener("change", onReduced);

  sync();
  schedule();

  cleanups.push(() => {
    if (timer) window.clearTimeout(timer);
    observer.disconnect();
    reducedMedia.removeEventListener("change", onReduced);
    for (const remove of listeners) remove();
  });
}

function mountPitchDecks(cleanups: Cleanup[]): void {
  const homeTitle = document.getElementById("loop-title");
  const homeRoot = homeTitle?.closest("section")?.querySelector<HTMLElement>(".hp-pp") ?? null;
  for (const root of Array.from(document.querySelectorAll<HTMLElement>(".hp-pp"))) {
    if (root === homeRoot) continue;
    setupPitchDeck(root, cleanups);
  }
}

/* ------------------------------------------------------------------------- */
/* Mount                                                                     */
/* ------------------------------------------------------------------------- */

export function mountPageFamilies(): Cleanup {
  const cleanups: Cleanup[] = [];

  mountFaqGlyphs(cleanups);
  mountFaqSearch(cleanups);
  mountRails(cleanups);
  mountOffscreenPause(cleanups);
  mountCreatorFilms(cleanups);
  mountAdLoops(cleanups);
  mountPitchDecks(cleanups);

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
