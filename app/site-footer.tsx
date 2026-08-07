import { getSiteSettings } from "../sanity/lib/settings";
import { localizedPath, defaultLocale, type Locale } from "./i18n";

const colTitle = { color: "#8990A0", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase" as const, marginBottom: 16 };
const link = { color: "#3A4152" };
const colList = { display: "flex", flexDirection: "column" as const, gap: 11 };

// locale-aware href for stored footer links
function hrefFor(href: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  const home = localizedPath("/", locale);
  if (href.startsWith("/#")) return home === "/" ? href : `${home}${href.slice(1)}`;
  return localizedPath(href, locale);
}
const isExternal = (href: string) => /^https?:/.test(href);

export default async function SiteFooter({ lang = defaultLocale }: { lang?: Locale }) {
  const s = await getSiteSettings(lang);
  return (
    <footer
      style={{
        background: "#EFF1F5",
        color: "#14161C",
        padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px) 40px",
        borderRadius: "clamp(28px,4vw,48px) clamp(28px,4vw,48px) 0 0",
        marginTop: "clamp(20px,4vw,40px)",
        borderTop: "1px solid rgba(24,30,48,.08)",
      }}
    >
      <div
        data-footgrid="1"
        style={{ maxWidth: 1360, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 48, borderBottom: "1px solid rgba(24,30,48,.1)" }}
      >
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/SGPT_logo.png" alt="SG Papertronics" style={{ height: 44, width: "auto", display: "block", marginBottom: 16 }} />
          <p style={{ margin: 0, color: "#4A5163", fontSize: 16, fontWeight: 300, maxWidth: 320, lineHeight: 1.5 }}>{s.footerTagline}</p>
        </div>
        {s.footerColumns.map((col, i) => (
          <div key={col.title || i}>
            <div style={colTitle}>{col.title}</div>
            <div style={colList}>
              {col.links.map((l, j) =>
                isExternal(l.href) ? (
                  <a key={j} href={l.href} target="_blank" rel="noopener noreferrer" style={link}>{l.label}</a>
                ) : (
                  <a key={j} href={hrefFor(l.href, lang)} style={link}>{l.label}</a>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1240, margin: "24px auto 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, color: "#8990A0", fontSize: 14 }}>
        <div>{s.footerCopyright}</div>
        <div style={{ display: "flex", gap: 20 }}>
          {s.legalLinks.map((l, i) => (
            <a key={i} href={hrefFor(l.href, lang)} style={{ color: "#8990A0" }}>{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
