"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  CONVERSATION_CHIP_KEYS,
  CONVERSATION_FACT_KEYS,
  buildConversationRoutes,
  type ConversationChipAnchor,
  type ConversationFactAnchor,
  type ConversationKey,
} from "../home/conversations";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
}

interface OffsetAnchor {
  readonly left: number;
  readonly right: number;
  readonly centerY: number;
}

function anchor(element: Element, root: DOMRect): OffsetAnchor {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - root.left,
    right: rect.right - root.left,
    centerY: (rect.top + rect.bottom) / 2 - root.top,
  };
}

/**
 * Conversation figure behaviour:
 * - draws the 14 measured `.hp-convo-string` routes (7 retrieval chips into
 *   the agent icon, 7 grounded fact marks back out),
 * - mirrors the source's pointer highlight (`data-active` / `data-lit`),
 * - keeps route geometry in sync with resize and late font loads,
 * - pauses the glowing agent (and the hero campaign's CSS loops) offscreen
 *   through the source's `data-inview` contract.
 */
export function useConversations(): (() => void) | void {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    for (const root of Array.from(
      document.querySelectorAll<HTMLElement>(".hp-convo"),
    )) {
      const svg = root.querySelector<SVGSVGElement>(".hp-convo-strings");
      const gradient = svg?.querySelector<SVGLinearGradientElement>(
        "#hp-convo-spectrum",
      );
      const icon = root.querySelector<HTMLElement>(".hp-convo-app-icon");
      if (!svg || !icon) continue;

      const chipElements = new Map<ConversationKey, HTMLElement>();
      for (const chip of Array.from(
        root.querySelectorAll<HTMLElement>(".hp-convo-chip[data-key]"),
      )) {
        const key = chip.dataset.key as ConversationKey | undefined;
        if (key) chipElements.set(key, chip);
      }

      const factElements = new Map<ConversationKey, HTMLElement>();
      for (const fact of Array.from(
        root.querySelectorAll<HTMLElement>(".hp-convo-fact[data-key]"),
      )) {
        const key = fact.dataset.key as ConversationKey | undefined;
        if (!key || !fact.closest(".hp-convo-bubble")) continue;
        if (!factElements.has(key)) factElements.set(key, fact);
      }

      let active: ConversationKey | null = null;
      let frame = 0;
      let disposed = false;
      let created: SVGGElement[] = [];
      const groupsByKey = new Map<ConversationKey, SVGGElement[]>();
      const listeners: Array<[HTMLElement, () => void, () => void]> = [];

      const applyActive = () => {
        if (active === null) root.removeAttribute("data-active");
        else root.setAttribute("data-active", active);

        for (const [key, element] of chipElements) {
          if (key === active) element.setAttribute("data-lit", "true");
          else element.removeAttribute("data-lit");
        }
        for (const [key, element] of factElements) {
          if (key === active) element.setAttribute("data-lit", "true");
          else element.removeAttribute("data-lit");
        }
        for (const [key, groups] of groupsByKey) {
          for (const group of groups) {
            if (key === active) group.setAttribute("data-lit", "true");
            else group.removeAttribute("data-lit");
          }
        }
      };

      const draw = () => {
        frame = 0;
        const rootRect = root.getBoundingClientRect();

        const chips: ConversationChipAnchor[] = [];
        for (const key of CONVERSATION_CHIP_KEYS) {
          const chip = chipElements.get(key);
          if (!chip) continue;
          const box = anchor(chip, rootRect);
          chips.push({ key, right: box.right, centerY: box.centerY });
        }

        const facts: ConversationFactAnchor[] = [];
        for (const key of CONVERSATION_FACT_KEYS) {
          const fact = factElements.get(key);
          const bubble = fact?.closest(".hp-convo-bubble");
          if (!fact || !bubble) continue;
          const factBox = anchor(fact, rootRect);
          facts.push({
            key,
            bubbleLeft: anchor(bubble, rootRect).left,
            centerY: factBox.centerY,
          });
        }

        const iconBox = anchor(icon, rootRect);
        const { routes, spectrum } = buildConversationRoutes(chips, facts, {
          left: iconBox.left,
          right: iconBox.right,
          centerY: iconBox.centerY,
        });

        svg.setAttribute("width", String(rootRect.width));
        svg.setAttribute("height", String(rootRect.height));
        gradient?.setAttribute("x1", String(spectrum.from));
        gradient?.setAttribute("x2", String(spectrum.to));

        for (const group of created) group.remove();
        created = [];
        groupsByKey.clear();

        for (const route of routes) {
          const group = svgElement("g");
          group.setAttribute("class", "hp-convo-string");

          const path = svgElement("path");
          path.setAttribute("d", route.d);

          const dot = svgElement("circle");
          dot.setAttribute("cx", String(route.node.x));
          dot.setAttribute("cy", String(route.node.y));
          dot.setAttribute("r", "3.5");

          group.append(path, dot);
          svg.append(group);
          created.push(group);

          const list = groupsByKey.get(route.key) ?? [];
          list.push(group);
          groupsByKey.set(route.key, list);
        }

        applyActive();
      };

      const schedule = () => {
        if (disposed || frame) return;
        frame = window.requestAnimationFrame(draw);
      };

      const setActive = (key: ConversationKey | null) => {
        active = key;
        applyActive();
      };

      for (const [key, element] of chipElements) {
        const enter = () => setActive(key);
        const leave = () => setActive(null);
        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointerleave", leave);
        listeners.push([element, enter, leave]);
      }
      for (const [key, element] of factElements) {
        const enter = () => setActive(key);
        const leave = () => setActive(null);
        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointerleave", leave);
        listeners.push([element, enter, leave]);
      }

      // Remove stale client-generated routes before the first pass so an HMR
      // remount cannot stack two sets into the same SVG.
      for (const group of Array.from(
        svg.querySelectorAll("g.hp-convo-string"),
      )) {
        group.remove();
      }

      const observer = new ResizeObserver(schedule);
      observer.observe(root);
      document.fonts.ready.then(schedule);
      window.addEventListener("resize", schedule);
      schedule();

      cleanups.push(() => {
        disposed = true;
        observer.disconnect();
        window.removeEventListener("resize", schedule);
        if (frame) window.cancelAnimationFrame(frame);
        for (const [element, enter, leave] of listeners) {
          element.removeEventListener("pointerenter", enter);
          element.removeEventListener("pointerleave", leave);
        }
        for (const group of created) group.remove();
        created = [];
        groupsByKey.clear();
        root.removeAttribute("data-active");
        for (const element of chipElements.values()) {
          element.removeAttribute("data-lit");
        }
        for (const element of factElements.values()) {
          element.removeAttribute("data-lit");
        }
      });
    }

    // Source OffscreenPause: 200 px margin, `animation-play-state:paused` is
    // applied by source.css. The hero campaign cards also use `hp-camp-*`
    // loops (7.2 s chat, 9 s metric, 6.4 s bars) owned by that CSS contract.
    const paused = Array.from(
      document.querySelectorAll<HTMLElement>(".hp-convo-agent, .hp-camp"),
    );
    if (paused.length > 0) {
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
      for (const element of paused) observer.observe(element);
      cleanups.push(() => observer.disconnect());
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [pathname]);
}
