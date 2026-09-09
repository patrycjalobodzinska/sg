import SiteFooter from "../site-footer";
import { contactUrl } from "./contact-intent";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import type { Locale } from "../i18n";
import { urlFor } from "../../sanity/lib/image";

type Cta = { label?: string; href?: string };
type Step = { n?: string; title?: string; text?: string };

export type TechDoc = {
  hero?: { lead?: string; body1?: string; body2?: string; image?: unknown; primaryCta?: Cta };
  steps?: Step[];
  focus?: { eyebrow?: string; heading?: string; body?: string; tags?: string[]; image?: unknown };
  builtForScale?: { body1?: string; body2?: string };
} | null;

// English source of truth (matches the current hand-tuned page verbatim).
const EN = {
  heroLead: "Q‑Tector turns small process samples into comparable results close to the point of work, helping teams act during the run and learn across runs.",
  heroBody1:
    "Q‑Tector combines a compact reader, ready-to-use assay pods, QR-guided instructions and connected result storage. Run process-relevant measurements close to your fermenter or bioreactor - without waiting for a central laboratory.",
  heroBody2: "",
  steps: [
    { n: "01", title: "Take a small sample", text: "Collect a small process sample from your culture, fermentation or product stream." },
    { n: "02", title: "Run the guided assay", text: "Use the ready-to-use assay pod and follow the app-guided workflow." },
    { n: "03", title: "Read the result", text: "Q‑Tector provides a clear result through the connected readout system." },
    { n: "04", title: "Track the process", text: "Results are stored and can be used for trend analysis, batch comparison and export." },
    { n: "05", title: "Act on the data", text: "Use the result to support feeding, process timing, formulation, stabilisation or troubleshooting decisions." },
  ] as Step[],
  focusEyebrow: "Current analytical focus",
  focusHeading: "Current glucose and sucrose workflows",
  focusBody:
    "Q‑Tector is currently focused on glucose and sucrose monitoring in culture media. Typical applications include fermentation development, media optimisation, feed-strategy work and production monitoring.",
  focusTags: ["Glucose & sucrose", "Culture media", "Fermentation", "Cell culture", "Media optimization", "Feed strategy", "Production monitoring"],
  scaleBody1: "Processes often fail to scale because the data collected in early development is not structured, frequent or comparable enough.",
  scaleBody2: "Q‑Tector helps teams build process datasets from early experiments onward. By using repeatable testing workflows and connected data capture, teams can compare experiments, monitor trends and carry process knowledge into pilot and production.",
};

