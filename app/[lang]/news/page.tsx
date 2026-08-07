import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsListPage from "../../_components/NewsListPage";
import { NEWS_CHROME } from "../../_components/news-i18n";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const TITLE: Record<string, string> = { nl: "Nieuws", pl: "Aktualności" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  const desc = NEWS_CHROME[l].listDesc;
  const title = TITLE[lang] ?? "News";
  return {
    title,
    description: desc,
    alternates: { canonical: `/${lang}/news`, languages: languageAlternates("/news") },
    openGraph: { title: `${title} - SG Papertronics`, description: desc, url: `https://sgpapertronics.com/${lang}/news`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  return <NewsListPage lang={lang as Locale} />;
}
