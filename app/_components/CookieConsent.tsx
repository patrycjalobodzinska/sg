"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { localizedPath, type Locale } from "../i18n";

/** Where the choice lives. Deliberately localStorage, not a cookie: until the
 *  visitor accepts, the site writes nothing a consent banner would have to
 *  declare in the first place. */
const KEY = "sgp-analytics-consent";
type Choice = "granted" | "denied";

const COPY: Record<Locale, {
  title: string;
  body: string;
  accept: string;
  decline: string;
  privacy: string;
  label: string;
}> = {
  en: {
    title: "Analytics cookies",
    body: "We would like to measure how this site is used so we can improve it. Analytics is off unless you accept, and nothing is stored on your device until then.",
    accept: "Accept analytics",
    decline: "Decline",
    privacy: "Privacy Notice",
    label: "Cookie consent",
  },
  nl: {
    title: "Analytische cookies",
    body: "We willen graag meten hoe deze site wordt gebruikt, zodat we hem kunnen verbeteren. Analyse staat uit tenzij u accepteert; tot die tijd wordt er niets op uw apparaat opgeslagen.",
    accept: "Analyse accepteren",
    decline: "Weigeren",
    privacy: "Privacyverklaring",
    label: "Cookietoestemming",
  },
  pl: {
    title: "Pliki cookie analityczne",
    body: "Chcielibyśmy mierzyć, jak korzystasz z tej strony, żeby ją ulepszać. Analityka jest wyłączona, dopóki jej nie zaakceptujesz — do tego czasu nic nie zapisujemy na Twoim urządzeniu.",
    accept: "Akceptuj analitykę",
    decline: "Odrzuć",
    privacy: "Polityka prywatności",
    label: "Zgoda na pliki cookie",
  },
};

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** The banner plus the analytics loader it gates.
 *
 *  Google Analytics only mounts when two things are true: the visitor accepted,
 *  and a measurement ID is configured. Without `NEXT_PUBLIC_GA_ID` nothing loads
 *  at all — accepting simply records the choice, so the banner can ship before
 *  the tag does (audit ch. 13). */
export default function CookieConsent({ lang }: { lang: Locale }) {
  const t = COPY[lang];
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Read after mount: the server has no way to know the visitor's choice, and
  // rendering the banner during hydration would flash it for everyone.
  useEffect(() => {
    const stored = readChoice();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored);
    if (!stored) setOpen(true);
  }, []);

  // "Cookie settings" in the footer reopens it, wherever that link is rendered.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("[data-cookie-settings]");
      if (!el) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (open) acceptRef.current?.focus();
  }, [open]);

  const decide = useCallback((value: Choice) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* private mode: the choice simply does not persist */
    }
    setChoice(value);
    setOpen(false);
    if (value === "granted") {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
    }
  }, []);

  return (
    <>
      {choice === "granted" && gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied'});
gtag('consent','update',{analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {open ? (
        <div className="cc" role="region" aria-label={t.label}>
          <div className="cc-inner">
            <div className="cc-text">
              <p className="cc-title">{t.title}</p>
              <p className="cc-body">
                {t.body}{" "}
                <a href={localizedPath("/privacy", lang)}>{t.privacy}</a>
              </p>
            </div>
            <div className="cc-actions">
              <button type="button" className="cc-decline" onClick={() => decide("denied")}>
                {t.decline}
              </button>
              <button type="button" className="cc-accept" ref={acceptRef} onClick={() => decide("granted")}>
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
