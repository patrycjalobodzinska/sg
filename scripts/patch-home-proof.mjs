// Audit ch. 5 — the proof band on the home page.
//
// White circles with names read as placeholders, so the section now shows the
// same case-study cards as the Applications page, in a grid. The card type is
// deliberately loose: everything except the title is optional, so the same grid
// can hold a plain partner ("name + relationship") once the client tells us the
// relationship type for each name (blocker B5).
//
// Usage: node scripts/patch-home-proof.mjs            (dry run)
//        node scripts/patch-home-proof.mjs --commit   (write)
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

const CASES = ["beer", "ferment", "agri"];
const commit = process.argv.includes("--commit");

for (const lang of ["en", "nl", "pl"]) {
  const items = CASES.map((c) => ({
    _key: c,
    _type: "reference",
    _ref: `caseStudy-${c}-${lang}`,
  }));
  console.log(`home-${lang}.partners.items -> ${items.map((i) => i._ref).join(", ")}`);
  if (commit) {
    await client
      .patch(`home-${lang}`)
      .set({ "partners.items": items })
      .unset(["partners.names"])
      .commit();
  }
}

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
