import type { MetadataRoute } from "next";
import { locales, localizedPath, defaultLocale } from "./i18n";
import { getNewsSlugs } from "../sanity/lib/news";

const BASE = "https://sgpapertronics.com";
const lastModified = new Date("2026-08-07");

// revalidate so newly published articles enter the sitemap without a redeploy
export const revalidate = 300;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

// emit one row per locale, each carrying the full hreflang alternates map
function withAlternates(e: Entry): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${BASE}${localizedPath(e.path, l)}`;
  languages["x-default"] = `${BASE}${localizedPath(e.path, defaultLocale)}`;
  return locales.map((l) => ({
    url: `${BASE}${localizedPath(e.path, l)}`,
    lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/technology", priority: 0.9, changeFrequency: "monthly" },
    { path: "/applications", priority: 0.9, changeFrequency: "monthly" },
    { path: "/investors", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  ];

  let slugs: string[] = [];
  try {
    slugs = await getNewsSlugs(defaultLocale);
  } catch {
    slugs = [];
  }
  for (const slug of slugs) {
    routes.push({ path: `/news/${slug}`, priority: 0.6, changeFrequency: "monthly" });
  }

  return routes.flatMap(withAlternates);
}
