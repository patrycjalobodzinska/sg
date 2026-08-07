// Seed siteSettings.news (news-section UI labels) in all 3 languages, sourced
// from the values already in app/_components/news-i18n.ts (imported via Node
// type-stripping). The code map stays as the runtime fallback.
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { NEWS_CHROME } from "../app/_components/news-i18n.ts";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
for (const line of existsSync(`${root}/.env.local`) ? readFileSync(`${root}/.env.local`, "utf8").split("\n") : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const val = (fn) => [
  { _key: "en", _type: "internationalizedArrayStringValue", value: fn("en") },
  { _key: "nl", _type: "internationalizedArrayStringValue", value: fn("nl") },
  { _key: "pl", _type: "internationalizedArrayStringValue", value: fn("pl") },
];
const s = (key) => val((l) => NEWS_CHROME[l][key]);

// byPrefix: NEWS_CHROME.by is a function; extract the prefix (drop the "{name}")
const byPrefix = val((l) => NEWS_CHROME[l].by("").trim());

const news = {
  heroTitle: s("heroTitle"),
  heroAccent: s("heroAccent"),
  heroLead: s("heroLead"),
  listDesc: s("listDesc"),
  categoryDefault: s("categoryDefault"),
  byPrefix,
  readStory: s("readStory"),
  readMore: s("readMore"),
  ctaHeading: s("ctaHeading"),
  ctaBody: s("ctaBody"),
  ctaButton: s("ctaButton"),
  allNews: s("allNews"),
  comingSoon: s("comingSoon"),
  articleCta: s("articleCta"),
};

const res = await client.patch("siteSettings").set({ news }).commit();
console.log("siteSettings.news seeded → rev", res._rev);
