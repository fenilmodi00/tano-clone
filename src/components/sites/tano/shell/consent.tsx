"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const CONSENT_STORAGE_KEY = "tano-consent";
export const CONSENT_OPEN_EVENT = "tano-consent-open";

type ConsentChoice = "accepted" | "rejected";
type Phase = "open" | "closing";

function readConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : null;
  } catch {
    return null;
  }
}

function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* storage may be unavailable; the banner still dismisses for this visit */
  }
}

/**
 * Cookie consent banner, ported from the source `.wire-consent` client
 * component. It only renders after hydration, and only while no choice has
 * been stored. "Cookie settings" in the footer (or a `tano-consent-open`
 * window event) brings it back.
 */
export function SiteConsent() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("open");
  const [focusToken, setFocusToken] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearTimer();
    const active = document.activeElement;
    returnFocusRef.current = active instanceof HTMLElement ? active : null;
    setPhase("open");
    setVisible(true);
    setFocusToken((token) => token + 1);
  }, [clearTimer]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReady(true);
      setVisible(readConsent() === null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLElement>(".wire-footer-button");
      if (!button || (button.textContent || "").trim() !== "Cookie settings") return;
      event.preventDefault();
      open();
    };

    const onOpenEvent = () => open();

    document.addEventListener("click", onDocumentClick);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpenEvent);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpenEvent);
    };
  }, [open, ready]);

  useEffect(() => {
    if (!visible || focusToken === 0) return;
    regionRef.current?.focus();
  }, [focusToken, visible]);

  useEffect(() => clearTimer, [clearTimer]);

  const decide = (choice: ConsentChoice) => {
    if (phase === "closing") return;
    writeConsent(choice);
    setPhase("closing");
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setVisible(false);
      setPhase("open");
      const previous = returnFocusRef.current;
      returnFocusRef.current = null;
      if (previous?.isConnected) previous.focus();
    }, delay);
  };

  if (!ready || !visible) return null;

  return (
    <div
      aria-label="Cookie consent"
      className="wire-consent"
      data-phase={phase}
      ref={regionRef}
      role="region"
      tabIndex={-1}
    >
      <p className="wire-consent-copy tano-body-sm">
        We use cookies to understand how our site is used and to improve our marketing. Read our{" "}
        <a className="wire-contact-link" href="/privacy-policy">
          privacy policy
        </a>
        .
      </p>
      <div className="wire-consent-actions">
        <button
          className="tano-button"
          data-material="surface"
          data-size="md"
          data-variant="secondary"
          onClick={() => decide("rejected")}
          type="button"
        >
          <span aria-hidden="true" className="tano-button__glow" />
          <span aria-hidden="true" className="tano-button__edge" />
          <span aria-hidden="true" className="tano-button__fill" />
          <span className="tano-button__label">Reject</span>
        </button>
        <button
          className="tano-button"
          data-material="surface"
          data-size="md"
          data-variant="secondary"
          onClick={() => decide("accepted")}
          type="button"
        >
          <span aria-hidden="true" className="tano-button__glow" />
          <span aria-hidden="true" className="tano-button__edge" />
          <span aria-hidden="true" className="tano-button__fill" />
          <span className="tano-button__label">Accept</span>
        </button>
      </div>
    </div>
  );
}
