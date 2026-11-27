import pageData from "@/content/tano/pages/playbooks-self-funding-seeding-affiliate.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksSelfFundingSeedingAffiliateReplica } from "../../../components/sites/tano/replica/PlaybooksSelfFundingSeedingAffiliateReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksSelfFundingSeedingAffiliateReplica />;
}
