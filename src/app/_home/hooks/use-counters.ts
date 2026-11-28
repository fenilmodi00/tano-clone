"use client";

import { useEffect } from "react";

const DURATION = 1900;
const TICK = 1600;
const STORAGE_KEY = "tano:hero-counters";

type Counter = {
  label: string;
  value: number;
  format: (n: number) => string;
  chips: HTMLElement[];
};

/**
 * Count-up and live ticker for the hero stat strip (source: CountUp 1900ms +
 * 1600ms ticker). Runs once per tab: the session flag is claimed before the
 * first view, so client-side returns and refreshes leave the values alone.
 */
export function useCounters() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) !== null) return;
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* No usable storage: treat the counters as already seen. */
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const strip = document.querySelector<HTMLElement>(".hp-hero-strip");
    if (!strip) return;

    /* One pass: parse each label's SSR value and collect every marquee copy. */
    const byLabel = new Map<string, Counter>();
    for (const stat of strip.querySelectorAll<HTMLElement>(".hp-hero-stat")) {
      const label = (stat.querySelector(".hp-loop-stat-label")?.textContent || "")
        .trim()
        .toLowerCase();
      const chip = stat.querySelector<HTMLElement>(".hp-loop-stat-chip");
      if (!chip) continue;

      const existing = byLabel.get(label);
      if (existing) {
        existing.chips.push(chip);
        continue;
      }

      const text = (chip.textContent || "").trim();
      const numeric = Number(text.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(numeric)) continue;
      const decimals = (text.split(".")[1] || "").replace(/[^0-9]/g, "").length;
      const prefix = text.match(/^[^0-9]*/)?.[0] || "";
      byLabel.set(label, {
        label,
        value: numeric,
        format: (n) =>
          prefix +
          n.toLocaleString("en-GB", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        chips: [chip],
      });
    }
    if (!byLabel.size) return;

    const counters = Array.from(byLabel.values());

    const paint = (counter: Counter, value: number) => {
      const text = counter.format(value);
      for (const chip of counter.chips) chip.textContent = text;
    };

    let raf = 0;
    let ticker = 0;
    let start: number | null = null;
    let visible = false;

    const startTicker = () => {
      if (ticker) return;
      ticker = window.setInterval(() => {
        if (!visible || document.hidden) return;
        for (const counter of counters) {
          if (!/products|creators|pieces/.test(counter.label)) continue;
          counter.value +=
            counter.label === "products seeded"
              ? 1 + Math.floor(Math.random() * 5)
              : Math.random() < 0.35
                ? 1
                : 0;
          paint(counter, counter.value);
        }
      }, TICK);
    };

    const runCountUp = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      for (const counter of counters) paint(counter, counter.value * eased);
      if (progress < 1) raf = requestAnimationFrame(runCountUp);
      else startTicker();
    };

    let started = false;
    let visibility: IntersectionObserver | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        io.disconnect();
        visible = true;
        /* The trigger is one-shot; this observer only gates ticker updates. */
        visibility = new IntersectionObserver(
          ([entry]) => {
            visible = entry?.isIntersecting === true;
          },
          { threshold: 0, rootMargin: "0px 0px -12% 0px" },
        );
        visibility.observe(strip);
        raf = requestAnimationFrame(runCountUp);
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(strip);

    return () => {
      io.disconnect();
      visibility?.disconnect();
      cancelAnimationFrame(raf);
      window.clearInterval(ticker);
    };
  }, []);
}
