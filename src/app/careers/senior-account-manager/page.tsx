import pageData from "@/content/pages/careers/senior-account-manager.json";
import { buildPageMetadata } from "@/lib/metadata";
import { CareersSeniorAccountManagerReplica } from "../../../components/sites/tano/replica/CareersSeniorAccountManagerReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <CareersSeniorAccountManagerReplica />;
}
