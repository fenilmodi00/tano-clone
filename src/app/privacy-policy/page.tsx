import type { Metadata } from "next";
export const metadata: Metadata = {"title": "Privacy Policy | Tano", "description": "How Tano collects, uses, shares and protects your personal data, and the choices you have about it."};

import { PrivacyPolicyReplica } from "../../components/sites/tano/replica/PrivacyPolicyReplica";

export default function Page() {
  return <PrivacyPolicyReplica />;
}
