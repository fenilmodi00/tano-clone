"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { scrollPageToTop } from "@/hooks/use-route-scroll";

const MENUS = [
  {
    label: "Use Cases",
    items: [
      { label: "Drive Revenue", href: "/use-cases/drive-revenue" },
      { label: "Creative Velocity", href: "/use-cases/creative-velocity" },
    ],
  },
];

const RESOURCES = [
  {
    label: "Guides",
    href: "/guides",
    description: "How to run and grow a creator programme",
  },
  { label: "Compare", href: "/compare", description: "Tano side by side with the alternatives" },
  {
    label: "Meta Muse",
    href: "/guides#link-cards-gh-muse",
    description: "What Muse means for your creator programme",
  },
  { label: "News", href: "/news", description: "Tano in the press" },
];

const chevron = (
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
);

export function Header({ glyphSvg, wordSvg }: { glyphSvg: string; wordSvg: string }) {
  const pathname = usePathname();
  const [stage, setStage] = useState<"seed" | "drop" | "travel" | "settled">("settled");
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const markId = useId().replaceAll(":", "");
  const glyph = glyphSvg.replaceAll("tano-glyph-spectrum", `tano-glyph-spectrum-${markId}`);

  // A committed route closes both menus. Adjusting state during render is
  // React's reset-on-change pattern and keeps back/forward covered without
  // the cascading render an effect would add.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-nav-ready", "");
    // A reload restoring a scrolled page must not replay the arrival
    // animation over it; a top-of-page reload still gets the full intro.
    if (Number(window.__tanoRestoreY || 0) > 0) {
      document.documentElement.setAttribute("data-nav-intro", "done");
      return;
    }
    // The intro belongs to the document, not the route. The marker is only
    // written once the animation has settled, so an interrupted mount
    // (StrictMode's first pass) still plays it on the next one.
    if (document.documentElement.getAttribute("data-nav-intro") === "done") return;
    const timers: number[] = [];
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      setStage("seed");
      inner = requestAnimationFrame(() => {
        setStage("drop");
        timers.push(window.setTimeout(() => setStage("travel"), 520));
        timers.push(
          window.setTimeout(() => {
            setStage("settled");
            document.documentElement.setAttribute("data-nav-intro", "done");
          }, 1140),
        );
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;
    const bar = wrap.current?.querySelector<HTMLElement>(".wire-nav-bar");
    const sentinel = document.querySelector<HTMLElement>(".wire-chrome-sentinel");
    const sentinelObserver = new IntersectionObserver(
      ([entry]) => {
        const scrolled = !entry.isIntersecting;
        wrap.current?.setAttribute("data-scrolled", String(scrolled));
        bar?.setAttribute("data-scrolled", String(scrolled));
      },
      { threshold: 0 },
    );
    if (sentinel) sentinelObserver.observe(sentinel);

    const hideObserver = new IntersectionObserver(
      (entries) => {
        const hide = entries.some((entry) => entry.isIntersecting);
        setHidden(hide);
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    );
    for (const el of Array.from(document.querySelectorAll("[data-chrome-hide]")))
      hideObserver.observe(el);

    return () => {
      sentinelObserver.disconnect();
      hideObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
        return;
      }
      if (event.type === "pointerdown") {
        const target = event.target as Node;
        const inPanel = document.getElementById("tano-mobile-menu")?.contains(target);
        if (!wrap.current?.contains(target) && !inPanel) {
          setOpen(null);
          setMobileOpen(false);
        }
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="wire-chrome" data-hidden={hidden ? "true" : "false"} ref={wrap}>
        <header className="wire-nav">
          <div className="wire-nav-inner">
            <div
              className="wire-nav-bar wire-glass wire-liquid"
              data-glass-light="false"
              data-glass-tilt="false"
              data-size="sm"
              data-stage={stage}
              style={
                {
                  "--nav-full-width": "min(1312px, calc(100vw - 2 * var(--page-margin)))",
                } as React.CSSProperties
              }
            >
              <span aria-hidden="true" className="wire-nav-grain" />
              <Link
                aria-label="Tano, home"
                className="wire-nav-mark"
                href="/"
                onClick={(event) => {
                  if (pathname !== "/") return;
                  event.preventDefault();
                  scrollPageToTop("smooth");
                }}
              >
                <span
                  aria-hidden="true"
                  className="wire-nav-mark-glyph"
                  dangerouslySetInnerHTML={{ __html: glyph }}
                />
                <span
                  aria-hidden="true"
                  className="wire-nav-mark-word"
                  dangerouslySetInnerHTML={{ __html: wordSvg }}
                />
              </Link>

              <nav aria-label="Primary" className="wire-nav-links">
                {MENUS.map((menu) => (
                  <span className="wire-nav-item" key={menu.label}>
                    <div
                      className="wire-nav-menu"
                      data-open={open === menu.label}
                      onMouseEnter={() => setOpen(menu.label)}
                      onMouseLeave={() =>
                        setOpen((current) => (current === menu.label ? null : current))
                      }
                    >
                      <button
                        className="wire-nav-link"
                        type="button"
                        aria-expanded={open === menu.label}
                        aria-controls={`nav-${menu.label}`}
                        onClick={() => setOpen(open === menu.label ? null : menu.label)}
                      >
                        <span>{menu.label}</span>
                        <span className="wire-nav-icon" data-direction="down">
                          {chevron}
                        </span>
                      </button>
                      <div
                        className="wire-nav-dropdown wire-glass"
                        data-columns="1"
                        data-glass-tilt="false"
                        data-size="sm"
                        data-open={open === menu.label}
                        id={`nav-${menu.label}`}
                        hidden={open !== menu.label}
                      >
                        <div className="wire-nav-column">
                          {menu.items.map((item) => (
                            <Link
                              className="wire-nav-link"
                              data-described="false"
                              href={item.href}
                              key={item.href}
                              onClick={() => setOpen(null)}
                            >
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </span>
                ))}
                <span className="wire-nav-item">
                  <Link className="wire-nav-link" href="/case-studies">
                    <span>Case Studies</span>
                  </Link>
                </span>
                <span className="wire-nav-item">
                  <div
                    className="wire-nav-menu"
                    data-open={open === "Resources"}
                    onMouseEnter={() => setOpen("Resources")}
                    onMouseLeave={() =>
                      setOpen((current) => (current === "Resources" ? null : current))
                    }
                  >
                    <button
                      className="wire-nav-link"
                      type="button"
                      aria-expanded={open === "Resources"}
                      aria-controls="nav-Resources"
                      onClick={() => setOpen(open === "Resources" ? null : "Resources")}
                    >
                      <span>Resources</span>
                      <span className="wire-nav-icon" data-direction="down">
                        {chevron}
                      </span>
                    </button>
                    <div
                      className="wire-nav-dropdown wire-glass"
                      data-columns="1"
                      data-glass-tilt="false"
                      data-size="sm"
                      data-open={open === "Resources"}
                      id="nav-Resources"
                      hidden={open !== "Resources"}
                    >
                      <div className="wire-nav-column">
                        {RESOURCES.map((item) => (
                          <Link
                            className="wire-nav-link"
                            data-described="true"
                            href={item.href}
                            key={item.href}
                            onClick={() => setOpen(null)}
                          >
                            <span>{item.label}</span>
                            <span className="wire-nav-link-description tano-body-sm">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </span>
                <span className="wire-nav-item">
                  <Link className="wire-nav-link" href="/for-creators">
                    <span>For Creators</span>
                  </Link>
                </span>
              </nav>

              <div className="wire-nav-mobile" data-variant="menu">
                <button
                  aria-controls="tano-mobile-menu"
                  aria-expanded={mobileOpen}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  className="wire-nav-mobile-toggle"
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  <span aria-hidden="true" className="wire-nav-mobile-glyph" data-open={mobileOpen}>
                    <span />
                    <span />
                  </span>
                </button>
              </div>

              <div className="wire-nav-end">
                <a
                  className="wire-nav-link wire-nav-login"
                  href="https://partners.tano.ai/partner/login"
                >
                  <span>Creator Login</span>
                </a>
                <span className="wire-nav-action-slot wire-spectrum-glow">
                  <Link className="wire-nav-action" href="/talk-to-us">
                    <span>Get started</span>
                    <span className="wire-nav-icon" data-direction="right">
                      {chevron}
                    </span>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div
        className="wire-nav-mobile-panel"
        id="tano-mobile-menu"
        data-open={mobileOpen}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile" className="wire-nav-mobile-links">
          <Link
            className="wire-nav-link"
            href="/use-cases/drive-revenue"
            onClick={() => setMobileOpen(false)}
          >
            Drive Revenue
          </Link>
          <Link
            className="wire-nav-link"
            href="/use-cases/creative-velocity"
            onClick={() => setMobileOpen(false)}
          >
            Creative Velocity
          </Link>
          <Link className="wire-nav-link" href="/case-studies" onClick={() => setMobileOpen(false)}>
            Case Studies
          </Link>
          <Link className="wire-nav-link" href="/guides" onClick={() => setMobileOpen(false)}>
            Guides
          </Link>
          <Link className="wire-nav-link" href="/compare" onClick={() => setMobileOpen(false)}>
            Compare
          </Link>
          <Link className="wire-nav-link" href="/news" onClick={() => setMobileOpen(false)}>
            News
          </Link>
          <Link className="wire-nav-link" href="/for-creators" onClick={() => setMobileOpen(false)}>
            For Creators
          </Link>
          <Link className="wire-nav-link" href="/talk-to-us" onClick={() => setMobileOpen(false)}>
            Get started
          </Link>
        </nav>
      </div>
    </>
  );
}
