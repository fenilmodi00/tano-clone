import pageData from "@/content/tano/pages/case-studies-hellofresh.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CaseStudiesHellofreshReplica } from "../../../components/sites/tano/replica/CaseStudiesHellofreshReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CaseStudiesHellofreshReplica />;
}
