export type FaqRowProps = {
  /** Shared id prefix; the row renders `${id}-question` and `${id}-answer`. */
  id: string;
  question: string;
  answer: string;
};

const plusPath =
  "M8 1.5c0-.552285-.44772-1-1-1s-1 .447715-1 1V6H1.5c-.552285 0-1 .44772-1 1s.447715 1 1 1H6v4.5c0 .5523.44772 1 1 1s1-.4477 1-1V8h4.5c.5523 0 1-.44772 1-1s-.4477-1-1-1H8V1.5Z";

/** One accordion row from the captured FAQ stacks (88 identical instances). */
export function FaqRow({ id, question, answer }: FaqRowProps) {
  const questionId = `${id}-question`;
  const answerId = `${id}-answer`;

  return (
    <li className="hp-faq-row">
      <button
        aria-controls={answerId}
        aria-expanded="false"
        className="hp-faq-trigger tano-body-md"
        id={questionId}
        type="button"
      >
        <span>{question}</span>
        <span aria-hidden="true" className="hp-faq-glyph" data-expanded="false">
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="100%"
            viewBox="0 0 14 14"
            width="100%"
          >
            <path clipRule="evenodd" d={plusPath} fill="currentColor" fillRule="evenodd" />
          </svg>
        </span>
      </button>
      <div
        aria-labelledby={questionId}
        className="hp-faq-answer"
        data-open="false"
        id={answerId}
        inert
        role="region"
      >
        <div className="hp-faq-answer-clip">
          <p className="hp-faq-answer-text tano-body-md">{answer}</p>
        </div>
      </div>
    </li>
  );
}
