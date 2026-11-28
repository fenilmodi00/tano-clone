/**
 * Nav cartwheel, ported from the live Tano bundle.
 *
 * While the bar seeds and expands, the hidden square holds a cartwheel Tano
 * mark instead of the flat glyph. The mark is rebuilt each frame from the
 * glyph outline: roll physics drive a drive/turn state, `flexMark` bends the
 * outline, and the resulting path is rotated with the bar's travel easing.
 * At rest it hands back to the static `<svg>` glyph.
 */

type Point = { x: number; y: number };

type RollOptions = {
  secondsPerTurn: number;
  apexClearance?: number;
  tempoShape?: number;
  samples?: number;
};

type RollFrame = {
  turn: number;
  height: number;
  drive: number;
  contactBearing: number;
};

type FlexOptions = {
  limbLag?: number;
  reach?: number;
  plant?: number;
};

const SAMPLE_STEP = 2.5;
const LIMB_ANGLE = ((2 * Math.PI) / 5) * 0.62;
const TRAVEL_EASE = { x1: 0.22, y1: 1, x2: 0.36, y2: 1 };

function parseGlyphPath(source: string): Point[] {
  const tokens = source.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  if (!tokens) throw new Error("Glyph path is empty");

  const points: Point[] = [];
  let index = 0;
  let command = "";
  let current = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };

  const readNumber = (): number => {
    const value = Number(tokens[index]);
    index += 1;
    if (Number.isNaN(value)) throw new Error(`Glyph path: expected a number at ${index}`);
    return value;
  };

  const sampleCubic = (controlA: Point, controlB: Point, end: Point): void => {
    const steps = Math.max(
      2,
      Math.ceil(
        (Math.hypot(controlA.x - current.x, controlA.y - current.y) +
          Math.hypot(controlB.x - controlA.x, controlB.y - controlA.y) +
          Math.hypot(end.x - controlB.x, end.y - controlB.y)) /
          SAMPLE_STEP,
      ),
    );
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const inverse = 1 - t;
      points.push({
        x:
          inverse * inverse * inverse * current.x +
          3 * inverse * inverse * t * controlA.x +
          3 * inverse * t * t * controlB.x +
          t * t * t * end.x,
        y:
          inverse * inverse * inverse * current.y +
          3 * inverse * inverse * t * controlA.y +
          3 * inverse * t * t * controlB.y +
          t * t * t * end.y,
      });
    }
    current = end;
  };

  while (index < tokens.length) {
    const token = tokens[index];
    if (/[A-Za-z]/.test(token)) {
      command = token;
      index += 1;
    }
    if (command === "M") {
      current = { x: readNumber(), y: readNumber() };
      start = current;
      points.push(current);
      command = "L";
      continue;
    }
    if (command === "L") {
      current = { x: readNumber(), y: readNumber() };
      points.push(current);
      continue;
    }
    if (command === "C") {
      sampleCubic(
        { x: readNumber(), y: readNumber() },
        { x: readNumber(), y: readNumber() },
        { x: readNumber(), y: readNumber() },
      );
      continue;
    }
    if (command === "Z" || command === "z") {
      current = start;
      break;
    }
    throw new Error(`Glyph path: unsupported command "${command}"`);
  }

  return points;
}

