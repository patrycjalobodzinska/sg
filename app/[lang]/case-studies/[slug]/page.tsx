import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "../../../_components/CaseStudyPage";
import { getCaseStudy, getCaseSlugs } from "../../../../sanity/lib/cases";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../../i18n";

export const revalidate = 300;

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of prefixedLocales) {
    for (const slug of await getCaseSlugs(lang)) params.push({ lang, slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const doc = await getCaseStudy(slug, lang);
  if (!doc) return {};
  const description = doc.seo?.description || doc.description;
  return {
    title: doc.seo?.title || doc.title,
    description,
    alternates: { canonical: `/${lang}/case-studies/${slug}`, languages: languageAlternates(`/case-studies/${slug}`) },
    openGraph: { title: doc.seo?.title || doc.title, description, url: `https://sgpapertronics.com/${lang}/case-studies/${slug}`, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = await getCaseStudy(slug, lang);
  if (!doc) notFound();
  return <CaseStudyPage lang={lang as Locale} doc={doc} />;
}
