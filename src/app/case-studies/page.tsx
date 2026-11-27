import type { Metadata } from "next";
export const metadata: Metadata = {"title": "Case Studies | Tano", "description": "Consumer brands across the US, the UK and EMEA run their creator programmes with Tano, and have the numbers to show for it."};

import { CaseStudiesReplica } from "../../components/sites/tano/replica/CaseStudiesReplica";

export default function Page() {
  return <CaseStudiesReplica />;
}
