import pageData from "@/content/pages/case-studies/papier.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CaseStudiesPapierReplica } from "../../../components/sites/tano/replica/CaseStudiesPapierReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CaseStudiesPapierReplica />;
}
