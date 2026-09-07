import type { Metadata } from "next";
import AboutPage, { type AboutDoc } from "@/app/_components/AboutPage";
import { getAbout } from "@/sanity/lib/pages";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

const DESC =
  "SG Papertronics develops accessible analytical technology for companies working with biological and fermentation processes. Our mission: make process control accessible, actionable and scalable.";
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
