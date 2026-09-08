// Audit ch. 4: About was reachable only from the footer, although "who is behind
// this" is one of the first questions a buyer asks. It joins the main navigation
// after Applications. The rest of the recommended structure (Case Studies,
// Resources, the "Discuss your process" CTA) waits on client decisions — see
// docs/audit-open-questions.md, E1/E3.
//
// Usage: node scripts/patch-nav-about.mjs            (dry run)
//        node scripts/patch-nav-about.mjs --commit   (write)
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

const ABOUT = {
  _key: "about",
  href: "/about",
  label: [
    { _key: "en", _type: "internationalizedArrayStringValue", value: "About" },
    { _key: "nl", _type: "internationalizedArrayStringValue", value: "Over ons" },
    { _key: "pl", _type: "internationalizedArrayStringValue", value: "O nas" },
  ],
};

const doc = await client.fetch(`*[_type=="siteSettings"][0]{_id, nav}`);
const nav = doc.nav ?? [];
if (nav.some((i) => i._key === "about")) {
  console.log("About is already in the navigation — nothing to do.");
  process.exit(0);
}
const i = nav.findIndex((n) => n._key === "applications");
const next = [...nav.slice(0, i + 1), ABOUT, ...nav.slice(i + 1)];

console.log(next.map((n) => n._key).join(" · "));
if (process.argv.includes("--commit")) {
  await client.patch(doc._id).set({ nav: next }).commit();
  console.log("\nWritten to", doc._id);
} else {
  console.log("\nDry run. Re-run with --commit to write.");
}
