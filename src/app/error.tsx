"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatusPage } from "@/components/site/status-page";
import { TanoButton } from "@/components/sites/tano/ui/tano-button";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Something went wrong"
      title="This page hit a snag."
      body="The page could not be rendered. Try again, or head back home while we recover."
    >
      <TanoButton onClick={() => retry()} type="button">
        Try again
      </TanoButton>
      <Link className="wire-contact-link tano-body-md" href="/">
        Back to home
      </Link>
    </StatusPage>
  );
}
