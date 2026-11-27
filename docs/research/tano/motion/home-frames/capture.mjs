/* Frame-by-frame motion capture for https://www.tano.ai/ at 1568x900.
 * Writes PNGs into <scene>/ and index.json next to this script.
 * Run from /home/boxd/tano-clone:  node docs/research/tano/motion/home-frames/capture.mjs
 */
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.dirname(fileURLToPath(import.meta.url));
const URL = 'https://www.tano.ai/';
const VIEWPORT = { width: 1568, height: 900 };
const TIME_MS = [0, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];

const HERO_SELECTORS = [
  { sel: '.hp-hero', label: 'hero', max: 1 },
  { sel: '.hp-hero-pin', label: 'heroPin', max: 1 },
  { sel: '.hp-hero-stage', label: 'heroStage', max: 1 },
  { sel: '.hp-camp', label: 'hpCamp', max: 1 },
  { sel: '.hp-camp-sticky', label: 'hpCampSticky', max: 1 },
  { sel: '.hp-camp-panel', label: 'campPanel', max: 1 },
  { sel: '.hp-camp-scene', label: 'campScene', max: 2 },
  { sel: '.hp-camp-track', label: 'campTrack', max: 1 },
  { sel: '.hp-hero-strip-row', label: 'stripRow', max: 1 },
  { sel: '.hp-hero-strip-dock', label: 'stripDock', max: 1 },
];

const COUNT_SELECTORS = [
  ...HERO_SELECTORS,
  { sel: '.hp-hero-strip', label: 'strip', max: 2 },
  { sel: '.hp-hero-strip-run', label: 'stripRun', max: 2 },
];

const CONVO_SELECTORS = [
  { sel: '.hp-convo', label: 'convo', max: 1 },
  { sel: '.hp-convo-frame', label: 'convoFrame', max: 1 },
  { sel: '.hp-convo-reads', label: 'convoReads', max: 1 },
  { sel: '.hp-convo-agent', label: 'convoAgent', max: 1 },
  { sel: '.hp-convo-message', label: 'convoMessage', max: 6 },
];

const EXP_SELECTORS = [
  { sel: '.hp-xl', label: 'xl', max: 1 },
  { sel: '.hp-xl-card', label: 'xlCard', max: 1 },
  { sel: '.hp-xl-chips', label: 'xlChips', max: 1 },
  { sel: '.hp-xl-runner', label: 'xlRunner', max: 3 },
  { sel: '.hp-xl-cac', label: 'xlCac', max: 1 },
  { sel: '.hp-xl-proven', label: 'xlProven', max: 1 },
];

const CASE_SELECTORS = [
  { sel: '.wire-case-banners', label: 'caseBanners', max: 1 },
  { sel: '.wire-case-slot', label: 'caseSlot', max: 3 },
  { sel: '.wire-case-banner', label: 'caseBanner', max: 3 },
  { sel: '.wire-case-tick', label: 'caseTick', max: 3 },
];

const LOGO_SELECTORS = [
  { sel: '.hp-logo-band', label: 'logoBand', max: 2 },
  { sel: '.wire-cases-marks', label: 'marks', max: 2 },
  { sel: '.wire-cases-marks-strip', label: 'marksStrip', max: 2 },
  { sel: '.wire-cases-marks-run', label: 'marksRun', max: 2 },
  { sel: '.wire-cases-marks-copy', label: 'marksCopy', max: 2 },
];

const CLOSING_SELECTORS = [
  { sel: '.hp-closing-band', label: 'closingBand', max: 1 },
  { sel: '.hp-closing', label: 'closing', max: 1 },
  { sel: '.hp-closing-cards', label: 'closingCards', max: 1 },
  { sel: '.hp-closing-copy', label: 'closingCopy', max: 1 },
  { sel: '.hp-closing-cards .hp-camp-card', label: 'closingCard', max: 4 },
  { sel: '.hp-closing a.tano-button', label: 'closingCta', max: 1 },
];

const ANNOUNCE_SELECTORS = [
  { sel: '.hp-notify', label: 'notify', max: 1 },
  { sel: '.hp-notify-stack', label: 'notifyStack', max: 1 },
  { sel: '.hp-notify-layer', label: 'notifyLayer', max: 2 },
  { sel: '.hp-notify-card', label: 'notifyCard', max: 1 },
  { sel: '.hp-notify-close', label: 'notifyClose', max: 1 },
];

const HERO_TIME_SELECTORS = [
  ...HERO_SELECTORS,
  { sel: '.hp-camp-match-figure', label: 'scoreFigure', max: 1 },
  { sel: '.hp-camp-bar', label: 'scoreBar', max: 4 },
  { sel: '.hp-camp-turn', label: 'chatTurn', max: 3 },
  { sel: '.hp-camp-metric', label: 'metric', max: 2 },
  { sel: '.hp-camp-chip', label: 'chip', max: 2 },
  { sel: '.hp-camp-track-button', label: 'campTrackButton', max: 4 },
];

