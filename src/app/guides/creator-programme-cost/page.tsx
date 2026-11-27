import pageData from "@/content/tano/pages/guides-creator-programme-cost.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesCreatorProgrammeCostReplica } from "../../../components/sites/tano/replica/GuidesCreatorProgrammeCostReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesCreatorProgrammeCostReplica />;
}
