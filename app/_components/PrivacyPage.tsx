import { PortableText, type PortableTextComponents } from "@portabletext/react";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import type { Locale } from "../i18n";
import { PRIVACY_CHROME, PRIVACY_EN, PRIVACY_UPDATED } from "./privacy-content";
import type { PrivacyDoc } from "../../sanity/lib/privacy";

const body = { margin: "0 0 18px", color: "#4A5163", fontSize: 17, lineHeight: 1.7 } as const;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={body}>{children}</p>,
    h2: ({ children }) => (
      <h2 style={{ margin: "40px 0 14px", fontSize: "clamp(21px,2.2vw,26px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.25, color: "#14161C" }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ margin: "28px 0 10px", fontSize: 19, fontWeight: 600, letterSpacing: "-.01em", color: "#14161C" }}>{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ ...body, padding: "0 0 0 22px", display: "flex", flexDirection: "column", gap: 8 }}>{children}</ul>
    ),
  },
  listItem: { bullet: ({ children }) => <li>{children}</li> },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#14161C" }}>{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} style={{ color: "#2E6BE6" }} target={value?.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

function formatDate(iso: string, lang: Locale) {
  const locale = lang === "nl" ? "nl-NL" : lang === "pl" ? "pl-PL" : "en-GB";
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export default function PrivacyPage({ lang, doc }: { lang: Locale; doc: PrivacyDoc }) {
  const chrome = PRIVACY_CHROME[lang];
  const updated = doc?.updated || PRIVACY_UPDATED;

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav lang={lang} />
      <main id="main" style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(104px,9vw,128px) clamp(20px,5vw,64px) clamp(48px,6vw,88px)" }}>
        <header style={{ maxWidth: 760 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(34px,5vw,58px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.05 }}>
            {doc?.title || chrome.title}
          </h1>
          <p style={{ margin: "16px 0 0", color: "#5A6275", fontSize: 15 }}>
            {chrome.updated}: {formatDate(updated, lang)}
          </p>
        </header>

        <article style={{ maxWidth: 760, marginTop: "clamp(24px,3vw,36px)" }}>
          {doc?.body?.length ? (
            <PortableText value={doc.body} components={components} />
          ) : (
            PRIVACY_EN.map((section) => (
              <section key={section.heading}>
                <h2 style={{ margin: "40px 0 14px", fontSize: "clamp(21px,2.2vw,26px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.25 }}>
                  {section.heading}
                </h2>
                {section.paragraphs.map((text) => (
                  <p key={text.slice(0, 40)} style={body}>
                    {text}
                  </p>
                ))}
              </section>
            ))
          )}
        </article>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
