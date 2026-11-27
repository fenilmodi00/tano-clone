/**
 * Owner: ConvoExperiments.
 *
 * The `.hp-xl` experiment loop: the six authored rounds (persona, rows, CAC)
 * and the pure geometry/state math the source uses for the connector wires,
 * the travelling dots and the 1 s rate/CAC jitter.
 *
 * Source component: 3wa99p2ledxp-.js (module 21244). Loop clock: 4200 ms per
 * round, 1000 ms jitter interval, reset on play-zone leave.
 */

export interface ExperimentRow {
  readonly message: string;
  readonly incentive: string;
  readonly content: string;
  readonly rate: number;
}

export interface ExperimentRound {
  readonly persona: number;
  readonly cac: number;
  readonly rows: readonly ExperimentRow[];
}

export const EXPERIMENT_PERSONAS: readonly string[] = [
  "Home and lifestyle",
  "New parents",
  "Gift givers",
  "Plant lovers",
  "Dinner hosts",
];

export const EXPERIMENT_HEADERS: readonly {
  readonly step: string | null;
  readonly label: string;
}[] = [
  { step: "01", label: "Messaging" },
  { step: "02", label: "Incentivise" },
  { step: "03", label: "Content" },
  { step: null, label: "Result" },
];

/** Source `p`: six rounds, each adding the winning persona/row set. */
export const EXPERIMENT_ROUNDS: readonly ExperimentRound[] = [
  {
    persona: 0,
    cac: 32.1,
    rows: [
      { message: "Variant A", incentive: "Commission increase", content: "A letterbox unboxing, the first look on camera", rate: 4.3 },
      { message: "Variant B", incentive: "Bouquet and code", content: "Styling the bunch in a vase at home", rate: 3.6 },
      { message: "Variant C", incentive: "Monthly bouquet", content: "Gifting a friend, the doorstep surprise", rate: 2.4 },
    ],
  },
  {
    persona: 1,
    cac: 30.4,
    rows: [
      { message: "Variant B", incentive: "Bouquet and code", content: "Styling the bunch in a vase at home", rate: 4.9 },
      { message: "Variant A", incentive: "Commission increase", content: "A letterbox unboxing, the first look on camera", rate: 3.9 },
      { message: "Variant A", incentive: "Early access", content: "Laying the table for a dinner party", rate: 3.1 },
    ],
  },
  {
    persona: 2,
    cac: 28.9,
    rows: [
      { message: "Variant A", incentive: "Early access", content: "Gifting a friend, the doorstep surprise", rate: 5.3 },
      { message: "Variant B", incentive: "Bouquet and code", content: "Styling the bunch in a vase at home", rate: 4.6 },
      { message: "Variant A", incentive: "Commission increase", content: "A letterbox unboxing, the first look on camera", rate: 3.6 },
    ],
  },
  {
    persona: 3,
    cac: 27.6,
    rows: [
      { message: "Variant A", incentive: "Early access", content: "Gifting a friend, the doorstep surprise", rate: 5.1 },
      { message: "Variant C", incentive: "Bouquet and code", content: "Laying the table for a dinner party", rate: 4.2 },
      { message: "Variant B", incentive: "Bouquet and code", content: "Styling the bunch in a vase at home", rate: 3.8 },
    ],
  },
  {
    persona: 4,
    cac: 26.2,
    rows: [
      { message: "Variant C", incentive: "Bouquet and code", content: "Laying the table for a dinner party", rate: 5.6 },
      { message: "Variant A", incentive: "Early access", content: "Gifting a friend, the doorstep surprise", rate: 5.2 },
      { message: "Variant B", incentive: "Monthly bouquet", content: "A letterbox unboxing, the first look on camera", rate: 3.4 },
    ],
  },
  {
    persona: 0,
    cac: 24.8,
    rows: [
      { message: "Variant C", incentive: "Bouquet and code", content: "Laying the table for a dinner party", rate: 5.8 },
      { message: "Variant A", incentive: "Early access", content: "Gifting a friend, the doorstep surprise", rate: 5 },
      { message: "Variant C", incentive: "Commission increase", content: "Styling the bunch in a vase at home", rate: 4.1 },
    ],
  },
];

export const EXPERIMENT_ROUND_MS = 4200;
export const EXPERIMENT_JITTER_MS = 1000;
export const EXPERIMENT_BAR_MAX = 6.4;

/** Source `m(e)`: deterministic ±1 noise that changes every second. */
function experimentNoise(seed: number): number {
  const value = 43758.5453 * Math.sin(12.9898 * seed);
  return (value - Math.floor(value)) * 2 - 1;
}

export function experimentRate(
  base: number,
  tick: number,
  rowIndex: number,
  reduced: boolean,
): number {
  if (reduced || tick === 0) return base;
  return Math.round((base + 0.15 * experimentNoise(31 * tick + rowIndex)) * 10) / 10;
}

export function experimentCac(
  base: number,
  tick: number,
  reduced: boolean,
): number {
  if (reduced || tick === 0) return base;
  return Math.round((base + 0.35 * experimentNoise(17 * tick + 5)) * 100) / 100;
}

export interface ExperimentCacSeries {
  readonly path: string;
  readonly cx: number;
  readonly cy: number;
}

