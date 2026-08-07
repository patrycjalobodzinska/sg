import SiteFooter from "../site-footer";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import { type Locale } from "../i18n";

type Cta = { label?: string };
export type InvDoc = {
  hero?: { title?: string; titleAccent?: string; body1?: string; body2?: string; primaryCta?: Cta; secondaryCta?: Cta };
  whyNow?: { eyebrow?: string; heading?: string; body1?: string; body2?: string; painPoints?: string[] };
  mission?: { eyebrow?: string; heading?: string; headingAccent?: string; body?: string };
  platform?: { eyebrow?: string; heading?: string; body?: string; features?: string[] };
  problem?: { eyebrow?: string; heading?: string; body?: string };
  benefits?: { tag?: string; text?: string; benefit?: string }[];
  marketEyebrow?: string; marketHeading?: string; marketSubtitle?: string; market?: string[];
  seriesAEyebrow?: string; seriesAHeading?: string; seriesA?: { title?: string; text?: string }[];
  thesisEyebrow?: string; thesisHeading?: string; thesis?: string[];
} | null;

const CHROME: Record<Locale, {
  heroPrimary: string; heroSecondary: string;
  benefitsEyebrow: string; benefitsHeading: string;
  cfEyebrow: string; cfHeading: string; cfBody1: string; cfBody2: string;
}> = {
  en: {
    heroPrimary: "Request investor deck", heroSecondary: "Contact investor relations",
    benefitsEyebrow: "Customer benefits", benefitsHeading: "Better data. Faster decisions. Stronger scale-up.",
    cfEyebrow: "Commercial foundation", cfHeading: "From brewing process control to broader biotech",
    cfBody1: "SG Papertronics built strong market validation through Beer-o-Meter - our application of Q‑Tector technology for brewing process control. It proved that producers value simple, fast, actionable testing close to the process, and created a real-world validation environment and customer feedback loop.",
    cfBody2: "We are now expanding the same platform logic into broader fermentation, biotech, CDMO and precision-fermentation markets - central to our Series A growth strategy.",
  },
  nl: {
    heroPrimary: "Vraag investor deck aan", heroSecondary: "Contact investor relations",
    benefitsEyebrow: "Klantvoordelen", benefitsHeading: "Betere data. Snellere beslissingen. Sterkere opschaling.",
    cfEyebrow: "Commerciële basis", cfHeading: "Van brouwprocontrol naar bredere biotech",
    cfBody1: "SG Papertronics bouwde sterke marktvalidatie op met Beer-o-Meter - onze toepassing van Q‑Tector-technologie voor brouwproscontrole. Het bewees dat producenten waarde hechten aan eenvoudige, snelle en bruikbare metingen dicht bij het proces, en creëerde een validatieomgeving en klantfeedback-loop in de praktijk.",
    cfBody2: "We breiden dezelfde platformlogica nu uit naar bredere fermentatie-, biotech-, CDMO- en precisiefermentatiemarkten - centraal in onze Series A-groeistrategie.",
  },
  pl: {
    heroPrimary: "Poproś o deck inwestorski", heroSecondary: "Kontakt dla inwestorów",
    benefitsEyebrow: "Korzyści dla klientów", benefitsHeading: "Lepsze dane. Szybsze decyzje. Mocniejsze skalowanie.",
    cfEyebrow: "Fundament komercyjny", cfHeading: "Od kontroli procesu w browarnictwie do szerszego biotechu",
    cfBody1: "SG Papertronics zbudował silną walidację rynkową dzięki Beer-o-Meter - naszemu zastosowaniu technologii Q‑Tector do kontroli procesu w browarnictwie. Pokazało to, że producenci cenią proste, szybkie i użyteczne pomiary blisko procesu, i stworzyło rzeczywiste środowisko walidacji oraz pętlę informacji zwrotnej od klientów.",
    cfBody2: "Rozszerzamy teraz tę samą logikę platformy na szersze rynki fermentacji, biotechu, CDMO i fermentacji precyzyjnej - co jest centralnym elementem naszej strategii wzrostu w rundzie Series A.",
  },
};

