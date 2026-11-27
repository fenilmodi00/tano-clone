import pageData from "@/content/pages/guides.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesReplica } from "../../components/sites/tano/replica/GuidesReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesReplica />;
}
