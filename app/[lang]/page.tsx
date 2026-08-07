import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingClient from "../_components/LandingClient";
import { landingMarkup } from "../_components/landing-markup";
import { getHome } from "../../sanity/lib/home";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const OG_LOCALE: Record<string, string> = { nl: "nl_NL", pl: "pl_PL" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) return {};
  const c = await getHome(lang as Locale);
  return {
    title: { absolute: c.seo.title },
    description: c.seo.description,
    alternates: { canonical: `/${lang}`, languages: languageAlternates("/") },
    openGraph: { title: c.seo.title, description: c.seo.description, url: `https://sgpapertronics.com/${lang}`, locale: OG_LOCALE[lang] },
    twitter: { title: c.seo.title, description: c.seo.description },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const c = await getHome(lang as Locale);
  return <LandingClient markup={landingMarkup(c, lang as Locale)} />;
}
