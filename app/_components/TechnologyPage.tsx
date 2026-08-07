import SiteFooter from "../site-footer";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import { urlFor } from "../../sanity/lib/image";
import { localizedPath, type Locale } from "../i18n";

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
  heroLead: "A compact at-line testing platform for process-relevant measurements.",
  heroBody1:
    "Q‑Tector is designed for teams that need practical analytical data without adding unnecessary complexity to their workflow. The platform combines a readout device, ready-to-use assay pods, QR-guided workflows, app-based instructions and cloud-connected data handling.",
  heroBody2:
    "The goal is simple: make it easier to measure important process parameters close to where the process happens.",
  steps: [
    { n: "01", title: "Take a small sample", text: "Collect a small process sample from your culture, fermentation or product stream." },
    { n: "02", title: "Run the guided assay", text: "Use the ready-to-use assay pod and follow the app-guided workflow." },
    { n: "03", title: "Read the result", text: "Q‑Tector provides a clear result through the connected readout system." },
    { n: "04", title: "Track the process", text: "Results are stored and can be used for trend analysis, batch comparison and export." },
    { n: "05", title: "Act on the data", text: "Use the result to support feeding, process timing, formulation, stabilization, release or troubleshooting decisions." },
  ] as Step[],
  focusEyebrow: "Current analytical focus",
  focusHeading: "Quick glucose & sucrose monitoring",
  focusBody:
    "Q‑Tector currently focuses on quick glucose and sucrose monitoring in culture media, with additional sugars and metabolites available for development on request. This makes the platform especially relevant for fermentation, cell culture, media optimization, feed strategy development and production monitoring.",
  focusTags: ["Glucose & sucrose", "Culture media", "Fermentation", "Cell culture", "Media optimization", "Feed strategy", "Production monitoring"],
  scaleBody1: "Processes often fail to scale because the data collected in early development is not structured, frequent or comparable enough.",
  scaleBody2: "Q‑Tector helps teams build process datasets from early experiments onward. By using repeatable testing workflows and connected data capture, teams can compare experiments, monitor trends and carry process knowledge into pilot and production.",
};

// "Chrome" strings not modelled in the schema — translated in-code.
const CHROME: Record<Locale, {
  heroAccent: string; heroPrimary: string; heroSecondary: string; heroCaption: string;
  howEyebrow: string; howLead: string; howAccent: string;
  chartLabel: string; chartCaption: string;
  scaleEyebrow: string; scaleHeading: string; scaleCta: string; stages: string[]; scaleChartCaption: string;
}> = {
  en: {
    heroAccent: "technology", heroPrimary: "Talk to us about your process", heroSecondary: "See applications", heroCaption: "Lab-in-a-box · at-line",
    howEyebrow: "How it works", howLead: "Sample to decision,", howAccent: "in five steps",
    chartLabel: "Glucose · g/L", chartCaption: "Depletion across a fermentation run",
    scaleEyebrow: "Built for scale-up", scaleHeading: "Carry process knowledge into pilot and production", scaleCta: "Request a Q‑Tector introduction",
    stages: ["R&D", "Dev", "Pilot", "Production"], scaleChartCaption: "Comparable datasets accumulate as the process moves toward production.",
  },
  nl: {
    heroAccent: "technologie", heroPrimary: "Praat met ons over uw proces", heroSecondary: "Bekijk toepassingen", heroCaption: "Lab-in-a-box · at-line",
    howEyebrow: "Hoe het werkt", howLead: "Van monster tot beslissing,", howAccent: "in vijf stappen",
    chartLabel: "Glucose · g/L", chartCaption: "Afname tijdens een fermentatierun",
    scaleEyebrow: "Gebouwd voor opschaling", scaleHeading: "Neem proceskennis mee naar pilot en productie", scaleCta: "Vraag een Q‑Tector-introductie aan",
    stages: ["R&D", "Dev", "Pilot", "Productie"], scaleChartCaption: "Vergelijkbare datasets stapelen zich op naarmate het proces richting productie beweegt.",
  },
  pl: {
    heroAccent: "technologia", heroPrimary: "Porozmawiaj z nami o swoim procesie", heroSecondary: "Zobacz zastosowania", heroCaption: "Lab-in-a-box · at-line",
    howEyebrow: "Jak to działa", howLead: "Od próbki do decyzji,", howAccent: "w pięciu krokach",
    chartLabel: "Glukoza · g/L", chartCaption: "Spadek w trakcie fermentacji",
    scaleEyebrow: "Zbudowany pod skalowanie", scaleHeading: "Przenieś wiedzę procesową do pilotażu i produkcji", scaleCta: "Poproś o wprowadzenie do Q‑Tectora",
    stages: ["B+R", "Dev", "Pilot", "Produkcja"], scaleChartCaption: "Porównywalne zbiory danych rosną, gdy proces zmierza ku produkcji.",
  },
};

