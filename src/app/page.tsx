import pageData from "@/content/tano/pages/home.json";
import { buildPageMetadata } from "@/lib/metadata";
import { HomeReplica } from "../components/sites/tano/replica/HomeReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <HomeReplica />;
}
