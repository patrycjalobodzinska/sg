import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApplicationsPage from "../../_components/ApplicationsPage";
import { getApplications } from "../../../sanity/lib/pages";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: { title: "Toepassingen", description: "Q‑Tector-toepassingen in biotech & precisiefermentatie, CDMO's, gefermenteerd eten & drinken en toegepaste biotech & agri-food." },
  pl: { title: "Zastosowania", description: "Zastosowania Q‑Tectora w biotechnologii i fermentacji precyzyjnej, w CDMO, w żywności i napojach fermentowanych oraz w agri-food i biotechnologii stosowanej." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/applications`, languages: languageAlternates("/applications") },
    openGraph: { title: `${m.title} - SG Papertronics`, description: m.description, url: `https://sgpapertronics.com/${lang}/applications`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = await getApplications(lang);
  return <ApplicationsPage lang={lang as Locale} doc={doc} />;
}
