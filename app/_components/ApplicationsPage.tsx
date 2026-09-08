import SiteFooter from "../site-footer";
import { contactUrl } from "./contact-intent";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import { localizedPath, type Locale } from "../i18n";
import type { AppContent } from "../../sanity/lib/pages";

const PE = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

// images are language-independent → kept in code (no Sanity image dependency)
const HERO_IMG = PE(18915643, 1200);
const CAT_IMG = [PE(8386434), PE(8770717), PE(1267700), PE(2255801)];
const caseImg = (id?: string) =>
  id?.includes("beer") ? "/assets/beerometer-1080x675.jpeg" : id?.includes("ferment") ? PE(8392613) : id?.includes("agri") ? PE(1435904) : PE(8392613);

// English source of truth (verbatim current copy) — fallback if Sanity empty
const EN = {
  heroTitle: "Built for biological",
  heroAccent: "production",
  heroLead: "Q‑Tector adapts to how different teams work with living processes - from early development and optimization to pilot runs and production monitoring.",
  catsEyebrow: "Where Q‑Tector fits",
  catsHeading: "Four ways teams put it to work",
  categories: [
    { tag: "Biotech & precision fermentation", title: "Understand how your cultures behave", text: "Monitor nutrient consumption and performance across strains, media and scale-up steps.", points: ["Track nutrient availability during culture development", "Compare media and feed strategies", "Generate datasets for scale-up decisions"] },
    { tag: "CDMOs & contract development", title: "Standardize monitoring across projects", text: "A consistent at-line workflow for early development, process transfer and troubleshooting.", points: ["Monitor key parameters across client projects", "Reduce dependency on delayed feedback", "Build clear datasets for client reporting"] },
    { tag: "Fermented food & beverage", title: "Control living products with better data", text: "Make process-relevant measurements easy during development and production.", points: ["Monitor residual sugars during fermentation", "Know when fermentation is complete", "Reduce batch-to-batch variation"] },
    { tag: "Agri-food & applied biotech", title: "Insight into complex biological systems", text: "Adaptable to new assay development and application-specific workflows.", points: ["Develop practical testing workflows", "Monitor process-relevant analytes", "Now live: PotatoSense - Fascinating / ISPT"] },
  ],
  casesEyebrow: "Case studies",
  casesHeading: "Q‑Tector in the real world",
  cases: [
    { tag: "Brewing", title: "Beer-o-Meter: brewing quality control", text: "Our first commercial application of Q‑Tector - fast, at-line testing of sugars, alcohol and key parameters for craft breweries, close to the tank.", id: "beer" },
    { tag: "Precision fermentation", title: "Media & feed monitoring across runs", text: "Tracking glucose and sucrose in culture media so teams can compare feed strategies and act during the run - not days after it.", id: "ferment" },
    { tag: "Agri-food", title: "PotatoSense - Fascinating / ISPT", text: "Applying Q‑Tector measurement workflows to agri-food process questions through a regional innovation collaboration.", id: "agri" },
  ],
  ctaHeading: "Have a process in mind?",
  ctaBody: "Tell us your organism, process stage and goal - we'll show where Q‑Tector fits and how fast you can start.",
  ctaButton: "Talk to us",
};

const CHROME: Record<Locale, { heroCaption: string; heroPrimary: string; heroSecondary: string }> = {
  en: { heroCaption: "At-line, close to the process", heroPrimary: "Talk to us about your process", heroSecondary: "See the technology" },
  nl: { heroCaption: "At-line, dicht bij het proces", heroPrimary: "Praat met ons over uw proces", heroSecondary: "Bekijk de technologie" },
  pl: { heroCaption: "Przyprocesowo, blisko procesu", heroPrimary: "Porozmawiaj z nami o swoim procesie", heroSecondary: "Zobacz technologię" },
};

