import pageData from "@/content/tano/pages/playbooks-rebriefing.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksRebriefingReplica } from "../../../components/sites/tano/replica/PlaybooksRebriefingReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksRebriefingReplica />;
}
