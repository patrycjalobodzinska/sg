// Give the CBC26 relationships article a real cover.
//
// All six CBC26 documents shared one asset, and that asset is cbc.png — the
// conference logo at 236x213, not a photograph. patch-news-author-cover.mjs
// removed it from cbc26-relationships to break the duplicate, which left the
// article with no image at all.
//
// It gets hero-beer.png instead: the Beer-o-Meter unit in a brewery, 2000x1098.
// The audit wants that device off the home hero, not erased from its own story
// — this article is about Beer-o-Meter at a brewing conference, so the branded
// photo belongs here. The alt text carries the Q-Tector qualifier (A3).
//
// Still open: cbc26-future keeps the 236x213 logo as its cover, which upscales
// badly on a 1080-wide card.
//
// Usage: node scripts/patch-cbc-cover.mjs            (dry run)
//        node scripts/patch-cbc-cover.mjs --commit   (write)
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

const ASSET = "image-4a1adef7a64908f0bf53ac4462731db57b35a4d2-2000x1098-png"; // hero-beer.png

const ALT = {
  en: "Beer-o-Meter, the Q‑Tector brewing application, beside bottled beer in a brewery",
  nl: "Beer-o-Meter, de Q‑Tector-brouwtoepassing, naast gebotteld bier in een brouwerij",
  pl: "Beer-o-Meter, browarnicze zastosowanie Q‑Tectora, obok butelkowanego piwa w browarze",
};

const IDS = [
  "newsArticle-cbc26-relationships-en",
  "newsArticle-cbc26-relationships-nl",
  "newsArticle-cbc26-relationships-pl",
];

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;

const docs = await client.fetch(`*[_id in $ids]{_id, language, coverImage}`, { ids: IDS });
for (const id of IDS) {
  const d = docs.find((x) => x._id === id);
  if (!d) throw new Error(`Missing document: ${id}`);
  const next = {
    _type: "image",
    asset: { _type: "reference", _ref: ASSET },
    alt: ALT[d.language],
  };
  const beforeRef = d.coverImage?.asset?._ref;
  if (beforeRef === ASSET && d.coverImage?.alt === next.alt) continue;
  changes++;
  console.log(`  ${id}`);
  console.log(`    - ${beforeRef ?? "(no cover)"}`);
  console.log(`    + ${ASSET}`);
  console.log(`      alt: ${next.alt}`);
  tx.patch(id, { set: { coverImage: next } });
}

if (!changes) {
  console.log("Nothing to change — the cover is already set.");
} else if (!commit) {
  console.log(`\n${changes} document(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} document(s).`);
}