const tagPill = { display: "inline-flex", alignItems: "center", width: "fit-content", alignSelf: "flex-start", fontSize: 12, color: "#1F52B8", background: "#E9F0FC", padding: "5px 12px", borderRadius: 999, fontWeight: 600 };
const eyebrow = { color: "#1F52B8", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" as const, marginBottom: 14 };

export default function ApplicationsPage({ lang, doc }: { lang: Locale; doc: AppContent }) {
  const t = CHROME[lang];
  const hero = doc?.hero ?? {};
  const cats = doc?.categories?.length ? doc.categories : EN.categories;
  const cases = doc?.caseStudies?.length ? doc.caseStudies : EN.cases.map((c) => ({ _id: c.id, tag: c.tag, title: c.title, text: c.text }));

  // Audit ch. 12. Both CTAs are genuinely "discuss an application", so they share
  // the intent but stay distinguishable in the inbox through source_cta.
  const ctaHeroHref = contactUrl({ lang, intent: "pilot", sourcePage: "applications", sourceCta: "hero-primary" });
  const ctaClosingHref = contactUrl({ lang, intent: "pilot", sourcePage: "applications", sourceCta: "closing" });
  const techHref = localizedPath("/technology", lang);

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="applications" lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(20px,4vw,44px)" }}>
        <div data-apphero="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(38px,6vw,72px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
              {hero.title || EN.heroTitle} <span style={{ color: "#2E6BE6", fontWeight: 500 }}>{hero.titleAccent || EN.heroAccent}</span>
            </h1>
            <p style={{ margin: "22px 0 0", color: "#4A5163", fontSize: "clamp(16.5px,1.7vw,20px)", lineHeight: 1.6, maxWidth: 580 }}>{hero.lead || EN.heroLead}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href={ctaHeroHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>{hero.primaryCta?.label || t.heroPrimary} <ArrowUpRight /></a>
              <a href={techHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>{hero.secondaryCta?.label || t.heroSecondary} <ArrowUpRight /></a>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", aspectRatio: "4 / 3", background: "#E7EAF0", boxShadow: "0 24px 60px rgba(20,26,48,.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_IMG} alt="Fermentation process monitoring" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", padding: "7px 13px", borderRadius: 999, fontSize: 13, fontWeight: 500 }}>{t.heroCaption}</div>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, marginBottom: 32 }}>
          <div style={eyebrow}>{doc?.categoriesEyebrow || EN.catsEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,44px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.categoriesHeading || EN.catsHeading}</h2>
        </div>
        <div data-appcats="1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {cats.map((c, i) => (
            <div key={c.tag || i} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(24,30,48,.06)", boxShadow: "0 14px 44px rgba(20,26,48,.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", aspectRatio: "16 / 8", background: "#E7EAF0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CAT_IMG[i] || CAT_IMG[0]} alt={c.title || ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "clamp(24px,3vw,34px)" }}>
                <span style={tagPill}>{c.tag}</span>
                <h3 style={{ margin: "16px 0 10px", fontSize: 22, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.15 }}>{c.title}</h3>
                <p style={{ margin: "0 0 18px", color: "#5A6275", fontSize: 15.5, lineHeight: 1.5 }}>{c.text}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {(c.points || []).map((p) => (
                    <div key={p} style={{ display: "flex", gap: 10, color: "#4A5163", fontSize: 15, lineHeight: 1.4 }}>
                      <span style={{ color: "#1F52B8", flex: "none" }}>›</span>{p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,56px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, marginBottom: 30 }}>
          <div style={eyebrow}>{doc?.caseStudiesEyebrow || EN.casesEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,44px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.caseStudiesHeading || EN.casesHeading}</h2>
        </div>
        <div data-appcases="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {cases.map((c, i) => (
            <article key={c._id || i} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(24,30,48,.06)", boxShadow: "0 12px 40px rgba(20,26,48,.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", aspectRatio: "16 / 10", background: "#E7EAF0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={caseImg(c._id)} alt={c.title || ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 26, display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={tagPill}>{c.tag}</span>
                <h3 style={{ margin: "14px 0 10px", fontSize: 19, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.2 }}>{c.title}</h3>
                <p style={{ margin: 0, color: "#5A6275", fontSize: 15, lineHeight: 1.55 }}>{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(20px,3vw,36px) clamp(20px,5vw,64px) clamp(32px,5vw,64px)" }}>
        <div style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(32px,4vw,56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "clamp(22px,2.6vw,32px)", fontWeight: 600, letterSpacing: "-.02em" }}>{doc?.cta?.heading || EN.ctaHeading}</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 16, lineHeight: 1.55 }}>{doc?.cta?.body || EN.ctaBody}</p>
          </div>
          <a href={ctaClosingHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "16px 28px", borderRadius: 999, fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>{doc?.cta?.button?.label || EN.ctaButton} <ArrowUpRight /></a>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
