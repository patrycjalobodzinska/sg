// Patch translated body onto the NL/PL newsArticle docs. The body STRUCTURE
// (blocks, styles, _keys, marks, markDefs) is identical across languages — only
// span .text differs — so we deep-clone the EN body and swap each span's text
// from the translated strings (same order, validated by count).
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

const load = (f) => JSON.parse(readFileSync(`${root}/${f}`, "utf8"));
const bodies = load("scratch_bodies_en.json");
const enStrings = load("scratch_strings_en.json");
const trans = { nl: load("scratch_strings_nl.json"), pl: load("scratch_strings_pl.json") };

// dry-run flag: pass --commit to actually write
const COMMIT = process.argv.includes("--commit");

let problems = 0;
for (const lang of ["nl", "pl"]) {
  for (const slug of Object.keys(bodies)) {
    const en = enStrings[slug];
    const tr = trans[lang][slug];
    if (!Array.isArray(tr) || tr.length !== en.length) {
      console.log(`✗ ${lang}/${slug}: span count mismatch en=${en.length} ${lang}=${tr ? tr.length : "MISSING"}`);
      problems++;
    }
  }
}
if (problems) { console.log(`\n${problems} problem(s) — aborting, nothing written.`); process.exit(1); }
console.log("validation OK: all span counts match.\n");

for (const lang of ["nl", "pl"]) {
  for (const slug of Object.keys(bodies)) {
    const docSlug = `${slug}-${lang}`;
    const id = await client.fetch(
      `*[_type=="newsArticle" && language==$lang && slug.current==$slug][0]._id`,
      { lang, slug: docSlug }
    );
    if (!id) { console.log(`✗ ${lang}/${slug}: no doc for slug ${docSlug}`); continue; }

    // deep clone EN body, swap span texts in document order
    const body = JSON.parse(JSON.stringify(bodies[slug]));
    const tr = trans[lang][slug];
    let i = 0;
    for (const block of body) {
      for (const child of block.children || []) {
        if (typeof child.text === "string") child.text = tr[i++];
      }
    }
    if (i !== tr.length) { console.log(`✗ ${lang}/${slug}: consumed ${i} of ${tr.length} strings`); continue; }

    if (COMMIT) {
      const res = await client.patch(id).set({ body }).commit();
      console.log(`✓ ${lang}/${slug} → ${id} rev ${res._rev}`);
    } else {
      console.log(`(dry) ${lang}/${slug} → ${id} would set ${body.length} blocks`);
    }
  }
}
console.log(COMMIT ? "\ndone (committed)." : "\ndry-run only — re-run with --commit to write.");
