import pageData from "@/content/tano/pages/compare-shopmy-vs-tano.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CompareShopmyVsTanoReplica } from "../../../components/sites/tano/replica/CompareShopmyVsTanoReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareShopmyVsTanoReplica />;
}
