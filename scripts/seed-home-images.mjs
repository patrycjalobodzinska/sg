// Move landing images into Sanity: reuse already-uploaded brand assets, upload
// the missing ones (hero.webp + the pexels stock shots), and set image refs on
// the homePage docs (all 3 locales — images are language-independent).
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

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

// already-uploaded assets (from earlier seed)
const REUSE = {
  heroBg: "image-49283c78f1a83dffa1516d006aaa48a44c7088af-6240x4160-jpg", // newHero.JPG
  team: "image-62a14e925f3e721092b0d962932eeab8799d577d-1920x885-jpg", // SGP-team.jpg
  lab: "image-751bceac00f1fc777966892fa491e1c23f76c8ab-1920x960-jpg", // SG-papertronics009b.jpg
};

// find an existing asset by originalFilename, else upload from a local path or URL
async function ensureAsset(filename, source) {
  const existing = await client.fetch(`*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id`, { f: filename });
  if (existing) { console.log(`  reuse ${filename} → ${existing}`); return existing; }
  let buf;
  if (source.startsWith("http")) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`fetch ${source} → ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
  } else {
    buf = readFileSync(`${root}/${source}`);
  }
  const asset = await client.assets.upload("image", buf, { filename });
  console.log(`  uploaded ${filename} → ${asset._id}`);
  return asset._id;
}

const PEX = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

console.log("ensuring assets…");
const heroWebp = await ensureAsset("hero.webp", "public/assets/hero.webp");
const life1 = await ensureAsset("lifecycle-analyze.jpg", PEX(9574338, 900));
const life2 = await ensureAsset("lifecycle-pilot.jpg", PEX(8770737, 900));
const life3 = await ensureAsset("lifecycle-rollout.jpg", PEX(5532674, 900));
const banner = await ensureAsset("howwework-banner.jpg", PEX(8386434, 1400));

const imageRef = (ref, alt) => ({ _type: "imageWithAlt", asset: { _type: "reference", _ref: ref }, alt });
const keyed = (ref, alt, key) => ({ _key: key, ...imageRef(ref, alt) });

const images = {
  heroBg: imageRef(REUSE.heroBg, "Lab"),
  collage: [
    keyed(REUSE.team, "The SG Papertronics team", "c0"),
    keyed(REUSE.lab, "At-line testing in the lab", "c1"),
    keyed(heroWebp, "Beer-o-Meter in a brewery", "c2"),
  ],
  lifecycle: [
    keyed(life1, "Analyze goals - reviewing process data", "l0"),
    keyed(life2, "Pilot & test - running a sample", "l1"),
    keyed(life3, "Roll out - production line", "l2"),
  ],
  banner: imageRef(banner, "Team running the process independently"),
};

for (const id of ["home-en", "home-nl", "home-pl"]) {
  const res = await client.patch(id).set({ images }).commit();
  console.log(`patched ${id} images → rev ${res._rev}`);
}
console.log("done.");
