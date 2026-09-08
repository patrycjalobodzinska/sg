import type { Metadata } from "next";
import InvestorsPage, { type InvDoc } from "@/app/_components/InvestorsPage";
import { getPage } from "@/sanity/lib/pages";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

const DESC =
  "SG Papertronics is preparing a Series A: accessible at-line measurement technology for biotech, fermentation, CDMO and food-tech.";
export const metadata: Metadata = {
  title: "Investor relations",
  description: DESC,
  alternates: { canonical: "/investors", languages: languageAlternates("/investors") },
  openGraph: {
    title: "Investor relations - SG Papertronics",
    description: DESC,
    url: "https://sgpapertronics.com/investors",
    type: "website",
  },
};

export default async function Page() {
  const doc = await getPage<NonNullable<InvDoc>>("investorsPage", "en");
  return <InvestorsPage lang="en" doc={doc} />;
}
