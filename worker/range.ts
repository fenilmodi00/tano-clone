export type ByteRange = { start: number; end: number };

/** Parse a single `bytes=` range. Multi-range requests fall back to a full response. */
export function parseRange(header: string | null, total: number): ByteRange | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec((header ?? "").trim());
  if (!match || (match[1] === "" && match[2] === "")) return null;

  let start: number;
  let end: number;
  if (match[1] === "") {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    start = Math.max(0, total - suffix);
    end = total - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? total - 1 : Number(match[2]);
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null;
  if (start < 0 || start >= total || end < start) return null;

  return { start, end: Math.min(end, total - 1) };
}

/** Drop bytes outside [start, end] without buffering the rest of the asset. */
export function sliceStream(
  body: ReadableStream<Uint8Array>,
  start: number,
  end: number,
): ReadableStream<Uint8Array> {
  let offset = 0;
  let done = false;

  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        if (done) return;
        const chunkStart = offset;
        const chunkEnd = offset + chunk.byteLength;
        offset = chunkEnd;

        if (chunkEnd <= start) return;
        if (chunkStart > end) {
          done = true;
          controller.terminate();
          return;
        }

        const from = Math.max(0, start - chunkStart);
        const to = Math.min(chunk.byteLength, end - chunkStart + 1);
        controller.enqueue(chunk.slice(from, to));

        if (chunkEnd > end) {
          done = true;
          controller.terminate();
        }
      },
    }),
  );
}
