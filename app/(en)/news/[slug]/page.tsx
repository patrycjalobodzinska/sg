import type { Metadata } from "next";
import NewsArticlePage from "@/app/_components/NewsArticlePage";
import { getNewsArticle, getNewsSlugs } from "@/sanity/lib/news";
import { urlFor } from "@/sanity/lib/image";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getNewsSlugs("en");
  return slugs.map((slug) => ({ slug }));
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getNewsArticle(slug, "en");
  if (!a) return { title: "News" };
  const title = a.seo?.title || a.title;
  const description = a.seo?.description || a.excerpt;
  const image = ogFor(a.coverImage);
  return {
    title: a.title,
    description,
    alternates: { canonical: `/news/${a.slug}`, languages: languageAlternates(`/news/${a.slug}`) },
    openGraph: {
      title,
      description,
      url: `https://sgpapertronics.com/news/${a.slug}`,
      type: "article",
      publishedTime: a.date,
      images: image ? [{ url: image, width: 1200, height: 630, alt: a.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsArticlePage lang="en" slug={slug} />;
}
