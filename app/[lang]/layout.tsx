import { notFound } from "next/navigation";
import RootDocument from "@/app/_components/RootDocument";
import { siteMetadata } from "@/app/site-metadata";
import { defaultLocale, isLocale, prefixedLocales, type Locale } from "@/app/i18n";

export const metadata = siteMetadata;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

/** Root layout for the prefixed locales, so `<html lang>` matches the content. */
export default async function LangLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  return <RootDocument lang={lang as Locale}>{children}</RootDocument>;
}
