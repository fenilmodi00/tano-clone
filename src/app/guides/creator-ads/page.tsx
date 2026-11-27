import pageData from "@/content/tano/pages/guides-creator-ads.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesCreatorAdsReplica } from "../../../components/sites/tano/replica/GuidesCreatorAdsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesCreatorAdsReplica />;
}