const VARS = [
  '--cover', '--ghost-hue', '--stack-depth', '--covered-depth',
  '--hp-steps-duration', '--hp-steps-index', '--share', '--row',
  '--camp-h', '--camp-panel-top', '--reel-count', '--hp-reveal-delay',
  '--camp-fade', '--camp-chat-loop', '--camp-metric-loop', '--camp-field-loop',
];

let browser;
let context;
let page;
const sceneSamples = new Map();
const sceneMeta = new Map();

function ensureScene(name, description) {
  if (!sceneSamples.has(name)) {
    sceneSamples.set(name, []);
    sceneMeta.set(name, { name, description });
  }
}

async function resetMotion() {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });
}

const collect = () => {
  const varsList = ['--cover', '--ghost-hue', '--stack-depth', '--covered-depth',
    '--hp-steps-duration', '--hp-steps-index', '--share', '--row',
    '--camp-h', '--camp-panel-top', '--reel-count', '--hp-reveal-delay',
    '--camp-fade', '--camp-chat-loop', '--camp-metric-loop', '--camp-field-loop'];
  const round = (n) => Math.round(n * 100) / 100;
  const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const dataOf = (el) => Object.fromEntries(
    [...el.attributes].filter((a) => a.name.startsWith('data-'))
      .map((a) => [a.name.slice(5), a.value]),
  );
  const describe = (el, label, selector) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const vars = {};
    for (const v of varsList) {
      const val = cs.getPropertyValue(v).trim();
      if (val) vars[v] = val;
    }
    const pseudo = (which) => {
      const p = getComputedStyle(el, which);
      if (!p || p.content === 'none') return null;
      const out = {
        content: p.content,
        opacity: p.opacity,
        transform: p.transform,
        translate: p.translate,
        filter: p.filter,
        backgroundColor: p.backgroundColor,
        backgroundImage: p.backgroundImage.slice(0, 220),
        boxShadow: p.boxShadow.slice(0, 220),
        inset: p.inset,
        width: p.width,
        height: p.height,
        animation: `${p.animationName} ${p.animationDuration} ${p.animationDelay} ${p.animationPlayState}`,
      };
      return out;
    };
    const pseudoBefore = pseudo('::before');
    const pseudoAfter = pseudo('::after');
    return {
      label,
      selector,
      tag: el.tagName.toLowerCase(),
      rect: {
        x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height),
        top: round(r.top), right: round(r.right), bottom: round(r.bottom), left: round(r.left),
      },
      opacity: cs.opacity,
      transform: cs.transform,
      translate: cs.translate,
      scale: cs.scale,
      rotate: cs.rotate,
      position: cs.position,
      display: cs.display,
      visibility: cs.visibility,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage.slice(0, 320),
      boxShadow: cs.boxShadow.slice(0, 320),
      filter: cs.filter,
      animation: {
        name: cs.animationName,
        duration: cs.animationDuration,
        delay: cs.animationDelay,
        playState: cs.animationPlayState,
      },
      transition: {
        property: cs.transitionProperty,
        duration: cs.transitionDuration,
        delay: cs.transitionDelay,
      },
      vars,
      data: dataOf(el),
      aria: {
        label: el.getAttribute('aria-label'),
        current: el.getAttribute('aria-current'),
        hidden: el.getAttribute('aria-hidden'),
      },
      text: clean(el.innerText ?? el.textContent).slice(0, 240),
      style: (el.getAttribute('style') || '').slice(0, 400),
      ...(pseudoBefore ? { pseudoBefore } : {}),
      ...(pseudoAfter ? { pseudoAfter } : {}),
    };
  };
  const groups = window.__motionSelectors || [];
  const elements = [];
  for (const g of groups) {
    const nodes = [...document.querySelectorAll(g.sel)].slice(0, g.max ?? 6);
    nodes.forEach((el, i) => {
      elements.push(describe(el, nodes.length > 1 ? `${g.label}[${i}]` : g.label, g.sel));
    });
  }

  const camp = document.querySelector('.hp-camp');
  const sticky = document.querySelector('.hp-camp-sticky');
  const stage = document.querySelector('.hp-hero-stage');
  const pin = document.querySelector('.hp-hero-pin');
  const dock = document.querySelector('.hp-hero-strip-dock');
  const row = document.querySelector('.hp-hero-strip-row');
  const stripRoot = row || dock;
  const run = stripRoot?.querySelector('.hp-hero-strip-run') || document.querySelector('.hp-hero-strip-run');
  const scenes = [...document.querySelectorAll('.hp-camp-scene')];
  const cards = [...document.querySelectorAll('.hp-camp .hp-camp-card, .hp-closing-cards .hp-camp-card')].map((el) => {
    const d = describe(el, `card:${el.dataset.slot || '?'}`, '.hp-camp-card');
    d.slot = el.dataset.slot || null;
    d.scene = el.closest('.hp-camp-scene')?.hasAttribute('data-opening')
      ? 'opening'
      : el.closest('.hp-camp-scene')?.hasAttribute('data-leaving') ? 'leaving' : 'closing';
    return d;
  });
  const backdrops = [...document.querySelectorAll('.hp-camp-backdrop')].map((el) => ({
    live: el.dataset.live ?? null,
    opacity: getComputedStyle(el).opacity,
    rect: (() => { const r = el.getBoundingClientRect(); return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }; })(),
    src: (el.currentSrc || el.src || '').slice(0, 220),
  }));
  const track = [...document.querySelectorAll('.hp-camp-track-button')];
  const notify = document.querySelector('.hp-notify');
  const closing = document.querySelector('.hp-closing-cards');
  const convo = document.querySelector('.hp-convo');
  const stats = stripRoot
    ? [...stripRoot.querySelectorAll('.hp-hero-stat:not([aria-hidden])')].slice(0, 7).map((el) => ({
      value: clean(el.querySelector('.hp-loop-stat-chip')?.textContent),
      label: clean(el.querySelector('.hp-loop-stat-label')?.textContent),
    }))
    : [];

  const scoreBars = [...document.querySelectorAll('.hp-camp .hp-camp-bar')].map((el) => ({
    transform: getComputedStyle(el).transform,
    share: getComputedStyle(el).getPropertyValue('--share').trim(),
    win: el.dataset.win ?? null,
  }));
  const turns = [...document.querySelectorAll('.hp-camp .hp-camp-turn')].map((el) => ({
    from: el.dataset.from ?? null,
    opacity: getComputedStyle(el).opacity,
    text: clean(el.querySelector('.hp-camp-bubble')?.textContent).slice(0, 160),
  }));
  const metrics = [...document.querySelectorAll('.hp-camp .hp-camp-metric')].map((el) => ({
    turn: el.dataset.turn ?? null,
    opacity: getComputedStyle(el).opacity,
    text: clean(el.textContent).slice(0, 120),
  }));
  const runners = [...document.querySelectorAll('.hp-xl-runner')].map((el) => ({
    text: clean(el.innerText).slice(0, 300),
    lead: el.dataset.lead ?? null,
    transform: getComputedStyle(el).transform,
  }));
  const persona = [...document.querySelectorAll('.hp-xl-chip')].find((el) => el.hasAttribute('data-picked'));
  const messages = [...document.querySelectorAll('.hp-convo-message')].map((el) => ({
    from: el.dataset.from ?? null,
    opacity: getComputedStyle(el).opacity,
    text: clean(el.textContent).slice(0, 220),
  }));
  const caseSlots = [...document.querySelectorAll('.wire-case-slot')].map((el) => {
    const cs = getComputedStyle(el);
    return {
      covered: el.dataset.covered ?? null,
      transform: cs.transform,
      top: round(el.getBoundingClientRect().top),
      vars: {
        '--cover': cs.getPropertyValue('--cover').trim(),
        '--ghost-hue': cs.getPropertyValue('--ghost-hue').trim(),
        '--stack-depth': cs.getPropertyValue('--stack-depth').trim(),
        '--covered-depth': cs.getPropertyValue('--covered-depth').trim(),
      },
    };
  });
  const marksRun = document.querySelector('.wire-cases-marks-run');
  const marksCopies = [...document.querySelectorAll('.wire-cases-marks-run .wire-cases-marks-copy')].map((el) => ({
    rect: (() => { const r = el.getBoundingClientRect(); return { x: round(r.x), width: round(r.width) }; })(),
    marks: [...el.querySelectorAll('.wire-cases-mark')].slice(0, 3).map((m) => m.getAttribute('aria-label') || clean(m.textContent).slice(0, 40)),
  }));
  const notifyLayers = [...document.querySelectorAll('.hp-notify-layer')].map((el) => {
    const cs = getComputedStyle(el);
    return {
      layer: el.dataset.layer ?? null,
      turned: el.dataset.turned ?? null,
      opacity: cs.opacity,
      transform: cs.transform,
      animation: `${cs.animationName} ${cs.animationDuration} ${cs.animationDelay} ${cs.animationPlayState}`,
      rect: (() => { const r = el.getBoundingClientRect(); return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }; })(),
    };
  });

  return {
    scrollY: round(window.scrollY),
    pagePerfNowMs: round(performance.now()),
    viewport: { width: innerWidth, height: innerHeight },
    tickerText: stripRoot?.querySelector('.hp-hero-strip')?.innerText?.replace(/\s+/g, ' ').trim().slice(0, 500) || '',
    ticker: {
      stats,
      transform: run ? getComputedStyle(run).transform : null,
      animation: run ? `${getComputedStyle(run).animationName} ${getComputedStyle(run).animationDuration} ${getComputedStyle(run).animationDelay} ${getComputedStyle(run).animationPlayState}` : null,
      rowRect: row ? (() => { const r = row.getBoundingClientRect(); return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }; })() : null,
      dock: dock ? {
        rect: (() => { const r = dock.getBoundingClientRect(); return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }; })(),
        floating: dock.dataset.floating ?? null,
        intro: dock.dataset.intro ?? null,
        position: getComputedStyle(dock).position,
      } : null,
    },
    hero: {
      pin: pin ? (() => { const r = pin.getBoundingClientRect(); const cs = getComputedStyle(pin); return { rect: { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }, position: cs.position, top: cs.top, data: dataOf(pin), vars: { '--reel-count': cs.getPropertyValue('--reel-count').trim() } }; })() : null,
      stage: stage ? (() => { const r = stage.getBoundingClientRect(); const cs = getComputedStyle(stage); return { rect: { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }, position: cs.position, top: cs.top, data: dataOf(stage) }; })() : null,
      camp: camp ? (() => { const r = camp.getBoundingClientRect(); const cs = getComputedStyle(camp); return { rect: { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }, position: cs.position, top: cs.top, data: dataOf(camp), opacity: cs.opacity, transform: cs.transform, animation: cs.animationName }; })() : null,
      sticky: sticky ? (() => { const cs = getComputedStyle(sticky); return { position: cs.position, top: cs.top, data: dataOf(sticky) }; })() : null,
    },
    cards,
    backdrops,
    activeStates: {
      campTrack: track.map((b) => ({
        state: b.dataset.state ?? null,
        current: b.getAttribute('aria-current'),
        label: b.getAttribute('aria-label'),
      })),
      campStepIndex: track.findIndex((b) => b.dataset.state === 'live'),
      campScenes: scenes.map((el) => ({
        opening: el.hasAttribute('data-opening'),
        leaving: el.hasAttribute('data-leaving'),
        brand: clean(el.querySelector('.wire-visually-hidden')?.textContent) || null,
        opacity: getComputedStyle(el).opacity,
        animation: getComputedStyle(el).animationName,
      })),
      campInview: camp?.dataset.inview ?? null,
      campMotion: camp?.dataset.motion ?? null,
      heroDock: dock ? { floating: dock.dataset.floating ?? null, intro: dock.dataset.intro ?? null } : null,
      caseCovered: [...document.querySelectorAll('.wire-case-slot')].map((el) => el.dataset.covered ?? null),
      convoActive: convo?.dataset.active ?? null,
      closingInview: closing?.dataset.inview ?? null,
      closingSeen: closing?.dataset.seen ?? null,
      notify: notify ? {
        open: notify.dataset.open ?? null,
        scrolled: notify.dataset.scrolled ?? null,
        opacity: getComputedStyle(notify).opacity,
        visibility: getComputedStyle(notify).visibility,
        translate: getComputedStyle(notify).translate,
        layers: notifyLayers,
      } : null,
    },
    sceneData: {
      scoreFigure: clean(document.querySelector('.hp-camp-match-figure')?.textContent) || null,
      scoreBars,
      turns,
      metrics,
      experiment: {
        persona: clean(persona?.textContent) || null,
        rows: runners,
        cac: clean(document.querySelector('.hp-xl-cac')?.innerText).slice(0, 200) || null,
      },
      messages,
      caseSlots,
      marksRun: marksRun ? {
        transform: getComputedStyle(marksRun).transform,
        rect: (() => { const r = marksRun.getBoundingClientRect(); return { x: round(r.x), width: round(r.width), height: round(r.height) }; })(),
        copies: marksCopies,
      } : null,
      notifyLayers,
      closingCards: [...document.querySelectorAll('.hp-closing-cards .hp-camp-card')].map((el) => ({
        slot: el.dataset.slot ?? null,
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform,
        translate: getComputedStyle(el).translate,
        rect: (() => { const r = el.getBoundingClientRect(); return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) }; })(),
      })),
    },
    elements,
  };
};

