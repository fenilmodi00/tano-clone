import pageData from "@/content/tano/pages/playbooks-rebriefing.json";
import { PlaybookPage } from "@/components/sites/tano/pages/playbook-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybookPage page={pageData} />;
}
