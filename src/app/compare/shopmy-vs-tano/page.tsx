import pageData from "@/content/pages/compare/shopmy-vs-tano.json";
import { CompareTemplate } from "@/components/sites/tano/pages/compare-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareTemplate page={pageData} />;
}
