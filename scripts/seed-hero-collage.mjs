// The home hero's four photographs, uploaded into Sanity so they can be swapped
// without a deploy (homePage.images.heroCollage).
//
// Only `device` is our own frame - the reader on a tank, no Beer-o-Meter mark in
// view. The tank hall, the bench and the crop field are stock stand-ins for the
// photo session (audit ch. 10): they are here so the composition is real, not
// because they should stay. Replace them in the Studio, one at a time; the
// layout does not care which slot changes.
//
// The code keeps the same four files in /public as a fallback, so an empty slot
// renders the stand-in rather than a hole.
//
// Usage: node scripts/seed-hero-collage.mjs            (dry run)
//        node scripts/seed-hero-collage.mjs --commit   (write)
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

const FRAMES = [
  {
    slot: "device",
    file: "DC9FCB4B-0CCC-4CC8-A2F3-261DBF2B686B.jpeg",
    filename: "qtector-on-tank.jpeg", // already uploaded for the technology hero
    alt: {
      en: "The Q‑Tector reader standing on a fermentation tank",
      nl: "De Q‑Tector-reader op een fermentatietank",
      pl: "Czytnik Q‑Tector na tanku fermentacyjnym",
    },
  },
  {
    slot: "tanks",
    file: "pexels-theshuttervision-13655238.jpg",
    filename: "hero-tanks.jpg",
    alt: {
      en: "Stainless fermentation tanks outside a brewery at night",
      nl: "Roestvrijstalen fermentatietanks bij een brouwerij in de avond",
      pl: "Stalowe tanki fermentacyjne przed browarem nocą",
    },
  },
  {
    slot: "lab",
    file: "pexels-jorge-chan-515189442-24293768.jpg",
    filename: "hero-lab.jpg",
    alt: {
      en: "A microscope and sample racks on a laboratory bench",
      nl: "Een microscoop en monsterrekken op een laboratoriumtafel",
      pl: "Mikroskop i statywy z próbkami na blacie laboratoryjnym",
    },
  },
  {
    slot: "field",
    file: "pexels-anna-3014674-37775778.jpg",
    filename: "hero-field.jpg",
    alt: {
      en: "Rows of a green crop field",
      nl: "Rijen van een groen gewasveld",
      pl: "Rzędy zielonego pola uprawnego",
    },
  },
];

const commit = process.argv.includes("--commit");
for (const f of FRAMES) console.log(`${f.slot}: ${f.file}`);
if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

// One asset per photograph, shared by all three language documents; only the
// alt differs per language.
const assets = {};
for (const f of FRAMES) {
  const existing = await client.fetch(`*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id`, { f: f.filename });
  if (existing) {
    assets[f.slot] = existing;
    console.log(`${f.slot}: reusing ${existing}`);
    continue;
  }
  const asset = await client.assets.upload("image", readFileSync(`${root}/public/assets/${f.file}`), { filename: f.filename });
  assets[f.slot] = asset._id;
  console.log(`${f.slot}: uploaded ${asset._id}`);
}

for (const lang of ["en", "nl", "pl"]) {
  const collage = {};
  for (const f of FRAMES) {
    collage[f.slot] = {
      _type: "imageWithAlt",
      asset: { _type: "reference", _ref: assets[f.slot] },
      alt: f.alt[lang],
    };
  }
  await client.patch(`home-${lang}`).set({ "images.heroCollage": collage }).commit();
  console.log(`home-${lang}.images.heroCollage set`);
}

console.log("\nWritten.");
