import pageData from "@/content/pages/talk-to-us.json";
import { buildPageMetadata } from "@/lib/metadata";
import { TalkToUsReplica } from "../../components/sites/tano/replica/TalkToUsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <TalkToUsReplica />;
}
