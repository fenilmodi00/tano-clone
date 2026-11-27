import pageData from "@/content/tano/pages/guides-meta-muse-creator-marketing.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesMetaMuseCreatorMarketingReplica } from "../../../components/sites/tano/replica/GuidesMetaMuseCreatorMarketingReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesMetaMuseCreatorMarketingReplica />;
}
