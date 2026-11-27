export type PrimeVideoOptions = {
  /** Start the network load when the element has not selected a resource yet. */
  load?: boolean;
};

/**
 * Raise a lazily-preloaded video to `auto`, optionally starting the load.
 *
 * `networkState === 0` (NETWORK_EMPTY) is the only safe state for an explicit
 * `load()`; calling it during playback would restart the media.
 */
export function primeVideo(
  video: HTMLVideoElement,
  { load = false }: PrimeVideoOptions = {},
): void {
  if (video.preload === "none") video.preload = "auto";
  if (load && video.networkState === 0) video.load();
}
