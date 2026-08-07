"use client";
import ArrowUpRight from "./ArrowUpRight";

import { useState } from "react";
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
  const pathname = usePathname() || "/";
  const { locale, path: basePath } = splitLocale(pathname);

  const keyFor = (href: string) => href.replace(/[/#]/g, "") || "home";

  return (
    <nav className="tech-nav" data-open={open ? "1" : undefined}>
      <a href={localizedPath("/", locale)} className="tech-logo" onClick={close}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/SGPT_logo.png" alt="SG Papertronics" className="brand-logo" />
      </a>
      <div className="tech-links">
        {nav.map((l) => {
          const k = l.key ?? keyFor(l.href);
          return (
            <a key={k} href={hrefFor(l.href, locale)} className={active === k ? "active" : undefined} onClick={close}>
              {l.label}
            </a>
          );
        })}
        <div className="lang-switch" role="group" aria-label="Language">
          {locales.map((l) => (
            <a
              key={l}
              href={localizedPath(basePath, l)}
              className={l === locale ? "active" : undefined}
              hrefLang={l}
              onClick={close}
            >
              {localeLabel[l]}
            </a>
          ))}
        </div>
        <a href={hrefFor(cta.href, locale)} className="tech-cta-mobile sheen" onClick={close}>
          {cta.label} <ArrowUpRight />
        </a>
      </div>
      <a href={hrefFor(cta.href, locale)} className="tech-cta sheen">
        {cta.label} <ArrowUpRight />
      </a>
      <button
        type="button"
        className="tech-burger"
        aria-label="Menu"
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
