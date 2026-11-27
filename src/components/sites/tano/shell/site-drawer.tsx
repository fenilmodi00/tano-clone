"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const TALK_TO_US_PATH = "/talk-to-us";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const COMPANY_TYPE_OPTIONS = [
  "DTC or consumer brand",
  "Agency",
  "SaaS or tech",
  "Creator",
  "Student",
  "Other",
] as const;

const AD_SPEND_OPTIONS = [
  "Under $35k",
  "$35k to $75k",
  "$75k to $150k",
  "$150k to $300k",
  "$300k to $1M",
  "$1M+",
] as const;

const PHYSICAL_PRODUCTS_OPTIONS = ["Yes", "No"] as const;

const CREATOR_ACTIVITY_OPTIONS = [
  "None",
  "Gifting only",
  "Paid creators",
  "Affiliate programme",
] as const;

const ROLE_OPTIONS = [
  "Founder",
  "Growth",
  "Ecommerce or Performance",
  "Influencer or Social",
  "Other",
] as const;

const HEAR_ABOUT_US_OPTIONS = [
  "Google Web Search",
  "Google AI Overview",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "AI assistant (ChatGPT, Claude, etc.)",
  "Word of mouth",
  "Event / conference",
  "Other",
] as const;

const COUNTRY_OPTIONS = [
  { label: "🇬🇧 +44", value: "GB" },
  { label: "🇺🇸 +1", value: "US" },
  { label: "🇨🇦 +1", value: "CA" },
  { label: "🇦🇺 +61", value: "AU" },
  { label: "🇩🇪 +49", value: "DE" },
  { label: "🇫🇷 +33", value: "FR" },
  { label: "🇳🇱 +31", value: "NL" },
  { label: "🇮🇪 +353", value: "IE" },
] as const;

type Phase = "closed" | "opening" | "open" | "closing";

function SourceChevron() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.1"
      viewBox="0 0 8 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.6 1.4 6.2 6l-4.6 4.6" />
    </svg>
  );
}

function SourceSelect({
  id,
  name,
  options,
}: {
  id: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <span className="wire-contact-select" data-empty="">
      <select id={id} name={name} required>
        <option disabled value="">
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="wire-nav-icon" data-direction="down">
        <SourceChevron />
      </span>
    </span>
  );
}

function CountrySelect() {
  return (
    <span className="wire-contact-select" data-size="dial">
      <select
        aria-describedby="tano-drawer-country-name"
        aria-label="Country code"
        defaultValue="GB"
        name="countryCode"
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="wire-nav-icon" data-direction="down">
        <SourceChevron />
      </span>
    </span>
  );
}