const imgUrl = (src: unknown, fallback: string, w: number, h: number) => {
  try {
    return src ? urlFor(src).width(w).height(h).fit("crop").auto("format").url() : fallback;
  } catch {
    return fallback;
  }
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
  const heroImg = imgUrl(hero.image, "/assets/hero-beer.png", 1000, 750);
  const focusImg = focus.image; // decorative chart overlays this section; image optional

  const contact = localizedPath("/", lang);
  const contactHref = contact === "/" ? "/#contact" : `${contact}#contact`;
  const applicationsHref = localizedPath("/applications", lang);

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="technology" lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(20px,4vw,48px)" }}>
        <div data-techgrid="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,6.4vw,76px)", lineHeight: 1.0, letterSpacing: "-.025em" }}>
              Q‑Tector <span style={{ color: "#AEB4C4", fontWeight: 500 }}>{t.heroAccent}</span>
            </h1>
            <p style={{ margin: "24px 0 0", color: "#2E6BE6", fontSize: "clamp(17px,1.8vw,21px)", fontWeight: 500, lineHeight: 1.5, maxWidth: 560 }}>{lead}</p>
            <p style={{ margin: "16px 0 0", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65, maxWidth: 600 }}>{body1}</p>
            <p style={{ margin: "14px 0 0", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65, maxWidth: 600 }}>{body2}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href={contactHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>
                {hero.primaryCta?.label || t.heroPrimary} <ArrowUpRight />
              </a>
              <a href={applicationsHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>
                {t.heroSecondary} <ArrowUpRight />
              </a>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", minHeight: 320, background: "#E7EAF0", aspectRatio: "4 / 3", boxShadow: "0 24px 60px rgba(20,26,48,.1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg} alt="Q‑Tector device in use" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            <div style={{ position: "absolute", left: 16, top: 16, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", padding: "7px 13px", borderRadius: 999, fontSize: 13, fontWeight: 500, color: "#14161C" }}>{t.heroCaption}</div>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(44px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 620, marginBottom: 44 }}>
          <div style={{ color: "#2E6BE6", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{t.howEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>
            {t.howLead} <span style={{ color: "#AEB4C4" }}>{t.howAccent}</span>
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

      {/* CURRENT ANALYTICAL FOCUS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,24px) clamp(20px,5vw,64px)" }}>
        <div data-techfocus="1" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "clamp(24px,4vw,56px)", alignItems: "center", background: "linear-gradient(180deg,#EDF1F8,#E3EAF6)", border: "1px solid rgba(24,30,48,.06)", borderRadius: "clamp(24px,3vw,40px)", padding: "clamp(28px,4vw,52px)" }}>
          <div>
            <div style={{ color: "#2E6BE6", fontSize: 12.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>{focus.eyebrow || EN.focusEyebrow}</div>
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>{focus.heading || EN.focusHeading}</h2>
            <p style={{ margin: "0 0 22px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.6 }}>{focus.body || EN.focusBody}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {tags.map((tag) => (
                <span key={tag} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#14161C", fontSize: 13.5, fontWeight: 500, padding: "8px 14px", borderRadius: 999 }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(24,30,48,.07)", boxShadow: "0 16px 44px rgba(20,26,48,.06)", aspectRatio: "4 / 3", minHeight: 220 }}>
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
            <div style={{ position: "absolute", top: 14, left: 16, color: "#8990A0", fontSize: 11, letterSpacing: ".04em", fontWeight: 500 }}>{t.chartLabel}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px", background: "linear-gradient(0deg,rgba(255,255,255,.95),rgba(255,255,255,0))" }}>
              <div style={{ fontSize: 12.5, color: "#8990A0" }}>{t.chartCaption}</div>
            </div>
            {focusImg ? null : null}
          </div>
        </div>
      </section>

      {/* BUILT FOR SCALE-UP */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(28px,4vw,48px)", margin: "clamp(24px,3vw,40px) clamp(12px,2vw,24px)", padding: "clamp(44px,5vw,80px) clamp(24px,5vw,64px)" }}>
        <div data-techscale="1" style={{ maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#6AA6FF", fontSize: 14, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{t.scaleEyebrow}</div>
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>{t.scaleHeading}</h2>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>{scale.body1 || EN.scaleBody1}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>{scale.body2 || EN.scaleBody2}</p>
            <a href={contactHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 30, background: "#2E6BE6", color: "#fff", padding: "14px 26px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>{t.scaleCta} <ArrowUpRight /></a>
          </div>
          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "clamp(22px,3vw,30px)" }}>
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
