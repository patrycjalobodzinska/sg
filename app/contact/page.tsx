import type { Metadata } from "next";
import ContactPage from "../_components/ContactPage";
import { DEFAULT_INTENT, isIntent } from "../_components/contact-content";
import { languageAlternates } from "../i18n";

const DESC =
  "Tell us your organism, process stage, target analyte and the decision you need to make. We reply with a practical next step within one business day.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESC,
  alternates: { canonical: "/contact", languages: languageAlternates("/contact") },
  openGraph: { title: "Contact - SG Papertronics", description: DESC, url: "https://sgpapertronics.com/contact", type: "website" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ intent?: string; source_page?: string; source_cta?: string; vertical?: string }> }) {
  const { intent, source_page, source_cta, vertical } = await searchParams;
  return <ContactPage lang="en" intent={isIntent(intent) ? intent : DEFAULT_INTENT}
      sourcePage={source_page}
      sourceCta={source_cta}
      vertical={vertical}
    />;
}
