import { describe, expect, it, vi } from "vitest";
import { primeVideo } from "@/lib/media";

function fakeVideo(overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement {
  return {
    preload: "none",
    networkState: 0,
    load: vi.fn(),
    ...overrides,
  } as unknown as HTMLVideoElement;
}

describe("primeVideo", () => {
  it("raises a lazy hint without loading by default", () => {
    const video = fakeVideo();

    primeVideo(video);

    expect(video.preload).toBe("auto");
    expect(video.load).not.toHaveBeenCalled();
  });

  it("loads only when requested and no resource is selected", () => {
    const empty = fakeVideo();
    const loading = fakeVideo({ networkState: 2 });

    primeVideo(empty, { load: true });
    primeVideo(loading, { load: true });

    expect(empty.load).toHaveBeenCalledTimes(1);
    expect(loading.load).not.toHaveBeenCalled();
  });

  it("keeps an existing preload hint", () => {
    const video = fakeVideo({ preload: "metadata" });

    primeVideo(video, { load: true });

    expect(video.preload).toBe("metadata");
    expect(video.load).toHaveBeenCalledTimes(1);
  });
});
