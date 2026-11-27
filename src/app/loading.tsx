export default function Loading() {
  return (
    <div className="wire-loading" role="status" aria-live="polite">
      <span className="wire-loading__bar" />
      <span className="wire-visually-hidden">Loading page</span>
    </div>
  );
}
