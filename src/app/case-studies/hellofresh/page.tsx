import type { Metadata } from "next";
export const metadata: Metadata = {"title": "HelloFresh Case Study | Tano", "description": "How HelloFresh lifted conversion rate by 93% with a hybrid creator model run by Tano, without adding manual work."};

import { CaseStudiesHellofreshReplica } from "../../../components/sites/tano/replica/CaseStudiesHellofreshReplica";

export default function Page() {
  return <CaseStudiesHellofreshReplica />;
}
