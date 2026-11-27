import pageData from "@/content/pages/webinars.json";
import { buildPageMetadata } from "@/lib/metadata";
import { WebinarsReplica } from "../../components/sites/tano/replica/WebinarsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <WebinarsReplica />;
}
