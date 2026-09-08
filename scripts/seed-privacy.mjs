// Seed the privacy notice into Sanity so the client can edit it in the Studio
// instead of asking us for a deploy (audit ch. 13: Privacy must be a real page).
//
// The text mirrors app/_components/privacy-content.ts, which stays the fallback
// if the document is ever emptied. NL and PL are created as empty shells: the
// page falls back to the EN body until someone translates them, which is better
// than half a legal page.
//
// Deliberately no analytics section — the site loads no analytics today. Add
// that paragraph in the Studio on the day tracking goes live.
//
// Usage: node scripts/seed-privacy.mjs            (dry run)
//        node scripts/seed-privacy.mjs --commit   (write)
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

let n = 0;
const block = (style, text) => ({
  _type: "block",
  _key: `b${++n}`,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `s${n}`, text, marks: [] }],
});

const SECTIONS = [
  ["Who we are", [
    "SG Papertronics B.V., Blauwborgje 31, 9747 AW Groningen, the Netherlands, is responsible for the personal data described in this notice. You can reach us at contact@sgpapertronics.com.",
    "This notice explains what personal data we handle when you use sgpapertronics.com or contact us, why we handle it and what rights you have.",
  ]],
  ["What we collect", [
    "Contact form: your name, work email address, company or organisation, the type of inquiry you select and the message you write. You decide what to put in the message.",
    "Correspondence: the emails you send us and our replies.",
    "Technical logs: our hosting provider records the usual server data, such as IP address, browser type and the page requested, so that pages can be delivered and the site kept secure.",
  ]],
  ["Why we use it, and on what basis", [
    "To answer your inquiry and, where relevant, to prepare or perform an agreement with you or your organisation.",
    "To operate, secure and improve the website, which is our legitimate interest.",
    "We do not use your data for automated decision-making, and we do not sell it.",
  ]],
  ["Who else sees it", [
    "Service providers that host the website, store its content and deliver our email process the data on our instructions and may not use it for their own purposes.",
    "We share data with others only where the law requires it.",
  ]],
  ["How long we keep it", [
    "We keep an inquiry for as long as we need it to answer you and to keep a record of our business contacts, and delete it when that reason ends. Server logs are kept for a short period for security and troubleshooting.",
  ]],
  ["Cookies", [
    "The website does not use advertising or tracking cookies. Any storage in your browser is what is needed to display the pages you request.",
    "If we add analytics or other non-essential tracking, we will ask for your consent first and update this notice.",
  ]],
  ["Your rights", [
    "You can ask us for a copy of your personal data, and ask us to correct, delete or restrict it. You can object to processing based on our legitimate interest, and ask to receive your data in a portable form.",
    "Write to contact@sgpapertronics.com and we will respond within one month. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
  ]],
  ["Changes", [
    "We update this notice when the way we handle personal data changes. The date above shows the current version.",
  ]],
];

const body = SECTIONS.flatMap(([heading, paragraphs]) => [
  block("h2", heading),
  ...paragraphs.map((p) => block("normal", p)),
]);

const DOCS = [
  { _id: "privacy-en", language: "en", title: "Privacy Notice", body },
  { _id: "privacy-nl", language: "nl", title: "Privacyverklaring" },
  { _id: "privacy-pl", language: "pl", title: "Polityka prywatności" },
];

const commit = process.argv.includes("--commit");

for (const d of DOCS) {
  const doc = { _type: "privacyPage", updated: "2026-09-07", ...d };
  console.log(`${doc._id}: ${doc.title}${doc.body ? ` (${doc.body.length} blocks)` : " (empty body -> falls back to EN)"}`);
  if (commit) {
    await client.createOrReplace(doc);
  }
}

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
