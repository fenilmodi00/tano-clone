import type { Metadata } from "next";
export const metadata: Metadata = {"title": "Tano — The Creator Advertising Platform", "description": "Tano runs creator programmes for consumer brands like a performance channel: sourcing, outreach, gifting, payment and reporting, all handled for you."};

import { HomeReplica } from "../components/sites/tano/replica/HomeReplica";

export default function Page() {
  return <HomeReplica />;
}
