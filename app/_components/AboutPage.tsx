import SiteFooter from "../site-footer";
import { contactUrl } from "./contact-intent";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import { localizedPath, type Locale } from "../i18n";
import { urlFor } from "../../sanity/lib/image";

export type AboutDoc = {
  hero?: { eyebrow?: string; title?: string; titleAccent?: string; lead?: string; primaryCta?: { label?: string }; secondaryCta?: { label?: string } };
  whyWeExist?: { eyebrow?: string; heading?: string; body1?: string; body2?: string };
  valuesEyebrow?: string; valuesHeading?: string;
  values?: { title?: string; text?: string }[];
  mission?: { eyebrow?: string; lead?: string; heading?: string; headingAccent?: string; visionEyebrow?: string; vision?: string };
  partnersLabel?: string;
  partners?: string[];
  teamEyebrow?: string;
  teamHeading?: string;
  team?: TeamMember[];
} | null;

export type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  /** Both optional on purpose: the audit asks for a competence line and a
   *  LinkedIn profile per person (ch. 8), and the card omits whichever the
   *  client has not filled in yet. */
  bio?: string;
  linkedin?: string;
  photo?: { asset?: unknown; alt?: string } | null;
};

function memberPhoto(photo: TeamMember["photo"]) {
  try {
    return photo?.asset ? urlFor(photo).width(560).height(560).fit("crop").auto("format").url() : null;
  } catch {
    return null;
  }
}

const PARTNERS = ["Bioclear Earth", "Fascinating", "University of Groningen", "Hanze UAS", "ISPT"];

const CHROME: Record<Locale, { primary: string; secondary: string; partnersLabel: string; teamEyebrow: string; teamHeading: string }> = {
  en: { primary: "Talk to us", secondary: "See the technology", partnersLabel: "Working with industry & research", teamEyebrow: "The team", teamHeading: "One team across assay, device and application development" },
  nl: { primary: "Neem contact op", secondary: "Bekijk de technologie", partnersLabel: "Samenwerking met industrie & onderzoek", teamEyebrow: "Het team", teamHeading: "Eén team voor assay-, apparaat- en applicatieontwikkeling" },
  pl: { primary: "Napisz do nas", secondary: "Zobacz technologię", partnersLabel: "Współpraca z przemysłem i nauką", teamEyebrow: "Zespół", teamHeading: "Jeden zespół: assaye, urządzenie i rozwój zastosowań" },
};

