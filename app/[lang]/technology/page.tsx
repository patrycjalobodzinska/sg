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
      "Een compact at-line testplatform voor procesrelevante metingen: uitleesapparaat, kant-en-klare assay-pods, QR-gestuurde workflows en cloud-gekoppelde data.",
  },
  pl: {
    title: "Technologia Q‑Tector",
    description:
      "Kompaktowa przyprocesowa platforma testowa do pomiarów istotnych dla procesu: czytnik, gotowe pody assay, workflow z kodem QR i dane w chmurze.",
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
