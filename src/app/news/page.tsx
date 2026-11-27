import pageData from "@/content/tano/pages/news.json";
import { buildPageMetadata } from "@/lib/metadata";
import { NewsReplica } from "../../components/sites/tano/replica/NewsReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <NewsReplica />;
}