/** Source `g({step})`: the CAC sparkline grows one point per completed round. */
export function experimentCacSeries(step: number): ExperimentCacSeries {
  const min = Math.min(...EXPERIMENT_ROUNDS.map((round) => round.cac));
  const max = Math.max(...EXPERIMENT_ROUNDS.map((round) => round.cac));
  const span = max - min || 1;
  const length = EXPERIMENT_ROUNDS.length;
  const index = ((step % length) + length) % length;
  const points = EXPERIMENT_ROUNDS.slice(0, index + 1).map((round, i) => ({
    x: 4 + (i / (length - 1)) * 80,
    y: 4 + (1 - (round.cac - min) / span) * 28,
  }));
  const last = points[points.length - 1] ?? { x: 4, y: 4 };
  const path = points
    .map((point, i) => {
      if (i === 0) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      const previous = points[i - 1] ?? point;
      const mid = (previous.x + point.x) / 2;
      return `C ${mid.toFixed(1)} ${previous.y.toFixed(1)}, ${mid.toFixed(1)} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    })
    .join(" ");
  return { path, cx: last.x, cy: last.y };
}

export interface ExperimentBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface ExperimentWirePath {
  readonly id: string;
  readonly d: string;
  readonly lead: boolean;
}

export interface ExperimentWires {
  readonly width: number;
  readonly height: number;
  readonly strings: readonly ExperimentWirePath[];
  readonly loop: string;
}

export interface ExperimentWireInput {
  readonly width: number;
  readonly height: number;
  readonly pickedChip: ExperimentBox;
  readonly provenGroup: ExperimentBox;
  readonly setupCard: ExperimentBox;
  readonly cac: ExperimentBox;
  readonly runners: readonly ExperimentBox[];
}

/** Source `b(e,t,a,s,r)`: straight run to the column edge, then a cubic. */
function sourceRoute(
  fromX: number,
  fromY: number,
  columnEdge: number,
  toX: number,
  toY: number,
): string {
  const bend = (toX - columnEdge) * 0.55;
  return `M ${fromX} ${fromY} L ${columnEdge} ${fromY} C ${columnEdge + bend} ${fromY}, ${toX - bend} ${toY}, ${toX} ${toY}`;
}

/**
 * Reproduces the source's measured wire pass. All coordinates are offset
 * boxes relative to `.hp-xl` (`offsetLeft/Top/Width/Height`, not client
 * rects), which is why the shipped paths carry integer coordinates.
 */
export function buildExperimentWires(
  input: ExperimentWireInput,
): ExperimentWires {
  const { pickedChip, provenGroup, setupCard, cac, runners } = input;
  const columnEdge = setupCard.left + setupCard.width;
  const strings: ExperimentWirePath[] = [];

  for (const source of [
    { id: "persona", box: pickedChip },
    { id: "proven", box: provenGroup },
  ]) {
    const fromX = source.box.left + source.box.width;
    const fromY = source.box.top + source.box.height / 2;
    runners.forEach((runner, index) => {
      strings.push({
        id: `${source.id}-${index}`,
        d: sourceRoute(
          fromX,
          fromY,
          columnEdge,
          runner.left,
          runner.top + runner.height / 2,
        ),
        lead: index === 0,
      });
    });
  }

  const cacCentreY = cac.top + cac.height / 2;
  const cacRight = cac.left + cac.width;
  runners.forEach((runner, index) => {
    const fromX = runner.left + runner.width;
    const fromY = runner.top + runner.height / 2;
    const busX = fromX + 36 - 14 * index;
    const bend = Math.max(
      0,
      Math.min(18, (cacCentreY - fromY) / 2, busX - cacRight),
    );
    strings.push({
      id: `out-${index}`,
      d:
        `M ${fromX} ${fromY} L ${busX - bend} ${fromY} ` +
        `Q ${busX} ${fromY} ${busX} ${fromY + bend} ` +
        `L ${busX} ${cacCentreY - bend} ` +
        `Q ${busX} ${cacCentreY} ${busX - bend} ${cacCentreY} ` +
        `L ${cacRight} ${cacCentreY}`,
      lead: index === 0,
    });
  });

  const provenCentreX = provenGroup.left + provenGroup.width / 2;
  const loopStartX = cac.left;
  const loopStartY = cacCentreY;
  const loopX = loopStartX - 28;
  const setupBottom = setupCard.top + setupCard.height;
  const loopBottom = Math.max(cacCentreY, setupBottom) + 32;
  const bend = Math.max(
    0,
    Math.min(
      18,
      (loopX - provenCentreX) / 2,
      (loopBottom - cacCentreY) / 2,
      (loopBottom - setupBottom) / 2,
    ),
  );
  const loop =
    `M ${loopStartX} ${loopStartY} L ${loopX + bend} ${loopStartY} ` +
    `Q ${loopX} ${loopStartY} ${loopX} ${loopStartY + bend} ` +
    `L ${loopX} ${loopBottom - bend} ` +
    `Q ${loopX} ${loopBottom} ${loopX - bend} ${loopBottom} ` +
    `L ${provenCentreX + bend} ${loopBottom} ` +
    `Q ${provenCentreX} ${loopBottom} ${provenCentreX} ${loopBottom - bend} ` +
    `L ${provenCentreX} ${setupBottom}`;

  return { width: input.width, height: input.height, strings, loop };
}
