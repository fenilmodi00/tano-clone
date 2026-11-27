import { describe, expect, it } from "vitest";
import { parseRange, sliceStream } from "../../../worker/range";

function streamOf(...chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

async function bytes(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

describe("parseRange", () => {
  it("parses closed, open and suffix ranges", () => {
    expect(parseRange("bytes=0-1023", 10_000)).toEqual({ start: 0, end: 1023 });
    expect(parseRange("bytes=500-", 10_000)).toEqual({ start: 500, end: 9999 });
    expect(parseRange("bytes=-500", 10_000)).toEqual({ start: 9500, end: 9999 });
  });

  it("clamps the end and rejects unusable ranges", () => {
    expect(parseRange("bytes=9999-12000", 10_000)).toEqual({ start: 9999, end: 9999 });
    expect(parseRange("bytes=10000-", 10_000)).toBeNull();
    expect(parseRange("bytes=5-2", 10_000)).toBeNull();
    expect(parseRange("bytes=0-1,5-6", 10_000)).toBeNull();
    expect(parseRange(null, 10_000)).toBeNull();
  });
});

describe("sliceStream", () => {
  it("returns an exact range spanning multiple chunks", async () => {
    const body = streamOf(
      new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
      new Uint8Array([20, 21, 22, 23, 24, 25, 26, 27, 28, 29]),
    );

    expect(Array.from(await bytes(sliceStream(body, 5, 14)))).toEqual([
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
  });

  it("stops early for a short prefix range", async () => {
    const body = streamOf(new Uint8Array([0, 1, 2, 3, 4]), new Uint8Array([5, 6, 7, 8, 9]));

    expect(Array.from(await bytes(sliceStream(body, 0, 1)))).toEqual([0, 1]);
  });

  it("returns the tail of the last chunk", async () => {
    const body = streamOf(new Uint8Array([0, 1, 2, 3, 4]), new Uint8Array([5, 6, 7, 8, 9]));

    expect(Array.from(await bytes(sliceStream(body, 7, 9)))).toEqual([7, 8, 9]);
  });
});
