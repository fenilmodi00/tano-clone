import pageData from "@/content/tano/pages/privacy-policy.json";
import { buildPageMetadata } from "@/lib/metadata";
import { PrivacyPolicyReplica } from "../../components/sites/tano/replica/PrivacyPolicyReplica";

export const metadata = buildPageMetadata(pageData);

export default function Page() {
  return <PrivacyPolicyReplica />;
}
