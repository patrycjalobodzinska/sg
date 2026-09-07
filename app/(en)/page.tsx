import type { Metadata } from "next";
import LandingClient from "@/app/_components/LandingClient";
import { landingParts } from "@/app/_components/landing-markup";
import ContactSection from "@/app/_components/ContactSection";
import { getHome } from "@/sanity/lib/home";
import { languageAlternates } from "@/app/i18n";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getHome("en");
  return {
    description: c.seo.description,
    alternates: { canonical: "/", languages: languageAlternates("/") },
    openGraph: { title: c.seo.title, description: c.seo.description, url: "https://sgpapertronics.com" },
    twitter: { title: c.seo.title, description: c.seo.description },
  };
}

export default async function Home() {
  const c = await getHome("en");
  const { before, footer } = landingParts(c, "en");
  return (
    <LandingClient markup={before} footerMarkup={footer}>
      <ContactSection lang="en" sourcePage="/" side={contactSide(c)} />
    </LandingClient>
  );
}

/** Side-panel copy for the contact block, carried over from the home content. */
function contactSide(c: Awaited<ReturnType<typeof getHome>>) {
  return {
    headingLine1: c.contact.rightHeadingLine1,
    headingLine2: c.contact.rightHeadingLine2,
    body: c.contact.rightBody,
    emailLabel: c.contact.emailLabel,
    visitLabel: c.contact.visitLabel,
    visitValue: c.contact.visitValue,
    beerLabel: c.contact.beerLabel,
  };
}
