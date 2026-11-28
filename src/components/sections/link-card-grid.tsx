import Link from "next/link";
import { BandHeading } from "@/components/sections/band-heading";

export type LinkCardItem = {
  title: string;
  body: string;
  href: string;
  cta?: string;
};

export type LinkCardGridProps = {
  heading: string;
  headingId: string;
  items: readonly LinkCardItem[];
  ground?: "light" | "dark";
  cta?: string;
};

/**
 * Banded grid of guide/comparison link cards: one heading, one list and one
 * trailing call to action per card.
 */
export function LinkCardGrid({
  heading,
  headingId,
  items,
  ground = "light",
  cta = "Read the guide →",
}: LinkCardGridProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="hp-band"
      data-ground={ground}
      data-ground-dark={ground === "dark" ? true : undefined}
      data-padding="xl"
    >
      <div className="hp-container hp-link-cards">
        <BandHeading align="start" titleId={headingId}>
          <span className="hp-title-words">{heading}</span>
        </BandHeading>
        <ul className="wire-grid hp-link-cards-grid">
          {items.map((item) => (
            <li className="wire-grid-item" key={item.href}>
              <article className="hp-link-card">
                <h3 className="tano-heading-sm">
                  <Link className="wire-case-link" href={item.href}>
                    {item.title}
                  </Link>
                </h3>
                <p className="tano-body-sm wire-ink-soft">{item.body}</p>
                <p className="hp-link-card-go tano-body-sm">{item.cta ?? cta}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
