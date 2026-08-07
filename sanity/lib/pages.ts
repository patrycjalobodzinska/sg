import { client } from "./client";

/** Fetch a page singleton document for a given language (full document). */
export async function getPage<T = Record<string, unknown>>(
  type: string,
  lang: string
): Promise<T | null> {
  return client.fetch(
    `*[_type == $type && language == $lang][0]`,
    { type, lang }
  );
}

export type AppContent = {
  hero?: { title?: string; titleAccent?: string; lead?: string; primaryCta?: { label?: string }; secondaryCta?: { label?: string } };
  categoriesEyebrow?: string;
  categoriesHeading?: string;
  categories?: { tag?: string; title?: string; text?: string; points?: string[] }[];
  caseStudiesEyebrow?: string;
  caseStudiesHeading?: string;
  caseStudies?: { _id?: string; tag?: string; title?: string; text?: string }[];
  cta?: { heading?: string; body?: string; button?: { label?: string } };
} | null;

// projected fetch that dereferences partner references → names
export async function getAbout(lang: string) {
  return client.fetch(
    `*[_type=="aboutPage" && language==$lang][0]{
      hero, whyWeExist, valuesEyebrow, valuesHeading, values, mission,
      partnersLabel, "partners": partners[]->name
    }`,
    { lang }
  );
}

// projected fetch that dereferences case-study references (localized text)
export async function getApplications(lang: string): Promise<AppContent> {
  return client.fetch(
    `*[_type=="applicationsPage" && language==$lang][0]{
      hero, categoriesEyebrow, categoriesHeading,
      categories[]{tag,title,text,points},
      caseStudiesEyebrow, caseStudiesHeading,
      "caseStudies": caseStudies[]->{_id, tag, title, "text": description},
      cta
    }`,
    { lang }
  );
}
