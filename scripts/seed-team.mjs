// Audit ch. 8 — the About page names the people behind the product.
//
// Names, roles and portraits are taken from the current sgpapertronics.com team
// page; the photos are uploaded into Sanity so the new site does not hotlink the
// old one. Two fields the audit also asks for are deliberately left empty:
//
//   · bio       - a short competence line per person
//   · linkedin  - the profile URL
//
// Neither exists on the current site, and neither is ours to invent. The card
// omits whichever is missing, so the client can fill them in one at a time.
//
// Usage: node scripts/seed-team.mjs            (dry run)
//        node scripts/seed-team.mjs --commit   (write)
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

const BASE = "https://sgpapertronics.com/wp-content/uploads";
const TEAM = [
  { key: "maciej", name: "Maciej, PhD", role: "CEO", photo: `${BASE}/2023/05/Maciej-sgpapertronics-1.jpeg` },
  { key: "leon", name: "Leon, PhD", role: "CCO", photo: `${BASE}/2023/06/leon.jpeg` },
  { key: "diederik", name: "Diederik, PhD", role: "COO", photo: `${BASE}/2023/05/Diederik-sgpapertronics-1.jpeg` },
  { key: "mags", name: "Mags", role: "Financial & Business Controller", photo: `${BASE}/2023/06/mags.jpeg` },
  { key: "steven", name: "Steven", role: "Product Design and Sourcing", photo: `${BASE}/2023/05/steven-sgpapertronics-1024x1024-1.webp` },
  { key: "ruby", name: "Ruby Karsten, PhD", role: "R&D Scientist", photo: `${BASE}/2024/09/Ruby-Karsten.jpeg` },
  { key: "hubert", name: "Hubert Hurban", role: "Marketing Specialist", photo: `${BASE}/2024/09/hubert-hurban.jpeg` },
  { key: "anna", name: "Anna Maria Lis", role: "Product Design and Content Creator Intern", photo: `${BASE}/2024/09/WhatsApp-Image-2024-09-26-at-11.27.16.jpeg` },
  { key: "adrian", name: "Adrian", role: "R&D Intern", photo: `${BASE}/2023/05/adrian-rufli-sgpapertronics-1024x1024-1.jpeg` },
];

const commit = process.argv.includes("--commit");
const refs = [];

for (const [i, m] of TEAM.entries()) {
  const _id = `teamMember-${m.key}`;
  refs.push({ _key: m.key, _type: "reference", _ref: _id });
  console.log(`${_id}: ${m.name} - ${m.role}`);
  if (!commit) continue;

  let photo;
  try {
    const res = await fetch(m.photo);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename: `${m.key}${path.extname(new URL(m.photo).pathname)}` });
    photo = { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt: `${m.name}, ${m.role}` };
  } catch (err) {
    console.log(`  ! photo skipped (${err.message}) - add it in the Studio`);
  }

  await client.createOrReplace({
    _id,
    _type: "teamMember",
    name: m.name,
    role: m.role,
    order: (i + 1) * 10,
    ...(photo ? { photo } : {}),
  });
}

// Point every language version of the About page at the same people.
for (const lang of ["en", "nl", "pl"]) {
  console.log(`about-${lang}.team -> ${refs.length} members`);
  if (commit) await client.patch(`about-${lang}`).set({ team: refs }).commit();
}

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
