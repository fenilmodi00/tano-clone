import pageData from "@/content/tano/pages/playbooks-creator-partnership-ads.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksCreatorPartnershipAdsReplica } from "../../../components/sites/tano/replica/PlaybooksCreatorPartnershipAdsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksCreatorPartnershipAdsReplica />;
}
