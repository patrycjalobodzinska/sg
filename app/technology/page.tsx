import type { Metadata } from "next";
import TechnologyPage, { type TechDoc } from "../_components/TechnologyPage";
import { getPage } from "../../sanity/lib/pages";
import { languageAlternates } from "../i18n";

export const revalidate = 300;

const DESC =
  "A compact at-line testing platform for process-relevant measurements: readout device, ready-to-use assay pods, QR-guided workflows and cloud-connected data.";
export const metadata: Metadata = {
  title: "Q‑Tector technology",
  description: DESC,
  alternates: { canonical: "/technology", languages: languageAlternates("/technology") },
  openGraph: {
    title: "Q‑Tector technology - SG Papertronics",
    description: DESC,
    url: "https://sgpapertronics.com/technology",
    type: "website",
  },
};

export default async function Page() {
  // EN content is now managed in Sanity too (synced to the tuned copy).
  // The in-component EN constants remain as a fallback if a field is empty.
  const doc = await getPage<NonNullable<TechDoc>>("technologyPage", "en");
  return <TechnologyPage lang="en" doc={doc} />;
}
