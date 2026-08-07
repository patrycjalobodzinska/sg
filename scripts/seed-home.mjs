// Seed/patch the three homePage documents (home-en / home-nl / home-pl) with the
// full localized landing content extracted from the redesigned Claude Design.
// EN comes from app/_components/home-content.ts (via scratchpad_home_en.json);
// NL/PL from the translated JSON. Landing images stay literal in the template,
// so only text/link content lives here.
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
const en = load("scratchpad_home_en.json");
const nl = load("scratchpad_home_nl.json");
const pl = load("scratchpad_home_pl.json");

// nav.about was added after the translation run — backfill it.
nl.nav = { ...nl.nav, about: nl.nav.about ?? "Over ons" };
pl.nav = { ...pl.nav, about: pl.nav.about ?? "O nas" };

const DOCS = { en: "home-en", nl: "home-nl", pl: "home-pl" };
const CONTENT = { en, nl, pl };

// Only the landing-content fields are patched; existing image refs / other
// fields on the doc are left untouched.
const FIELDS = ["nav", "hero", "intro", "benefits", "explore", "lifecycle", "howWeWork", "partners", "contact", "footer", "seo"];

for (const [lang, id] of Object.entries(DOCS)) {
  const c = CONTENT[lang];
  const set = {};
  for (const f of FIELDS) set[f] = c[f];
  const res = await client
    .patch(id)
    .setIfMissing({ _type: "homePage", language: lang })
    .set(set)
    .commit({ autoGenerateArrayKeys: true });
  console.log(`patched ${id} (${lang}) rev ${res._rev}`);
}
console.log("done.");
