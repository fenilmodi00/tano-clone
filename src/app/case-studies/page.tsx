import pageData from "@/content/tano/pages/case-studies.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CaseStudiesReplica } from "../../components/sites/tano/replica/CaseStudiesReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CaseStudiesReplica />;
}
