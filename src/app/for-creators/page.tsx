import pageData from "@/content/tano/pages/for-creators.json";
import { buildPageMetadata } from "@/lib/metadata";
import { ForCreatorsReplica } from "../../components/sites/tano/replica/ForCreatorsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <ForCreatorsReplica />;
}
