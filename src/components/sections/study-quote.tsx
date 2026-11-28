export type StudyQuotePortrait = {
  src: string;
  alt: string;
};

export type StudyQuoteProps = {
  /** Plain quote text; the component adds the typographic quotation marks. */
  quote: string;
  name: string;
  role: string;
  portrait?: StudyQuotePortrait;
  initials?: string;
};

/** Pull quote that closes a case-study results section, with portrait or initials. */
export function StudyQuote({ quote, name, role, portrait, initials }: StudyQuoteProps) {
  return (
    <figure className="wire-study-quote-card" data-rv-skip>
      <div className="wire-study-quote-main">
        <span aria-hidden="true" className="hp-brand-stat-rule wire-study-quote-rule" />
        <div className="hp-brand-quote-slot">
          <p aria-hidden="true" className="hp-brand-quote hp-brand-quote-ghost tano-heading-md">
            “{quote}”
          </p>
        </div>
      </div>
      <figcaption className="hp-brand-who">
        {portrait ? (
          <span className="hp-brand-portrait" data-initials="false">
            <img
              alt={portrait.alt}
              aria-hidden="true"
              decoding="async"
              height={96}
              loading="lazy"
              src={portrait.src}
              style={{ color: "transparent" }}
              width={96}
            />
          </span>
        ) : (
          <span aria-hidden="true" className="hp-brand-portrait" data-initials="true">
            {initials}
          </span>
        )}
        <span className="hp-brand-who-name">
          <span className="tano-body-md">{name}</span>
          <span className="hp-sub tano-body-sm">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
