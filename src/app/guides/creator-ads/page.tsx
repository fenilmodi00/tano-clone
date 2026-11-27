import pageData from "@/content/tano/pages/guides-creator-ads.json";
import { GuidePage } from "@/components/sites/tano/pages/guide-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidePage page={pageData} />;
}