async function captureSample(scene, step, {
  elapsedMs = null,
  targetMs = null,
  phase = null,
  selectors = [],
  note = null,
} = {}) {
  ensureScene(scene, sceneMeta.get(scene)?.description || '');
  await page.evaluate((sels) => { window.__motionSelectors = sels; }, selectors);
  const data = await page.evaluate(collect);
  const file = `${scene}/${step}.png`;
  await page.screenshot({ path: path.join(OUT, file), animations: 'allow' });
  const sample = {
    scene,
    step,
    phase,
    targetMs,
    elapsedMs: elapsedMs == null ? null : Math.round(elapsedMs),
    screenshot: file,
    capturedAt: new Date().toISOString(),
    ...data,
  };
  if (note) sample.note = note;
  sceneSamples.get(scene).push(sample);
  return sample;
}

function pickSceneData(sample) {
  return sample.sceneData;
}

async function gotoAndWarm() {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.wire-consent', { timeout: 30000 }).catch(() => {});
  const reject = page.getByRole('button', { name: /^Reject$/i }).first();
  if (await reject.count()) {
    await reject.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(500);
}

async function captureAnnouncement() {
  ensureScene('announcement', 'Announcement card load/entry/dismiss. Entry is delayed by the site until hydration; load frames are relative to navigation commit, entry/dismiss frames are exact CSS-transition states extracted by pausing and stepping the transition instead of racing screenshot latency.');
  const t0 = Date.now();
  const loadTimes = [0, 100, 200, 300, 500, 800, 1200];
  for (const target of loadTimes) {
    const wait = target - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await captureSample('announcement', `load-${String(target).padStart(4, '0')}`, {
      elapsedMs: Date.now() - t0,
      targetMs: target,
      phase: 'load',
      selectors: ANNOUNCE_SELECTORS,
      note: 'relative to navigation commit; actual pagePerfNowMs is authoritative',
    });
  }

  // Close the announcement on the load page; exact entry/dismiss is measured on a fresh page below.
  await page.evaluate(() => document.querySelector('.hp-notify-close')?.click());
  await page.waitForTimeout(700);

  const entryPage = await context.newPage();
  entryPage.setDefaultTimeout(30000);
  await entryPage.goto(URL, { waitUntil: 'commit', timeout: 90000 });
  const detected = await entryPage.evaluate(async () => {
    const raf = () => new Promise((r) => requestAnimationFrame(r));
    const limit = performance.now() + 20000;
    while (!document.querySelector('.hp-notify') && performance.now() < limit) await raf();
    const n = document.querySelector('.hp-notify');
    while (n && n.dataset.open !== 'true' && performance.now() < limit) await raf();
    const openedAt = performance.now();
    let anims = [];
    const t = performance.now();
    while (performance.now() - t < 1500) {
      anims = document.getAnimations().filter((a) => a.effect?.target === n && a.playState === 'running');
      if (anims.length) break;
      await raf();
    }
    anims.forEach((a) => a.pause());
    return {
      openedAt,
      detectedAt: performance.now(),
      fonts: document.fonts.status,
      transitionCount: anims.length,
      animations: anims.map((a) => ({
        property: a.transitionProperty || a.animationName,
        duration: a.effect.getTiming().duration,
        delay: a.effect.getTiming().delay,
        currentTime: a.currentTime,
      })),
    };
  });

  const scenePage = page;
  page = entryPage;
  for (const target of loadTimes) {
    await page.evaluate((t) => {
      const n = document.querySelector('.hp-notify');
      document.getAnimations()
        .filter((a) => a.effect?.target === n)
        .forEach((a) => { try { a.currentTime = t; } catch {} });
    }, target);
    await captureSample('announcement', `entry-${String(target).padStart(4, '0')}`, {
      elapsedMs: target,
      targetMs: target,
      phase: 'entry',
      selectors: ANNOUNCE_SELECTORS,
      note: `exact transition state at ${target} ms (animations paused); openedAt pagePerf=${detected.openedAt.toFixed(1)}`,
    });
  }

  await page.evaluate(() => document.querySelector('.hp-notify-close')?.click());
  const dismissDetected = await page.evaluate(async () => {
    const raf = () => new Promise((r) => requestAnimationFrame(r));
    let layer = null;
    let anims = [];
    const t = performance.now();
    while (performance.now() - t < 1500) {
      layer = document.querySelector('.hp-notify-layer[data-layer=leaving]');
      anims = layer ? document.getAnimations().filter((a) => a.effect?.target === layer && a.playState === 'running') : [];
      if (layer && anims.length) break;
      await raf();
    }
    anims.forEach((a) => a.pause());
    return {
      detectedAt: performance.now(),
      animations: anims.map((a) => ({
        property: a.transitionProperty || a.animationName,
        duration: a.effect.getTiming().duration,
        currentTime: a.currentTime,
      })),
    };
  });
  for (const target of [0, 100, 200, 300, 500, 800, 1200]) {
    await page.evaluate((t) => {
      const layer = document.querySelector('.hp-notify-layer[data-layer=leaving]');
      if (!layer) return;
      document.getAnimations()
        .filter((a) => a.effect?.target === layer)
        .forEach((a) => { try { a.currentTime = t; } catch {} });
    }, target);
    await captureSample('announcement', `dismiss-${String(target).padStart(4, '0')}`, {
      elapsedMs: target,
      targetMs: target,
      phase: 'dismiss',
      selectors: ANNOUNCE_SELECTORS,
      note: target <= 300
        ? `exact leave-animation state at ${target} ms (animations paused)`
        : `stepped beyond the 480 ms leave animation at ${target} ms; the live layer unmounts around 480 ms`,
    });
  }
  await page.close();
  page = scenePage;

  sceneMeta.set('announcement', {
    ...sceneMeta.get('announcement'),
    detected,
    dismissDetected,
    entryTimesMs: loadTimes,
    dismissalTimesMs: [0, 100, 200, 300, 500, 800, 1200],
    entryOpacityDurationMs: 320,
    entryTranslateDurationMs: 420,
    dismissalLeaveDurationMs: 480,
  });
}

async function scrollToY(y) {
  await page.evaluate((v) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, v);
  }, y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.waitForTimeout(80);
}

