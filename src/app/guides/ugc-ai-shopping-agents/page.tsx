import pageData from "@/content/tano/pages/guides-ugc-ai-shopping-agents.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesUgcAiShoppingAgentsReplica } from "../../../components/sites/tano/replica/GuidesUgcAiShoppingAgentsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesUgcAiShoppingAgentsReplica />;
}
