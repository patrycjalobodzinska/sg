import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvestorsPage, { type InvDoc } from "../../_components/InvestorsPage";
import { getPage } from "../../../sanity/lib/pages";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: { title: "Investor relations", description: "SG Papertronics bereidt zijn Series A-ronde voor - toegankelijke at-line meet- en monitoringtechnologie (Q‑Tector) voor biotech, fermentatie, CDMO en food-tech." },
  pl: { title: "Relacje inwestorskie", description: "SG Papertronics przygotowuje rundę Series A - dostępna technologia pomiaru i monitoringu przyprocesowego (Q‑Tector) dla biotech, fermentacji, CDMO i food-tech." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/investors`, languages: languageAlternates("/investors") },
    openGraph: { title: `${m.title} - SG Papertronics`, description: m.description, url: `https://sgpapertronics.com/${lang}/investors`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = await getPage<NonNullable<InvDoc>>("investorsPage", lang);
  return <InvestorsPage lang={lang as Locale} doc={doc} />;
}