const eyebrow = (t?: string) => (
  <div style={{ color: "#2E6BE6", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{t}</div>
);

export default function InvestorsPage({ lang, doc }: { lang: Locale; doc: InvDoc }) {
  const t = CHROME[lang];
  const hero = doc?.hero ?? {};
  const why = doc?.whyNow ?? {};
  const mission = doc?.mission ?? {};
  const platform = doc?.platform ?? {};
  const problem = doc?.problem ?? {};
  const benefits = doc?.benefits ?? [];
  const market = doc?.market ?? [];
  const seriesA = doc?.seriesA ?? [];
  const thesis = doc?.thesis ?? [];

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="investors" lang={lang} />

      {/* HERO (dark) */}
      <header style={{ position: "relative", overflow: "hidden", background: "#0B1220", color: "#fff", borderRadius: "0 0 clamp(28px,4vw,48px) clamp(28px,4vw,48px)", padding: "clamp(88px,10vw,116px) clamp(20px,5vw,64px) clamp(48px,6vw,88px)" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-20%", right: "-6%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(46,107,230,.4),transparent 66%)", pointerEvents: "none" }} />
        <div data-invgrid="1" style={{ maxWidth: 1440, margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(34px,5.2vw,64px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.02 }}>
              {hero.title} <span style={{ color: "#8FB6FF" }}>{hero.titleAccent}</span>
            </h1>
            <p style={{ margin: "24px 0 0", color: "rgba(255,255,255,.75)", fontSize: "clamp(16px,1.7vw,19px)", lineHeight: 1.6, maxWidth: 620 }}>{hero.body1}</p>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.6)", fontSize: 16, lineHeight: 1.6, maxWidth: 620 }}>{hero.body2}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 32 }}>
              <a href="mailto:m.grajewski@sgpapertronics.com?subject=Investor%20deck%20request" className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "16px 26px", borderRadius: 14, fontWeight: 600, fontSize: 16, boxShadow: "0 14px 36px rgba(46,107,230,.4)" }}>{hero.primaryCta?.label || t.heroPrimary} <ArrowUpRight /></a>
              <a href="mailto:m.grajewski@sgpapertronics.com" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "16px 24px", borderRadius: 14, fontWeight: 500, fontSize: 16 }}>{hero.secondaryCta?.label || t.heroSecondary} <ArrowUpRight /></a>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3", background: "#141C2E", boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/SG-papertronics009b.jpg" alt="SG Papertronics team in the lab" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 38%" }} />
          </div>
        </div>
      </header>

      {/* WHY NOW */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,54px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, marginBottom: 32 }}>
          {eyebrow(why.eyebrow)}
          <h2 style={{ margin: 0, fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{why.heading}</h2>
        </div>
        <div data-inv2="1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "start" }}>
          <div>
            <p style={{ margin: "0 0 14px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body1}</p>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body2}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 22, padding: "clamp(24px,3vw,32px)", boxShadow: "0 12px 40px rgba(20,26,48,.04)" }}>
            {(why.painPoints ?? []).map((p) => (
              <div key={p} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(24,30,48,.07)", color: "#14161C", fontSize: 15.5, lineHeight: 1.45 }}>
                <span style={{ color: "#2E6BE6", flex: "none" }}>›</span>{p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION BAND */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(28px,4vw,48px)", margin: "clamp(8px,2vw,20px) clamp(12px,2vw,24px)", padding: "clamp(32px,4vw,60px) clamp(24px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ color: "#8FB6FF", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{mission.eyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.04 }}>
            {mission.heading} <span style={{ color: "#8FB6FF" }}>{mission.headingAccent}</span>
          </h2>
          <p style={{ margin: "20px 0 0", color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6, maxWidth: 720 }}>{mission.body}</p>
        </div>
      </section>

      {/* THE PLATFORM */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,54px) clamp(20px,5vw,64px)" }}>
        <div data-inv2="1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
          <div>
            {eyebrow(platform.eyebrow)}
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{platform.heading}</h2>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{platform.body}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {(platform.features ?? []).map((f) => (
              <div key={f} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 16, padding: "18px 20px", fontSize: 15, fontWeight: 500, color: "#14161C", boxShadow: "0 10px 30px rgba(20,26,48,.04)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E6BE6", flex: "none" }} />{f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,24px) clamp(20px,5vw,64px)" }}>
        <div style={{ background: "linear-gradient(180deg,#EDF1F8,#E3EAF6)", border: "1px solid rgba(24,30,48,.06)", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(32px,4vw,56px)" }}>
          {eyebrow(problem.eyebrow)}
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08, maxWidth: 820 }}>{problem.heading}</h2>
          <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65, maxWidth: 820 }}>{problem.body}</p>
        </div>
      </section>

      {/* CUSTOMER BENEFITS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,54px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, marginBottom: 36 }}>
          {eyebrow(t.benefitsEyebrow)}
          <h2 style={{ margin: 0, fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{t.benefitsHeading}</h2>
        </div>
        <div data-invbenefits="1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {benefits.map((b, i) => (
            <div key={b.tag || i} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 22, padding: "clamp(26px,3vw,34px)", boxShadow: "0 12px 40px rgba(20,26,48,.05)" }}>
              <span style={{ fontSize: 12, color: "#2E6BE6", background: "#E9F0FC", padding: "5px 12px", borderRadius: 999, fontWeight: 600 }}>{b.tag}</span>
              <p style={{ margin: "18px 0 14px", color: "#4A5163", fontSize: 15.5, lineHeight: 1.6 }}>{b.text}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "#14161C", fontSize: 14.5, fontWeight: 600, lineHeight: 1.45 }}>
                <span style={{ color: "#2E6BE6", flex: "none" }}>→</span>{b.benefit}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMERCIAL FOUNDATION (chrome — not in schema) */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,28px) clamp(20px,5vw,64px)" }}>
        <div data-inv2="1" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3", background: "#E7EAF0", boxShadow: "0 18px 48px rgba(20,26,48,.1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/beerometer-1080x675.jpeg" alt="Beer-o-Meter - the first commercial validation" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            {eyebrow(t.cfEyebrow)}
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08 }}>{t.cfHeading}</h2>
            <p style={{ margin: "0 0 14px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{t.cfBody1}</p>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{t.cfBody2}</p>
          </div>
        </div>
      </section>

      {/* MARKET OPPORTUNITY */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,54px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, marginBottom: 30 }}>
          {eyebrow(doc?.marketEyebrow)}
          <h2 style={{ margin: 0, fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.marketHeading}</h2>
          <p style={{ margin: "16px 0 0", color: "#8990A0", fontSize: 16.5, lineHeight: 1.55 }}>{doc?.marketSubtitle}</p>
        </div>
        <div data-invmarket="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {market.map((m) => (
            <div key={m} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 16, padding: "20px 22px", fontSize: 15.5, fontWeight: 500, color: "#14161C", boxShadow: "0 10px 30px rgba(20,26,48,.04)" }}>{m}</div>
          ))}
        </div>
      </section>

      {/* SERIES A FOCUS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,24px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, marginBottom: 36 }}>
          {eyebrow(doc?.seriesAEyebrow)}
          <h2 style={{ margin: 0, fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.seriesAHeading}</h2>
        </div>
        <div data-invmarket="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {seriesA.map((s, i) => (
            <div key={s.title || i} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 20, padding: 28, boxShadow: "0 12px 40px rgba(20,26,48,.04)" }}>
              <span style={{ fontSize: 12, color: "#2E6BE6", background: "#E9F0FC", padding: "4px 11px", borderRadius: 999, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 style={{ margin: "16px 0 8px", fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>{s.title}</h3>
              <p style={{ margin: 0, color: "#8990A0", fontSize: 15, lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INVESTMENT THESIS (dark) */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(28px,4vw,48px)", margin: "clamp(18px,3vw,34px) clamp(12px,2vw,24px)", padding: "clamp(34px,4vw,62px) clamp(24px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-30%", left: "-6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(106,166,255,.24),transparent 68%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ color: "#8FB6FF", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{doc?.thesisEyebrow}</div>
          <h2 style={{ margin: "0 0 32px", fontSize: "clamp(26px,3.6vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06, maxWidth: 900 }}>{doc?.thesisHeading}</h2>
          <div data-invmarket="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {thesis.map((x) => (
              <div key={x} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: "18px 20px", fontSize: 15, lineHeight: 1.45, display: "flex", gap: 10 }}>
                <span style={{ color: "#6AA6FF", flex: "none" }}>›</span>{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
