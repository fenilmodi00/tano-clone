import pageData from "@/content/tano/pages/guides-meta-creator-marketing-hub.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesMetaCreatorMarketingHubReplica } from "../../../components/sites/tano/replica/GuidesMetaCreatorMarketingHubReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesMetaCreatorMarketingHubReplica />;
}