async function resetHeroToCampaignOne() {
  await scrollToY(2000);
  await page.waitForTimeout(450);
  await scrollToY(350);
  await page.waitForTimeout(120);
}

async function captureHeroScroll() {
  ensureScene('hp-camp-scroll', 'Hero campaign scene sampled every 50 px of scroll from 0 to 1600. There is no CSS sticky pin at 1568x900: .hp-camp stays position:relative and scrolls 1:1; the release point is where the camp bottom crosses the viewport top.');
  await scrollToY(2000);
  await page.waitForTimeout(400);
  await scrollToY(0);
  await page.waitForTimeout(800);
  const layout = await page.evaluate(() => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { y: b.y, height: b.height, bottom: b.bottom, position: getComputedStyle(el).position, top: getComputedStyle(el).top };
    };
    return {
      scrollY: window.scrollY,
      camp: r('.hp-camp'),
      stage: r('.hp-hero-stage'),
      pin: r('.hp-hero-pin'),
      campInview: document.querySelector('.hp-camp')?.dataset.inview ?? null,
      stagePosition: getComputedStyle(document.querySelector('.hp-hero-stage')).position,
      stageTop: getComputedStyle(document.querySelector('.hp-hero-stage')).top,
    };
  });
  const release = layout.camp.y + layout.camp.height;
  const stageRelease = layout.stage.y + layout.stage.height;
  const t0 = Date.now();
  for (let y = 0; y <= 1600; y += 50) {
    await scrollToY(y);
    await captureSample('hp-camp-scroll', `scroll-${String(y).padStart(4, '0')}`, {
      elapsedMs: Date.now() - t0,
      targetMs: y,
      phase: 'scroll',
      selectors: HERO_SELECTORS,
      note: 'scrollY target in px',
    });
  }
  await scrollToY(Math.ceil(release));
  await captureSample('hp-camp-scroll', `scroll-release-${Math.ceil(release)}`, {
    elapsedMs: Date.now() - t0,
    targetMs: Math.ceil(release),
    phase: 'scroll',
    selectors: HERO_SELECTORS,
    note: `camp bottom reaches viewport top; release=${release.toFixed(2)} px from layout at scrollY=0`,
  });
  const firstOff = sceneSamples.get('hp-camp-scroll').find((s) => s.phase === 'scroll' && s.activeStates.campInview === 'false');
  if (firstOff) {
    await scrollToY(firstOff.scrollY);
    await captureSample('hp-camp-scroll', `scroll-inviewoff-${Math.round(firstOff.scrollY)}`, {
      elapsedMs: Date.now() - t0,
      targetMs: firstOff.scrollY,
      phase: 'scroll',
      selectors: HERO_SELECTORS,
      note: 'first sampled scroll where .hp-camp data-inview=false',
    });
  }
  sceneMeta.set('hp-camp-scroll', {
    ...sceneMeta.get('hp-camp-scroll'),
    pinStart: 0,
    pinEnd: null,
    pinBasis: 'No sticky pin exists at 1568x900: .hp-hero-stage.hp-camp-sticky computes position:relative, top:0px. The hero scrolls 1:1.',
    effectivePinStart: 0,
    effectivePinEnd: Number(release.toFixed(2)),
    stageRelease: Number(stageRelease.toFixed(2)),
    totalScrollDistance: 1600,
    firstInviewFalseAtScroll: firstOff ? firstOff.scrollY : null,
    layoutAtScroll0: layout,
  });
}

