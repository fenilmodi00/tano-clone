import pageData from "@/content/pages/careers/senior-account-manager.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/page-shell";
import { CapturedBody } from "./_components/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return (
    <PageShell>
      <CapturedBody />
    </PageShell>
  );
}
