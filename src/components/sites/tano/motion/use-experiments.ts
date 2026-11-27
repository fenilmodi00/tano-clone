"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  EXPERIMENT_BAR_MAX,
  EXPERIMENT_JITTER_MS,
  EXPERIMENT_ROUND_MS,
  EXPERIMENT_ROUNDS,
  buildExperimentWires,
  experimentCac,
  experimentCacSeries,
  experimentRate,
  type ExperimentBox,
  type ExperimentWires,
} from "../home/experiments";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
}

function offsetBox(root: HTMLElement, element: HTMLElement): ExperimentBox {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== root) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { left, top, width: element.offsetWidth, height: element.offsetHeight };
}

/** Replace the text node that follows a source-rendered visually-hidden label. */
function setTrailingText(element: Element, text: string): void {
  const last = element.lastChild;
  if (last?.nodeType === Node.TEXT_NODE) {
    last.textContent = text;
  } else {
    element.appendChild(document.createTextNode(text));
  }
}

/**
 * `.hp-xl` experiment loop:
 * - advances the six authored rounds every 4200 ms,
 * - re-jitters the displayed conversion rates and CAC every 1000 ms,
 * - resets the round when the play zone leaves and pauses when offscreen,
 * - leaves everything on round 0 under `prefers-reduced-motion`,
 * - draws/updates the 10 measured `.hp-xl-string` wires and 12
 *   `.hp-xl-loop-dot` SMIL travellers.
 */
