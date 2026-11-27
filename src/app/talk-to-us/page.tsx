import type { Metadata } from "next";
export const metadata: Metadata = {"title": "Get Started | Tano", "description": "Tell us about your brand and your goals, and we’ll show you what a creator programme run by Tano could do for you."};

import { TalkToUsReplica } from "../../components/sites/tano/replica/TalkToUsReplica";

export default function Page() {
  return <TalkToUsReplica />;
}