// "Chrome" strings not modelled in the schema — translated in-code.
const CHROME: Record<Locale, {
  heroTitleLead: string; heroAccent: string; heroEyebrow: string; heroPrimary: string; heroSecondary: string; heroFocus: string;
  atLineEyebrow: string; atLineHeading: string; atLineBody1: string; atLineBody2: string;
  focusNote: string;
  customEyebrow: string; customHeading: string; customBody: string; customCta: string;
  howEyebrow: string; howLead: string; howAccent: string;
  chartLabel: string; chartCaption: string;
  scaleEyebrow: string; scaleHeading: string; scaleCta: string; stages: string[]; scaleChartCaption: string;
}> = {
  en: {
    heroTitleLead: "Q‑Tector", heroAccent: "technology",
    heroEyebrow: "Q‑Tector platform",
    atLineEyebrow: "What at-line means", atLineHeading: "A result near the process - not days later",
    atLineBody1: "At-line testing means that an operator takes a small process sample and runs a guided assay in a nearby work area. Q‑Tector adds the result to the process history.",
    atLineBody2: "It is designed for frequent monitoring during a run; it is not a continuous online sensor.",
    focusNote: "Assay performance depends on the analyte, concentration range and sample matrix. Contact us to confirm fit for your process.",
    customEyebrow: "Application development", customHeading: "Need another analyte or sample matrix?",
    customBody: "Tell us what you need to measure, in which matrix, at what concentration range and which decision the result should support. We will assess technical fit and propose a feasibility or co-development path.",
    customCta: "Request an application assessment", heroPrimary: "View current assays", heroSecondary: "Discuss your sample matrix", heroFocus: "Current analytical focus: glucose and sucrose in culture media",
    howEyebrow: "How it works", howLead: "Sample to decision,", howAccent: "in five steps",
    chartLabel: "Glucose · g/L", chartCaption: "Depletion across a fermentation run",
    scaleEyebrow: "Built for scale-up", scaleHeading: "Carry process knowledge into pilot and production", scaleCta: "Request a Q‑Tector introduction",
    stages: ["R&D", "Dev", "Pilot", "Production"], scaleChartCaption: "Comparable datasets accumulate as the process moves toward production.",
  },
  nl: {
    heroTitleLead: "Q‑Tector", heroAccent: "technologie",
    heroEyebrow: "Q‑Tector-platform",
    atLineEyebrow: "Wat at-line betekent", atLineHeading: "Een resultaat dicht bij het proces - niet dagen later",
    atLineBody1: "At-line testen betekent dat een operator een klein procesmonster neemt en een begeleide assay uitvoert in een werkruimte vlakbij. Q‑Tector voegt het resultaat toe aan de processhistorie.",
    atLineBody2: "Het is bedoeld voor frequente monitoring tijdens een run; het is geen continue online sensor.",
    focusNote: "De prestaties van een assay hangen af van de analyt, het concentratiebereik en de monstermatrix. Neem contact op om de fit voor uw proces te bevestigen.",
    customEyebrow: "Applicatieontwikkeling", customHeading: "Een andere analyt of monstermatrix nodig?",
    customBody: "Vertel ons wat u moet meten, in welke matrix, in welk concentratiebereik en welke beslissing het resultaat moet ondersteunen. Wij beoordelen de technische fit en stellen een haalbaarheids- of co-ontwikkelingstraject voor.",
    customCta: "Vraag een applicatiebeoordeling aan", heroPrimary: "Bekijk huidige assays", heroSecondary: "Bespreek uw monstermatrix", heroFocus: "Huidige analytische focus: glucose en sucrose in cultuurmedia",
    howEyebrow: "Hoe het werkt", howLead: "Van monster tot beslissing,", howAccent: "in vijf stappen",
    chartLabel: "Glucose · g/L", chartCaption: "Afname tijdens een fermentatierun",
    scaleEyebrow: "Gebouwd voor opschaling", scaleHeading: "Neem proceskennis mee naar pilot en productie", scaleCta: "Vraag een Q‑Tector-introductie aan",
    stages: ["R&D", "Dev", "Pilot", "Productie"], scaleChartCaption: "Vergelijkbare datasets stapelen zich op naarmate het proces richting productie beweegt.",
  },
  pl: {
    heroTitleLead: "Technologia", heroAccent: "Q‑Tector",
    heroEyebrow: "Platforma Q‑Tector",
    atLineEyebrow: "Co znaczy at-line", atLineHeading: "Wynik blisko procesu - a nie po kilku dniach",
    atLineBody1: "Pomiar at-line oznacza, że operator pobiera niewielką próbkę procesową i wykonuje prowadzony assay na stanowisku obok. Q‑Tector dopisuje wynik do historii procesu.",
    atLineBody2: "Jest przeznaczony do częstego pomiaru w trakcie serii - nie jest ciągłym czujnikiem online.",
    focusNote: "Parametry assayu zależą od analitu, zakresu stężeń i matrycy próbki. Napisz do nas, żeby potwierdzić dopasowanie do Twojego procesu.",
    customEyebrow: "Rozwój zastosowań", customHeading: "Potrzebujesz innego analitu lub matrycy próbki?",
    customBody: "Napisz nam, co potrzebujesz zmierzyć, w jakiej matrycy, w jakim zakresie stężeń i jaką decyzję ma wspierać wynik. Ocenimy dopasowanie techniczne i zaproponujemy ścieżkę studium wykonalności albo wspólnego rozwoju.",
    customCta: "Poproś o ocenę zastosowania", heroPrimary: "Zobacz dostępne assaye", heroSecondary: "Omówmy Twoją matrycę próbki", heroFocus: "Obecny zakres analityczny: glukoza i sacharoza w podłożach hodowlanych",
    howEyebrow: "Jak to działa", howLead: "Od próbki do decyzji,", howAccent: "w pięciu krokach",
    chartLabel: "Glukoza · g/L", chartCaption: "Spadek w trakcie fermentacji",
    scaleEyebrow: "Stworzony do skalowania", scaleHeading: "Przenieś wiedzę procesową do pilotażu i produkcji", scaleCta: "Poproś o wprowadzenie do Q‑Tectora",
    stages: ["B+R", "Dev", "Pilot", "Produkcja"], scaleChartCaption: "Porównywalne zbiory danych rosną, gdy proces zmierza ku produkcji.",
  },
};

