import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingClient from "../_components/LandingClient";
import { landingParts } from "../_components/landing-markup";
import ContactSection from "../_components/ContactSection";
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
  const { before, footer } = landingParts(c, lang as Locale);
  return (
    <LandingClient markup={before} footerMarkup={footer}>
      <ContactSection
        lang={lang as Locale}
        sourcePage={`/${lang}`}
        side={{
          headingLine1: c.contact.rightHeadingLine1,
          headingLine2: c.contact.rightHeadingLine2,
          body: c.contact.rightBody,
          emailLabel: c.contact.emailLabel,
          visitLabel: c.contact.visitLabel,
          visitValue: c.contact.visitValue,
          beerLabel: c.contact.beerLabel,
        }}
      />
    </LandingClient>
  );
}
