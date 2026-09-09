// Jelmer Coenradij joins the About page as R&D Scientist - the seat Ruby held,
// in the same position in the list (order 60).
//
// The portrait is 4:5 and the team tiles are square, so a plain centre crop
// would cut the top of his head. A crop is stored on the image object instead,
// keeping the full width and trimming from the bottom; the Studio can move it.
//
// Usage: node scripts/add-team-jelmer.mjs            (dry run)
//        node scripts/add-team-jelmer.mjs --commit   (write)
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

const ID = "teamMember-jelmer";
const KEY = "jelmer";
const NAME = "Jelmer Coenradij";
const ROLE = "R&D Scientist";
const ORDER = 60; // Ruby's position, between Steven (50) and Adrian (90)
const PHOTO = `${root}/public/assets/team/jelmer-coenradij.jpg`;
// fractions cut from each edge of the 1280x1600 portrait
const CROP = { _type: "sanity.imageCrop", top: 0.025, bottom: 0.175, left: 0, right: 0 };

const commit = process.argv.includes("--commit");
console.log(`${ID}: ${NAME} - ${ROLE} (order ${ORDER})`);
if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

let assetId = await client.fetch(`*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id`, { f: "jelmer-coenradij.jpg" });
if (!assetId) {
  const asset = await client.assets.upload("image", readFileSync(PHOTO), { filename: "jelmer-coenradij.jpg" });
  assetId = asset._id;
  console.log(`uploaded ${assetId}`);
} else {
  console.log(`reusing ${assetId}`);
}

await client.createOrReplace({
  _id: ID,
  _type: "teamMember",
  name: NAME,
  role: ROLE,
  order: ORDER,
  photo: {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: assetId },
    alt: `${NAME}, ${ROLE}`,
    crop: CROP,
  },
});
console.log(`${ID} written`);

// Slot him into every language version of the About page, ordered by `order`
// so he lands where Ruby was rather than at the end of the list.
for (const lang of ["en", "nl", "pl"]) {
  const id = `about-${lang}`;
  const team = (await client.fetch(`*[_id==$id][0].team`, { id })) ?? [];
  if (team.some((r) => r._ref === ID)) {
    console.log(`${id}: already listed`);
    continue;
  }
  const orders = await client.fetch(`*[_id in $ids]{_id, order}`, { ids: team.map((r) => r._ref) });
  const orderOf = Object.fromEntries(orders.map((o) => [o._id, o.order ?? 999]));
  const at = team.findIndex((r) => (orderOf[r._ref] ?? 999) > ORDER);
  const ref = { _key: KEY, _type: "reference", _ref: ID };
  const next = at === -1 ? [...team, ref] : [...team.slice(0, at), ref, ...team.slice(at)];
  await client.patch(id).set({ team: next }).commit();
  console.log(`${id}: ${team.length} -> ${next.length}, inserted at ${at === -1 ? next.length - 1 : at}`);
}

console.log("\nWritten.");
