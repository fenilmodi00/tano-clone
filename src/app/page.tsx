import pageData from "@/content/pages/home.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CapturedBody } from "./_home/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CapturedBody />;
}
