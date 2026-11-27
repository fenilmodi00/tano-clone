import pageData from "@/content/pages/compare.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CompareReplica } from "../../components/sites/tano/replica/CompareReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareReplica />;
}
