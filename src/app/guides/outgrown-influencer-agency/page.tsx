import pageData from "@/content/tano/pages/guides-outgrown-influencer-agency.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesOutgrownInfluencerAgencyReplica } from "../../../components/sites/tano/replica/GuidesOutgrownInfluencerAgencyReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesOutgrownInfluencerAgencyReplica />;
}
