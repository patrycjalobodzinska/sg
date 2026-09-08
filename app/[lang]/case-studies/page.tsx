import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudiesPage from "../../_components/CaseStudiesPage";
import { getCaseStudies } from "../../../sanity/lib/cases";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: { title: "Case studies", description: "Commerciële validatie en applicatieontwikkeling met Q‑Tector: wat werd gemeten, in welke matrix, met welke partner en wat het opleverde." },
  pl: { title: "Case studies", description: "Walidacja komercyjna i rozwój zastosowań Q‑Tectora: co mierzono, w jakiej matrycy, z jakim partnerem i co to zmieniło." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/case-studies`, languages: languageAlternates("/case-studies") },
    openGraph: { title: `${m.title} - SG Papertronics`, description: m.description, url: `https://sgpapertronics.com/${lang}/case-studies`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const items = await getCaseStudies(lang);
  return <CaseStudiesPage lang={lang as Locale} items={items} />;
}
