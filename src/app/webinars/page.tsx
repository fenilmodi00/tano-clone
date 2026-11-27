import pageData from "@/content/pages/webinars.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CapturedBody } from "./_components/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CapturedBody />;
}
