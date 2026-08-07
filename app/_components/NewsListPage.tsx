import SiteFooter from "../site-footer";
import ArrowUpRight from "./ArrowUpRight";
import SiteNav from "../site-nav";
import NewsCarousel from "../news-carousel";
import { getNewsList, formatNewsDate, type NewsListItem } from "../../sanity/lib/news";
import { urlFor } from "../../sanity/lib/image";
import { localizedPath, type Locale } from "../i18n";
import { type NewsChrome } from "./news-i18n";
import { getNewsChrome } from "../../sanity/lib/settings";

const clamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
});

const cover = (img: unknown, w: number, h: number) => {
  try {
    return img ? urlFor(img).width(w).height(h).fit("crop").auto("format").url() : null;
  } catch {
    return null;
  }
};

const meta = (t: NewsChrome, it: NewsListItem, lang: Locale) =>
  [it.author && t.by(it.author), formatNewsDate(it.date, lang)].filter(Boolean).join(" · ");

export default async function NewsListPage({ lang }: { lang: Locale }) {
  const t = await getNewsChrome(lang);
  const all = await getNewsList(lang);
  const featured = all.find((a) => a.featured) ?? all[0];
  const items = all.filter((a) => a._id !== featured?._id);
  const href = (slug: string) => localizedPath(`/news/${slug}`, lang);
  const contact = localizedPath("/", lang);
  const contactHref = contact === "/" ? "/#contact" : `${contact}#contact`;

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="news" lang={lang} />

      {/* HERO */}
      <header style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,64px) clamp(12px,2vw,22px)" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(38px,6vw,72px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t.heroTitle} <span style={{ color: "#AEB4C4", fontWeight: 500 }}>{t.heroAccent}</span>
        </h1>
        <p style={{ margin: "20px 0 0", color: "#4A5163", fontSize: "clamp(16.5px,1.7vw,20px)", lineHeight: 1.6, maxWidth: 620 }}>
          {t.heroLead}
        </p>
      </header>

      {/* FEATURED */}
      {featured && (
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(14px,2vw,24px) clamp(20px,5vw,64px)" }}>
          <a href={href(featured.slug)} data-newsfeat="1" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(24px,4vw,48px)", alignItems: "stretch", background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 26, overflow: "hidden", boxShadow: "0 18px 52px rgba(20,26,48,.06)", color: "inherit" }}>
            <div style={{ position: "relative", minHeight: 300, background: "#E7EAF0" }}>
              {cover(featured.coverImage, 1000, 720) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover(featured.coverImage, 1000, 720)!} alt={featured.coverImage?.alt || featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              )}
            </div>
            <div style={{ padding: "clamp(28px,3.5vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#8990A0", fontSize: 13.5 }}>
                <span style={{ fontSize: 12, color: "#2E6BE6", background: "#E9F0FC", padding: "5px 12px", borderRadius: 999, fontWeight: 600 }}>{featured.category || t.categoryDefault}</span>
                <span>{meta(t, featured, lang)}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(23px,2.6vw,33px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.12 }}>{featured.title}</h2>
              {featured.excerpt && <p style={{ margin: "16px 0 0", color: "#4A5163", fontSize: 16, lineHeight: 1.6, ...clamp(4) }}>{featured.excerpt}</p>}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 22, color: "#2E6BE6", fontSize: 15.5, fontWeight: 600 }}>{t.readStory} <ArrowUpRight /></span>
            </div>
          </a>
        </section>
      )}

      {/* GRID */}
      {items.length > 0 && (
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(20px,5vw,64px) clamp(20px,4vw,40px)" }}>
          <NewsCarousel>
            {items.map((it) => (
              <a key={it._id} href={href(it.slug)} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.06)", borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 40px rgba(20,26,48,.05)", display: "flex", flexDirection: "column", color: "inherit" }}>
                <div style={{ position: "relative", aspectRatio: "16 / 10", background: "#EEF1F6" }}>
                  {cover(it.coverImage, 720, 450) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover(it.coverImage, 720, 450)!} alt={it.coverImage?.alt || it.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ color: "#8990A0", fontSize: 13, marginBottom: 12 }}>{meta(t, it, lang)}</div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18.5, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.22, ...clamp(3) }}>{it.title}</h3>
                  {it.excerpt && <p style={{ margin: 0, color: "#8990A0", fontSize: 14.5, lineHeight: 1.55, ...clamp(4) }}>{it.excerpt}</p>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "#2E6BE6", fontSize: 14, fontWeight: 600 }}>{t.readMore} <ArrowUpRight /></span>
                </div>
              </a>
            ))}
          </NewsCarousel>
        </section>
      )}

      {/* CTA */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(8px,2vw,20px) clamp(20px,5vw,64px) clamp(32px,5vw,64px)" }}>
        <div style={{ background: "#0E1526", color: "#fff", borderRadius: "clamp(24px,3vw,36px)", padding: "clamp(32px,4vw,56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "clamp(22px,2.6vw,32px)", fontWeight: 600, letterSpacing: "-.02em" }}>{t.ctaHeading}</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 16, lineHeight: 1.55 }}>{t.ctaBody}</p>
          </div>
          <a href={contactHref} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "16px 28px", borderRadius: 14, fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>{t.ctaButton} <ArrowUpRight /></a>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
