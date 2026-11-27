import pageData from "@/content/pages/use-cases/drive-revenue.json";
import { buildPageMetadata } from "@/lib/metadata";
import { UseCasesDriveRevenueReplica } from "../../../components/sites/tano/replica/UseCasesDriveRevenueReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <UseCasesDriveRevenueReplica />;
}
