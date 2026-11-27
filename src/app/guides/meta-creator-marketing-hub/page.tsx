import pageData from "@/content/tano/pages/guides-meta-creator-marketing-hub.json";
import { GuidePage } from "@/components/sites/tano/pages/guide-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidePage page={pageData} />;
}
