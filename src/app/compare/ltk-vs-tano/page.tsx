import pageData from "@/content/tano/pages/compare-ltk-vs-tano.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CompareLtkVsTanoReplica } from "../../../components/sites/tano/replica/CompareLtkVsTanoReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareLtkVsTanoReplica />;
}
