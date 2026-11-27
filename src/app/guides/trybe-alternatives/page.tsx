import pageData from "@/content/tano/pages/guides-trybe-alternatives.json";
import { buildPageMetadata } from "@/lib/metadata";
import { GuidesTrybeAlternativesReplica } from "../../../components/sites/tano/replica/GuidesTrybeAlternativesReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <GuidesTrybeAlternativesReplica />;
}
