import type { Metadata } from "next";
import LandingClient from "./_components/LandingClient";
import { landingMarkup } from "./_components/landing-markup";
import { getHome } from "../sanity/lib/home";
import { languageAlternates } from "./i18n";

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
  return <LandingClient markup={landingMarkup(c, "en")} />;
}
