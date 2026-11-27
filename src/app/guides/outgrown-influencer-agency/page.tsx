import pageData from "@/content/pages/guides/outgrown-influencer-agency.json";
import { GuideTemplate } from "@/components/sites/tano/pages/guide-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuideTemplate page={pageData} />;
}
