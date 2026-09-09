// Two archive covers are group photos that include a person who is no longer
// with the company, so they have to go. Cropping was the first idea and it does
// not work: on the Flinc frame that person stands over the "WINNAAR EUR 20.000"
// cheque, which is the whole point of the story, so a crop that loses him loses
// the news with him.
//
// Both are replaced by our own Q-Tector-on-the-tank frame instead - the one
// device shot we hold with no Beer-o-Meter mark in view (audit ch. 1, ch. 10).
// One asset, two different crops stored on the image object, so the two cards
// do not read as the same picture in the news grid; the Studio can move either
// crop later without touching an asset.
//
// Usage: node scripts/replace-news-covers.mjs            (dry run)
//        node scripts/replace-news-covers.mjs --commit   (write)
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

// The asset scripts/set-technology-hero.mjs already uploaded; reused, not re-uploaded.
const ASSET_FILE = `${root}/public/assets/DC9FCB4B-0CCC-4CC8-A2F3-261DBF2B686B.jpeg`;
const ASSET_FILENAME = "qtector-on-tank.jpeg";

// Sanity crops are the fraction cut away from each edge of the 2048x2222 original.
const WIDE = { _type: "sanity.imageCrop", top: 0.18, bottom: 0.199, left: 0, right: 0 }; // the whole scene
const TIGHT = { _type: "sanity.imageCrop", top: 0.15, bottom: 0.5, left: 0.22, right: 0.17 }; // knob and display, with headroom at 1.9:1

const ALT = {
  en: "The Q‑Tector reader standing on a fermentation tank",
  nl: "De Q‑Tector-reader op een fermentatietank",
  pl: "Czytnik Q‑Tector na tanku fermentacyjnym",
};

const TARGETS = [
  { prefix: "newsArticle-flinc-pitch-", crop: TIGHT },
  { prefix: "newsArticle-nom-rug-", crop: WIDE },
];

const commit = process.argv.includes("--commit");

const ids = await client.fetch(`*[_type=="newsArticle" && (_id match $a || _id match $b)]._id`, {
  a: "newsArticle-flinc-pitch-*",
  b: "newsArticle-nom-rug-*",
});
console.log(`${ids.length} documents: ${ids.join(", ")}`);
if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

// Reuse the asset if it is already in the dataset; upload it once if not.
let assetId = await client.fetch(`*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id`, { f: ASSET_FILENAME });
if (!assetId) {
  const asset = await client.assets.upload("image", readFileSync(ASSET_FILE), { filename: ASSET_FILENAME });
  assetId = asset._id;
  console.log(`uploaded asset: ${assetId}`);
} else {
  console.log(`reusing asset: ${assetId}`);
}

for (const id of ids) {
  const target = TARGETS.find((t) => id.startsWith(t.prefix));
  const lang = id.slice(-2);
  await client
    .patch(id)
    .set({
      coverImage: {
        _type: "imageWithAlt",
        asset: { _type: "reference", _ref: assetId },
        alt: ALT[lang] ?? ALT.en,
        crop: target.crop,
      },
    })
    .commit();
  console.log(`${id}.coverImage -> ${target.crop === TIGHT ? "tight" : "wide"} crop`);
}

console.log("\nWritten.");
