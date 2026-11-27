import pageData from "@/content/tano/pages/guides-keep-creators-long-term.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesKeepCreatorsLongTermReplica } from "../../../components/sites/tano/replica/GuidesKeepCreatorsLongTermReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesKeepCreatorsLongTermReplica />;
}
