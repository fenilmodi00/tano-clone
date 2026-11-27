import pageData from "@/content/tano/pages/guides-meta-muse-nano-micro-creators.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesMetaMuseNanoMicroCreatorsReplica } from "../../../components/sites/tano/replica/GuidesMetaMuseNanoMicroCreatorsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesMetaMuseNanoMicroCreatorsReplica />;
}
