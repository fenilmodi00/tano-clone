import pageData from "@/content/pages/home.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PageEffects } from "@/app/_runtime/page-effects";
import { HomeEffects } from "./_home/effects";
import { CapturedBody } from "./_home/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return (
    <>
      <CapturedBody />
      <PageEffects />
      <HomeEffects />
    </>
  );
}
