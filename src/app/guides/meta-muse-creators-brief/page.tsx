import pageData from "@/content/tano/pages/guides-meta-muse-creators-brief.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesMetaMuseCreatorsBriefReplica } from "../../../components/sites/tano/replica/GuidesMetaMuseCreatorsBriefReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesMetaMuseCreatorsBriefReplica />;
}
