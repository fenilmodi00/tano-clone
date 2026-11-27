import pageData from "@/content/tano/pages/compare-agentio-vs-tano.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CompareAgentioVsTanoReplica } from "../../../components/sites/tano/replica/CompareAgentioVsTanoReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareAgentioVsTanoReplica />;
}
