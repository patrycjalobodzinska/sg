// Mirror the claim register (app/_components/claims.ts) into the three homePage
// documents. The code literals are only the EN fallback — Sanity is what the
// live site renders, so a claim fixed in code alone stays published in NL/PL.
//
// Audit ch. 14 ("Warunek publikacji"), plan item A1:
//   · "see the change as it happens"        → change is seen during the run,
//                                             not live (at-line, not online)
//   · "scalable process intelligence"       → "structured process data" (B4)
//   · "Trusted by"                          → relationship not asserted (B5)
//   · "process control" as a device promise → "process monitoring" /
//                                             "at-line measurement"
//   · explore.trust2                        → unset; carried the unconfirmed
//                                             "<5 min · zero calibration" claim
//                                             (B1/B2). The field is not rendered
//                                             anywhere, but an editor could
//                                             surface it, so it goes.
//
// Still deliberately NOT published: BLOCKED.speedAndCalibration in claims.ts.
//
// "process control" survives only in the company mission on /about, where it
// names an ambition rather than a device capability.
//
// Usage: node scripts/patch-claim-register.mjs            (dry run)
//        node scripts/patch-claim-register.mjs --commit   (write)
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

// Headings are two-tone (heading + headingAccent), so the replacements are
// split to keep each locale's grammar intact.
const PATCH = {
  "home-en": {
    "benefits.subtitle":
      "Q‑Tector brings guided at-line measurement closer to your process - so teams see what is changing during the run.",
    "lifecycle.headingAccent": "structured process data",
    "lifecycle.cols[0].text":
      "Understand the process and the goals you're chasing - then we propose a customised at-line measurement setup to test.",
    "howWeWork.headingAccent": "process monitoring",
    "partners.heading": "Selected customers",
    "partners.headingAccent": "and research collaborators",
    "seo.title": "SG Papertronics - At-line process monitoring for biotech and fermentation",
  },
  "home-nl": {
    "benefits.subtitle":
      "Q‑Tector brengt begeleide at-line metingen dichter bij uw proces - zodat teams zien wat er tijdens de run verandert.",
    "lifecycle.headingAccent": "gestructureerde procesdata",
    "lifecycle.cols[0].text":
      "Begrijp het proces en de doelen die u nastreeft - vervolgens stellen wij een op maat gemaakte at-line meetopzet voor om te testen.",
    "howWeWork.headingAccent": "procesmonitoring",
    "partners.heading": "Geselecteerde klanten",
    "partners.headingAccent": "en onderzoekspartners",
    "seo.title": "SG Papertronics - At-line procesmonitoring voor biotech en fermentatie",
  },
  "home-pl": {
    "benefits.subtitle":
      "Q‑Tector przybliża prowadzone pomiary at-line do Twojego procesu - dzięki czemu zespoły widzą, co zmienia się w trakcie przebiegu.",
    "lifecycle.headingAccent": "ustrukturyzowanych danych procesowych",
    "lifecycle.cols[0].text":
      "Zrozum proces i cele, do których dążysz - następnie zaproponujemy dopasowaną konfigurację pomiarów at-line do przetestowania.",
    "howWeWork.headingAccent": "monitorowaniu procesów",
    "partners.heading": "Wybrani klienci",
    "partners.headingAccent": "i partnerzy naukowi",
    "seo.title": "SG Papertronics - Monitorowanie procesów at-line dla biotechnologii i fermentacji",
  },
};

const UNSET = ["explore.trust2"];

/** Read a dotted/indexed path like "lifecycle.cols[0].text" off a document. */
function at(doc, p) {
  return p
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((o, k) => (o == null ? undefined : o[k]), doc);
}

const docs = await client.fetch(`*[_type=="homePage"]{_id, language, benefits, lifecycle, howWeWork, partners, seo, explore}`);
const byId = new Map(docs.map((d) => [d._id, d]));

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;

for (const [id, next] of Object.entries(PATCH)) {
  const doc = byId.get(id);
  if (!doc) throw new Error(`Missing homePage document: ${id}`);
  console.log(`\n── ${id} (${doc.language})`);
  for (const [p, v] of Object.entries(next)) {
    const before = at(doc, p);
    if (before === v) continue;
    changes++;
    console.log(`  ${p}\n    - ${before ?? "(none)"}\n    + ${v}`);
  }
  for (const p of UNSET) {
    if (at(doc, p) === undefined) continue;
    changes++;
    console.log(`  ${p}\n    - ${at(doc, p)}\n    + (unset)`);
  }
  tx.patch(id, { set: next, unset: UNSET });
}

if (!changes) {
  console.log("\nNothing to change — the dataset already matches the register.");
} else if (!commit) {
  console.log(`\n${changes} field(s) to change. Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} field(s). The public client uses useCdn:true + revalidate=300, so the live page lags briefly.`);
}
