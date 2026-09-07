// Plan A3 — the brand hierarchy has to hold wherever the name appears, not just
// in the home intro paragraph. Rule from the audit (ch. 2, 14): Beer-o-Meter
// never stands without the qualifier that places it under Q-Tector.
//
// Fixed here:
//   · homePage.footer.tagline      — named the platform but not the hierarchy
//   · homePage.contact.beerLabel   — a bare "Beer-o-Meter" beside testmybeer.com
//   · siteSettings.footerTagline   — the subpage footers use this one
//   · siteSettings.news.listDesc   — listed the two brands as if they were peers
//
// Usage: node scripts/patch-brand-hierarchy.mjs            (dry run)
//        node scripts/patch-brand-hierarchy.mjs --commit   (write)
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

const TAGLINE = {
  en: "Q‑Tector is our at-line analytics platform for biotech and fermentation; Beer‑o‑Meter is its first commercial application.",
  nl: "Q‑Tector is ons at-line analyseplatform voor biotech en fermentatie; Beer‑o‑Meter is de eerste commerciële toepassing ervan.",
  pl: "Q‑Tector to nasza platforma analityki at-line dla biotechnologii i fermentacji; Beer‑o‑Meter to jej pierwsze komercyjne zastosowanie.",
};
const BEER_LABEL = {
  en: "Beer-o-Meter - brewing application of Q‑Tector",
  nl: "Beer-o-Meter - brouwtoepassing van Q‑Tector",
  pl: "Beer-o-Meter - zastosowanie Q‑Tectora w browarnictwie",
};
const NEWS_LIST_DESC = {
  en: "News and updates from SG Papertronics - Q‑Tector milestones, its Beer‑o‑Meter brewing application, events, grants, partnerships and company announcements.",
  nl: "Nieuws en updates van SG Papertronics - mijlpalen rond Q‑Tector, de Beer‑o‑Meter-brouwtoepassing, evenementen, subsidies, samenwerkingen en bedrijfsaankondigingen.",
  pl: "Aktualności i nowości SG Papertronics - kamienie milowe Q‑Tectora, jego browarnicze zastosowanie Beer‑o‑Meter, wydarzenia, granty, partnerstwa i ogłoszenia firmowe.",
};

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;
const show = (label, before, after) => {
  if (before === after) return false;
  changes++;
  console.log(`  ${label}\n    - ${before ?? "(none)"}\n    + ${after}`);
  return true;
};

// ---- per-locale homePage documents ----
const homes = await client.fetch(`*[_type=="homePage"]{_id, language, footer, contact}`);
for (const d of homes) {
  const l = d.language;
  console.log(`\n── ${d._id} (${l})`);
  const set = {};
  if (show("footer.tagline", d.footer?.tagline, TAGLINE[l])) set["footer.tagline"] = TAGLINE[l];
  if (show("contact.beerLabel", d.contact?.beerLabel, BEER_LABEL[l])) set["contact.beerLabel"] = BEER_LABEL[l];
  if (Object.keys(set).length) tx.patch(d._id, { set });
}

// ---- siteSettings: internationalizedArray fields ----
const st = await client.fetch(`*[_type=="siteSettings"][0]{_id, footerTagline, "newsListDesc": news.listDesc}`);
if (!st) throw new Error("No siteSettings document");
const arr = (map, type) =>
  ["en", "nl", "pl"].map((k) => ({ _key: k, _type: type, value: map[k] }));
const readVal = (a, k) => (Array.isArray(a) ? a.find((v) => v._key === k)?.value : undefined);

console.log(`\n── ${st._id}`);
const set = {};
let taglineChanged = false;
for (const k of ["en", "nl", "pl"]) {
  if (show(`footerTagline[${k}]`, readVal(st.footerTagline, k), TAGLINE[k])) taglineChanged = true;
}
if (taglineChanged) set.footerTagline = arr(TAGLINE, "internationalizedArrayStringValue");

let ldChanged = false;
for (const k of ["en", "nl", "pl"]) {
  if (show(`news.listDesc[${k}]`, readVal(st.newsListDesc, k), NEWS_LIST_DESC[k])) ldChanged = true;
}
if (ldChanged) set["news.listDesc"] = arr(NEWS_LIST_DESC, "internationalizedArrayTextValue");

if (Object.keys(set).length) tx.patch(st._id, { set });

if (!changes) {
  console.log("\nNothing to change — the dataset already matches.");
} else if (!commit) {
  console.log(`\n${changes} field(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} field(s).`);
}
