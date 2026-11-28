/**
 * Owner: HeroCampaign. Mounts the four home hero campaign reels.
 *
 * Mirrors the source's HeroCampaignStage: 8000 ms per reel, 600 ms scene exit,
 * remaining-time pause, video autoplay while the reel is visible, and no hover
 * pause. The SSR scene is replaced with data-driven markup so the handle,
 * avatar, brand, product, video, poster and backdrop all change per reel.
 */
import { HERO_CAMPAIGNS, type HeroCampaign } from "./data/hero-campaigns";
import { primeVideo } from "@/lib/media";

const REEL_MS = 8000;
const LEAVE_MS = 600;
const SCORE_DELAY_MS = 500;
const SCORE_MS = 1600;
const FILL_STYLE =
  "position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent";
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/* The agent mark used in the source's chat turn. */
const GLYPH_PATH =
  "M88.0338 4.00741C94.2708 -1.07111 103.169 -0.35695 113.68 0.954679C124.143 2.59856 132.893 4.37172 137.492 10.9771C142.074 17.5585 141.747 29.3607 140.316 40.69C140.299 40.7994 139.455 46.8137 138.263 55.3068C138.066 56.7112 139.348 57.871 140.72 57.5277C158.642 53.0441 177.219 48.3977 177.41 48.3473C188.497 45.7363 200.169 44.1752 207.176 48.0563C214.209 51.9519 216.882 60.4922 219.606 70.7545C222.006 81.0979 223.645 89.8961 219.26 96.6461C214.89 103.371 203.853 107.488 192.84 110.402C192.649 110.447 174.818 114.9 157.244 119.29C155.723 119.67 155.214 121.579 156.341 122.67C167.99 133.945 178.721 144.331 178.849 144.452C186.933 152.496 194.438 161.595 194.868 169.61C195.3 177.654 189.494 184.452 182.258 192.207C174.781 199.728 168.207 205.784 160.174 205.632C152.17 205.48 142.84 198.277 134.54 190.458C134.357 190.276 110.985 167.638 95.749 152.879C94.8364 151.995 93.3481 152.183 92.6759 153.262C82.6871 169.296 72.0716 186.34 71.965 186.516C65.798 196.117 58.4822 205.369 50.7527 207.458C42.9946 209.554 35.1552 205.272 26.0855 199.788C17.1935 194.019 9.91902 188.831 8.39701 180.922C6.88068 173.04 11.9679 162.392 17.8709 152.626C18.0005 152.424 32.9447 128.454 44.0686 110.613C44.5958 109.767 44.4196 108.663 43.6575 108.022C30.5698 97.0155 17.998 86.4428 17.8505 86.3219C9.2263 78.8625 1.10598 70.3116 0.119118 62.3463C-0.871353 54.3518 4.44807 47.1643 11.1271 38.9225C18.0624 30.8963 24.1984 24.3953 32.2226 23.985C40.2175 23.5762 50.0271 30.1093 58.8513 37.3297C58.9474 37.4127 64.3671 41.9737 71.7693 48.2037C72.9695 49.2138 74.8114 48.5053 75.0292 46.9494C76.2575 38.1756 77.1354 31.9084 77.1505 31.7897C78.8896 20.5037 81.8197 9.06748 88.0338 4.00741Z";

const GLYPH =
  '<svg aria-hidden="true" fill="none" viewBox="0 0 222 208" overflow="visible" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><radialGradient cx="0" cy="0" gradientTransform="matrix(-73.3295 -212.012 181.351 -72.7727 153.8000 189.9900)" gradientUnits="userSpaceOnUse" id="tano-glyph-spectrum" r="1">' +
  '<stop offset="0" stop-color="var(--spectrum-cyan, #46b7d1)"></stop>' +
  '<stop offset="0.5" stop-color="var(--spectrum-magenta, #cc6add)"></stop>' +
  '<stop offset="1" stop-color="var(--spectrum-orange, #fb751f)"></stop>' +
  "</radialGradient></defs>" +
  `<path d="${GLYPH_PATH}" fill="url(#tano-glyph-spectrum)"></path>` +
  "</svg>";

