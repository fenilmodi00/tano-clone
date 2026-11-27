import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clamp, onScrollRaf, prefersReducedMotion } from "@/lib/motion";

type ClampCase = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  expected: number;
};

describe("clamp", () => {
  const cases: ClampCase[] = [
    { label: "keeps an in-range value", value: 0.42, expected: 0.42 },
    { label: "keeps the exact lower bound", value: 0, expected: 0 },
    { label: "keeps the exact upper bound", value: 1, expected: 1 },
    { label: "clamps above the default maximum", value: 1.01, expected: 1 },
    { label: "clamps below the default minimum", value: -0.01, expected: 0 },
    { label: "clamps below a custom range", value: 5, min: 10, max: 20, expected: 10 },
    { label: "clamps above a custom range", value: 25, min: 10, max: 20, expected: 20 },
    {
      label: "keeps a value inside a negative range",
      value: -0.5,
      min: -1,
      max: 0,
      expected: -0.5,
    },
    { label: "clamps below a negative range", value: -3, min: -1, max: 0, expected: -1 },
  ];

  it.each(cases)("$label", ({ value, min, max, expected }) => {
    expect(clamp(value, min, max)).toBe(expected);
  });

  it("resolves a reversed range to its upper argument", () => {
    expect(clamp(5, 10, 0)).toBe(0);
    expect(clamp(-5, 10, 0)).toBe(0);
  });
});

describe("prefersReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns true when the reduced-motion query matches", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal("matchMedia", matchMedia);

    expect(prefersReducedMotion()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("returns false when the reduced-motion query does not match", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));

    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("onScrollRaf", () => {
  type QueuedFrame = { id: number; callback: FrameRequestCallback };

  const requestFrame = vi.fn<(callback: FrameRequestCallback) => number>();
  const cancelFrame = vi.fn<(frameId: number) => void>();
  let frames: QueuedFrame[];

  const flushFrame = () => {
    const frame = frames.shift();
    if (!frame) throw new Error("expected a queued animation frame");
    frame.callback(0);
  };

  beforeEach(() => {
    frames = [];
    requestFrame.mockReset().mockImplementation((callback) => {
      frames.push({ id: frames.length + 1, callback });
      return frames.length;
    });
    cancelFrame.mockReset();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("coalesces a burst of scroll and resize events into one callback per frame", () => {
    const callback = vi.fn();
    const cleanup = onScrollRaf(callback);

    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));

    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(1);
    expect(callback).not.toHaveBeenCalled();

    flushFrame();

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("schedules a new frame for events that arrive after the callback ran", () => {
    const callback = vi.fn();
    const cleanup = onScrollRaf(callback);

    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(callback).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("resize"));

    expect(requestFrame).toHaveBeenCalledTimes(2);
    expect(frames).toHaveLength(1);

    flushFrame();
    expect(callback).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it("removes both listeners and cancels a queued frame on cleanup", () => {
    const callback = vi.fn();
    const cleanup = onScrollRaf(callback);

    window.dispatchEvent(new Event("scroll"));
    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(1);

    cleanup();

    expect(cancelFrame).toHaveBeenCalledWith(1);

    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("resize"));

    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();
    expect(frames).toHaveLength(1);
  });
});
