import pageData from "@/content/pages/compare/grin-vs-tano.json";
import { CompareTemplate } from "../_components/compare-template";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CompareTemplate page={pageData} />;
}
