import pageData from "@/content/pages/use-cases/creative-velocity.json";
import { buildPageMetadata } from "@/lib/metadata";
import { UseCasesCreativeVelocityReplica } from "../../../components/sites/tano/replica/UseCasesCreativeVelocityReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <UseCasesCreativeVelocityReplica />;
}
