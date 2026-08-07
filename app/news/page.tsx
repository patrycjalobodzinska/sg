import type { Metadata } from "next";
import NewsListPage from "../_components/NewsListPage";
import { NEWS_CHROME } from "../_components/news-i18n";
import { languageAlternates } from "../i18n";

export const revalidate = 300;

const DESC = NEWS_CHROME.en.listDesc;
export const metadata: Metadata = {
  title: "News",
  description: DESC,
  alternates: { canonical: "/news", languages: languageAlternates("/news") },
  openGraph: {
    title: "News - SG Papertronics",
    description: DESC,
    url: "https://sgpapertronics.com/news",
    type: "website",
  },
};

export default function Page() {
  return <NewsListPage lang="en" />;
}