const mounted = new WeakMap<HTMLElement, () => void>();

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const avatar = (campaign: HeroCampaign, size: number) =>
  `<img alt="" width="${size}" height="${size}" decoding="async" style="color:transparent" src="${campaign.avatar}" />`;

function chips(campaign: HeroCampaign) {
  return campaign.cards.chips
    .map(
      (chip) =>
        `<span class="hp-camp-chip"${chip.picked ? ' data-picked="true"' : ""}>${escape(chip.label)}</span>`,
    )
    .join("");
}

function scoreRows(campaign: HeroCampaign) {
  return campaign.cards.library.rows
    .map(
      (row, index) =>
        `<span class="hp-camp-score-row"${row.win ? ' data-win="true"' : ""} style="--row:${index}">` +
        `<span class="hp-camp-score-label">${escape(row.label)}</span>` +
        `<span aria-hidden="true" class="hp-camp-bar"${row.win ? ' data-win="true"' : ""} style="--share:${row.share}"></span>` +
        "</span>",
    )
    .join("");
}

function chatTurns(campaign: HeroCampaign) {
  return campaign.cards.chat
    .map((turn) => {
      if (turn.from === "creator") {
        return (
          '<li class="hp-camp-turn" data-from="creator">' +
          '<span aria-hidden="true" class="hp-camp-turn-face">' +
          `<span aria-label="${escape(campaign.handle)}" class="wire-lockup" data-size="xs" role="img">` +
          `<span class="wire-lockup-ring">${avatar(campaign, 48)}</span>` +
          "</span>" +
          "</span>" +
          `<span class="hp-camp-bubble">${escape(turn.text)}</span>` +
          "</li>"
        );
      }
      return (
        '<li class="hp-camp-turn" data-from="agent">' +
        `<span aria-hidden="true" class="hp-camp-turn-mark">${GLYPH}</span>` +
        `<span class="hp-camp-bubble">${escape(turn.text)}</span>` +
        "</li>"
      );
    })
    .join("");
}

function metricRows(campaign: HeroCampaign) {
  const gradientId = `hp-camp-metric-${campaign.key}`;
  const stops =
    '<stop offset="0" style="stop-color:var(--spectrum-yellow)"></stop>' +
    '<stop offset="0.3" style="stop-color:var(--spectrum-lime)"></stop>' +
    '<stop offset="0.58" style="stop-color:var(--spectrum-cyan)"></stop>' +
    '<stop offset="0.8" style="stop-color:var(--spectrum-violet)"></stop>' +
    '<stop offset="1" style="stop-color:var(--spectrum-magenta)"></stop>';
  return campaign.cards.metrics
    .map(
      (metric, index) =>
        `<span class="hp-camp-metric" data-turn="${index}">` +
        `<span class="hp-camp-mono" data-quiet="">${escape(metric.label)}</span>` +
        '<span class="hp-camp-metric-row">' +
        '<svg aria-hidden="true" class="hp-camp-metric-trend" preserveAspectRatio="none" viewBox="0 0 100 40">' +
        (index === 0
          ? `<defs><linearGradient gradientUnits="userSpaceOnUse" id="${gradientId}" x1="0" x2="100" y1="0" y2="0">${stops}</linearGradient></defs>`
          : "") +
        `<path class="hp-camp-metric-line" d="${metric.path}" stroke="url(#${gradientId})"></path>` +
        "</svg>" +
        '<span aria-hidden="true" class="hp-camp-redacted" data-size="md"></span>' +
        "</span>" +
        "</span>",
    )
    .join("");
}

