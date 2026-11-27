import pageData from "@/content/tano/pages/guides-usage-rights-pricing.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesUsageRightsPricingReplica } from "../../../components/sites/tano/replica/GuidesUsageRightsPricingReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesUsageRightsPricingReplica />;
}
