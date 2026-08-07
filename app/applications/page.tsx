import type { Metadata } from "next";
import ApplicationsPage from "../_components/ApplicationsPage";
import { getApplications } from "../../sanity/lib/pages";
import { languageAlternates } from "../i18n";

export const revalidate = 300;

const DESC =
  "Q‑Tector applications across biotech & precision fermentation, CDMOs, fermented food & beverage and applied biotech & agri-food.";
export const metadata: Metadata = {
  title: "Applications",
  description: DESC,
  alternates: { canonical: "/applications", languages: languageAlternates("/applications") },
  openGraph: {
    title: "Applications - SG Papertronics",
    description: DESC,
    url: "https://sgpapertronics.com/applications",
    type: "website",
  },
};

export default async function Page() {
  const doc = await getApplications("en");
  return <ApplicationsPage lang="en" doc={doc} />;
}
