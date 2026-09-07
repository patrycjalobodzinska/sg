import "../globals.css";
import { Montserrat } from "next/font/google";
import type { Locale } from "../i18n";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SKIP_LINK: Record<Locale, string> = {
  en: "Skip to main content",
  nl: "Ga naar de hoofdinhoud",
  pl: "Przejdź do treści głównej",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SG Papertronics",
  url: "https://sgpapertronics.com",
  logo: "https://sgpapertronics.com/assets/SGPT_logo.png",
  description:
    "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Blauwborgje 31",
    postalCode: "9747 AW",
    addressLocality: "Groningen",
    addressCountry: "NL",
  },
  sameAs: ["https://testmybeer.com"],
};

/** The `<html>`/`<body>` shell. Each root layout renders this with its own
 *  locale so NL and PL pages stop declaring themselves as English. */
export default function RootDocument({
  lang,
  children,
}: Readonly<{ lang: Locale; children: React.ReactNode }>) {
  return (
    <html lang={lang} className={montserrat.variable}>
      <head>
        {/* Scroll-reveal starts every section at opacity:0 and JS fades it in. With
            scripting off that left most of the page invisible, so restore it here. */}
        <noscript>
          <style>{`[data-appear]{opacity:1!important;transform:none!important}
[data-introline]{stroke-dashoffset:0!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          {SKIP_LINK[lang]}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
