import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";
import { defaultLocale, type Locale } from "../../app/i18n";

export type NewsImage = { asset?: unknown; alt?: string } | null;

export type NewsListItem = {
  _id: string;
  title: string;
  slug: string; // base slug (locale suffix stripped) — used in URLs across all locales
  date: string;
  excerpt?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  coverImage?: NewsImage;
};

export type NewsArticle = NewsListItem & {
  body?: PortableTextBlock[];
  bodyFallback?: boolean; // true when body is served from EN because the localized doc has none
  seo?: { title?: string; description?: string };
};

const LIST_FIELDS = `
  _id, title, "slug": slug.current, date, excerpt, "category": category,
  featured, "author": author->name, coverImage
`;

/** NL/PL documents carry a "-nl"/"-pl" suffix on their slug; the public URL
 *  uses the bare EN slug for all locales. */
const suffix = (lang: Locale) => (lang === defaultLocale ? "" : `-${lang}`);
const toBase = (slug: string, lang: Locale): string => {
  const s = suffix(lang);
  return s && slug.endsWith(s) ? slug.slice(0, -s.length) : slug;
};

export async function getNewsList(lang: Locale = defaultLocale): Promise<NewsListItem[]> {
  const rows: NewsListItem[] = await client.fetch(
    `*[_type=="newsArticle" && language==$lang && defined(slug.current)]|order(date desc){${LIST_FIELDS}}`,
    { lang }
  );
  return rows.map((r) => ({ ...r, slug: toBase(r.slug, lang) }));
}

export async function getNewsArticle(
  baseSlug: string,
  lang: Locale = defaultLocale
): Promise<NewsArticle | null> {
  const localizedSlug = `${baseSlug}${suffix(lang)}`;
  const a: NewsArticle | null = await client.fetch(
    `*[_type=="newsArticle" && language==$lang && slug.current==$slug][0]{${LIST_FIELDS}, body, seo}`,
    { slug: localizedSlug, lang }
  );
  if (!a) return null;
  a.slug = baseSlug;

  // NL/PL articles carry localized metadata but no body — fall back to EN body.
  if ((!a.body || a.body.length === 0) && lang !== defaultLocale) {
    const enBody: PortableTextBlock[] | null = await client.fetch(
      `*[_type=="newsArticle" && language=="en" && slug.current==$slug][0].body`,
      { slug: baseSlug }
    );
    if (enBody && enBody.length > 0) {
      a.body = enBody;
      a.bodyFallback = true;
    }
  }
  return a;
}

export async function getNewsSlugs(lang: Locale = defaultLocale): Promise<string[]> {
  const slugs: string[] = await client.fetch(
    `*[_type=="newsArticle" && language==$lang && defined(slug.current)].slug.current`,
    { lang }
  );
  return slugs.map((s) => toBase(s, lang));
}

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", nl: "nl-NL", pl: "pl-PL" };

export function formatNewsDate(date?: string, lang: Locale = defaultLocale): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
