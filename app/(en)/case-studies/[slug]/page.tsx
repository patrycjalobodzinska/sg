import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/app/_components/CaseStudyPage";
import { getCaseStudy, getCaseSlugs } from "@/sanity/lib/cases";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getCaseSlugs("en");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getCaseStudy(slug, "en");
  if (!doc) return {};
  const description = doc.seo?.description || doc.description;
  return {
    title: doc.seo?.title || doc.title,
    description,
    alternates: { canonical: `/case-studies/${slug}`, languages: languageAlternates(`/case-studies/${slug}`) },
    openGraph: { title: doc.seo?.title || doc.title, description, url: `https://sgpapertronics.com/case-studies/${slug}`, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getCaseStudy(slug, "en");
  if (!doc) notFound();
  return <CaseStudyPage lang="en" doc={doc} />;
}
