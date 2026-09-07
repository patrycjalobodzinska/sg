import { PortableText, type PortableTextComponents } from "@portabletext/react";
import ArrowUpRight from "./ArrowUpRight";
import SiteFooter from "../site-footer";
import SiteNav from "../site-nav";
import { getNewsArticle, formatNewsDate } from "../../sanity/lib/news";
import { urlFor } from "../../sanity/lib/image";
import { localizedPath, type Locale } from "../i18n";
import { contactUrl } from "./contact-intent";
import { getNewsChrome } from "../../sanity/lib/settings";
import { notFound } from "next/navigation";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ margin: "0 0 20px", color: "#3A4152", fontSize: 17.5, lineHeight: 1.7 }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 style={{ margin: "38px 0 14px", fontSize: "clamp(22px,2.4vw,28px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, color: "#14161C" }}>{children}</h2>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "0 0 20px", padding: "0 0 0 22px", color: "#3A4152", fontSize: 17.5, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 8 }}>{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#14161C" }}>{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "#2E6BE6", textDecoration: "underline", textUnderlineOffset: 3 }}>
        {children}
      </a>
    ),
  },
};

const heroImg = (img: unknown) => {
  try {
    return img ? urlFor(img).width(1600).height(840).fit("crop").auto("format").url() : null;
  } catch {
    return null;
  }
};

export default async function NewsArticlePage({ lang, slug }: { lang: Locale; slug: string }) {
  const t = await getNewsChrome(lang);
  const a = await getNewsArticle(slug, lang);
  if (!a) notFound();

  const cover = heroImg(a.coverImage);
  const metaLine = formatNewsDate(a.date, lang);

  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      <SiteNav active="news" lang={lang} />

      <article style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(72px,7vw,92px) clamp(20px,5vw,40px) clamp(32px,5vw,64px)" }}>
        <a href={localizedPath("/news", lang)} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#8990A0", fontSize: 14.5, fontWeight: 500, marginBottom: 22 }}>
          <span>←</span> {t.allNews}
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#8990A0", fontSize: 14 }}>
          <span style={{ fontSize: 12, color: "#2E6BE6", background: "#E9F0FC", padding: "5px 12px", borderRadius: 999, fontWeight: 600 }}>{a.category || t.categoryDefault}</span>
          <span>{metaLine}</span>
        </div>

        <h1 style={{ margin: 0, fontSize: "clamp(30px,4.4vw,46px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.1 }}>{a.title}</h1>

        {a.excerpt && (
          <p style={{ margin: "18px 0 0", color: "#4A5163", fontSize: "clamp(17px,1.8vw,20px)", lineHeight: 1.6 }}>{a.excerpt}</p>
        )}

        {cover && (
          <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 20, overflow: "hidden", margin: "28px 0 36px", background: "#E7EAF0", boxShadow: "0 18px 52px rgba(20,26,48,.08)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={a.coverImage?.alt || a.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ marginTop: cover ? 0 : 32 }}>
          {a.body && a.body.length > 0 ? (
            <PortableText value={a.body} components={components} />
          ) : (
            <p style={{ color: "#8990A0", fontSize: 17, lineHeight: 1.7 }}>{t.comingSoon}</p>
          )}
        </div>

        <div style={{ marginTop: 44, paddingTop: 28, borderTop: "1px solid rgba(24,30,48,.1)" }}>
          <a href={contactUrl({ lang, intent: "product", sourcePage: "news-article", sourceCta: "closing" })} className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 12, fontWeight: 600, fontSize: 15.5 }}>
            {t.articleCta} <ArrowUpRight />
          </a>
        </div>
      </article>

      <SiteFooter lang={lang} />
    </div>
  );
}