export default function AboutPage({ lang, doc }: { lang: Locale; doc: AboutDoc }) {
  const t = CHROME[lang];
  const hero = doc?.hero ?? {};
  const why = doc?.whyWeExist ?? {};
  const values = doc?.values ?? [];
  const mission = doc?.mission ?? {};
  const partners = doc?.partners?.length ? doc.partners : PARTNERS;
  const partnersLabel = doc?.partnersLabel || t.partnersLabel;
  const team = doc?.team ?? [];

  const contactHref = contactUrl({ lang, intent: "general", sourcePage: "about", sourceCta: "hero-secondary" });
  const techHref = localizedPath("/technology", lang);

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(20px,4vw,48px)" }}>
        <div data-aboutgrid="1" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#4A5163", fontSize: 12.5, fontWeight: 500, padding: "6px 13px 6px 7px", borderRadius: 999, marginBottom: 22 }}>
              <span style={{ display: "inline-flex", width: 17, height: 17, borderRadius: 5, background: "#2E6BE6", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>✓</span>
              {hero.eyebrow}
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(34px,4.4vw,56px)", lineHeight: 1.06, letterSpacing: "-.03em" }}>
              {hero.title} <span style={{ color: "#2E6BE6" }}>{hero.titleAccent}</span>
            </h1>
            <p style={{ margin: "22px 0 0", color: "#4A5163", fontSize: "clamp(16.5px,1.7vw,19px)", lineHeight: 1.65, maxWidth: 540 }}>{hero.lead}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href={techHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 8, fontWeight: 500, fontSize: 16 }}>{hero.primaryCta?.label || t.primary} <ArrowUpRight /></a>
              <a href={contactHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>{hero.secondaryCta?.label || t.secondary} <ArrowUpRight /></a>
            </div>
          </div>
          {/* The faces are the hero image: "who is behind this?" is answered above
              the fold instead of with a lab shot (audit ch. 8, ch. 10). Names and
              roles surface on hover and focus; the full cards sit further down. */}
          <ul data-heromosaic="1" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,1.2vw,16px)" }}>
            {team.slice(0, 9).map((m, i) => {
              const photo = memberPhoto(m.photo);
              return (
                <li
                  key={m._id}
                  className="hero-tile"
                  style={{ "--d": `${i * 55}ms`, position: "relative", aspectRatio: "1 / 1", borderRadius: 18, overflow: "hidden", background: "#E7EAF0" } as React.CSSProperties}
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={`${m.name}, ${m.role ?? ""}`} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                  <span className="hero-tile-name">
                    <b>{m.name}</b>
                    {m.role ? <span>{m.role}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {/* WHY WE EXIST */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(36px,5vw,72px) clamp(20px,5vw,64px)" }}>
        <div data-aboutgrid="1" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#1F52B8", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{why.eyebrow}</div>
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08 }}>{why.heading}</h2>
            <p style={{ margin: "0 0 14px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body1}</p>
            <p style={{ margin: 0, color: "#4A5163", fontSize: 16.5, lineHeight: 1.65 }}>{why.body2}</p>
          </div>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", aspectRatio: "4 / 3", background: "#E7EAF0", boxShadow: "0 18px 48px rgba(20,26,48,.1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/SG-papertronics009b.jpg" alt="At-line testing in the SG Papertronics lab" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(12px,2vw,28px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 640, marginBottom: 36 }}>
          <div style={{ color: "#1F52B8", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{doc?.valuesEyebrow}</div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.06 }}>{doc?.valuesHeading}</h2>
        </div>
        <div data-aboutvals="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {values.map((v, i) => (
            <div key={v.title || i} style={{ background: "#fff", borderRadius: 18, padding: 30, border: "1px solid rgba(24,30,48,.06)", boxShadow: "0 12px 40px rgba(20,26,48,.04)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E9F0FC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#2E6BE6" }} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>{v.title}</h3>
              <p style={{ margin: 0, color: "#5A6275", fontSize: 15.5, lineHeight: 1.5 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION BAND */}
      <section style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(24px,3vw,36px)", margin: "clamp(28px,4vw,52px) clamp(12px,2vw,24px)", padding: "clamp(48px,6vw,88px) clamp(24px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "-30%", right: "-6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(46,107,230,.32),transparent 66%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ color: "#8FB6FF", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 18 }}>{mission.eyebrow}</div>
          <p style={{ margin: 0, color: "rgba(255,255,255,.72)", fontSize: "clamp(17px,1.8vw,21px)", lineHeight: 1.55, maxWidth: 760 }}>{mission.lead}</p>
          <h2 style={{ margin: "22px 0 0", fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.02 }}>
            {mission.heading} <span style={{ color: "#8FB6FF" }}>{mission.headingAccent}</span>
          </h2>
          {mission.vision ? (
            /* Audit ch. 3: the site stated a mission but never a vision. */
            <div style={{ marginTop: "clamp(30px,4vw,44px)", paddingTop: "clamp(26px,3vw,34px)", borderTop: "1px solid rgba(255,255,255,.16)" }}>
              <div style={{ color: "#8FB6FF", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{mission.visionEyebrow}</div>
              <p style={{ margin: 0, fontSize: "clamp(19px,2.2vw,26px)", fontWeight: 500, letterSpacing: "-.01em", lineHeight: 1.4, maxWidth: 860 }}>{mission.vision}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* TEAM — names, roles, and per person a competence line and LinkedIn as
          soon as the client fills them in (audit ch. 8). */}
      {team.length ? (
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(28px,4vw,56px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 760, marginBottom: "clamp(24px,3vw,36px)" }}>
            <div style={{ color: "#1F52B8", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{doc?.teamEyebrow || t.teamEyebrow}</div>
            <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.08 }}>{doc?.teamHeading || t.teamHeading}</h2>
          </div>
          <ul data-teamgrid="1" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(16px,1.8vw,24px)" }}>
            {team.map((m) => {
              const photo = memberPhoto(m.photo);
              return (
                <li key={m._id} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.08)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#E7EAF0" }}>
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={m.photo?.alt || m.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6275", fontSize: 28, fontWeight: 600 }}>
                        {m.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 17.5, fontWeight: 600, letterSpacing: "-.01em" }}>{m.name}</h3>
                    {m.role ? <p style={{ margin: "5px 0 0", color: "#1F52B8", fontSize: 14.5, fontWeight: 500 }}>{m.role}</p> : null}
                    {m.bio ? <p style={{ margin: "11px 0 0", color: "#5A6275", fontSize: 14.5, lineHeight: 1.55 }}>{m.bio}</p> : null}
                    {m.linkedin ? (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 14, color: "#1F52B8", fontSize: 14, fontWeight: 600 }}>
                        LinkedIn <ArrowUpRight size={13} />
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* PARTNERS */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(24px,4vw,56px) clamp(20px,5vw,64px)" }}>
        <div style={{ color: "#5A6275", fontSize: 13, fontWeight: 500, letterSpacing: ".04em", marginBottom: 18 }}>{partnersLabel}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {partners.map((p) => (
            <span key={p} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#4A5163", fontSize: 14, fontWeight: 500, padding: "10px 16px", borderRadius: 8 }}>{p}</span>
          ))}
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