async function captureHeroTime() {
  ensureScene('hp-camp-time', 'Hero campaign time series at fixed scrollY=350 after leaving and re-entering the hero (the site resets to campaign 1). Samples at 0..5000 ms.');
  await resetHeroToCampaignOne();
  const t0 = Date.now();
  await captureSample('hp-camp-time', 't-0000', {
    elapsedMs: 0, targetMs: 0, phase: 'time', selectors: HERO_TIME_SELECTORS,
  });
  for (const target of TIME_MS.slice(1)) {
    const wait = target - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await captureSample('hp-camp-time', `t-${String(target).padStart(4, '0')}`, {
      elapsedMs: Date.now() - t0,
      targetMs: target,
      phase: 'time',
      selectors: HERO_TIME_SELECTORS,
    });
  }
}

async function captureTimedScene(scene, description, scrollY, selectors) {
  ensureScene(scene, description);
  await scrollToY(scrollY);
  await page.waitForTimeout(100);
  const t0 = Date.now();
  await captureSample(scene, 't-0000', {
    elapsedMs: 0, targetMs: 0, phase: 'time', selectors,
    note: `scrollY=${scrollY}`,
  });
  for (const target of TIME_MS.slice(1)) {
    const wait = target - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await captureSample(scene, `t-${String(target).padStart(4, '0')}`, {
      elapsedMs: Date.now() - t0,
      targetMs: target,
      phase: 'time',
      selectors,
      note: `scrollY=${scrollY}`,
    });
  }
}

