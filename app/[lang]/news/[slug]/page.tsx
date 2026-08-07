import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsArticlePage from "../../../_components/NewsArticlePage";
import { getNewsArticle, getNewsSlugs } from "../../../../sanity/lib/news";
import { urlFor } from "../../../../sanity/lib/image";
import { prefixedLocales, defaultLocale, isLocale, languageAlternates, type Locale } from "../../../i18n";

export const revalidate = 300;

export async function generateStaticParams() {
  const out: { lang: string; slug: string }[] = [];
  for (const lang of prefixedLocales) {
    const slugs = await getNewsSlugs(lang);
    for (const slug of slugs) out.push({ lang, slug });
  }
  return out;
}

const ogFor = (img: unknown) => {
  try {
    return img ? urlFor(img).width(1200).height(630).fit("crop").url() : undefined;
  } catch {
    return undefined;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = (isLocale(lang) ? lang : "en") as Locale;
  const a = await getNewsArticle(slug, l);
  if (!a) return { title: "News" };
  const title = a.seo?.title || a.title;
  const description = a.seo?.description || a.excerpt;
  const image = ogFor(a.coverImage);
  return {
    title: a.title,
    description,
    alternates: { canonical: `/${lang}/news/${a.slug}`, languages: languageAlternates(`/news/${a.slug}`) },
    openGraph: {
      title,
      description,
      url: `https://sgpapertronics.com/${lang}/news/${a.slug}`,
      type: "article",
      publishedTime: a.date,
      images: image ? [{ url: image, width: 1200, height: 630, alt: a.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  return <NewsArticlePage lang={lang as Locale} slug={slug} />;
}
