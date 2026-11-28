import pageData from "@/content/pages/home.json";
import { preload } from "react-dom";
import { HERO_CAMPAIGNS } from "./_home/data/hero-campaigns";
import { buildPageMetadata } from "@/lib/metadata";
import { PageEffects } from "@/app/_runtime/page-effects";
import { HomeEffects } from "./_home/effects";
import { CapturedBody } from "./_home/captured-body";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  preload(HERO_CAMPAIGNS[0].brand.backdrop, {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <>
      <CapturedBody />
      <PageEffects />
      <HomeEffects />
    </>
  );
}