async function captureCaseScroll() {
  ensureScene('case-stack', 'Case-study deck. It has no time-driven advance at desktop: three position:sticky cards are stacked by scroll. Nine time samples plus eight scroll probes document both facts.');
  const t0 = Date.now();
  for (const y of [4800, 4950, 5100, 5250, 5400, 5550, 5700, 5850]) {
    await scrollToY(y);
    await page.waitForTimeout(120);
    await captureSample('case-stack', `scroll-${y}`, {
      elapsedMs: Date.now() - t0,
      targetMs: y,
      phase: 'scroll',
      selectors: CASE_SELECTORS,
      note: 'scroll-driven sticky deck probe',
    });
  }
}

async function captureClosingTime() {
  ensureScene('closing-cards', 'Closing band decorative campaign cards. The cards fade/translate in on data-seen (1 s) and then run the same camp CSS loops (6.4/7.2/9 s). Nine samples at 0..5000 ms.');
  await scrollToY(12676);
  await page.waitForFunction(() => document.querySelector('.hp-closing-cards')?.dataset.inview === 'true', null, { timeout: 5000 }).catch(() => {});
  const t0 = Date.now();
  await captureSample('closing-cards', 't-0000', {
    elapsedMs: 0, targetMs: 0, phase: 'time', selectors: CLOSING_SELECTORS,
    note: 'scrollY=12676, data-inview=true',
  });
  for (const target of TIME_MS.slice(1)) {
    const wait = target - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await captureSample('closing-cards', `t-${String(target).padStart(4, '0')}`, {
      elapsedMs: Date.now() - t0,
      targetMs: target,
      phase: 'time',
      selectors: CLOSING_SELECTORS,
      note: 'scrollY=12676, data-inview=true',
    });
  }
}

