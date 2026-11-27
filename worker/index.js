import vinext from "vinext/server/fetch-handler";
import { parseRange, sliceStream } from "./range";

const VIDEO_PATH = /^\/sites\/tano\/(media|extras)\/[^/]+\.(mp4|webm|mov)$/i;

/**
 * Workers Static Assets answers a Range request with the whole file and no
 * Content-Range. Safari needs partial content to play video, so this entry
 * slices video responses before handing every other request to vinext.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if ((request.method === "GET" || request.method === "HEAD") && VIDEO_PATH.test(url.pathname)) {
      if (request.headers.has("range")) {
        const ranged = await rangeResponse(request, env, url);
        if (ranged) return ranged;
      }

      const response = await vinext.fetch(request, env, ctx);
      if (response.status === 200) {
        const headers = new Headers(response.headers);
        headers.set("accept-ranges", "bytes");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
      return response;
    }

    return vinext.fetch(request, env, ctx);
  },
};

async function rangeResponse(request, env, url) {
  const asset = await env.ASSETS.fetch(
    new Request(`${url.origin}${url.pathname}`, { method: "GET" }),
  );
  if (!asset.ok) return null;

  const lengthHeader = asset.headers.get("content-length");
  let total = Number(lengthHeader);
  let buffer = null;
  if (!lengthHeader || !Number.isSafeInteger(total) || total <= 0) {
    // Miniflare omits Content-Length on ASSETS responses; production includes
    // it, so buffering is only the local-preview fallback.
    buffer = new Uint8Array(await asset.arrayBuffer());
    total = buffer.byteLength;
  }

  const range = parseRange(request.headers.get("range"), total);
  if (!range) return null;

  const headers = new Headers();
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", cacheControl(url.pathname));
  headers.set("content-length", String(range.end - range.start + 1));
  headers.set("content-range", `bytes ${range.start}-${range.end}/${total}`);
  headers.set("content-type", asset.headers.get("content-type") ?? "video/mp4");
  headers.set("x-content-type-options", "nosniff");

  const etag = asset.headers.get("etag");
  if (etag) headers.set("etag", etag);
  const lastModified = asset.headers.get("last-modified");
  if (lastModified) headers.set("last-modified", lastModified);

  if (request.method === "HEAD") {
    return new Response(null, { status: 206, headers });
  }

  const body = buffer
    ? buffer.slice(range.start, range.end + 1)
    : sliceStream(asset.body, range.start, range.end);
  return new Response(body, { status: 206, headers });
}

function cacheControl(pathname) {
  if (pathname.startsWith("/sites/tano/extras/")) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=604800, stale-while-revalidate=86400";
}
