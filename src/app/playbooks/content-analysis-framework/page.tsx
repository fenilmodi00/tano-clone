import pageData from "@/content/pages/playbooks/content-analysis-framework.json";
import { PlaybookTemplate } from "@/components/sites/tano/pages/playbook-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybookTemplate page={pageData} />;
}