async function captureHover() {
  ensureScene('hover', 'Hover probes on Get started and hero campaign cards at 0/120/240/400 ms. Nav CTA transitions background-image .22 s; tano-button translates .18 s; hero cards have no hover rule. Hover transitions are paused and stepped to exact offsets.');
  const times = [0, 120, 240, 400];
  const hoverMeta = {};
  const hoverSeries = async (label, point, selectors, note, exact = true) => {
    await page.mouse.move(10, 860);
    await page.waitForTimeout(400);
    await captureSample('hover', `${label}-before`, {
      elapsedMs: 0, targetMs: null, phase: 'before', selectors, note,
    });
    await page.evaluate(() => { window.__preHoverAnims = new Set(document.getAnimations()); });
    await page.mouse.move(point.x, point.y, { steps: 3 });
    let freshInfo = [];
    if (exact) {
      freshInfo = await page.evaluate(async () => {
        const raf = () => new Promise((r) => requestAnimationFrame(r));
        const pre = window.__preHoverAnims || new Set();
        let fresh = [];
        const t = performance.now();
        while (performance.now() - t < 800) {
          fresh = document.getAnimations().filter((a) => !pre.has(a) && a.playState === 'running');
          if (fresh.length) break;
          await raf();
        }
        fresh.forEach((a) => a.pause());
        return fresh.map((a) => ({
          property: a.transitionProperty || a.animationName,
          duration: a.effect.getTiming().duration,
          delay: a.effect.getTiming().delay,
          target: a.effect?.target?.className?.baseVal ?? a.effect?.target?.className ?? null,
        }));
      });
    }
    hoverMeta[label] = { note, animations: freshInfo };
    if (!(exact && freshInfo.length)) hoverMeta[label].t0 = Date.now();
    for (const target of times) {
      if (exact && freshInfo.length) {
        await page.evaluate((t) => {
          const pre = window.__preHoverAnims || new Set();
          document.getAnimations()
            .filter((a) => !pre.has(a))
            .forEach((a) => { try { a.currentTime = t; } catch {} });
        }, target);
      } else {
        const wait = target - (Date.now() - hoverMeta[label].t0);
        if (wait > 0) await page.waitForTimeout(wait);
      }
      const elapsed = exact && freshInfo.length ? target : Date.now() - hoverMeta[label].t0;
      const sample = await captureSample('hover', `${label}-${String(target).padStart(4, '0')}`, {
        elapsedMs: elapsed,
        targetMs: target,
        phase: 'hover',
        selectors,
        note: exact && freshInfo.length
          ? `${note}; exact transition state at ${target} ms (paused)`
          : `${note}; no hover transition found; elapsedMs is wall-clock from the first target`,
      });
      sample.hoverTransitions = freshInfo;
    }
    if (freshInfo.length) {
      await page.evaluate(() => {
        const pre = window.__preHoverAnims || new Set();
        document.getAnimations().filter((a) => !pre.has(a)).forEach((a) => { try { a.play(); } catch {} });
      });
    }
  };

  await scrollToY(0);
  await page.waitForTimeout(250);
  const nav = page.locator('.wire-nav-action', { hasText: 'Get started' }).first();
  const navBox = await nav.boundingBox();
  await hoverSeries('nav-getstarted', { x: navBox.x + navBox.width / 2, y: navBox.y + navBox.height / 2 }, [
    { sel: '.wire-nav-action', label: 'navGetStarted', max: 1 },
    { sel: '.wire-spectrum-glow', label: 'navGlow', max: 1 },
  ], 'nav Get started');

  await scrollToY(8480);
  await page.waitForTimeout(300);
  const cta = page.locator('.hp-band a.tano-button', { hasText: 'Get started' }).first();
  const ctaBox = await cta.boundingBox();
  await hoverSeries('section-getstarted', { x: ctaBox.x + ctaBox.width / 2, y: ctaBox.y + ctaBox.height / 2 }, [
    { sel: '.hp-band a.tano-button', label: 'sectionGetStarted', max: 1 },
  ], 'section Get started');

  await scrollToY(0);
  await page.waitForTimeout(300);
  const send = page.locator('.hp-camp-card[data-slot="send"]').first();
  const sendBox = await send.boundingBox();
  await hoverSeries('stage-card-send', { x: sendBox.x + sendBox.width / 2, y: sendBox.y + sendBox.height / 2 }, [
    { sel: '.hp-camp-card[data-slot=send]', label: 'stageCardSend', max: 1 },
    { sel: '.hp-camp', label: 'hpCamp', max: 1 },
  ], 'hero stage card send', false);

  const lib = page.locator('.hp-camp-card[data-slot="library"]').first();
  const libBox = await lib.boundingBox();
  await page.mouse.move(libBox.x + libBox.width / 2, libBox.y + libBox.height / 2, { steps: 3 });
  await page.waitForTimeout(400);
  await captureSample('hover', 'stage-card-library-0400', {
    elapsedMs: 400, targetMs: 400, phase: 'hover',
    selectors: [{ sel: '.hp-camp-card[data-slot=library]', label: 'stageCardLibrary', max: 1 }],
    note: 'hero stage card library at settled hover; no hover rule exists',
  });
  sceneMeta.set('hover', { ...sceneMeta.get('hover'), targets: hoverMeta, timesMs: times });
}