export default function TechnologyPage({ lang, doc }: { lang: Locale; doc: TechDoc }) {
  const t = CHROME[lang];
  const hero = doc?.hero ?? {};
  const focus = doc?.focus ?? {};
  const scale = doc?.builtForScale ?? {};
  const steps = doc?.steps?.length ? doc.steps : EN.steps;
  const tags = focus.tags?.length ? focus.tags : EN.focusTags;

  const lead = hero.lead || EN.heroLead;
  const body1 = hero.body1 || EN.heroBody1;
  const body2 = hero.body2 || EN.heroBody2;
  /** The hero shows `hero.image` when the Studio holds one, and falls back to the
   *  brand's chrome form when it does not. The image used to be ignored on purpose:
   *  the only device photo we had was the Beer-o-Meter, mark and all, and this page
   *  is about Q-Tector (audit ch. 1 and 5). The reader-on-the-tank shot solves that
   *  - same hardware, no wordmark in frame - so the photo can lead again. */
  const heroArt = "/assets/hero-chrome.png";
  const heroPhoto = (() => {
    try {
      return hero.image ? urlFor(hero.image).width(1200).height(900).fit("crop").auto("format").url() : null;
    } catch {
      return null;
    }
  })();
  const heroAlt = (hero.image as { alt?: string } | undefined)?.alt ?? "";

  // Audit ch. 12: each CTA carries its own intent instead of dropping everyone on
  // the homepage's #contact anchor, which bypassed the intent-aware form entirely.
  const ctaScaleHref = contactUrl({ lang, intent: "pilot", sourcePage: "technology", sourceCta: "scale-up" });
  const ctaMatrixHref = contactUrl({ lang, intent: "assay", sourcePage: "technology", sourceCta: "hero-secondary" });
  const ctaCustomHref = contactUrl({ lang, intent: "assay", sourcePage: "technology", sourceCta: "application-development" });

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="technology" lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(20px,4vw,48px)" }}>
        <div data-techgrid="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#1F52B8", fontSize: 12.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{t.heroEyebrow}</div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,6.4vw,76px)", lineHeight: 1.0, letterSpacing: "-.025em" }}>
              {t.heroTitleLead} <span style={{ color: "#2E6BE6", fontWeight: 500 }}>{t.heroAccent}</span>
            </h1>
            <p style={{ margin: "24px 0 0", color: "#1F52B8", fontSize: "clamp(17px,1.8vw,21px)", fontWeight: 500, lineHeight: 1.5, maxWidth: 560 }}>{lead}</p>
            <p style={{ margin: "16px 0 0", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65, maxWidth: 600 }}>{body1}</p>
            {body2 ? <p style={{ margin: "14px 0 0", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65, maxWidth: 600 }}>{body2}</p> : null}
            <p style={{ display: "inline-flex", alignItems: "center", gap: 9, margin: "22px 0 0", padding: "9px 15px", background: "#fff", border: "1px solid rgba(24,30,48,.1)", borderRadius: 999, color: "#14161C", fontSize: 14.5, fontWeight: 600 }}>
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#2E6BE6", flex: "none" }} />
              {t.heroFocus}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href="#assays" className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 8, fontWeight: 500, fontSize: 16 }}>
                {hero.primaryCta?.label || t.heroPrimary} <ArrowUpRight />
              </a>
              <a href={ctaMatrixHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>
                {t.heroSecondary} <ArrowUpRight />
              </a>
            </div>
          </div>
          <div style={{ position: "relative", minHeight: 300, aspectRatio: "4 / 3" }}>
            {heroPhoto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroPhoto}
                alt={heroAlt}
                {...(heroAlt ? {} : { "aria-hidden": true })}
                fetchPriority="high"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, background: "#E7EAF0" }}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={heroArt} alt="" aria-hidden="true" style={{ position: "absolute", right: 0, bottom: 0, width: "auto", height: "auto", maxWidth: "92%", maxHeight: "92%", pointerEvents: "none" }} />
            )}
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(44px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 620, marginBottom: 44 }}>
          <div style={{ color: "#1F52B8", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{t.howEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>
            {t.howLead} <span style={{ color: "#2E6BE6" }}>{t.howAccent}</span>
          </h2>
        </div>
        <div className="tech-flow">
          <div className="tech-flow-line" />
          <div className="tech-flow-grid">
            {steps.map((s, i) => (
              <div className="tech-step" key={s.n || i}>
                <div className="tech-node">{s.n || String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AT-LINE, DEFINED — the audit asks for this in plain words, including
          what the platform is not. No time-to-result claim: that wording stays
          blocked until the client confirms it per assay (ch. 14). */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,56px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,.9fr) minmax(0,1.1fr)", gap: "clamp(20px,4vw,64px)", alignItems: "start" }} data-techgrid="1">
          <div>
            <div style={{ color: "#1F52B8", fontSize: 12.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{t.atLineEyebrow}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,44px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08 }}>{t.atLineHeading}</h2>
          </div>
          <div>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 17, lineHeight: 1.65 }}>{t.atLineBody1}</p>
            <p style={{ margin: "16px 0 0", padding: "16px 18px", background: "#fff", border: "1px solid rgba(24,30,48,.09)", borderRadius: 12, color: "#14161C", fontSize: 16, fontWeight: 500, lineHeight: 1.55 }}>{t.atLineBody2}</p>
          </div>
        </div>
      </section>

      {/* CURRENT ANALYTICAL FOCUS */}
      <section id="assays" style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,24px) clamp(20px,5vw,64px)", scrollMarginTop: 96 }}>
        <div data-techfocus="1" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "clamp(24px,4vw,56px)", alignItems: "center", background: "linear-gradient(180deg,#EDF1F8,#E3EAF6)", border: "1px solid rgba(24,30,48,.06)", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(28px,4vw,52px)" }}>
          <div>
            <div style={{ color: "#1F52B8", fontSize: 12.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>{focus.eyebrow || EN.focusEyebrow}</div>
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>{focus.heading || EN.focusHeading}</h2>
            <p style={{ margin: "0 0 22px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.6 }}>{focus.body || EN.focusBody}</p>
            <p style={{ margin: "-8px 0 22px", color: "#5A6275", fontSize: 15, lineHeight: 1.6 }}>{t.focusNote}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {tags.map((tag) => (
                <span key={tag} style={{ display: "inline-flex", alignItems: "center", width: "fit-content", alignSelf: "flex-start", background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#14161C", fontSize: 13.5, fontWeight: 500, padding: "8px 14px", borderRadius: 999 }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid rgba(24,30,48,.07)", boxShadow: "0 16px 44px rgba(20,26,48,.06)", aspectRatio: "4 / 3", minHeight: 220 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="qtAreaT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2E6BE6" stopOpacity=".2" />
                  <stop offset="1" stopColor="#2E6BE6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="rgba(24,30,48,.08)" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="9" y1="30" x2="92" y2="30" />
                <line x1="9" y1="50" x2="92" y2="50" />
                <line x1="9" y1="70" x2="92" y2="70" />
              </g>
              <path d="M10,30 C26,31 30,34 42,44 C54,54 60,63 76,66 C84,68 88,68 92,68 L92,74 L10,74 Z" fill="url(#qtAreaT)" />
              <path d="M10,30 C26,31 30,34 42,44 C54,54 60,63 76,66 C84,68 88,68 92,68" fill="none" stroke="#2E6BE6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="92" cy="68" r="6" fill="#2E6BE6" fillOpacity=".2" />
              <circle cx="92" cy="68" r="2.6" fill="#2E6BE6" />
            </svg>
            <div style={{ position: "absolute", top: 14, left: 16, color: "#5A6275", fontSize: 11, letterSpacing: ".04em", fontWeight: 500 }}>{t.chartLabel}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px", background: "linear-gradient(0deg,rgba(255,255,255,.95),rgba(255,255,255,0))" }}>
              <div style={{ fontSize: 12.5, color: "#5A6275" }}>{t.chartCaption}</div>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION DEVELOPMENT — the "another analyte or matrix" path (ch. 6). */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,56px) clamp(20px,5vw,64px)" }}>
        <div style={{ background: "#fff", border: "1px solid rgba(24,30,48,.08)", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(28px,4vw,52px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 28 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ color: "#1F52B8", fontSize: 12.5, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{t.customEyebrow}</div>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.1 }}>{t.customHeading}</h2>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.6 }}>{t.customBody}</p>
          </div>
          <a href={ctaCustomHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "16px 28px", borderRadius: 8, fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>
            {t.customCta} <ArrowUpRight />
          </a>
        </div>
      </section>

      {/* BUILT FOR SCALE-UP */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(24px,3vw,36px)", margin: "clamp(24px,3vw,36px) clamp(12px,2vw,24px)", padding: "clamp(44px,5vw,80px) clamp(24px,5vw,64px)" }}>
        <div data-techscale="1" style={{ maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#6AA6FF", fontSize: 14, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{t.scaleEyebrow}</div>
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>{t.scaleHeading}</h2>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>{scale.body1 || EN.scaleBody1}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>{scale.body2 || EN.scaleBody2}</p>
            <a href={ctaScaleHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 30, background: "#2E6BE6", color: "#fff", padding: "14px 26px", borderRadius: 8, fontWeight: 500, fontSize: 16 }}>{t.scaleCta} <ArrowUpRight /></a>
          </div>
          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "clamp(22px,3vw,30px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.55)", fontSize: 12, marginBottom: 18 }}>
              {t.stages.map((s) => <span key={s}>{s}</span>)}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 150 }}>
              {[36, 54, 72, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i < 2 ? "rgba(106,166,255,.35)" : "linear-gradient(180deg,#6AA6FF,#2E6BE6)" }} />
              ))}
            </div>
            <div style={{ marginTop: 16, color: "rgba(255,255,255,.55)", fontSize: 13.5, lineHeight: 1.5 }}>{t.scaleChartCaption}</div>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
