import type { Metadata } from "next";
import AboutPage, { type AboutDoc } from "@/app/_components/AboutPage";
import { getAbout } from "@/sanity/lib/pages";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

// Kept under ~155 characters: past that a search result truncates mid-sentence.
const DESC =
  "SG Papertronics develops Q‑Tector, an at-line analytics platform for teams working with fermentation, biotech and other living processes.";
export const metadata: Metadata = {
  title: "About",
  description: DESC,
  alternates: { canonical: "/about", languages: languageAlternates("/about") },
  openGraph: {
    title: "About - SG Papertronics",
    description: DESC,
    url: "https://sgpapertronics.com/about",
    type: "website",
  },
};

export default async function Page() {
  const doc = (await getAbout("en")) as NonNullable<AboutDoc>;
  return <AboutPage lang="en" doc={doc} />;
}
