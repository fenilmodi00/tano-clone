import pageData from "@/content/pages/guides/influencer-agency-or-platform.json";
import { GuideTemplate } from "@/components/sites/tano/pages/guide-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuideTemplate page={pageData} />;
}
