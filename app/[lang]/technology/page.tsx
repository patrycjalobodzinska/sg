import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnologyPage, { type TechDoc } from "../../_components/TechnologyPage";
import { getPage } from "../../../sanity/lib/pages";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: {
    title: "Q‑Tector-technologie",
    description:
      "Begeleide at-line assays en verbonden data voor biologische productie: een compacte reader, kant-en-klare assay-pods, QR-gestuurde workflows en cloud-gekoppelde resultaten.",
  },
  pl: {
    title: "Technologia Q‑Tector",
    description:
      "Prowadzone assaye at-line i połączone dane dla produkcji biologicznej: kompaktowy czytnik, gotowe wkłady assay, workflow prowadzone kodem QR i wyniki w chmurze.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/technology`, languages: languageAlternates("/technology") },
    openGraph: {
      title: `${m.title} - SG Papertronics`,
      description: m.description,
      url: `https://sgpapertronics.com/${lang}/technology`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = await getPage<NonNullable<TechDoc>>("technologyPage", lang);
  return <TechnologyPage lang={lang as Locale} doc={doc} />;
}
