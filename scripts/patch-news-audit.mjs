// Section F/News from the audit (ch. 9), plan items 1, 4, 5 and 6.
//
//  1. One read-article label instead of two ("Read the full story" on the
//     featured card, "Read more" in the grid) — `news.readStory` is unset and
//     `news.readMore` carries the surviving wording.
//  4. Article categories move to the audit's five:
//       Customer results · Q-Tector product · Application development ·
//       Partnerships · Company
//     The legacy set (News/Event/Award/Grant/Recognition/Investment) does not
//     survive. Note the distribution this produces on the current archive:
//     Company 5, Partnerships 3, Application development 1, and nothing yet in
//     Customer results or Q-Tector product — the archive is company-milestone
//     heavy, and the two empty ones are for posts still to come.
//  5. The closing CTA promised "we'll keep you posted on releases and
//     milestones". There is no newsletter, so the promise goes.
//  6. ...and its label becomes the audit's "Discuss your application".
//
// NOT covered, both need a decision first:
//  2. author-job is still named "jobgerjon" — nobody's real name is recorded
//     anywhere in the project, so it cannot be fixed from here.
//  3. cbc26-future and cbc26-relationships share one coverImage; picking the
//     replacement is a content call.
//
// Usage: node scripts/patch-news-audit.mjs            (dry run)
//        node scripts/patch-news-audit.mjs --commit   (write)
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
for (const line of existsSync(`${root}/.env.local`) ? readFileSync(`${root}/.env.local`, "utf8").split("\n") : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) throw new Error("Missing projectId/token in .env.local");

const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", token, useCdn: false });

/** internationalizedArrayString value for the three locales. */
const i18n = (en, nl, pl) => [
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
  { _key: "nl", _type: "internationalizedArrayStringValue", value: nl },
  { _key: "pl", _type: "internationalizedArrayStringValue", value: pl },
];
const i18nText = (en, nl, pl) => [
  { _key: "en", _type: "internationalizedArrayTextValue", value: en },
  { _key: "nl", _type: "internationalizedArrayTextValue", value: nl },
  { _key: "pl", _type: "internationalizedArrayTextValue", value: pl },
];

const CHROME_SET = {
  "news.readMore": i18n(
    "Read the full story",
    "Lees het volledige verhaal",
    "Przeczytaj całą historię"
  ),
  "news.categoryDefault": i18n("Company", "Bedrijf", "Firma"),
  "news.ctaHeading": i18n(
    "Have an application in mind?",
    "Heeft u een toepassing in gedachten?",
    "Masz na myśli konkretne zastosowanie?"
  ),
  "news.ctaBody": i18nText(
    "Tell us your organism, process stage and target analyte, and we'll say whether an existing Q‑Tector workflow fits or an application-development path makes sense.",
    "Vertel ons uw organisme, processtadium en doelanalyt, en wij zeggen of een bestaande Q‑Tector-workflow past of dat een applicatieontwikkelingstraject zinvol is.",
    "Napisz nam, jaki to organizm, na jakim etapie jest proces i jaki analit Cię interesuje - odpowiemy, czy pasuje istniejące workflow Q‑Tector, czy sensowna jest ścieżka rozwoju zastosowania."
  ),
  "news.ctaButton": i18n(
    "Discuss your application",
    "Bespreek uw toepassing",
    "Omów swoje zastosowanie"
  ),
};
const CHROME_UNSET = ["news.readStory"];

// audit category -> label per locale
const CAT = {
  customerResults: { en: "Customer results", nl: "Klantresultaten", pl: "Wyniki klientów" },
  product: { en: "Q-Tector product", nl: "Q-Tector product", pl: "Produkt Q-Tector" },
  appDev: { en: "Application development", nl: "Applicatieontwikkeling", pl: "Rozwój zastosowań" },
  partnerships: { en: "Partnerships", nl: "Samenwerkingen", pl: "Partnerstwa" },
  company: { en: "Company", nl: "Bedrijf", pl: "Firma" },
};

// Mapped from each article's subject, not its old label.
const ARTICLE_CAT = {
  "living-fermentation": "appDev",       // supporting producers with process data
  "cbc26-relationships": "partnerships", // relationships built at the trade show
  "mit-grant": "partnerships",           // consortium with Levels Diagnostics + Omnigen
  "mit-subsidy": "partnerships",         // joint R&D with EV Biotech
  "cbc26-future": "company",
  "kvk-top-100": "company",
  "ces-2025": "company",
  "finally-here": "company",
  "flinc-pitch": "company",
  "nom-rug": "company",
};

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;

// ---- site settings news chrome ----
const settings = await client.fetch(`*[_type=="siteSettings"][0]{_id, news}`);
if (!settings) throw new Error("No siteSettings document");
const readVal = (arr, k) => (Array.isArray(arr) ? arr.find((v) => v._key === k)?.value : undefined);
console.log(`\n── siteSettings (${settings._id})`);
for (const [p, v] of Object.entries(CHROME_SET)) {
  const field = p.split(".")[1];
  const before = settings.news?.[field];
  const same = ["en", "nl", "pl"].every((k) => readVal(before, k) === readVal(v, k));
  if (same) continue;
  changes++;
  console.log(`  ${p}`);
  for (const k of ["en", "nl", "pl"]) {
    console.log(`    ${k}  - ${readVal(before, k) ?? "(none)"}`);
    console.log(`        + ${readVal(v, k)}`);
  }
}
for (const p of CHROME_UNSET) {
  const field = p.split(".")[1];
  if (settings.news?.[field] === undefined) continue;
  changes++;
  console.log(`  ${p}  → unset (was: ${readVal(settings.news[field], "en")})`);
}
tx.patch(settings._id, { set: CHROME_SET, unset: CHROME_UNSET });

// ---- article categories ----
const articles = await client.fetch(
  `*[_type=="newsArticle"]|order(_id asc){_id, language, category, "slug": slug.current}`
);
console.log("\n── newsArticle categories");
for (const a of articles) {
  // NL/PL slugs carry a locale suffix
  const base = a.slug.replace(/-(nl|pl)$/, "");
  const key = ARTICLE_CAT[base];
  if (!key) {
    console.log(`  !! no mapping for ${a.slug} — left alone`);
    continue;
  }
  const next = CAT[key][a.language];
  if (!next) {
    console.log(`  !! no ${a.language} label for ${key} — left alone`);
    continue;
  }
  if (a.category === next) continue;
  changes++;
  console.log(`  ${a._id.padEnd(34)} ${String(a.category).padEnd(14)} → ${next}`);
  tx.patch(a._id, { set: { category: next } });
}

if (!changes) {
  console.log("\nNothing to change — the dataset already matches.");
} else if (!commit) {
  console.log(`\n${changes} change(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} change(s). useCdn:true + revalidate=300, so the live pages lag briefly.`);
}
