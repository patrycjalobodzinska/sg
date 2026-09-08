import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyPage from "../../_components/PrivacyPage";
import { getPrivacy } from "../../../sanity/lib/privacy";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const META: Record<string, { title: string; description: string }> = {
  nl: { title: "Privacyverklaring", description: "Hoe SG Papertronics omgaat met persoonsgegevens op sgpapertronics.com: het contactformulier, correspondentie, serverlogs, bewaartermijnen en uw rechten." },
  pl: { title: "Polityka prywatności", description: "Jak SG Papertronics przetwarza dane osobowe w serwisie sgpapertronics.com: formularz kontaktowy, korespondencja, logi serwera, okresy przechowywania i Twoje prawa." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.nl;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/privacy`, languages: languageAlternates("/privacy") },
    openGraph: { title: `${m.title} - SG Papertronics`, description: m.description, url: `https://sgpapertronics.com/${lang}/privacy`, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const doc = await getPrivacy(lang);
  return <PrivacyPage lang={lang as Locale} doc={doc} />;
}
