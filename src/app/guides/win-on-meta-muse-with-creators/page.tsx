import pageData from "@/content/tano/pages/guides-win-on-meta-muse-with-creators.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesWinOnMetaMuseWithCreatorsReplica } from "../../../components/sites/tano/replica/GuidesWinOnMetaMuseWithCreatorsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesWinOnMetaMuseWithCreatorsReplica />;
}
