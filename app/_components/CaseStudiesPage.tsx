import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import { urlFor } from "../../sanity/lib/image";
import { localizedPath, type Locale } from "../i18n";
import type { CaseStudy } from "../../sanity/lib/cases";
import { CASE_CHROME } from "./CaseStudyPage";

function cover(image: CaseStudy["image"]) {
  try {
    return image?.asset ? urlFor(image).width(800).height(500).fit("crop").auto("format").url() : null;
  } catch {
    return null;
  }
}

const pill = (text: string, tone: "brand" | "neutral" = "brand") => (
  <span
    key={text}
    style={{
      display: "inline-flex",
      alignItems: "center",
      background: tone === "brand" ? "#E9F0FC" : "#F1F3F7",
      color: tone === "brand" ? "#1F52B8" : "#5A6275",
      fontSize: 12,
      fontWeight: 600,
      padding: "6px 12px",
      borderRadius: 999,
    }}
  >
    {text}
  </span>
);

/** The index the audit's navigation asks for (ch. 4/7). Cards carry only what a
 *  story actually has: status, result and quote appear once the client fills
 *  them in, and stay out of the way until then. */
export default function CaseStudiesPage({ lang, items }: { lang: Locale; items: CaseStudy[] }) {
  const t = CASE_CHROME[lang];

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />
      <main id="main" style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(104px,9vw,128px) clamp(20px,5vw,64px) clamp(40px,5vw,72px)" }}>
        <header style={{ maxWidth: 760, marginBottom: "clamp(24px,3vw,36px)" }}>
          <h1 style={{ margin: 0, fontSize: "clamp(34px,5vw,58px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.05 }}>{t.index}</h1>
          <p style={{ margin: "16px 0 0", color: "#4A5163", fontSize: "clamp(17px,1.7vw,20px)", lineHeight: 1.6 }}>{t.indexLead}</p>
        </header>

        <div data-showcase="1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,1.8vw,24px)" }}>
          {items.map((c) => {
            const img = cover(c.image);
            return (
              <a
                key={c._id}
                href={localizedPath(`/case-studies/${c.slug}`, lang)}
                style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(24,30,48,.07)", boxShadow: "0 12px 40px rgba(20,26,48,.05)", overflow: "hidden", display: "flex", flexDirection: "column", color: "inherit" }}
              >
                {img ? (
                  <div style={{ position: "relative", aspectRatio: "16 / 10", background: "#E7EAF0" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={c.image?.alt || ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : null}
                <div style={{ padding: "clamp(20px,2vw,26px)", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {c.tag ? pill(c.tag) : null}
                    {c.status ? pill(c.status, "neutral") : null}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.25 }}>{c.title}</h2>
                  {c.description ? <p style={{ margin: "10px 0 0", color: "#5A6275", fontSize: 15, lineHeight: 1.55 }}>{c.description}</p> : null}
                  {c.result ? <p style={{ margin: "14px 0 0", color: "#14161C", fontSize: 17, fontWeight: 600, letterSpacing: "-.01em" }}>{c.result}</p> : null}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, color: "#1F52B8", fontSize: 14.5, fontWeight: 600 }}>
                    {t.readMore} <ArrowUpRight size={13} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
