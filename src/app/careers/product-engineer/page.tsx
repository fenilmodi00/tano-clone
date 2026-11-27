import pageData from "@/content/tano/pages/careers-product-engineer.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CareersProductEngineerReplica } from "../../../components/sites/tano/replica/CareersProductEngineerReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CareersProductEngineerReplica />;
}