function convexHull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (origin: Point, a: Point, b: Point) =>
    (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
  const half = (list: Point[]) => {
    const stack: Point[] = [];
    for (const point of list) {
      while (
        stack.length >= 2 &&
        cross(stack[stack.length - 2], stack[stack.length - 1], point) <= 0
      )
        stack.pop();
      stack.push(point);
    }
    return stack;
  };
  const lower = half(sorted);
  const upper = half([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function createGeometry(path: string) {
  const sampled = parseGlyphPath(path);

  let areaSum = 0;
  let momentX = 0;
  let momentY = 0;
  let secondX = 0;
  let secondY = 0;
  for (let index = 0; index < sampled.length; index += 1) {
    const point = sampled[index];
    const next = sampled[(index + 1) % sampled.length];
    const cross = point.x * next.y - next.x * point.y;
    areaSum += cross;
    momentX += (point.x + next.x) * cross;
    momentY += (point.y + next.y) * cross;
    secondX += (point.x * point.x + point.x * next.x + next.x * next.x) * cross;
    secondY += (point.y * point.y + point.y * next.y + next.y * next.y) * cross;
  }

  const area = areaSum / 2;
  const centroid = { x: momentX / (6 * area), y: momentY / (6 * area) };
  const radiusOfGyrationSq =
    (Math.abs(secondX / 12 + secondY / 12) -
      Math.abs(area) * (centroid.x * centroid.x + centroid.y * centroid.y)) /
    Math.abs(area);
  const outline = sampled.map((point) => ({ x: point.x - centroid.x, y: point.y - centroid.y }));
  const hull = convexHull(outline);

  let maxRadius = 0;
  for (const point of hull) maxRadius = Math.max(maxRadius, Math.hypot(point.x, point.y));
  maxRadius = Math.round(maxRadius * 1e6) / 1e6;

  return { centroid, outline, hull, maxRadius, radiusOfGyrationSq };
}

function createFlexMark(outline: Point[], maxRadius: number) {
  const limbs = outline.map((point) => {
    const distance = Math.hypot(point.x, point.y);
    const length = distance === 0 ? 1 : distance;
    return {
      x: point.x,
      y: point.y,
      ux: point.x / length,
      uy: point.y / length,
      weight: (distance / maxRadius) ** 2,
    };
  });
  const count = limbs.length;
  const xs = new Float64Array(count);
  const ys = new Float64Array(count);

  const cube = (value: number) => {
    if (value <= 0) return 0;
    const square = value * value;
    return square * square;
  };

  return (frame: RollFrame, options: FlexOptions = {}) => {
    const limbLag = options.limbLag ?? 0.26;
    const reach = options.reach ?? 0.07;
    const plant = options.plant ?? 0.045;
    const contact = frame.contactBearing;
    const lag = contact - LIMB_ANGLE;
    const cosContact = Math.cos(contact);
    const sinContact = Math.sin(contact);
    const cosLag = Math.cos(lag);
    const sinLag = Math.sin(lag);
    const bend = -frame.drive * limbLag;
    const bendCubic = bend - (bend * bend * bend) / 6;
    const bendQuadratic = 1 - (bend * bend) / 2;
    const turnSin = Math.sin(frame.turn);
    const turnCos = Math.cos(frame.turn);
    let height = -Infinity;

    for (let index = 0; index < count; index += 1) {
      const limb = limbs[index];
      const wave =
        1 +
        limb.weight *
          (reach * cube(limb.ux * cosLag + limb.uy * sinLag) -
            plant * cube(limb.ux * cosContact + limb.uy * sinContact));
      const bendWeight = limb.weight;
      const bendDirection = bendCubic * bendWeight;
      const scale = 1 - (1 - bendQuadratic) * bendWeight;
      const x = wave * (limb.x * scale - limb.y * bendDirection);
      const y = wave * (limb.x * bendDirection + limb.y * scale);
      xs[index] = x;
      ys[index] = y;
      const projected = turnSin * x + turnCos * y;
      if (projected > height) height = projected;
    }

    const parts = [
      `M${((xs[count - 1] + xs[0]) / 2).toFixed(2)} ${((ys[count - 1] + ys[0]) / 2).toFixed(2)}`,
    ];
    for (let index = 0; index < count; index += 1) {
      const next = (index + 1) % count;
      parts.push(
        `Q${xs[index].toFixed(2)} ${ys[index].toFixed(2)} ${((xs[index] + xs[next]) / 2).toFixed(2)} ${((ys[index] + ys[next]) / 2).toFixed(2)}`,
      );
    }
    parts.push("Z");

    return { path: parts.join(""), height };
  };
}

function createBuildRoll(hull: Point[], radiusOfGyrationSq: number) {
  return ({ secondsPerTurn, apexClearance = 6, tempoShape = 1.25, samples = 720 }: RollOptions) => {
    const step = (Math.PI * 2) / samples;
    const heights = new Float64Array(samples);
    const contacts = new Float64Array(samples);

    for (let sample = 0; sample < samples; sample += 1) {
      const angle = sample * step;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      let height = -Infinity;
      let contact = 0;
      for (const point of hull) {
        const projection = sin * point.x + cos * point.y;
        if (projection > height) {
          height = projection;
          contact = cos * point.x - sin * point.y;
        }
      }
      heights[sample] = height;
      contacts[sample] = contact;
    }

    let maxHeight = -Infinity;
    for (let index = 0; index < samples; index += 1) {
      if (heights[index] > maxHeight) maxHeight = heights[index];
    }
    const apex = maxHeight + apexClearance;

    const rates = new Float64Array(samples);
    for (let index = 0; index < samples; index += 1) {
      const height = heights[index];
      const contact = contacts[index];
      const speed = Math.sqrt(
        (2 * (apex - height)) / (contact * contact + height * height + radiusOfGyrationSq),
      );
      rates[index] = speed ** tempoShape;
    }

    const time = new Float64Array(samples + 1);
    const travel = new Float64Array(samples + 1);
    for (let index = 0; index < samples; index += 1) {
      time[index + 1] = time[index] + step / rates[index];
      travel[index + 1] = travel[index] + heights[index] * step;
    }

    const turnScale = secondsPerTurn / time[samples];
    for (let index = 0; index <= samples; index += 1) time[index] *= turnScale;
    for (let index = 0; index < samples; index += 1) rates[index] /= turnScale;

    const slope = new Float64Array(samples);
    for (let index = 0; index < samples; index += 1) {
      const previous = rates[(index - 1 + samples) % samples];
      const next = rates[(index + 1) % samples];
      slope[index] = ((next - previous) * rates[index]) / (2 * step);
    }

    const angular = (1.4 * Math.PI * 10) / secondsPerTurn;
    const drive = new Float64Array(samples);
    let velocity = 0;
    let acceleration = 0;
    for (let pass = 0; pass < 6; pass += 1) {
      for (let index = 0; index < samples; index += 1) {
        const span = time[index + 1] - time[index];
        const substeps = Math.max(1, Math.ceil((span * angular) / 0.2));
        const delta = span / substeps;
        for (let substep = 0; substep < substeps; substep += 1) {
          const force = angular * angular * (slope[index] - velocity);
          const damping = 1.7 * angular * acceleration;
          acceleration += (force - damping) * delta;
          velocity += acceleration * delta;
        }
        if (pass === 5) drive[index] = velocity;
      }
    }

    let peak = 0;
    for (let index = 0; index < samples; index += 1) {
      peak = Math.max(peak, Math.abs(drive[index]));
    }
    if (peak > 0) for (let index = 0; index < samples; index += 1) drive[index] /= peak;

    const bearing = new Float64Array(samples);
    for (let index = 0; index < samples; index += 1) {
      bearing[index] = Math.atan2(heights[index], contacts[index]) - index * step;
    }

    return {
      frameAt: (seconds: number): RollFrame & { travel: number; turnRate: number } => {
        const turns = Math.floor(seconds / secondsPerTurn);
        const local = seconds - turns * secondsPerTurn;
        let low = 0;
        let high = samples;
        while (high - low > 1) {
          const middle = (low + high) >> 1;
          if (time[middle] <= local) low = middle;
          else high = middle;
        }
        const span = time[low + 1] - time[low];
        const fraction = span > 0 ? (local - time[low]) / span : 0;
        const next = (low + 1) % samples;
        return {
          turn: (low + fraction) * step,
          height: heights[low] + (heights[next] - heights[low]) * fraction,
          travel:
            turns * travel[samples] + travel[low] + (travel[low + 1] - travel[low]) * fraction,
          turnRate: rates[low] + (rates[next] - rates[low]) * fraction,
          drive: drive[low] + (drive[next] - drive[low]) * fraction,
          contactBearing:
            Math.abs(bearing[next] - bearing[low]) < 1
              ? bearing[low] + (bearing[next] - bearing[low]) * fraction
              : bearing[low],
        };
      },
    };
  };
}

function ease(progress: number): number {
  const { x1, y1, x2, y2 } = TRAVEL_EASE;
  const bezier = (a: number, b: number, t: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  const derivative = (a: number, b: number, t: number) =>
    3 * (1 - t) * (1 - t) * a + 6 * (1 - t) * t * (b - a) + 3 * t * t * (1 - b);
  let t = progress;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const error = bezier(x1, x2, t) - progress;
    const slope = derivative(x1, x2, t);
    if (slope === 0) break;
    t -= error / slope;
  }
  return bezier(y1, y2, Math.min(1, Math.max(0, t)));
}

function gradientTransform(centroid: Point): string {
  const [a, b, c, d] = [-73.3295, -212.012, 181.351, -72.7727];
  return `matrix(${a} ${b} ${c} ${d} ${(153.8 - centroid.x).toFixed(4)} ${(189.99 - centroid.y).toFixed(4)})`;
}

/**
 * Adds the cartwheel to the nav glyph and rolls it for the bar's travel
 * stage. Returns its cleanup; the observer and rAF are owned here so the
 * header stays free of motion detail.
 */
export function mountNavCartwheel(bar: HTMLElement, gradientId: string): () => void {
  const glyph = bar.querySelector<HTMLElement>(".wire-nav-mark-glyph");
  const source = glyph
    ?.querySelector<SVGPathElement>("svg.wire-nav-mark-art path")
    ?.getAttribute("d");
  if (!glyph || !source) return () => {};

  const geometry = createGeometry(source);
  const radius = 1.12 * geometry.maxRadius;
  const roll = document.createElement("span");
  roll.className = "wire-nav-mark-roll";
  roll.setAttribute("aria-hidden", "true");
  roll.innerHTML = `<svg class="wire-nav-mark-roll-art" viewBox="${-radius} ${-radius} ${radius * 2} ${radius * 2}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient cx="0" cy="0" gradientTransform="${gradientTransform(geometry.centroid)}" gradientUnits="userSpaceOnUse" id="${gradientId}" r="1"><stop offset="0" stop-color="var(--spectrum-cyan, #46b7d1)"></stop><stop offset="0.5" stop-color="var(--spectrum-magenta, #cc6add)"></stop><stop offset="1" stop-color="var(--spectrum-orange, #fb751f)"></stop></radialGradient></defs><path fill="url(#${gradientId})"></path></svg>`;
  glyph.append(roll);

  const rollPath = roll.querySelector<SVGPathElement>("path");
  if (!rollPath) {
    roll.remove();
    return () => {};
  }

  const motion = createBuildRoll(
    geometry.hull,
    geometry.radiusOfGyrationSq,
  )({
    secondsPerTurn: 1,
    apexClearance: 10,
    tempoShape: 0.8,
  });
  const flexMark = createFlexMark(geometry.outline, geometry.maxRadius);
  const restHeight = motion.frameAt(0).height;
  const scale = roll.clientHeight / (2 * radius) || 1;

  const paint = (progress: number) => {
    const eased = ease(progress);
    const frame = motion.frameAt((1 - eased) * 2);
    const remaining = 1 - eased;
    const mark = flexMark(
      { ...frame, drive: -frame.drive },
      { reach: 0, limbLag: 0.26 * remaining, plant: 0.1 * remaining },
    );
    rollPath.setAttribute("d", mark.path);
    roll.style.transform = `translateY(${((restHeight - mark.height) * scale).toFixed(2)}px) rotate(${((180 * frame.turn) / Math.PI).toFixed(3)}deg)`;
  };

  let raf = 0;
  let startedAt = 0;
  const duration = () => {
    const raw = Number.parseFloat(window.getComputedStyle(bar).getPropertyValue("--nav-travel-ms"));
    return Number.isFinite(raw) && raw > 0 ? raw : 1000;
  };
  const tick = (now: number) => {
    if (startedAt === 0) startedAt = now;
    const progress = Math.min(1, (now - startedAt) / duration());
    paint(progress);
    if (progress < 1) raf = window.requestAnimationFrame(tick);
    else raf = 0;
  };
  const stop = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  };
  const play = () => {
    stop();
    startedAt = 0;
    raf = window.requestAnimationFrame(tick);
  };

  const observer = new MutationObserver(() => {
    if (bar.dataset.stage === "travel") play();
    else if (bar.dataset.stage === "settled") {
      stop();
      paint(1);
    }
  });
  observer.observe(bar, { attributeFilter: ["data-stage"] });

  paint(1);
  if (bar.dataset.stage === "travel") play();

  return () => {
    stop();
    observer.disconnect();
    roll.remove();
  };
}
