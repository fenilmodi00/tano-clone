"use client";

import { useEffect, useState } from "react";

export function Announcement() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 1650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!dismissed) return;
    document.documentElement.style.setProperty("--hp-notify-push", "0px");
    document.querySelector("main[data-notify]")?.removeAttribute("data-notify");
  }, [dismissed]);

  if (dismissed) return null;

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setDismissed(true), 500);
  };

  return (
    <aside aria-label="Announcement" className="hp-notify tano-light-ground" data-open={open} data-scrolled={scrolled ? "true" : "false"}>
      <div className="hp-notify-stack">
        <div
          className="hp-notify-layer"
          data-layer="front"
          data-turned="false"
          style={closing ? { animation: "hp-notify-leave 480ms cubic-bezier(.32,.08,.24,1) forwards" } : undefined}
        >
          <a className="hp-notify-card" href="/news/tano-raises-4m-seed-round">
            <div className="hp-note-card">
              <span className="hp-note-icon">
                <img alt="" decoding="async" height={256} src="/sites/tano/images/tano-app-icon.png" width={256} />
              </span>
              <div className="hp-note-body">
                <p className="hp-note-head">
                  <span className="hp-note-app tano-heading-sm">Announcement</span>
                  <span className="hp-note-meta hp-sub tano-body-md">
                    <span className="hp-notify-cta">
                      Read here
                      <span aria-hidden="true" className="hp-notify-chevron">
                        <svg
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.1"
                          viewBox="0 0 8 12"
                        >
                          <path d="M1.6 1.4 6.2 6l-4.6 4.6" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </p>
                <p className="hp-note-text tano-heading-sm">
                  Tano has raised $5m in funding to make creators a true performance marketing channel
                </p>
              </div>
            </div>
          </a>
          <button aria-label="Dismiss announcement" className="hp-notify-close" type="button" onClick={close}>
            <span aria-hidden="true" className="hp-notify-close-glyph">
              <svg aria-hidden="true" focusable="false" height="100%" viewBox="0 0 14 14" width="100%">
                <path
                  clipRule="evenodd"
                  d="M8 1.5c0-.552285-.44772-1-1-1s-1 .447715-1 1V6H1.5c-.552285 0-1 .44772-1 1s.447715 1 1 1H6v4.5c0 .5523.44772 1 1 1s1-.4477 1-1V8h4.5c.5523 0 1-.44772 1-1s-.4477-1-1-1H8V1.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
