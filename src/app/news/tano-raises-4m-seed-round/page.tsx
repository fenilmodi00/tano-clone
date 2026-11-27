import pageData from "@/content/tano/pages/news-tano-raises-4m-seed-round.json";
import { buildPageMetadata } from "@/lib/metadata";
import { NewsTanoRaises4mSeedRoundReplica } from "../../../components/sites/tano/replica/NewsTanoRaises4mSeedRoundReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <NewsTanoRaises4mSeedRoundReplica />;
}
