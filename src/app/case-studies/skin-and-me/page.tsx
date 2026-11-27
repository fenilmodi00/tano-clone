import pageData from "@/content/pages/case-studies/skin-and-me.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CaseStudiesSkinAndMeReplica } from "../../../components/sites/tano/replica/CaseStudiesSkinAndMeReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CaseStudiesSkinAndMeReplica />;
}
