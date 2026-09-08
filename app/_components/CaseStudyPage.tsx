import { PortableText, type PortableTextComponents } from "@portabletext/react";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import { urlFor } from "../../sanity/lib/image";
import { localizedPath, type Locale } from "../i18n";
import { contactUrl } from "./contact-intent";
import type { CaseStudy } from "../../sanity/lib/cases";

/** Section labels. The page is a template: every block below renders only when
 *  the corresponding field is filled, so a half-known story still reads well. */
export const CASE_CHROME = {
  en: {
    back: "All case studies",
    facts: "At a glance",
    analyte: "Analyte",
    matrix: "Sample matrix",
    partner: "Partner",
    status: "Status",
    relationship: "Relationship",
    problem: "The problem",
    workflow: "The workflow",
    result: "The result",
    next: "Next milestone",
    ctaHeading: "A process like this?",
    ctaBody: "Tell us what you are producing, what you need to measure and which decision the result should support.",
    ctaButton: "Request a process-fit review",
    index: "Case studies",
    indexLead: "Commercial validation and application development.",
    readMore: "Read the case study",
  },
  nl: {
    back: "Alle case studies",
    facts: "In het kort",
    analyte: "Analyt",
    matrix: "Monstermatrix",
    partner: "Partner",
    status: "Status",
    relationship: "Relatie",
    problem: "Het probleem",
    workflow: "De workflow",
    result: "Het resultaat",
    next: "Volgende mijlpaal",
    ctaHeading: "Een vergelijkbaar proces?",
    ctaBody: "Vertel ons wat u produceert, wat u moet meten en welke beslissing het resultaat moet ondersteunen.",
    ctaButton: "Vraag een process-fit review aan",
    index: "Case studies",
    indexLead: "Commerciële validatie en applicatieontwikkeling.",
    readMore: "Lees de case study",
  },
  pl: {
    back: "Wszystkie case studies",
    facts: "W skrócie",
    analyte: "Analit",
    matrix: "Matryca próbki",
    partner: "Partner",
    status: "Status",
    relationship: "Relacja",
    problem: "Problem",
    workflow: "Przebieg pomiaru",
    result: "Wynik",
    next: "Następny kamień milowy",
    ctaHeading: "Masz podobny proces?",
    ctaBody: "Napisz nam, co produkujesz, co musisz mierzyć i jaką decyzję ma wspierać wynik.",
    ctaButton: "Poproś o przegląd dopasowania procesu",
    index: "Case studies",
    indexLead: "Walidacja komercyjna i rozwój zastosowań.",
    readMore: "Przeczytaj case study",
  },
} as const;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={{ margin: "0 0 18px", color: "#4A5163", fontSize: 17, lineHeight: 1.7 }}>{children}</p>,
    h2: ({ children }) => (
      <h2 style={{ margin: "36px 0 12px", fontSize: "clamp(21px,2.2vw,26px)", fontWeight: 600, letterSpacing: "-.02em", color: "#14161C" }}>{children}</h2>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "0 0 18px", padding: "0 0 0 22px", color: "#4A5163", fontSize: 17, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 8 }}>{children}</ul>
    ),
  },
  listItem: { bullet: ({ children }) => <li>{children}</li> },
  marks: { strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#14161C" }}>{children}</strong> },
};

const pill = (text: string, tone: "brand" | "neutral" = "brand") => (
  <span
    key={text}
    style={{
      display: "inline-flex",
      alignItems: "center",
      background: tone === "brand" ? "#E9F0FC" : "#F1F3F7",
      color: tone === "brand" ? "#1F52B8" : "#5A6275",
      fontSize: 12.5,
      fontWeight: 600,
      padding: "6px 13px",
      borderRadius: 999,
    }}
  >
    {text}
  </span>
);

function imgUrl(image: CaseStudy["image"], w: number, h: number) {
  try {
    return image?.asset ? urlFor(image).width(w).height(h).fit("crop").auto("format").url() : null;
  } catch {
    return null;
  }
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "clamp(30px,4vw,44px)" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: "clamp(20px,2.2vw,26px)", fontWeight: 600, letterSpacing: "-.02em", color: "#14161C" }}>{label}</h2>
      {children}
    </section>
  );
}

const body = { margin: 0, color: "#4A5163", fontSize: 17, lineHeight: 1.7 } as const;

