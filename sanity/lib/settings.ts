import { client } from "./client";
import { defaultLocale, type Locale } from "../../app/i18n";
import { NEWS_CHROME, type NewsChrome } from "../../app/_components/news-i18n";

type I18nVal = { _key: string; value?: string }[] | undefined;
type RawLink = { href?: string; label?: I18nVal };
type RawSettings = {
  nav?: RawLink[];
  navCta?: { href?: string };
  navCtaLabel?: I18nVal;
  footerTagline?: I18nVal;
  footerColumns?: { title?: I18nVal; links?: RawLink[] }[];
  footerCopyright?: I18nVal;
  legalLinks?: RawLink[];
} | null;

export type SiteLink = { href: string; label: string };
export type SiteSettings = {
  nav: SiteLink[];
  navCta: SiteLink;
  footerTagline: string;
  footerColumns: { title: string; links: SiteLink[] }[];
  footerCopyright: string;
  legalLinks: SiteLink[];
};

// pick a localized value from an internationalized array, EN fallback
const pick = (arr: I18nVal, lang: Locale): string => {
  if (!Array.isArray(arr)) return "";
  return arr.find((v) => v._key === lang)?.value ?? arr.find((v) => v._key === defaultLocale)?.value ?? arr[0]?.value ?? "";
};
const links = (raw: RawLink[] | undefined, lang: Locale): SiteLink[] =>
  (raw ?? []).map((l) => ({ href: l.href ?? "#", label: pick(l.label, lang) }));

// EN fallback used if Sanity is unreachable, so chrome never renders empty.
const FALLBACK: SiteSettings = {
  nav: [
    { href: "/technology", label: "Technology" },
    { href: "/applications", label: "Applications" },
    { href: "/investors", label: "Investors" },
    { href: "/news", label: "News" },
    { href: "/#contact", label: "Contact" },
  ],
  navCta: { href: "/#contact", label: "Talk to us" },
  footerTagline: "Actionable process data for biotech & fermentation - powered by Q‑Tector.",
  footerColumns: [
    { title: "Explore", links: [{ href: "/technology", label: "Technology" }, { href: "/applications", label: "Applications" }, { href: "/news", label: "News" }] },
    { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/investors", label: "Investors" }, { href: "/#contact", label: "Contact" }] },
    { title: "Connect", links: [{ href: "https://testmybeer.com", label: "testmybeer.com" }, { href: "mailto:contact@sgpapertronics.com", label: "Email" }, { href: "/#top", label: "LinkedIn" }] },
  ],
  footerCopyright: "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
  legalLinks: [{ href: "/#top", label: "Privacy" }, { href: "/#top", label: "Terms" }],
};

type RawNews = Record<string, I18nVal> | null;

// Resolve news-section UI copy from Sanity, falling back per-field to the
// in-code NEWS_CHROME map so the news pages never render empty.
export async function getNewsChrome(lang: Locale = defaultLocale): Promise<NewsChrome> {
  const fb = NEWS_CHROME[lang];
  let n: RawNews = null;
  try {
    n = await client.fetch(`*[_type=="siteSettings"][0].news{
      heroTitle, heroAccent, heroLead, listDesc, categoryDefault, byPrefix,
      readStory, readMore, ctaHeading, ctaBody, ctaButton, allNews, comingSoon, articleCta
    }`);
  } catch {
    n = null;
  }
  if (!n) return fb;
  const g = (k: string, dflt: string) => pick(n?.[k], lang) || dflt;
  const prefix = g("byPrefix", fb.by("").trim());
  return {
    heroTitle: g("heroTitle", fb.heroTitle),
    heroAccent: g("heroAccent", fb.heroAccent),
    heroLead: g("heroLead", fb.heroLead),
    listDesc: g("listDesc", fb.listDesc),
    categoryDefault: g("categoryDefault", fb.categoryDefault),
    by: (author: string) => `${prefix} ${author}`.trim(),
    readStory: g("readStory", fb.readStory),
    readMore: g("readMore", fb.readMore),
    ctaHeading: g("ctaHeading", fb.ctaHeading),
    ctaBody: g("ctaBody", fb.ctaBody),
    ctaButton: g("ctaButton", fb.ctaButton),
    allNews: g("allNews", fb.allNews),
    comingSoon: g("comingSoon", fb.comingSoon),
    articleCta: g("articleCta", fb.articleCta),
  };
}

export async function getSiteSettings(lang: Locale = defaultLocale): Promise<SiteSettings> {
  let s: RawSettings = null;
  try {
    s = await client.fetch(`*[_type=="siteSettings"][0]{
      nav[]{href, label}, navCta, navCtaLabel,
      footerTagline, footerColumns[]{title, links[]{href, label}},
      footerCopyright, legalLinks[]{href, label}
    }`);
  } catch {
    s = null;
  }
  if (!s) return FALLBACK;
  return {
    nav: links(s.nav, lang),
    navCta: { href: s.navCta?.href ?? "/#contact", label: pick(s.navCtaLabel, lang) || FALLBACK.navCta.label },
    footerTagline: pick(s.footerTagline, lang) || FALLBACK.footerTagline,
    footerColumns: (s.footerColumns ?? FALLBACK.footerColumns.map((c) => ({ title: c.title, links: c.links }))).map((c) => ({
      title: typeof c.title === "string" ? c.title : pick(c.title, lang),
      links: links((c as { links?: RawLink[] }).links, lang),
    })),
    footerCopyright: pick(s.footerCopyright, lang) || FALLBACK.footerCopyright,
    legalLinks: (s.legalLinks && s.legalLinks.length ? links(s.legalLinks, lang) : FALLBACK.legalLinks),
  };
}
