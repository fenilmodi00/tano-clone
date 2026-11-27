/**
 * Owner: ConvoExperiments.
 *
 * The conversation figure's real content and the pure geometry for the
 * connector strings that the source draws after hydration. The SSR replica
 * already carries the reads panel, the six-message thread and the seven fact
 * marks; only the 14 `<g class="hp-convo-string">` routes are client-rendered.
 *
 * Source component: 3wa99p2ledxp-.js (module 70445 data, module 10846 view).
 */

export type ConversationKey =
  | "voice"
  | "brief"
  | "verdicts"
  | "thread"
  | "gift"
  | "code"
  | "posts";

export type ConversationSpeaker = "agent" | "creator";

export interface ConversationChip {
  readonly key: ConversationKey;
  readonly label: string;
  readonly icon: string;
}

export interface ConversationSource {
  readonly name: string;
  readonly chips: readonly ConversationChip[];
}

export type ConversationRun =
  | string
  | { readonly text: string; readonly from: ConversationKey };

export interface ConversationMessage {
  readonly id: string;
  readonly from: ConversationSpeaker;
  readonly runs: readonly ConversationRun[];
}

export interface ConversationFigure {
  readonly readsLabel: string;
  readonly sources: readonly ConversationSource[];
  readonly chat: {
    readonly label: string;
    readonly agent: string;
    readonly creator: string;
    readonly creatorAvatar: string;
    readonly messages: readonly ConversationMessage[];
  };
}

export const CONVERSATION_FIGURE: ConversationFigure = {
  readsLabel: "Read before every reply",
  sources: [
    {
      name: "Brand",
      chips: [
        { key: "voice", label: "Tone of voice", icon: "userSpeaking" },
        { key: "brief", label: "Programme details", icon: "notepadList" },
        { key: "verdicts", label: "Past verdicts", icon: "like" },
      ],
    },
    {
      name: "Creator",
      chips: [
        { key: "thread", label: "Every thread", icon: "chatBubbleSquare" },
        { key: "gift", label: "Delivered gifts", icon: "shipmentCheck" },
        { key: "code", label: "Product codes", icon: "tag" },
        { key: "posts", label: "Post history", icon: "gallery" },
      ],
    },
  ],
  chat: {
    label: "Messages with the creator",
    agent: "Ava at Ochre",
    creator: "Lena",
    creatorAvatar: "/sites/tano/images/avatar-15.jpg",
    messages: [
      {
        id: "hello",
        from: "agent",
        runs: [
          "Hey Lena! ",
          { text: "Hope the deload week went well", from: "thread" },
          ".",
        ],
      },
      {
        id: "gift",
        from: "agent",
        runs: [
          "Glad ",
          { text: "the gift arrived on Tuesday", from: "gift" },
          ". ",
          { text: "Your recovery-day video", from: "posts" },
          " is doing really well.",
        ],
      },
      {
        id: "thanks",
        from: "creator",
        runs: ["Thank you! The candle’s already half gone."],
      },
      {
        id: "code",
        from: "agent",
        runs: [
          { text: "Love that", from: "voice" },
          "! Your code ",
          { text: "TANOCAMPAIGN", from: "code" },
          " is still live.",
        ],
      },
      {
        id: "ask",
        from: "agent",
        runs: [
          "Could ",
          { text: "your second post go up by Friday", from: "brief" },
          "? ",
          { text: "The brand loved your routine", from: "verdicts" },
          ", so more of that would be perfect.",
        ],
      },
      {
        id: "yes",
        from: "creator",
        runs: ["Sounds good. Friday it is!"],
      },
    ],
  },
};

/** Chip order as rendered by the source: Brand 3, then Creator 4. */
export const CONVERSATION_CHIP_KEYS: readonly ConversationKey[] =
  CONVERSATION_FIGURE.sources.flatMap((source) =>
    source.chips.map((chip) => chip.key),
  );

/** Fact-mark order as rendered by the source thread (thread → verdicts). */
export const CONVERSATION_FACT_KEYS: readonly ConversationKey[] = (() => {
  const keys: ConversationKey[] = [];
  for (const message of CONVERSATION_FIGURE.chat.messages) {
    for (const run of message.runs) {
      if (typeof run !== "string" && !keys.includes(run.from)) {
        keys.push(run.from);
      }
    }
  }
  return keys;
})();

export interface ConversationPoint {
  readonly x: number;
  readonly y: number;
}

export interface ConversationRoute {
  readonly id: string;
  readonly key: ConversationKey;
  readonly d: string;
  readonly node: ConversationPoint;
}

export interface ConversationChipAnchor {
  readonly key: ConversationKey;
  readonly right: number;
  readonly centerY: number;
}

export interface ConversationFactAnchor {
  readonly key: ConversationKey;
  readonly bubbleLeft: number;
  readonly centerY: number;
}

export interface ConversationIconAnchor {
  readonly left: number;
  readonly right: number;
  readonly centerY: number;
}

export interface ConversationRoutes {
  readonly routes: readonly ConversationRoute[];
  readonly spectrum: { readonly from: number; readonly to: number };
}

/** Source `d(e,t)`: cubic with control points pulled 55% along x. */
function connector(from: ConversationPoint, to: ConversationPoint): string {
  const dx = (to.x - from.x) * 0.55;
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
}

/**
 * Reproduces the source's route pass: chips flow into the agent icon and the
 * icon flows back out to each fact mark. Coordinates are relative to
 * `.hp-convo` (the measuring pass subtracts the root rect).
 */
export function buildConversationRoutes(
  chips: readonly ConversationChipAnchor[],
  facts: readonly ConversationFactAnchor[],
  icon: ConversationIconAnchor,
): ConversationRoutes {
  const inbound: ConversationPoint = { x: icon.left + 6, y: icon.centerY };
  const outbound: ConversationPoint = { x: icon.right - 6, y: icon.centerY };
  const routes: ConversationRoute[] = [];

  for (const chip of chips) {
    const node = { x: chip.right, y: chip.centerY };
    routes.push({
      id: `in-${chip.key}`,
      key: chip.key,
      d: connector(node, inbound),
      node,
    });
  }

  for (const fact of facts) {
    const node = { x: fact.bubbleLeft, y: fact.centerY };
    routes.push({
      id: `out-${fact.key}`,
      key: fact.key,
      d: connector(outbound, node),
      node,
    });
  }

  const xs = routes.map((route) => route.node.x);
  const spectrum =
    xs.length === 0
      ? { from: 0, to: 0 }
      : { from: Math.min(...xs), to: Math.max(...xs) };

  return { routes, spectrum };
}