export default function CaseStudyPage({ lang, doc }: { lang: Locale; doc: CaseStudy }) {
  const t = CASE_CHROME[lang];
  const hero = imgUrl(doc.image, 1600, 900);
  const facts: [string, string | undefined][] = [
    [t.analyte, doc.analyte],
    [t.matrix, doc.sampleMatrix],
    [t.partner, doc.partner],
    [t.status, doc.status],
    [t.relationship, doc.relationship],
  ];
  const known = facts.filter(([, value]) => value);
  const ctaHref = contactUrl({ lang, intent: "pilot", sourcePage: "case-study", sourceCta: "closing", vertical: doc.tag });

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />
      <main id="main" style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(104px,9vw,128px) clamp(20px,5vw,64px) clamp(40px,5vw,72px)" }}>
        <div style={{ maxWidth: 860 }}>
        <a href={localizedPath("/case-studies", lang)} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#5A6275", fontSize: 14.5, fontWeight: 500 }}>
          ← {t.back}
        </a>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "22px 0 16px" }}>
          {doc.tag ? pill(doc.tag) : null}
          {doc.relationship ? pill(doc.relationship, "neutral") : null}
          {doc.status ? pill(doc.status, "neutral") : null}
        </div>

        <h1 style={{ margin: 0, fontSize: "clamp(32px,4.6vw,54px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.05 }}>{doc.title}</h1>
        {doc.description ? <p style={{ margin: "18px 0 0", color: "#4A5163", fontSize: "clamp(17px,1.7vw,20px)", lineHeight: 1.6 }}>{doc.description}</p> : null}

        {hero ? (
          <div style={{ margin: "clamp(28px,4vw,40px) 0 0", borderRadius: 18, overflow: "hidden", background: "#E7EAF0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt={doc.image?.alt || ""} style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
        ) : null}

        {known.length ? (
          <section style={{ marginTop: "clamp(28px,4vw,40px)", background: "#fff", border: "1px solid rgba(24,30,48,.08)", borderRadius: 18, padding: "clamp(20px,2.4vw,28px)" }}>
            <div style={{ color: "#5A6275", fontSize: 11.5, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 16 }}>{t.facts}</div>
            <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "18px 28px" }}>
              {known.map(([label, value]) => (
                <div key={label}>
                  <dt style={{ margin: 0, color: "#5A6275", fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</dt>
                  <dd style={{ margin: "6px 0 0", color: "#14161C", fontSize: 16.5, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.35 }}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {doc.problem ? <Block label={t.problem}><p style={body}>{doc.problem}</p></Block> : null}
        {doc.workflow ? <Block label={t.workflow}><p style={body}>{doc.workflow}</p></Block> : null}

        {doc.result ? (
          <Block label={t.result}>
            <p style={{ margin: 0, color: "#14161C", fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.3 }}>{doc.result}</p>
          </Block>
        ) : null}

        {doc.quote ? (
          <blockquote style={{ margin: "clamp(28px,4vw,40px) 0 0", padding: "clamp(20px,2.4vw,28px)", background: "#fff", borderLeft: "3px solid #2E6BE6", borderRadius: "0 18px 18px 0" }}>
            <p style={{ margin: 0, color: "#14161C", fontSize: "clamp(17px,1.8vw,20px)", lineHeight: 1.55 }}>“{doc.quote}”</p>
            {doc.quoteAuthor ? <footer style={{ marginTop: 12, color: "#5A6275", fontSize: 14.5, fontWeight: 500 }}>{doc.quoteAuthor}</footer> : null}
          </blockquote>
        ) : null}

        {doc.body?.length ? (
          <div style={{ marginTop: "clamp(30px,4vw,44px)" }}>
            <PortableText value={doc.body} components={components} />
          </div>
        ) : null}

        {doc.nextMilestone ? (
          <Block label={t.next}>
            <p style={body}>{doc.nextMilestone}</p>
          </Block>
        ) : null}

        <section style={{ marginTop: "clamp(40px,5vw,64px)", background: "#0E1526", color: "#fff", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(24px,3vw,36px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 22 }}>
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "clamp(21px,2.4vw,28px)", fontWeight: 600, letterSpacing: "-.02em" }}>{t.ctaHeading}</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 16, lineHeight: 1.55 }}>{t.ctaBody}</p>
          </div>
          <a href={ctaHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "15px 26px", borderRadius: 999, fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>
            {t.ctaButton} <ArrowUpRight />
          </a>
        </section>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