export function useExperiments(): (() => void) | void {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    for (const root of Array.from(
      document.querySelectorAll<HTMLElement>(".hp-xl"),
    )) {
      const svg = root.querySelector<SVGSVGElement>(".hp-xl-wires");
      const gradient =
        svg?.querySelector<SVGLinearGradientElement>("linearGradient");
      const setup = root.querySelector<HTMLElement>(
        '.hp-xl-card[data-col="setup"]',
      );
      const proven = root.querySelector<HTMLElement>(".hp-xl-proven");
      const cacFigure = root.querySelector<HTMLElement>(".hp-xl-cac");
      const cacValue = root.querySelector<HTMLElement>(".hp-xl-cac-value");
      const cacPath = root.querySelector<SVGPathElement>(
        ".hp-xl-cac-line path",
      );
      const cacDot = root.querySelector<SVGCircleElement>(
        ".hp-xl-cac-line circle",
      );
      const runners = Array.from(
        root.querySelectorAll<HTMLElement>(".hp-xl-runner"),
      );
      const chips = Array.from(
        root.querySelectorAll<HTMLElement>(".hp-xl-chip"),
      );
      if (
        !svg ||
        !setup ||
        !proven ||
        !cacFigure ||
        !cacValue ||
        !cacPath ||
        !cacDot ||
        runners.length === 0 ||
        chips.length === 0
      ) {
        continue;
      }

      const gradientId = gradient?.id || "hp-xl-spectrum";
      const rowSlots = runners.map((runner) => ({
        runner,
        fields: Array.from(runner.children).filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement &&
            child.classList.contains("tano-body-sm"),
        ),
        rate: runner.querySelector<HTMLElement>(".hp-xl-rate"),
        bar: runner.querySelector<HTMLElement>(".hp-xl-bar"),
        fill: runner.querySelector<HTMLElement>(".hp-xl-bar > span"),
      }));
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let reduced = reducedMotion.matches;
      let round = 0;
      let tick = 0;
      let inView = false;
      let announced = false;
      let running = false;
      let disposed = false;
      let roundTimer = 0;
      let tickTimer = 0;
      let frame = 0;
      const wirePaths = new Map<string, SVGPathElement>();
      const wireDots = new Map<
        string,
        { circle: SVGCircleElement; motion: SVGElement }
      >();

      // Remove client-generated nodes from a prior instance so HMR cannot
      // duplicate the 10 wires or 12 dots.
      for (const node of Array.from(
        svg.querySelectorAll("path.hp-xl-string, circle.hp-xl-loop-dot"),
      )) {
        node.remove();
      }

      const createDot = (
        id: string,
        radius: number,
        begin: string,
        duration: string,
        path: string,
        lead: string | null,
      ) => {
        const circle = svgElement("circle");
        circle.setAttribute("class", "hp-xl-loop-dot");
        if (lead !== null) circle.setAttribute("data-lead", lead);
        circle.setAttribute("r", String(radius));

        const motion = svgElement("animateMotion");
        motion.setAttribute("begin", begin);
        motion.setAttribute("dur", duration);
        motion.setAttribute("path", path);
        motion.setAttribute("repeatCount", "indefinite");

        circle.append(motion);
        svg.append(circle);
        wireDots.set(id, { circle, motion });
      };

      const syncDots = (next: ExperimentWires) => {
        if (reduced) {
          for (const { circle } of wireDots.values()) circle.remove();
          wireDots.clear();
          return;
        }

        next.strings.forEach((spec, index) => {
          const id = `dot-${spec.id}`;
          let dot = wireDots.get(id);
          if (!dot) {
            createDot(
              id,
              2.5,
              `${(-(3.2 * index) / 4) % 3.2}s`,
              "3.2s",
              spec.d,
              spec.lead ? "true" : null,
            );
            dot = wireDots.get(id);
          }
          dot?.motion.setAttribute("path", spec.d);
        });

        for (let index = 0; index < 3; index += 1) {
          const id = `home-${index}`;
          let dot = wireDots.get(id);
          if (!dot) {
            createDot(
              id,
              3,
              `${(6 * index) / 3 - 6}s`,
              "6s",
              next.loop,
              "",
            );
            dot = wireDots.get(id);
          }
          dot?.motion.setAttribute("path", next.loop);
        }
      };

      const pauseWires = () => {
        if (running) svg.unpauseAnimations();
        else svg.pauseAnimations();
      };

      const syncWires = () => {
        const pickedChip = root.querySelector<HTMLElement>(
          ".hp-xl-chip[data-picked]",
        );
        if (!pickedChip) return;

        const next = buildExperimentWires({
          width: root.offsetWidth,
          height: root.offsetHeight,
          pickedChip: offsetBox(root, pickedChip),
          provenGroup: offsetBox(root, proven),
          setupCard: offsetBox(root, setup),
          cac: offsetBox(root, cacFigure),
          runners: runners.map((runner) => offsetBox(root, runner)),
        });
        svg.setAttribute("width", String(next.width));
        svg.setAttribute("height", String(next.height));
        if (gradient) {
          gradient.setAttribute("x1", "0");
          gradient.setAttribute("x2", String(next.width));
        }

        for (const spec of [
          ...next.strings.filter((path) => !path.lead),
          ...next.strings.filter((path) => path.lead),
        ]) {
          let path = wirePaths.get(spec.id);
          if (!path) {
            path = svgElement("path");
            path.setAttribute("class", "hp-xl-string");
            svg.append(path);
            wirePaths.set(spec.id, path);
          }
          path.setAttribute("d", spec.d);
          if (spec.lead) {
            path.setAttribute("data-lead", "true");
            path.style.stroke = `url(#${gradientId})`;
          } else {
            path.removeAttribute("data-lead");
            path.style.removeProperty("stroke");
          }
        }

        let loop = wirePaths.get("loop");
        if (!loop) {
          loop = svgElement("path");
          loop.setAttribute("class", "hp-xl-string");
          svg.append(loop);
          wirePaths.set("loop", loop);
        }
        loop.setAttribute("d", next.loop);

        syncDots(next);
        pauseWires();
      };

      const scheduleWires = () => {
        if (disposed || frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          if (!disposed) syncWires();
        });
      };

      const setPersona = (persona: number) => {
        chips.forEach((chip, index) => {
          const picked = index === persona;
          if (picked) chip.setAttribute("data-picked", "true");
          else chip.removeAttribute("data-picked");

          const label = chip.querySelector<HTMLElement>(
            ":scope > .wire-visually-hidden",
          );
          if (label?.textContent?.includes("Trying this round:")) {
            label.remove();
          }
          if (picked) {
            const next = document.createElement("span");
            next.className = "wire-visually-hidden";
            next.textContent = "Trying this round: ";
            chip.insertBefore(next, chip.firstChild);
          }
        });
      };

      const renderRows = (data: (typeof EXPERIMENT_ROUNDS)[number]) => {
        rowSlots.forEach((slot, rowIndex) => {
          const row = data.rows[rowIndex];
          if (!row) return;
          if (slot.fields[0]) setTrailingText(slot.fields[0], row.message);
          if (slot.fields[1]) setTrailingText(slot.fields[1], row.incentive);
          if (slot.fields[2]) setTrailingText(slot.fields[2], row.content);

          const lead = rowIndex === 0;
          if (lead) {
            slot.runner.setAttribute("data-lead", "true");
            slot.bar?.setAttribute("data-lead", "true");
          } else {
            slot.runner.removeAttribute("data-lead");
            slot.bar?.removeAttribute("data-lead");
          }
        });
      };

      const renderNumbers = (data: (typeof EXPERIMENT_ROUNDS)[number]) => {
        rowSlots.forEach((slot, rowIndex) => {
          const row = data.rows[rowIndex];
          if (!row) return;
          const rate = experimentRate(row.rate, tick, rowIndex, reduced);
          if (slot.rate) setTrailingText(slot.rate, `${rate.toFixed(1)}%`);
          if (slot.fill) {
            slot.fill.style.transform = `scaleX(${Math.min(rate / EXPERIMENT_BAR_MAX, 1)})`;
          }
        });

        const cac = experimentCac(data.cac, tick, reduced);
        cacValue.textContent = `£${cac.toFixed(2)}`;
      };

      const renderChart = () => {
        const series = experimentCacSeries(reduced ? 0 : round);
        cacPath.setAttribute("d", series.path);
        cacDot.setAttribute("cx", String(series.cx));
        cacDot.setAttribute("cy", String(series.cy));
      };

      const render = () => {
        const index = (reduced ? 0 : round) % EXPERIMENT_ROUNDS.length;
        const data = EXPERIMENT_ROUNDS[index];
        if (!data) return;

        setPersona(data.persona);
        renderRows(data);
        renderNumbers(data);
        renderChart();
        syncWires();
      };


      const clearTimers = () => {
        if (roundTimer) {
          window.clearTimeout(roundTimer);
          roundTimer = 0;
        }
        if (tickTimer) {
          window.clearInterval(tickTimer);
          tickTimer = 0;
        }
      };

      const startTimers = () => {
        clearTimers();
        roundTimer = window.setTimeout(() => {
          tick = 0;
          round = (round + 1) % EXPERIMENT_ROUNDS.length;
          render();
          startTimers();
        }, EXPERIMENT_ROUND_MS);
        tickTimer = window.setInterval(() => {
          tick += 1;
          const index = (reduced ? 0 : round) % EXPERIMENT_ROUNDS.length;
          const data = EXPERIMENT_ROUNDS[index];
          if (data) renderNumbers(data);
        }, EXPERIMENT_JITTER_MS);
      };

      const applyRunning = () => {
        const next = inView && !reduced;
        if (next === running) {
          pauseWires();
          return;
        }
        running = next;
        if (running) startTimers();
        else clearTimers();
        pauseWires();
      };

      const resetZone = () => {
        round = 0;
        tick = 0;
        render();
      };

      let inside = false;
      let ratio75 = false;
      const arriveObserver = new IntersectionObserver(
        ([entry]) => {
          inside = entry?.isIntersecting === true;
          const next = inside || ratio75;
          if (next && !announced) announced = true;
          inView = next;
          applyRunning();
        },
        { rootMargin: "0px 0px -40% 0px", threshold: 0 },
      );
      const ratioObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (!entry.isIntersecting && announced) {
            announced = false;
            resetZone();
          }
          ratio75 = entry.intersectionRatio >= 0.75;
          inView = inside || ratio75;
          applyRunning();
        },
        { threshold: [0, 0.75] },
      );

      const onMotionChange = () => {
        reduced = reducedMotion.matches;
        render();
        applyRunning();
      };
      reducedMotion.addEventListener("change", onMotionChange);

      const resizeObserver = new ResizeObserver(scheduleWires);
      resizeObserver.observe(root);
      document.fonts.ready.then(scheduleWires);
      window.addEventListener("resize", scheduleWires);

      arriveObserver.observe(root);
      ratioObserver.observe(root);
      render();

      cleanups.push(() => {
        disposed = true;
        clearTimers();
        if (frame) window.cancelAnimationFrame(frame);
        arriveObserver.disconnect();
        ratioObserver.disconnect();
        resizeObserver.disconnect();
        reducedMotion.removeEventListener("change", onMotionChange);
        window.removeEventListener("resize", scheduleWires);
        for (const path of wirePaths.values()) path.remove();
        for (const { circle } of wireDots.values()) circle.remove();
        wirePaths.clear();
        wireDots.clear();
        svg.unpauseAnimations();
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [pathname]);
}
