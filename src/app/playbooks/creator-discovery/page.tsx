import pageData from "@/content/tano/pages/playbooks-creator-discovery.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksCreatorDiscoveryReplica } from "../../../components/sites/tano/replica/PlaybooksCreatorDiscoveryReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksCreatorDiscoveryReplica />;
}
