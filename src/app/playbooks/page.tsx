import pageData from "@/content/tano/pages/playbooks.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksReplica } from "../../components/sites/tano/replica/PlaybooksReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksReplica />;
}
