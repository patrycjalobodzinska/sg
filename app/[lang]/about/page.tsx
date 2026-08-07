import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutPage, { type AboutDoc } from "../../_components/AboutPage";
import { getAbout } from "../../../sanity/lib/pages";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: { title: "Over ons", description: "SG Papertronics ontwikkelt toegankelijke analytische technologie voor bedrijven die met biologische en fermentatieprocessen werken." },
  pl: { title: "O nas", description: "SG Papertronics tworzy dostępną technologię analityczną dla firm pracujących z procesami biologicznymi i fermentacyjnymi." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/about`, languages: languageAlternates("/about") },
    openGraph: { title: `${m.title} - SG Papertronics`, description: m.description, url: `https://sgpapertronics.com/${lang}/about`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = (await getAbout(lang)) as NonNullable<AboutDoc>;
  return <AboutPage lang={lang as Locale} doc={doc} />;
}
