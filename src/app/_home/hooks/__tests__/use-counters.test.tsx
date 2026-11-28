import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCounters } from "../use-counters";

const STORAGE_KEY = "tano:hero-counters";
const COPIES = 3;

type StatPair = readonly [value: string, label: string];

/** The SSR strip: three marquee copies of the same labelled values. */
const STATS: readonly StatPair[] = [
  ["£14.50", "median CAC"],
  ["70,023", "products seeded"],
  ["17,340", "content-active creators"],
];

const INITIAL = Array.from({ length: COPIES }, () => STATS.map(([value]) => value)).flat();
const ZEROED = Array.from({ length: COPIES }, () => ["£0.00", "0", "0"]).flat();

let storage: Storage;
let reducedMotion: boolean;
let callbacks: IntersectionObserverCallback[];
let observers: FakeIntersectionObserver[];
let frames: { id: number; callback: FrameRequestCallback }[];
let nextFrameId: number;
let rafCalls: number;

class FakeIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  readonly callback: IntersectionObserverCallback;
  disconnects = 0;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    callbacks.push(callback);
    observers.push(this);
  }

  observe() {}

  unobserve() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  disconnect() {
    this.disconnects += 1;
  }
}

function createStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, String(value));
    },
  } as unknown as Storage;
}

function mountStrip() {
  const stat = ([value, label]: StatPair) =>
    `<span class="hp-hero-stat">` +
    `<span class="hp-loop-stat-chip hp-hero-stat-chip tano-body-xs">${value}</span>` +
    `<span class="hp-loop-stat-label tano-body-mono-xs">${label}</span>` +
    `</span>`;
  const run = `<div class="hp-hero-strip-run">${STATS.map((pair) => stat(pair)).join("")}</div>`;
  document.body.innerHTML = `<div class="hp-hero-strip" role="group">${run.repeat(COPIES)}</div>`;
}

function chipTexts(): string[] {
  return Array.from(document.querySelectorAll(".hp-loop-stat-chip")).map(
    (chip) => chip.textContent ?? "",
  );
}

function intersect(isIntersecting: boolean) {
  const callback = callbacks[0];
  const observer = observers[0];
  if (!callback || !observer) throw new Error("useCounters did not observe the strip");
  act(() => {
    callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );
  });
}

function runFrame(time: number) {
  const pending = frames;
  frames = [];
  act(() => {
    for (const frame of pending) frame.callback(time);
  });
}

beforeEach(() => {
  storage = createStorage();
  reducedMotion = false;
  callbacks = [];
  observers = [];
  frames = [];
  nextFrameId = 0;
  rafCalls = 0;

  vi.useFakeTimers();
  vi.stubGlobal("sessionStorage", storage);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    rafCalls += 1;
    nextFrameId += 1;
    frames.push({ id: nextFrameId, callback });
    return nextFrameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames = frames.filter((frame) => frame.id !== id);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("useCounters", () => {
  it("leaves the rendered values alone when the session flag is already set", () => {
    mountStrip();
    storage.setItem(STORAGE_KEY, "1");
    const initial = chipTexts();

    renderHook(() => useCounters());

    expect(callbacks).toHaveLength(0);
    expect(rafCalls).toBe(0);
    expect(vi.getTimerCount()).toBe(0);

    act(() => {
      vi.advanceTimersByTime(120_000);
    });

    expect(chipTexts()).toEqual(initial);
  });

  it("counts up once on the first intersection and never resets", () => {
    mountStrip();
    const initial = chipTexts();
    expect(initial).toEqual(INITIAL);

    const { rerender } = renderHook(() => useCounters());
    expect(callbacks).toHaveLength(1);

    intersect(true);
    expect(observers[0]?.disconnects).toBe(1);
    expect(rafCalls).toBe(1);

    runFrame(0);
    expect(chipTexts()).toEqual(ZEROED);

    runFrame(1900);
    expect(chipTexts()).toEqual(initial);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(vi.getTimerCount()).toBe(1);

    intersect(true);
    rerender();

    expect(chipTexts()).toEqual(initial);
    expect(rafCalls).toBe(2);
  });

  it("leaves the values untouched when motion is reduced", () => {
    reducedMotion = true;
    mountStrip();
    const initial = chipTexts();

    renderHook(() => useCounters());

    expect(callbacks).toHaveLength(0);
    expect(rafCalls).toBe(0);

    act(() => {
      vi.advanceTimersByTime(120_000);
    });

    expect(chipTexts()).toEqual(initial);
  });
});
