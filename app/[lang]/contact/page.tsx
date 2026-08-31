import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "../../_components/ContactPage";
import { DEFAULT_INTENT, isIntent } from "../../_components/contact-content";
import { CONTACT_COPY } from "../../_components/contact-content";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../i18n";

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

const OG_LOCALE: Record<string, string> = { nl: "nl_NL", pl: "pl_PL" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) return {};
  const t = CONTACT_COPY[lang as Locale];
  return {
    title: "Contact",
    description: t.lead,
    alternates: { canonical: `/${lang}/contact`, languages: languageAlternates("/contact") },
    openGraph: { title: "Contact - SG Papertronics", description: t.lead, url: `https://sgpapertronics.com/${lang}/contact`, locale: OG_LOCALE[lang], type: "website" },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ intent?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  const { intent } = await searchParams;
  return <ContactPage lang={lang as Locale} intent={isIntent(intent) ? intent : DEFAULT_INTENT} />;
}
