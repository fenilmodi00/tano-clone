import pageData from "@/content/pages/guides/outgrown-influencer-agency.json";
import { GuideTemplate } from "../_components/guide-template";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuideTemplate page={pageData} />;
}
