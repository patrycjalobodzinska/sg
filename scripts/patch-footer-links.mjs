// Footer links, audit ch. 13 ("Privacy, Terms i LinkedIn są atrapami").
//
//   · LinkedIn  -> the real company page
//   · Privacy   -> /privacy, the site's own notice (localized per locale)
//   · Terms     -> removed; there is no document to link to, and a dead label
//                  is what the audit objected to in the first place
//
// The footer renders from Sanity, so fixing the code fallback alone leaves the
// live site unchanged. This writes the same decision into siteSettings.
//
// Usage: node scripts/patch-footer-links.mjs            (dry run)
//        node scripts/patch-footer-links.mjs --commit   (write)
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

const LINKEDIN = "https://pl.linkedin.com/company/sg-papertronics-b-v";
const i18n = (en, nl, pl) => [
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
  { _key: "nl", _type: "internationalizedArrayStringValue", value: nl },
  { _key: "pl", _type: "internationalizedArrayStringValue", value: pl },
];

const commit = process.argv.includes("--commit");

const doc = await client.fetch(`*[_type=="siteSettings"][0]{_id, footerColumns, legalLinks}`);
if (!doc?._id) throw new Error("siteSettings document not found");

// LinkedIn: fill the href on whichever footer link is labelled LinkedIn.
const columns = (doc.footerColumns ?? []).map((col) => ({
  ...col,
  links: (col.links ?? []).map((l) => {
    const label = (l.label ?? []).map((v) => v?.value ?? "").join(" ").toLowerCase();
    return label.includes("linkedin") ? { ...l, href: LINKEDIN } : l;
  }),
}));

// Legal: one link, to our own privacy notice.
const legalLinks = [
  {
    _key: "privacy",
    _type: "legalLink",
    href: "/privacy",
    label: i18n("Privacy", "Privacy", "Prywatność"),
  },
];

const patch = { footerColumns: columns, legalLinks };
console.log(JSON.stringify(patch, null, 2));

if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
} else {
  await client.patch(doc._id).set(patch).commit();
  console.log("\nWritten to", doc._id);
}
