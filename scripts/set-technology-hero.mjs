// Technology hero photo.
//
// The page used to fall back to the chrome form because the only device shot in
// Sanity was the Beer-o-Meter, wordmark and all, and /technology is about
// Q-Tector (audit ch. 1 and 5). This uploads our own reader-on-the-tank frame -
// same hardware, no mark in view - and points all three language versions at it.
//
// Usage: node scripts/set-technology-hero.mjs            (dry run)
//        node scripts/set-technology-hero.mjs --commit   (write)
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

const FILE = `${root}/public/assets/DC9FCB4B-0CCC-4CC8-A2F3-261DBF2B686B.jpeg`;
const ALT = {
  en: "The Q‑Tector reader standing on a fermentation tank",
  nl: "De Q‑Tector-reader op een fermentatietank",
  pl: "Czytnik Q‑Tector na tanku fermentacyjnym",
};

const commit = process.argv.includes("--commit");
console.log(`${commit ? "Uploading" : "Would upload"} ${path.basename(FILE)} -> technology-{en,nl,pl}.hero.image`);
if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

const asset = await client.assets.upload("image", readFileSync(FILE), { filename: "qtector-on-tank.jpeg" });
console.log(`asset: ${asset._id}`);

for (const lang of Object.keys(ALT)) {
  await client
    .patch(`technology-${lang}`)
    .set({ "hero.image": { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt: ALT[lang] } })
    .commit();
  console.log(`technology-${lang}.hero.image set`);
}

console.log("\nWritten.");
