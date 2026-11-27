"use client";

import { useEffect } from "react";

const DURATION = 1900;
const TICK = 1600;

type Stat = { label: string; format: (n: number) => string; value: number };

/** Count-up and live ticker for the hero stat strip (source: CountUp 1900ms + 1600ms ticker). */
export function useCounters() {
  useEffect(() => {
    const strip = document.querySelector(".hp-hero-strip");
    if (!strip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stats = Array.from(strip.querySelectorAll<HTMLElement>(".hp-hero-stat"));
    const seen = new Set<string>();
    const parsed: Stat[] = [];
    for (const stat of stats) {
      const label = (stat.querySelector(".hp-loop-stat-label")?.textContent || "").trim().toLowerCase();
      const chip = stat.querySelector<HTMLElement>(".hp-loop-stat-chip");
      if (!chip || seen.has(label)) continue;
      seen.add(label);
      const text = (chip.textContent || "").trim();
      const numeric = Number(text.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(numeric)) continue;
      const decimals = (text.split(".")[1] || "").replace(/[^0-9]/g, "").length;
      const prefix = text.match(/^[^0-9]*/)?.[0] || "";
      parsed.push({
        label,
        value: numeric,
        format: (n) =>
          prefix +
          n.toLocaleString("en-GB", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
      });
    }
    if (!parsed.length) return;

    const chipsFor = (label: string) =>
      Array.from(strip.querySelectorAll<HTMLElement>(".hp-hero-stat")).filter(
        (stat) => (stat.querySelector(".hp-loop-stat-label")?.textContent || "").trim().toLowerCase() === label,
      ).map((stat) => stat.querySelector<HTMLElement>(".hp-loop-stat-chip")).filter(Boolean) as HTMLElement[];

    let raf = 0;
    let start = 0;
    const runCountUp = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      for (const stat of parsed) {
        for (const chip of chipsFor(stat.label)) chip.textContent = stat.format(stat.value * eased);
      }
      if (p < 1) raf = requestAnimationFrame(runCountUp);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        start = 0;
        raf = requestAnimationFrame(runCountUp);
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(strip);

    const ticker = window.setInterval(() => {
      if (document.hidden) return;
      for (const stat of parsed) {
        if (!/products|creators|pieces/.test(stat.label)) continue;
        stat.value += stat.label === "products seeded" ? 1 + Math.floor(Math.random() * 5) : Math.random() < 0.35 ? 1 : 0;
        for (const chip of chipsFor(stat.label)) chip.textContent = stat.format(stat.value);
      }
    }, TICK);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearInterval(ticker);
    };
  }, []);
}
