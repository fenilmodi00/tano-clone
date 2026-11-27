import pageData from "@/content/tano/pages/playbooks-content-analysis-framework.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PlaybooksContentAnalysisFrameworkReplica } from "../../../components/sites/tano/replica/PlaybooksContentAnalysisFrameworkReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PlaybooksContentAnalysisFrameworkReplica />;
}
