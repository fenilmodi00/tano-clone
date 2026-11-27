import pageData from "@/content/tano/pages/playbooks-content-analysis-framework.json";
import { PlaybookPage } from "@/components/sites/tano/pages/playbook-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybookPage page={pageData} />;
}