async function main() {
  await rm(path.join(OUT, 'hp-camp-scroll'), { recursive: true, force: true });
  await rm(path.join(OUT, 'hp-camp-time'), { recursive: true, force: true });
  for (const d of ['counters', 'conversations', 'experiments', 'case-stack', 'logo-marquee', 'closing-cards', 'announcement', 'hover']) {
    await rm(path.join(OUT, d), { recursive: true, force: true });
  }
  for (const d of ['hp-camp-scroll', 'hp-camp-time', 'counters', 'conversations', 'experiments', 'case-stack', 'logo-marquee', 'closing-cards', 'announcement', 'hover']) {
    await mkdir(path.join(OUT, d), { recursive: true });
  }

  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    colorScheme: 'light',
    locale: 'en-GB',
  });
  page = await context.newPage();
  page.setDefaultTimeout(30000);

  await gotoAndWarm();
  await page.reload({ waitUntil: 'commit', timeout: 90000 });
  await captureAnnouncement();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await resetMotion();

  await captureHeroScroll();
  await captureHeroTime();
  await captureTimedScene(
    'counters',
    'Hero ticker/counters. Values update on a random-ish 1.6 s interval; the strip itself is a 36 s CSS marquee. Nine samples at 0..5000 ms, scrollY=944.',
    944,
    COUNT_SELECTORS,
  );
  await captureTimedScene(
    'conversations',
    'Conversation thread. All six turns render together; there is no per-turn timer at desktop. Nine samples at 0..5000 ms, scrollY=3000.',
    3000,
    CONVO_SELECTORS,
  );
  await captureTimedScene(
    'experiments',
    'Experiment table. Rounds advance every 4.2 s and displayed rates/CAC jitter every 1 s. Nine samples at 0..5000 ms, scrollY=4000.',
    4000,
    EXP_SELECTORS,
  );
  await captureTimedScene(
    'case-stack',
    'Case-study deck. It has no time-driven advance at desktop: three position:sticky cards are stacked by scroll. Nine time samples plus eight scroll probes document both facts.',
    4800,
    CASE_SELECTORS,
  );
  await captureCaseScroll();
  await captureTimedScene(
    'logo-marquee',
    'Logo marquee. JS-driven translate3d at 26 px/s with a 0.9 s speed easing, only while the strip intersects. Nine samples at 0..5000 ms, scrollY=1396.',
    1396,
    LOGO_SELECTORS,
  );
  await captureClosingTime();
  await captureHover();

  const scenes = [...sceneSamples.entries()].map(([name, samples]) => ({
    ...sceneMeta.get(name),
    sampleCount: samples.length,
    timeSampleCount: samples.filter((s) => s.phase === 'time').length,
    scrollSampleCount: samples.filter((s) => s.phase === 'scroll').length,
    samples,
  }));

  const index = {
    generatedAt: new Date().toISOString(),
    url: URL,
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    methodology: {
      browser: 'Playwright Chromium headless',
      screenshot: 'viewport PNG, 1568x900, animations allowed',
      fonts: 'document.fonts.ready awaited before scene captures',
      announcement: 'captured separately then dismissed via its close button; cookie consent rejected before the measured run',
      scroll: 'window.scrollTo with scroll-behavior:auto, two rAF plus ~80 ms settle',
      time: 'target offsets 0/250/500/750/1000/1500/2000/3000/5000 ms; elapsedMs is the measured pre-screenshot time',
      elementSchema: 'rect/opacity/transform/position/animation/transition/vars/data/aria/text per element',
    },
    scenes,
  };
  await writeFile(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`wrote ${scenes.length} scenes, ${scenes.reduce((n, s) => n + s.sampleCount, 0)} samples`);
  for (const s of scenes) console.log(`${s.name}: ${s.sampleCount} (time ${s.timeSampleCount}, scroll ${s.scrollSampleCount})`);
  await browser.close();
}

main().catch(async (err) => {
  console.error(err);
  if (browser) await browser.close().catch(() => {});
  process.exit(1);
});
