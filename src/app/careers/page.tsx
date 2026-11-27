import pageData from "@/content/tano/pages/careers.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CareersReplica } from "../../components/sites/tano/replica/CareersReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CareersReplica />;
}
