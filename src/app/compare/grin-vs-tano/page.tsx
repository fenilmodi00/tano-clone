import pageData from "@/content/tano/pages/compare-grin-vs-tano.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CompareGrinVsTanoReplica } from "../../../components/sites/tano/replica/CompareGrinVsTanoReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareGrinVsTanoReplica />;
}
