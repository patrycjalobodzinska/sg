import ContactForm from "./ContactForm";
import { CONTACT_COPY, DEFAULT_INTENT, type Intent } from "./contact-content";
import type { Locale } from "../i18n";

export type ContactSidePanel = {
  headingLine1: string;
  headingLine2: string;
  body: string;
  emailLabel: string;
  visitLabel: string;
  visitValue: string;
  beerLabel: string;
};

/**
 * The contact block, extracted out of the generated landing HTML string into
 * real markup so the form can be a working, accessible Server Action form.
 * Visual design is carried over verbatim from the original section.
 */
export default function ContactSection({
  lang,
  intent = DEFAULT_INTENT,
  sourcePage,
  sourceCta = "contact-section",
  side,
  privacyHref,
}: {
  lang: Locale;
  intent?: Intent;
  sourcePage: string;
  sourceCta?: string;
  side: ContactSidePanel;
  privacyHref?: string;
}) {
  const t = CONTACT_COPY[lang];

  return (
    <section id="contact" style={{ padding: "clamp(44px,5vw,72px) clamp(20px,5vw,64px)", maxWidth: 1420, margin: "0 auto" }}>
      <div
        data-contactgrid="1"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          background: "#fff",
          borderRadius: 32,
          overflow: "hidden",
          border: "1px solid rgba(24,30,48,.05)",
          boxShadow: "0 20px 60px rgba(20,26,48,.08)",
        }}
      >
        <div style={{ padding: "clamp(32px,4vw,56px)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1px solid rgba(24,30,48,.1)",
              color: "#3A4152",
              fontSize: 12.5,
              fontWeight: 500,
              letterSpacing: ".01em",
              padding: "6px 13px 6px 7px",
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                width: 17,
                height: 17,
                borderRadius: 5,
                background: "#2E6BE6",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 11,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
            {t.eyebrow}
          </div>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(30px,4vw,48px)", fontWeight: 500, letterSpacing: "-.03em", lineHeight: 1.05 }}>
            {t.heading} <span style={{ color: "#AEB4C4" }}>{t.headingAccent}</span>
          </h2>
          <p style={{ margin: "0 0 28px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.55, maxWidth: 520 }}>{t.lead}</p>

          <ContactForm lang={lang} t={t} intent={intent} sourcePage={sourcePage} sourceCta={sourceCta} privacyHref={privacyHref} />
        </div>

        <div
          style={{
            position: "relative",
            background: "#0E1526",
            color: "#fff",
            padding: "clamp(32px,4vw,56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            minHeight: "100%",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-25%",
              right: "-15%",
              width: 360,
              height: 360,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(46,107,230,.4),transparent 68%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2 }}>
              {side.headingLine1}
              <br />
              {side.headingLine2}
            </div>
            <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,.6)", fontSize: 15.5, lineHeight: 1.55, maxWidth: 340 }}>{side.body}</p>
          </div>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
            <a href="mailto:contact@sgpapertronics.com" className="cf-side-link" style={{ display: "flex", alignItems: "center", gap: 14, color: "#fff" }}>
              <span style={ICON_BOX}>
                <span style={{ width: 16, height: 11, border: "2px solid #6AA6FF", borderRadius: 3 }} />
              </span>
              <span>
                <span style={SIDE_LABEL}>{side.emailLabel}</span>
                <span style={SIDE_VALUE}>contact@sgpapertronics.com</span>
              </span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={ICON_BOX}>
                <span style={{ width: 12, height: 12, border: "2px solid #6AA6FF", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
              </span>
              <span>
                <span style={SIDE_LABEL}>{side.visitLabel}</span>
                <span style={SIDE_VALUE}>{side.visitValue}</span>
              </span>
            </div>
            <a
              href="https://testmybeer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cf-side-link"
              style={{ display: "flex", alignItems: "center", gap: 14, color: "#fff" }}
            >
              <span style={ICON_BOX}>
                <span style={{ width: 14, height: 14, border: "2px solid #6AA6FF", borderRadius: "50%" }} />
              </span>
              <span>
                <span style={SIDE_LABEL}>{side.beerLabel}</span>
                <span style={SIDE_VALUE}>testmybeer.com</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const ICON_BOX: React.CSSProperties = {
  flex: "none",
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "rgba(255,255,255,.08)",
  border: "1px solid rgba(255,255,255,.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const SIDE_LABEL: React.CSSProperties = { display: "block", color: "rgba(255,255,255,.5)", fontSize: 12.5, letterSpacing: ".04em" };
const SIDE_VALUE: React.CSSProperties = { fontSize: 16, fontWeight: 500 };
