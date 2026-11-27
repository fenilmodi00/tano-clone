import pageData from "@/content/tano/pages/guides-influencer-agency-or-platform.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesInfluencerAgencyOrPlatformReplica } from "../../../components/sites/tano/replica/GuidesInfluencerAgencyOrPlatformReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesInfluencerAgencyOrPlatformReplica />;
}