function renderScene(campaign: HeroCampaign) {
  return (
    '<div class="hp-camp-scene">' +
    `<p class="wire-visually-hidden">${escape(campaign.handle)} for ${escape(campaign.brand.name)}</p>` +
    '<div class="hp-camp-post"><div class="hp-camp-video wire-glass-edge" data-rim="true">' +
    `<video aria-label="${escape(campaign.handle)}’s post for ${escape(campaign.brand.name)}" loop muted playsinline preload="none" poster="${campaign.clip.poster}" src="${campaign.clip.src}"></video>` +
    '<span aria-hidden="true" class="hp-camp-video-blur"></span>' +
    '<span aria-hidden="true" class="hp-camp-video-fade"></span>' +
    `<span class="hp-camp-logo"><img alt="${escape(campaign.brand.name)}" decoding="async" style="${FILL_STYLE}" src="${campaign.brand.logo}" /></span>` +
    "</div></div>" +
    '<div class="hp-camp-card" data-slot="send"><div class="hp-camp-brief">' +
    `<span class="hp-camp-chips">${chips(campaign)}</span>` +
    '<span class="hp-camp-mono" data-quiet="">Product to gift</span>' +
    '<span class="hp-camp-gift">' +
    `<span class="hp-camp-tile" style="background-color:${campaign.product.tint}">` +
    `<img alt="${escape(campaign.product.name)}" decoding="async" style="${FILL_STYLE}" src="${campaign.product.image}" />` +
    "</span>" +
    `<span class="hp-camp-gift-name">${escape(campaign.product.name)}</span>` +
    "</span>" +
    '<span class="hp-camp-targets">' +
    campaign.cards.targets
      .map(
        (label) =>
          '<span class="hp-camp-target">' +
          `<span class="hp-camp-mono" data-quiet="">${escape(label)}</span>` +
          '<span class="hp-camp-target-value"><span aria-hidden="true" class="hp-camp-redacted" data-size="md"></span></span>' +
          "</span>",
      )
      .join("") +
    "</span></div></div>" +
    '<div class="hp-camp-card" data-slot="library"><div class="hp-camp-field">' +
    '<span class="hp-camp-field-head"><span class="hp-camp-mono" data-quiet="">Creator score</span>' +
    '<span class="hp-camp-match-figure">0.00</span></span>' +
    `<span class="hp-camp-score">${scoreRows(campaign)}</span>` +
    '<span class="hp-camp-field-foot"><span class="wire-lockup" data-size="sm">' +
    `<span class="wire-lockup-ring">${avatar(campaign, 72)}</span>` +
    `<span class="wire-lockup-who"><span class="wire-lockup-handle">${escape(campaign.handle)}</span></span>` +
    "</span></span></div></div>" +
    '<div class="hp-camp-card" data-slot="metric"><ol class="hp-camp-chat">' +
    chatTurns(campaign) +
    "</ol></div>" +
    '<div class="hp-camp-card" data-slot="code"><div class="hp-camp-metrics">' +
    metricRows(campaign) +
    "</div></div>" +
    "</div>"
  );
}

/**
 * Mount the hero campaign on the home page. `root` may be the hero section,
 * the stage, or `.hp-camp` itself. Returns an idempotent cleanup.
 */
