import type { Metadata } from "next";
import PrivacyPage from "@/app/_components/PrivacyPage";
import { getPrivacy } from "@/sanity/lib/privacy";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

const DESC = "How SG Papertronics handles personal data on sgpapertronics.com: the contact form, correspondence, hosting logs, retention and your rights.";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: DESC,
  alternates: { canonical: "/privacy", languages: languageAlternates("/privacy") },
  openGraph: { title: "Privacy Notice - SG Papertronics", description: DESC, url: "https://sgpapertronics.com/privacy", type: "website" },
};

export default async function Page() {
  const doc = await getPrivacy("en");
  return <PrivacyPage lang="en" doc={doc} />;
}