function DrawerForm() {
  return (
    <div className="wire-contact-card" data-current-step={1}>
      <div className="wire-contact-head">
        <h2 className="tano-heading-md">
          Tell us about your brand, and we’ll tell you how we can help.
        </h2>
        <p className="tano-body-md wire-ink-soft">
          Want to reach out by email? Find us at{" "}
          <a className="wire-contact-link" href="mailto:team@tano.ai">
            team@tano.ai
          </a>
        </p>
      </div>
      <form className="wire-contact-form" id="tano-drawer-form" noValidate>
        <div className="wire-contact-fields">
          <p className="wire-contact-group tano-heading-xs" data-field="group-you" data-step={1}>
            <span className="wire-contact-step tano-body-sm">Step 1 of 2</span>
            About you
          </p>

          <div className="wire-contact-field" data-field="name" data-span="half" data-step={1}>
            <label htmlFor="tano-drawer-name">Name</label>
            <div className="wire-contact-control">
              <input autoComplete="name" id="tano-drawer-name" name="name" required type="text" />
            </div>
          </div>

          <div className="wire-contact-field" data-field="email" data-span="half" data-step={1}>
            <label htmlFor="tano-drawer-email">Work email</label>
            <div className="wire-contact-control">
              <input
                autoComplete="email"
                id="tano-drawer-email"
                name="email"
                required
                type="email"
              />
            </div>
          </div>

          <p className="wire-contact-group tano-heading-xs" data-field="group-brand" data-step={2}>
            <span className="wire-contact-step tano-body-sm">Step 2 of 2</span>
            About your brand
          </p>

          <div
            className="wire-contact-field"
            data-field="brandWebsite"
            data-span="half"
            data-step={2}
          >
            <label htmlFor="tano-drawer-brandWebsite">Brand website</label>
            <div className="wire-contact-control">
              <input
                autoComplete="url"
                id="tano-drawer-brandWebsite"
                inputMode="url"
                name="brandWebsite"
                placeholder="yourbrand.com"
                required
                type="text"
              />
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="companyType"
            data-span="half"
            data-step={2}
          >
            <label htmlFor="tano-drawer-companyType">Company type</label>
            <div className="wire-contact-control">
              <SourceSelect
                id="tano-drawer-companyType"
                name="companyType"
                options={COMPANY_TYPE_OPTIONS}
              />
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="monthlyAdSpendBand"
            data-span="half"
            data-step={2}
          >
            <label htmlFor="tano-drawer-monthlyAdSpendBand">Monthly ad spend</label>
            <div className="wire-contact-control">
              <SourceSelect
                id="tano-drawer-monthlyAdSpendBand"
                name="monthlyAdSpendBand"
                options={AD_SPEND_OPTIONS}
              />
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="sellsPhysicalProducts"
            data-span="half"
            data-step={2}
          >
            <label htmlFor="tano-drawer-sellsPhysicalProducts">
              Do you sell physical products online?
            </label>
            <div className="wire-contact-control">
              <SourceSelect
                id="tano-drawer-sellsPhysicalProducts"
                name="sellsPhysicalProducts"
                options={PHYSICAL_PRODUCTS_OPTIONS}
              />
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="creatorActivity"
            data-span="half"
            data-step={2}
          >
            <label htmlFor="tano-drawer-creatorActivity">
              Current creator or affiliate activity
            </label>
            <div className="wire-contact-control">
              <SourceSelect
                id="tano-drawer-creatorActivity"
                name="creatorActivity"
                options={CREATOR_ACTIVITY_OPTIONS}
              />
            </div>
          </div>

          <div className="wire-contact-field" data-field="role" data-span="half" data-step={2}>
            <label htmlFor="tano-drawer-role">Your role</label>
            <div className="wire-contact-control">
              <SourceSelect id="tano-drawer-role" name="role" options={ROLE_OPTIONS} />
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="phoneNumber"
            data-span="full"
            data-step={1}
          >
            <label htmlFor="tano-drawer-phoneNumber">Phone number (optional)</label>
            <div className="wire-contact-control">
              <div className="wire-contact-phone">
                <CountrySelect />
                <input
                  autoComplete="tel"
                  id="tano-drawer-phoneNumber"
                  inputMode="tel"
                  name="phoneNumber"
                  placeholder="+44 7700 900123"
                  type="tel"
                />
              </div>
              <p className="wire-visually-hidden" id="tano-drawer-country-name">
                United Kingdom
              </p>
            </div>
          </div>

          <div
            className="wire-contact-field"
            data-field="hearAboutUs"
            data-span="full"
            data-step={2}
          >
            <label htmlFor="tano-drawer-hearAboutUs">Where did you hear about us?</label>
            <div className="wire-contact-control">
              <SourceSelect
                id="tano-drawer-hearAboutUs"
                name="hearAboutUs"
                options={HEAR_ABOUT_US_OPTIONS}
              />
            </div>
          </div>

          <div className="wire-contact-field" data-field="message" data-span="full" data-step={2}>
            <label htmlFor="tano-drawer-message">Message (optional)</label>
            <div className="wire-contact-control">
              <textarea id="tano-drawer-message" name="message" />
            </div>
          </div>
        </div>

        <div className="wire-contact-closing" data-step={2}>
          <label className="wire-contact-consent" htmlFor="tano-drawer-consent">
            <input id="tano-drawer-consent" name="consent" required type="checkbox" />
            <span>
              I agree to Tano storing and processing these details in order to respond to this
              request, as described in the{" "}
              <Link className="wire-contact-link" href="/privacy-policy">
                privacy policy
              </Link>
              .
            </span>
          </label>
        </div>

        <p className="wire-visually-hidden" role="status" />

        <div className="wire-contact-actions">
          <span className="wire-spectrum-glow wire-contact-submit">
            <button
              className="tano-button"
              data-material="surface"
              data-size="md"
              data-variant="primary"
              type="submit"
            >
              <span aria-hidden="true" className="tano-button__glow" />
              <span aria-hidden="true" className="tano-button__edge" />
              <span aria-hidden="true" className="tano-button__fill" />
              <span className="tano-button__label">
                Continue
                <span aria-hidden="true" className="tano-button__icon tano-button__icon--chevron">
                  <SourceChevron />
                </span>
              </span>
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}

/**
 * Site-wide "Get started" drawer. It mirrors the source `<dialog>`: any
 * unmodified same-origin click on `/talk-to-us` opens the sheet without
 * touching the URL; modified or middle clicks keep normal navigation.
 * Form behaviour belongs to `motion/use-forms.ts`.
 */
export function SiteDrawer() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("closed");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const active = phase !== "closed";

  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      const menu = document.getElementById("tano-mobile-menu");
      if (menu?.getAttribute("data-open") !== "true") {
        body.style.overflow = previousBodyOverflow === "hidden" ? "" : previousBodyOverflow;
      }
    };
  }, [active]);

  const restorePreviousFocus = useCallback(() => {
    const previous = previousFocusRef.current;
    previousFocusRef.current = null;
    if (
      previous?.isConnected &&
      previous.getClientRects().length > 0 &&
      window.getComputedStyle(previous).visibility !== "hidden"
    ) {
      requestAnimationFrame(() => previous.focus());
      return;
    }
    const fallback = document.querySelector<HTMLElement>(".wire-nav-mobile-toggle");
    if (fallback?.getClientRects().length) requestAnimationFrame(() => fallback.focus());
  }, []);

  const requestOpen = useCallback((trigger?: HTMLElement | null) => {
    const dialog = dialogRef.current;
    if (dialog?.open) return;
    const activeElement = document.activeElement;
    previousFocusRef.current =
      trigger ?? (activeElement instanceof HTMLElement ? activeElement : null);
    setPhase("opening");
  }, []);

  const requestClose = useCallback(() => {
    setPhase((current) => (current === "opening" || current === "open" ? "closing" : current));
  }, []);

  useEffect(() => {
    if (pathname === TALK_TO_US_PATH) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a");
      if (!anchor) return;
      if (anchor.dataset.noDrawer !== undefined) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.closest(".wire-drawer")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname.replace(/\/$/, "") !== TALK_TO_US_PATH) return;

      event.preventDefault();
      requestOpen(anchor);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname, requestOpen]);

  useEffect(() => {
    if (phase !== "opening") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const frame = window.requestAnimationFrame(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
      /* The mobile menu also writes body overflow; the dialog owns it now. */
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.dispatchEvent(new CustomEvent("tano:drawer-open", { detail: { dialog } }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "closing") return;
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (dialog?.open) dialog.close();
      else {
        setPhase("closed");
        restorePreviousFocus();
      }
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === sheet) finish();
    };

    sheet?.addEventListener("animationend", onAnimationEnd);
    const timeout = window.setTimeout(finish, 400);
    return () => {
      window.clearTimeout(timeout);
      sheet?.removeEventListener("animationend", onAnimationEnd);
    };
  }, [phase, restorePreviousFocus]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      setPhase("closed");
      restorePreviousFocus();
    };

    const onCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };

    dialog.addEventListener("close", onClose);
    dialog.addEventListener("cancel", onCancel);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("cancel", onCancel);
    };
  }, [requestClose, restorePreviousFocus]);

  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) =>
        element.getClientRects().length > 0 &&
        window.getComputedStyle(element).visibility !== "hidden",
    );
    if (focusables.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement;
    const outside = !(current instanceof Node) || !dialog.contains(current);

    if (event.shiftKey) {
      if (outside || current === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (outside || current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onSheetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (link && (link.getAttribute("href") || "").startsWith("/")) requestClose();
  };

  return (
    <dialog
      aria-label="Get started"
      className="wire-drawer"
      data-phase={phase}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
      onKeyDown={onDialogKeyDown}
      ref={dialogRef}
    >
      {active && (
        <div className="wire-drawer-sheet" onClick={onSheetClick} ref={sheetRef}>
          <div className="wire-drawer-rule">
            <div aria-hidden="true" className="wire-spectrum-rule" data-inview="true" />
          </div>
          <button
            aria-label="Close"
            className="wire-drawer-close"
            onClick={requestClose}
            ref={closeButtonRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="wire-drawer-scroll">
            <DrawerForm />
          </div>
        </div>
      )}
    </dialog>
  );
}