export function mountHeroCampaign(root: HTMLElement): () => void {
  mounted.get(root)?.();

  const host = root.matches(".hp-camp") ? root : root.querySelector<HTMLElement>(".hp-camp");
  if (!host || HERO_CAMPAIGNS.length < 2) return () => {};
  const camp: HTMLElement = host;

  const stage = camp.closest(".hp-hero-stage") ?? camp.parentElement ?? root;
  const track = stage.querySelector<HTMLElement>(".hp-camp-track");
  const buttons = Array.from(
    track?.querySelectorAll<HTMLButtonElement>(".hp-camp-track-button") ?? [],
  );
  const panel = camp.querySelector<HTMLElement>(".hp-camp-panel") ?? createPanel(camp);
  const fade = panel.querySelector<HTMLElement>(".hp-camp-fade") ?? createFade(panel);

  const scenes = new Set<HTMLElement>();
  const sceneCleanups = new WeakMap<HTMLElement, Array<() => void>>();
  const sceneCampaigns = new WeakMap<HTMLElement, HeroCampaign>();
  const videoVisible = new WeakMap<HTMLVideoElement, boolean>();
  const backdrops = new Map<string, HTMLElement>();

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = media.matches;
  let paused = reduced;
  let destroyed = false;

  let currentIndex = 0;
  let left = REEL_MS;
  let timer: number | null = null;
  let timerStarted = 0;
  let leavingScene: HTMLElement | null = null;
  let leavingTimer: number | null = null;
  let currentScene: HTMLElement | null = null;

  let inside = false;
  let ratio75 = false;
  let arrived = false;
  let inView = false;

  const running = () => !paused && inView && HERO_CAMPAIGNS.length > 1;

  /* ------------------------------------------------------------- backdrops */

  function createPanel(host: HTMLElement) {
    const element = document.createElement("div");
    element.className = "hp-camp-panel";
    element.setAttribute("aria-hidden", "true");
    host.prepend(element);
    return element;
  }

  function createFade(host: HTMLElement) {
    const element = document.createElement("span");
    element.className = "hp-camp-fade";
    host.append(element);
    return element;
  }

  function ensureBackdrop(campaign: HeroCampaign) {
    const existing = backdrops.get(campaign.key);
    if (existing) return existing;
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.media = "(max-width: 767px)";
    source.srcset = PIXEL;
    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    image.fetchPriority = "low";
    image.className = "hp-camp-backdrop";
    image.style.cssText = FILL_STYLE;
    image.src = campaign.brand.backdrop;
    image.dataset.live = "false";
    picture.append(source, image);
    panel.insertBefore(picture, fade);
    backdrops.set(campaign.key, picture);
    return picture;
  }

  function renderPanel() {
    const current = HERO_CAMPAIGNS[currentIndex];
    const next = HERO_CAMPAIGNS[(currentIndex + 1) % HERO_CAMPAIGNS.length];
    const keep = new Set([current.key, next.key]);
    for (const [key, picture] of backdrops) {
      if (keep.has(key)) continue;
      picture.remove();
      backdrops.delete(key);
    }
    ensureBackdrop(current);
    ensureBackdrop(next);
    for (const [key, picture] of backdrops) {
      const image = picture.querySelector<HTMLImageElement>(".hp-camp-backdrop");
      const live = key === current.key;
      if (image && image.dataset.live !== String(live)) {
        image.dataset.live = String(live);
        image.fetchPriority = live ? "high" : "low";
      }
    }
    // Keep the fade as the last child so it stays above every backdrop.
    panel.append(fade);
  }

  /* ---------------------------------------------------------------- scenes */

  function buildScene(campaign: HeroCampaign, opening: "initial" | "switch") {
    const template = document.createElement("template");
    template.innerHTML = renderScene(campaign);
    const scene = template.content.firstElementChild as HTMLElement;
    sceneCampaigns.set(scene, campaign);
    if (opening === "initial") {
      scene.setAttribute("data-opening", "");
    } else {
      scene.setAttribute("data-opening", "");
      const frame = requestAnimationFrame(() => scene.removeAttribute("data-opening"));
      addCleanup(scene, () => cancelAnimationFrame(frame));
    }
    scenes.add(scene);
    wireScene(scene, campaign);
    return scene;
  }

  function addCleanup(scene: HTMLElement, cleanup: () => void) {
    const list = sceneCleanups.get(scene);
    if (list) list.push(cleanup);
    else sceneCleanups.set(scene, [cleanup]);
  }

  function wireScene(scene: HTMLElement, campaign: HeroCampaign) {
    /* Video: muted, inline, looping, autoplaying only while visible. */
    const video = scene.querySelector<HTMLVideoElement>("video");
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          videoVisible.set(video, entry?.isIntersecting === true);
          syncVideos();
        },
        { threshold: 0 },
      );
      observer.observe(video);
      const onEnded = () => {
        video.currentTime = 0;
        if (videoVisible.get(video) === true) playVideo(video);
      };
      video.addEventListener("ended", onEnded);
      addCleanup(scene, () => {
        observer.disconnect();
        video.removeEventListener("ended", onEnded);
        video.pause();
      });
    }

    /* Creator score count-up, gated on the field becoming 60% visible. */
    const figure = scene.querySelector<HTMLElement>(".hp-camp-match-figure");
    const field = scene.querySelector<HTMLElement>(".hp-camp-field");
    if (figure && field) {
      const target = campaign.cards.library.match;
      if (reduced) {
        figure.textContent = target.toFixed(2);
      } else {
        let frame = 0;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            observer.disconnect();
            let started = 0;
            const tick = (now: number) => {
              if (!started) started = now;
              const progress = Math.min(
                Math.max((now - started - SCORE_DELAY_MS) / SCORE_MS, 0),
                1,
              );
              const eased = progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              figure.textContent = (target * eased).toFixed(2);
              if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
          },
          { threshold: 0.6 },
        );
        observer.observe(field);
        addCleanup(scene, () => {
          observer.disconnect();
          cancelAnimationFrame(frame);
        });
      }
    }
  }

  function removeScene(scene: HTMLElement) {
    for (const cleanup of sceneCleanups.get(scene) ?? []) cleanup();
    sceneCleanups.delete(scene);
    scene.remove();
    scenes.delete(scene);
    if (currentScene === scene) currentScene = null;
    if (leavingScene === scene) leavingScene = null;
  }

  function switchScene(nextIndex: number) {
    const outgoing = currentScene;
    if (leavingScene && leavingScene !== outgoing) removeScene(leavingScene);
    if (leavingTimer !== null) {
      window.clearTimeout(leavingTimer);
      leavingTimer = null;
    }
    if (outgoing) {
      outgoing.removeAttribute("data-opening");
      outgoing.setAttribute("data-leaving", "");
      outgoing.setAttribute("aria-hidden", "true");
      leavingScene = outgoing;
      leavingTimer = window.setTimeout(() => {
        leavingTimer = null;
        if (leavingScene === outgoing) removeScene(outgoing);
      }, LEAVE_MS);
    }
    const incoming = buildScene(HERO_CAMPAIGNS[nextIndex], "switch");
    camp.append(incoming);
    currentScene = incoming;
  }

  /* ---------------------------------------------------------------- videos */

  /* Film bytes stay off the critical path: no load or play until idle. */
  let filmsReady = false;
  let filmTimer: number | null = null;
  let filmIdle: number | null = null;

  function playVideo(video: HTMLVideoElement) {
    if (!filmsReady) return;
    // Scenes ship with preload="none" so first paint fetches no film bytes.
    // Only an active, visible reel raises the hint; the networkState guard
    // keeps repeated syncs from restarting a load that is already in flight.
    primeVideo(video, { load: true });
    const attempt = video.play();
    if (attempt) {
      // Autoplay may be denied; never surface that as a page error.
      attempt.catch(() => {});
    }
  }

  function unlockFilms() {
    if (filmsReady) return;
    filmsReady = true;
    if (filmTimer !== null) {
      window.clearTimeout(filmTimer);
      filmTimer = null;
    }
    if (filmIdle !== null) {
      window.cancelIdleCallback(filmIdle);
      filmIdle = null;
    }
    syncVideos();
  }

  const onFilmLoad = () => {
    filmTimer = window.setTimeout(unlockFilms, 500);
  };

  function syncVideos() {
    if (!filmsReady) return;
    for (const video of camp.querySelectorAll<HTMLVideoElement>("video")) {
      if (videoVisible.get(video) === true && !paused) playVideo(video);
      else video.pause();
    }
  }

  /* ----------------------------------------------------------------- track */

  function renderTrack(restart: boolean) {
    buttons.forEach((button, index) => {
      const state = index < currentIndex ? "done" : index === currentIndex ? "live" : "idle";
      button.dataset.state = state;
      const campaign = HERO_CAMPAIGNS[index];
      if (campaign && button.getAttribute("aria-label") !== campaign.trackLabel) {
        button.setAttribute("aria-label", campaign.trackLabel);
      }
      if (index === currentIndex) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");

      const fill = button.querySelector<HTMLElement>(".hp-steps-seg-fill");
      if (!fill) return;
      fill.dataset.paused = String(!running());
      if (index === currentIndex && restart) {
        const fresh = fill.cloneNode(true) as HTMLElement;
        fresh.dataset.paused = String(!running());
        fill.replaceWith(fresh);
      }
    });
  }

  /* ----------------------------------------------------------------- timer */

  function stopTimer(preserve: boolean) {
    if (timer === null) return;
    window.clearTimeout(timer);
    timer = null;
    if (preserve) left = Math.max(0, left - (performance.now() - timerStarted));
  }

  function startTimer() {
    if (destroyed || timer !== null || !running()) return;
    timerStarted = performance.now();
    timer = window.setTimeout(() => {
      timer = null;
      left = REEL_MS;
      activate((currentIndex + 1) % HERO_CAMPAIGNS.length);
    }, left);
  }

  function restartTimer() {
    stopTimer(false);
    left = REEL_MS;
    startTimer();
  }

  function syncTimer() {
    if (running()) startTimer();
    else stopTimer(true);
  }

  /* --------------------------------------------------------------- actions */

  function activate(nextIndex: number) {
    if (destroyed) return;
    const count = HERO_CAMPAIGNS.length;
    const next = ((nextIndex % count) + count) % count;
    const changed = next !== currentIndex;
    currentIndex = next;
    left = REEL_MS;
    if (changed) switchScene(next);
    renderPanel();
    renderTrack(true);
    restartTimer();
    syncVideos();
  }

  function onLeave() {
    if (destroyed) return;
    const changed = currentIndex !== 0;
    currentIndex = 0;
    left = REEL_MS;
    stopTimer(false);
    if (changed) switchScene(0);
    renderPanel();
    renderTrack(true);
    syncVideos();
  }

  function onArrive() {
    if (destroyed) return;
    renderTrack(false);
    syncTimer();
    syncVideos();
  }

  function applyZone() {
    const next = inside || ratio75;
    if (next === inView) return;
    inView = next;
    if (inView && !arrived) {
      arrived = true;
      onArrive();
    }
    if (inView) startTimer();
    else stopTimer(true);
    renderTrack(false);
    syncVideos();
  }

  function applyMotion() {
    paused = reduced;
    if (paused) camp.setAttribute("data-motion", "paused");
    else camp.removeAttribute("data-motion");
    if (reduced) {
      for (const scene of scenes) {
        const campaign = sceneCampaigns.get(scene);
        const figure = scene.querySelector<HTMLElement>(".hp-camp-match-figure");
        if (campaign && figure) figure.textContent = campaign.cards.library.match.toFixed(2);
      }
    }
    syncTimer();
    renderTrack(false);
    syncVideos();
  }

  const onMotionChange = () => {
    reduced = media.matches;
    applyMotion();
  };

  const onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>(".hp-camp-track-button");
    if (!button || !track?.contains(button)) return;
    const index = buttons.indexOf(button);
    if (index < 0) return;
    event.preventDefault();
    unlockFilms();
    activate(index);
  };

  // The shared runtime autoplays every page video once on mount; keep the film
  // frozen until its idle unlock and while the reel is paused or offscreen.
  const onPlay = (event: Event) => {
    const target = event.target;
    if (
      target instanceof HTMLVideoElement &&
      (!filmsReady || paused || videoVisible.get(target) !== true)
    ) {
      target.pause();
    }
  };

  /* ----------------------------------------------------------------- setup */

  for (const scene of Array.from(camp.querySelectorAll<HTMLElement>(".hp-camp-scene"))) {
    scene.remove();
  }
  for (const picture of Array.from(panel.querySelectorAll("picture"))) picture.remove();
  backdrops.clear();

  camp.setAttribute("data-inview", "true");
  applyMotion();

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => camp.setAttribute("data-inview", entry?.isIntersecting ? "true" : "false"),
    { rootMargin: "200px 0px" },
  );
  visibilityObserver.observe(camp);

  const zone = camp.closest(".hp-hero-pin") ?? camp;
  const insideObserver = new IntersectionObserver(
    ([entry]) => {
      inside = entry?.isIntersecting === true;
      applyZone();
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0 },
  );
  const ratioObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (!entry.isIntersecting && arrived) {
        arrived = false;
        onLeave();
      }
      ratio75 = entry.intersectionRatio >= 0.75;
      applyZone();
    },
    { threshold: [0, 0.75] },
  );
  insideObserver.observe(zone);
  ratioObserver.observe(zone);

  currentScene = buildScene(HERO_CAMPAIGNS[currentIndex], "initial");
  camp.append(currentScene);
  renderPanel();
  renderTrack(true);
  media.addEventListener("change", onMotionChange);
  track?.addEventListener("click", onClick);
  camp.addEventListener("play", onPlay, true);

  /* Defer film bytes: first idle slot (bounded) or half a second after load. */
  if (typeof window.requestIdleCallback === "function") {
    filmIdle = window.requestIdleCallback(unlockFilms, { timeout: 1200 });
  } else if (document.readyState === "complete") {
    filmTimer = window.setTimeout(unlockFilms, 500);
  } else {
    window.addEventListener("load", onFilmLoad, { once: true });
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stopTimer(false);
    if (filmTimer !== null) window.clearTimeout(filmTimer);
    filmTimer = null;
    if (filmIdle !== null) window.cancelIdleCallback(filmIdle);
    filmIdle = null;
    window.removeEventListener("load", onFilmLoad);
    if (leavingTimer !== null) window.clearTimeout(leavingTimer);
    leavingTimer = null;
    visibilityObserver.disconnect();
    insideObserver.disconnect();
    ratioObserver.disconnect();
    media.removeEventListener("change", onMotionChange);
    track?.removeEventListener("click", onClick);
    camp.removeEventListener("play", onPlay, true);
    for (const scene of Array.from(scenes)) removeScene(scene);
    for (const picture of Array.from(backdrops.values())) picture.remove();
    backdrops.clear();
    for (const video of camp.querySelectorAll<HTMLVideoElement>("video")) video.pause();
    camp.removeAttribute("data-motion");
    camp.removeAttribute("data-inview");
    window.removeEventListener("scroll", onDockScroll);
    window.removeEventListener("resize", onDockScroll);
    cancelAnimationFrame(dockStart);
    if (dockFrame) cancelAnimationFrame(dockFrame);
    if (dock) {
      dock.dataset.floating = "false";
      dock.dataset.intro = "false";
      delete dock.dataset.aside;
      dock.style.removeProperty("--dock-left");
      dock.style.removeProperty("--dock-width");
    }
    if (mounted.get(root) === destroy) mounted.delete(root);
  }

  /* ------------------------------------------------------------ dock ticker */
  const dock =
    camp
      .closest<HTMLElement>(".hp-camp-sticky")
      ?.querySelector<HTMLElement>(".hp-hero-strip-dock") ??
    document.querySelector<HTMLElement>(".hp-hero-strip-dock");
  const dockRow = dock?.closest<HTMLElement>(".hp-hero-strip-row") ?? null;
  let dockFrame = 0;
  const syncDock = () => {
    dockFrame = 0;
    if (!dock || !dockRow) return;
    const rect = dockRow.getBoundingClientRect();
    if (rect.height === 0) return;
    dock.style.setProperty("--dock-left", `${rect.left}px`);
    dock.style.setProperty("--dock-width", `${rect.width}px`);
    // Stay floating and visible until the in-flow slot reaches the dock line;
    // there is no fade gap. At the switch point fixed and relative coincide.
    const dockLine = window.innerHeight - rect.height - 12;
    if (rect.top > dockLine) {
      dock.dataset.floating = "true";
      dock.dataset.intro = "false";
    } else {
      dock.dataset.floating = "false";
      dock.dataset.intro = "false";
    }
    delete dock.dataset.aside;
  };
  const onDockScroll = () => {
    if (dockFrame) return;
    dockFrame = requestAnimationFrame(syncDock);
  };
  dock?.setAttribute("data-intro", "true");
  const dockStart = requestAnimationFrame(() => {
    syncDock();
    dock?.setAttribute("data-intro", "true");
  });
  window.addEventListener("scroll", onDockScroll, { passive: true });
  window.addEventListener("resize", onDockScroll);

  mounted.set(root, destroy);
  return destroy;
}
