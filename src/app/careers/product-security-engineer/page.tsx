import pageData from "@/content/tano/pages/careers-product-security-engineer.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CareersProductSecurityEngineerReplica } from "../../../components/sites/tano/replica/CareersProductSecurityEngineerReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CareersProductSecurityEngineerReplica />;
}
