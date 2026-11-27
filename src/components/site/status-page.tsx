import Link from "next/link";
import type { ReactNode } from "react";
import { TanoButtonLink } from "@/components/sites/tano/ui/tano-button";

type StatusPageProps = {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
};

/** Shared full-page state used by 404, error and loading boundaries. */
export function StatusPage({ eyebrow, title, body, children }: StatusPageProps) {
  return (
    <main id="main" className="hp-band" data-ground="dark">
      <div className="hp-container wire-status-page">
        <p className="tano-body-mono-sm wire-ink-soft">{eyebrow}</p>
        <h1 className="tano-display-md">{title}</h1>
        <p className="tano-body-para-md wire-ink-soft">{body}</p>
        <div className="wire-status-actions">
          {children ?? <TanoButtonLink href="/" label="Back to home" />}
          <Link className="wire-contact-link tano-body-md" href="/talk-to-us">
            Talk to us
          </Link>
        </div>
      </div>
    </main>
  );
}
