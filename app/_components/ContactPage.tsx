import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import ContactSection, { type ContactSidePanel } from "./ContactSection";
import { CONTACT_COPY, type Intent } from "./contact-content";
import { localizedPath, type Locale } from "../i18n";

const SIDE: Record<Locale, ContactSidePanel> = {
  en: {
    headingLine1: "Let's talk about",
    headingLine2: "your process.",
    body: "Tell us your organism, process stage and goal - we'll suggest where Q‑Tector fits.",
    emailLabel: "Email",
    visitLabel: "Visit us",
    visitValue: "Blauwborgje 31, 9747 AW Groningen, NL",
    beerLabel: "Beer-o-Meter - brewing application of Q‑Tector",
  },
  nl: {
    headingLine1: "Laten we het hebben",
    headingLine2: "over uw proces.",
    body: "Vertel ons uw organisme, processtadium en doel - wij geven aan waar Q‑Tector past.",
    emailLabel: "E-mail",
    visitLabel: "Bezoek ons",
    visitValue: "Blauwborgje 31, 9747 AW Groningen, NL",
    beerLabel: "Beer-o-Meter - brouwtoepassing van Q‑Tector",
  },
  pl: {
    headingLine1: "Porozmawiajmy",
    headingLine2: "o Twoim procesie.",
    body: "Napisz nam, z jakim organizmem pracujesz, na jakim etapie jest proces i jaki masz cel - podpowiemy, gdzie sprawdzi się Q‑Tector.",
    emailLabel: "E-mail",
    visitLabel: "Odwiedź nas",
    visitValue: "Blauwborgje 31, 9747 AW Groningen, NL",
    beerLabel: "Beer‑o‑Meter - zastosowanie Q‑Tectora w browarnictwie",
  },
};

/** Standalone contact page. Every intent-carrying CTA on the site lands here
 *  with the matching inquiry type preselected (audit ch. 12). */
export default function ContactPage({
  lang,
  intent,
  sourcePage,
  sourceCta,
  vertical,
}: {
  lang: Locale;
  intent: Intent;
  /** Attribution carried in the URL by the CTA that sent the reader here. */
  sourcePage?: string;
  sourceCta?: string;
  vertical?: string;
}) {
  const t = CONTACT_COPY[lang];
  const path = localizedPath("/contact", lang);
  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />
      <main id="main" style={{ paddingTop: "clamp(96px,12vw,140px)" }}>
        <h1 className="sr-only">{`${t.heading} ${t.headingAccent}`}</h1>
        <ContactSection lang={lang} intent={intent} sourcePage={sourcePage || path} sourceCta={sourceCta || "contact-page"} vertical={vertical} side={SIDE[lang]} />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
