import pageData from "@/content/pages/guides/meta-muse-creator-marketing.json";
import { GuideTemplate } from "../_components/guide-template";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuideTemplate page={pageData} />;
}
