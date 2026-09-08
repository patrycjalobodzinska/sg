import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";
import { defaultLocale } from "../../app/i18n";

/** A case study as the audit wants it told (ch. 7): problem, analyte, matrix,
 *  workflow, measurable result, status, partner and next milestone. Everything
 *  except the title and slug is optional — a story is published as far as the
 *  facts reach, and the page simply omits what is missing. */
export type CaseStudy = {
  _id: string;
  slug: string;
  title: string;
  tag?: string;
  relationship?: string;
  status?: string;
  description?: string;
  problem?: string;
  analyte?: string;
  sampleMatrix?: string;
  workflow?: string;
  result?: string;
  partner?: string;
  nextMilestone?: string;
  quote?: string;
  quoteAuthor?: string;
  body?: PortableTextBlock[];
  image?: { asset?: unknown; alt?: string } | null;
  seo?: { title?: string; description?: string };
};

const FIELDS = `
  _id, "slug": slug.current, title, tag, relationship, status, description,
  problem, analyte, sampleMatrix, workflow, result, partner, nextMilestone,
  quote, quoteAuthor, body, image, seo
`;

/** Every case study that has a slug, i.e. every one with its own page. */
export async function getCaseStudies(lang: string): Promise<CaseStudy[]> {
  try {
    return await client.fetch<CaseStudy[]>(
      `*[_type=="caseStudy" && language==$lang && defined(slug.current)]{${FIELDS}} | order(title asc)`,
      { lang }
    );
  } catch {
    return [];
  }
}

export async function getCaseStudy(slug: string, lang: string): Promise<CaseStudy | null> {
  try {
    const doc = await client.fetch<CaseStudy | null>(
      `*[_type=="caseStudy" && language==$lang && slug.current==$slug][0]{${FIELDS}}`,
      { lang, slug }
    );
    if (doc) return doc;
    // A story translated only into English still deserves a page in NL/PL.
    if (lang === defaultLocale) return null;
    return await client.fetch<CaseStudy | null>(
      `*[_type=="caseStudy" && language==$lang && slug.current==$slug][0]{${FIELDS}}`,
      { lang: defaultLocale, slug }
    );
  } catch {
    return null;
  }
}

export async function getCaseSlugs(lang: string = defaultLocale): Promise<string[]> {
  try {
    return await client.fetch<string[]>(
      `*[_type=="caseStudy" && language==$lang && defined(slug.current)].slug.current`,
      { lang }
    );
  } catch {
    return [];
  }
}
