import pageData from "@/content/tano/pages/compare-shopmy-vs-tano.json";
import { ComparePage } from "@/components/sites/tano/pages/compare-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <ComparePage page={pageData} />;
}
