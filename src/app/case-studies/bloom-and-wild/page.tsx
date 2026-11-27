import pageData from "@/content/tano/pages/case-studies-bloom-and-wild.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CaseStudiesBloomAndWildReplica } from "../../../components/sites/tano/replica/CaseStudiesBloomAndWildReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CaseStudiesBloomAndWildReplica />;
}
