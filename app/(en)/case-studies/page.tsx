import type { Metadata } from "next";
import CaseStudiesPage from "@/app/_components/CaseStudiesPage";
import { getCaseStudies } from "@/sanity/lib/cases";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

const DESC = "Commercial validation and application development with Q‑Tector: what was measured, in which matrix, with which partner and what it changed.";

export const metadata: Metadata = {
  title: "Case studies",
  description: DESC,
  alternates: { canonical: "/case-studies", languages: languageAlternates("/case-studies") },
  openGraph: { title: "Case studies - SG Papertronics", description: DESC, url: "https://sgpapertronics.com/case-studies", type: "website" },
};

export default async function Page() {
  const items = await getCaseStudies("en");
  return <CaseStudiesPage lang="en" items={items} />;
}
