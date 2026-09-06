"use client";
import ArrowUpRight from "./ArrowUpRight";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, localeLabel, localizedPath, splitLocale } from "../i18n";
import type { SiteLink } from "../../sanity/lib/settings";

// Build a locale-aware href from a stored link href.
function hrefFor(href: string, locale: Parameters<typeof localizedPath>[1]): string {
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  const home = localizedPath("/", locale);
  if (href.startsWith("/#") || href.startsWith("#")) {
    const anchor = href.startsWith("/#") ? href.slice(1) : href;
    return home === "/" ? (href.startsWith("/#") ? href : `/${href}`) : `${home}${anchor}`;
  }
  return localizedPath(href, locale);
}

export default function SiteNavClient({
  active,
  nav,
  cta,
}: {
  active?: string;
  nav: (SiteLink & { key?: string })[];
  cta: SiteLink;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const langRef = useRef<HTMLDetailsElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile panel and the page behind it stays put.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // <details> alone stays open on outside clicks and ignores Escape; add both.
  useEffect(() => {
    const dd = langRef.current;
    if (!dd) return;
    const onDown = (e: MouseEvent) => {
      if (dd.open && !dd.contains(e.target as Node)) dd.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dd.open) {
        dd.open = false;
        dd.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const pathname = usePathname() || "/";
  const { locale, path: basePath } = splitLocale(pathname);

  const keyFor = (href: string) => href.replace(/[/#]/g, "") || "home";

  return (
    <nav className="tech-nav" data-open={open ? "1" : undefined}>
      <a href={localizedPath("/", locale)} className="tech-logo" onClick={close}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/SGPT_logo.png" alt="SG Papertronics" className="brand-logo" />
      </a>
      <div className="tech-links" id="tech-nav-links">
        {nav.map((l) => {
          const k = l.key ?? keyFor(l.href);
          return (
            <a
              key={k}
              href={hrefFor(l.href, locale)}
              className={active === k ? "active" : undefined}
              aria-current={active === k ? "page" : undefined}
              onClick={close}
            >
              {l.label}
            </a>
          );
        })}
        <details className="lang-dd" ref={langRef}>
          <summary aria-label="Language">
            {localeLabel[locale]}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="lang-dd-menu">
            {locales.map((l) => (
              <a
                key={l}
                href={localizedPath(basePath, l)}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                onClick={close}
              >
                {localeLabel[l]}
                {l === locale && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </details>
        <a href={hrefFor(cta.href, locale)} className="tech-cta-mobile sheen" onClick={close}>
          {cta.label} <ArrowUpRight />
        </a>
      </div>
      <a href={hrefFor(cta.href, locale)} className="tech-cta sheen">
        {cta.label} <ArrowUpRight />
      </a>
      <button
        type="button"
        ref={burgerRef}
        className="tech-burger"
        aria-label="Menu"
        aria-controls="tech-nav-links"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
