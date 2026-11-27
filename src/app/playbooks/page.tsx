import pageData from "@/content/pages/playbooks.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PageEffects } from "@/app/_runtime/page-effects";
import { CapturedBody } from "./_components/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return (
    <>
      <CapturedBody />
      <PageEffects />
    </>
  );
}
