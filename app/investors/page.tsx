import type { Metadata } from "next";
import InvestorsPage, { type InvDoc } from "../_components/InvestorsPage";
import { getPage } from "../../sanity/lib/pages";
import { languageAlternates } from "../i18n";

export const revalidate = 300;

const DESC =
  "SG Papertronics is preparing for its Series A round - building accessible, at-line process-control technology (Q‑Tector) for biotech, fermentation, CDMO and food-tech companies.";
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
