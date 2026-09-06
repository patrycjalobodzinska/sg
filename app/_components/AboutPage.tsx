import SiteFooter from "../site-footer";
import { contactUrl } from "./contact-intent";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import { localizedPath, type Locale } from "../i18n";

export type AboutDoc = {
  hero?: { eyebrow?: string; title?: string; titleAccent?: string; lead?: string; imageCaption?: string; primaryCta?: { label?: string }; secondaryCta?: { label?: string } };
  whyWeExist?: { eyebrow?: string; heading?: string; body1?: string; body2?: string };
  valuesEyebrow?: string; valuesHeading?: string;
  values?: { title?: string; text?: string }[];
  mission?: { eyebrow?: string; lead?: string; heading?: string; headingAccent?: string };
  partnersLabel?: string;
  partners?: string[];
} | null;

const PARTNERS = ["Bioclear Earth", "Fascinating", "University of Groningen", "Hanze UAS", "ISPT"];

const CHROME: Record<Locale, { primary: string; secondary: string; partnersLabel: string }> = {
  en: { primary: "Talk to us", secondary: "See the technology", partnersLabel: "Working with industry & research" },
  nl: { primary: "Neem contact op", secondary: "Bekijk de technologie", partnersLabel: "Samenwerking met industrie & onderzoek" },
  pl: { primary: "Napisz do nas", secondary: "Zobacz technologię", partnersLabel: "Współpraca z przemysłem i nauką" },
};

export default function AboutPage({ lang, doc }: { lang: Locale; doc: AboutDoc }) {
  const t = CHROME[lang];
  const hero = doc?.hero ?? {};
  const why = doc?.whyWeExist ?? {};
  const values = doc?.values ?? [];
  const mission = doc?.mission ?? {};
  const partners = doc?.partners?.length ? doc.partners : PARTNERS;
  const partnersLabel = doc?.partnersLabel || t.partnersLabel;

  const contactHref = contactUrl({ lang, intent: "general", sourcePage: "about", sourceCta: "hero-primary" });
  const techHref = localizedPath("/technology", lang);

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(20px,4vw,48px)" }}>
        <div data-aboutgrid="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#3A4152", fontSize: 12.5, fontWeight: 500, padding: "6px 13px 6px 7px", borderRadius: 999, marginBottom: 22 }}>
              <span style={{ display: "inline-flex", width: 17, height: 17, borderRadius: 5, background: "#2E6BE6", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>✓</span>
              {hero.eyebrow}
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(38px,6vw,72px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
              {hero.title} <span style={{ color: "#AEB4C4", fontWeight: 500 }}>SG&nbsp;Papertronics</span>
            </h1>
            <p style={{ margin: "24px 0 0", color: "#4A5163", fontSize: "clamp(16.5px,1.7vw,20px)", lineHeight: 1.6, maxWidth: 580 }}>{hero.lead}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href={contactHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>{hero.primaryCta?.label || t.primary} <ArrowUpRight /></a>
              <a href={techHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>{hero.secondaryCta?.label || t.secondary} <ArrowUpRight /></a>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", aspectRatio: "5 / 4", background: "#E7EAF0", boxShadow: "0 24px 60px rgba(20,26,48,.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/SGP-team.jpg" alt="The SG Papertronics team" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
            <div style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", padding: "7px 13px", borderRadius: 999, fontSize: 13, fontWeight: 500 }}>{hero.imageCaption}</div>
          </div>
        </div>
      </header>

      {/* WHY WE EXIST */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(36px,5vw,72px) clamp(20px,5vw,64px)" }}>
        <div data-aboutgrid="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#2E6BE6", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{why.eyebrow}</div>
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08 }}>{why.heading}</h2>
            <p style={{ margin: "0 0 14px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body1}</p>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body2}</p>
          </div>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3", background: "#E7EAF0", boxShadow: "0 18px 48px rgba(20,26,48,.1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/SG-papertronics009b.jpg" alt="At-line testing in the SG Papertronics lab" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,28px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 640, marginBottom: 36 }}>
          <div style={{ color: "#2E6BE6", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{doc?.valuesEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.valuesHeading}</h2>
        </div>
        <div data-aboutvals="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {values.map((v, i) => (
            <div key={v.title || i} style={{ background: "#fff", borderRadius: 22, padding: 30, border: "1px solid rgba(24,30,48,.06)", boxShadow: "0 12px 40px rgba(20,26,48,.04)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "#E9F0FC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#2E6BE6" }} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>{v.title}</h3>
              <p style={{ margin: 0, color: "#8990A0", fontSize: 15.5, lineHeight: 1.5 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION BAND */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(28px,4vw,48px)", margin: "clamp(28px,4vw,52px) clamp(12px,2vw,24px)", padding: "clamp(48px,6vw,88px) clamp(24px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-30%", right: "-6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(46,107,230,.32),transparent 66%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ color: "#8FB6FF", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 18 }}>{mission.eyebrow}</div>
          <p style={{ margin: 0, color: "rgba(255,255,255,.72)", fontSize: "clamp(17px,1.8vw,21px)", lineHeight: 1.55, maxWidth: 760 }}>{mission.lead}</p>
          <h2 style={{ margin: "22px 0 0", fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.02 }}>
            {mission.heading} <span style={{ color: "#8FB6FF" }}>{mission.headingAccent}</span>
          </h2>
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(24px,4vw,56px) clamp(20px,5vw,64px)" }}>
        <div style={{ color: "#8990A0", fontSize: 13, fontWeight: 500, letterSpacing: ".04em", marginBottom: 18 }}>{partnersLabel}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {partners.map((p) => (
            <span key={p} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#3A4152", fontSize: 14, fontWeight: 500, padding: "10px 16px", borderRadius: 999 }}>{p}</span>
          ))}
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
