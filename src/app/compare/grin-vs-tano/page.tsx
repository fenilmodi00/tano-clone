import type { Metadata } from "next";
export const metadata: Metadata = {"title": "GRIN vs Tano: Software You Run, or a Programme Run for You? | Tano", "description": "GRIN is creator software your own team runs. Tano runs an always-on creator programme for you. Compare the models, pricing, AI agents and fit."};

import { CompareGrinVsTanoReplica } from "../../../components/sites/tano/replica/CompareGrinVsTanoReplica";

export default function Page() {
  return <CompareGrinVsTanoReplica />;
}
