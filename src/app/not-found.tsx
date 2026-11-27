import type { Metadata } from "next";
import { StatusPage } from "@/components/site/status-page";

export const metadata: Metadata = {
  title: "Page not found | Tano",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <StatusPage
      eyebrow="404"
      title="That page is off-brief."
      body="The page you were looking for does not exist, or it moved. Head back to the home page or tell us what you were looking for."
    />
  );
}
