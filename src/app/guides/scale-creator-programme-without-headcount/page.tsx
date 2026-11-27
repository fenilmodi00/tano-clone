import pageData from "@/content/tano/pages/guides-scale-creator-programme-without-headcount.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesScaleCreatorProgrammeWithoutHeadcountReplica } from "../../../components/sites/tano/replica/GuidesScaleCreatorProgrammeWithoutHeadcountReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesScaleCreatorProgrammeWithoutHeadcountReplica />;
}
