// Correction to scripts/patch-news-audit.mjs.
//
// That script rewrote every article's category to the audit's five (ch. 9).
// But that set is the taxonomy for the news feed going forward — it was never
// meant to overwrite the archive. Applying it retroactively destroyed real
// information: "Grant", "Award", "Investment", "Event" and "Recognition" each
// said something specific and true, and six of ten posts collapsed into the
// single label "Company".
//
// So the archive gets its original labels back. Only the 2026 posts — the ones
// written since the audit — keep the new set:
//
//   living-fermentation   Application development
//   cbc26-relationships   Partnerships
//   cbc26-future          Company
//
// One deliberate difference from the originals: the Polish labels were seeded
// without diacritics ("Wyroznienie", "Aktualnosci"). Since these values are
// being written anyway, they go back spelled correctly.
//
// Usage: node scripts/patch-news-categories-archive.mjs            (dry run)
//        node scripts/patch-news-categories-archive.mjs --commit   (write)
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

// Restored archive labels, as they were before the remap.
const ARCHIVE = {
  "ces-2025":     { en: "Event",       nl: "Evenement",  pl: "Wydarzenie" },
  "finally-here": { en: "Company",     nl: "Bedrijf",    pl: "Firma" },
  "kvk-top-100":  { en: "Recognition", nl: "Erkenning",  pl: "Wyróżnienie" },
  "mit-grant":    { en: "Grant",       nl: "Subsidie",   pl: "Grant" },
  "mit-subsidy":  { en: "Grant",       nl: "Subsidie",   pl: "Grant" },
  "flinc-pitch":  { en: "Award",       nl: "Prijs",      pl: "Nagroda" },
  "nom-rug":      { en: "Investment",  nl: "Investering", pl: "Inwestycja" },
};

// Posts from 2026 keep the audit's set; listed so the intent is explicit
// rather than "whatever is not in ARCHIVE".
const KEEP_AUDIT_SET = new Set([
  "living-fermentation",
  "cbc26-future",
  "cbc26-relationships",
]);

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;

const docs = await client.fetch(
  `*[_type=="newsArticle"]|order(_id asc){_id, language, category, "slug": slug.current}`
);

for (const d of docs) {
  const base = d.slug.replace(/-(nl|pl)$/, "");
  if (KEEP_AUDIT_SET.has(base)) continue;
  const want = ARCHIVE[base]?.[d.language];
  if (!want) {
    console.log(`  !! no archive label for ${d.slug} (${d.language}) — left alone`);
    continue;
  }
  if (d.category === want) continue;
  changes++;
  console.log(`  ${d._id.padEnd(34)} ${String(d.category).padEnd(24)} → ${want}`);
  tx.patch(d._id, { set: { category: want } });
}

if (!changes) {
  console.log("\nNothing to change — the archive already carries its own labels.");
} else if (!commit) {
  console.log(`\n${changes} change(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} change(s).`);
}
