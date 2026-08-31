// Patch the hero + intro blocks of the three homePage documents with the audit's
// P0 copy (SG_Papertronics_website_audit_and_copy_recommendations.docx, ch. 2 and
// ch. 5). EN is the audit copy deck verbatim; NL/PL are translations of it.
//
// Only `hero.*` and `intro.brand` are touched — the intro heading and every other
// section keep whatever is already in Sanity.
//
// Deliberately NOT included (audit ch. 14, "Warunek publikacji"): the
// "Results in under five minutes / No user calibration required" claim, which may
// only be published once the client confirms it per supported assay.
//
// Usage: node scripts/patch-home-hero.mjs            (dry run)
//        node scripts/patch-home-hero.mjs --commit   (write)
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

const PATCH = {
  "home-en": {
    hero: {
      eyebrow: "At-line analytics for biological processes",
      titleLead: "Know what is happening in your process",
      titleAccent: "— while you can still act.",
      subtitle:
        "Q‑Tector combines ready-to-use assay pods, a compact reader and guided digital workflows to generate comparable glucose and sucrose results close to the fermenter or bioreactor. Use the data to compare runs, refine feed strategies and carry process knowledge from R&D to production.",
      focus: "Current analytical focus: glucose and sucrose in culture media",
      cta1: "See how Q‑Tector works",
      cta2: "Discuss your process",
    },
    brand:
      "SG Papertronics develops Q‑Tector, a compact at-line analytics platform for biological processes. Beer‑o‑Meter is the first commercial application built on Q‑Tector technology. We also work with industry partners to develop and validate new assay workflows for specific analytes and sample matrices.",
  },
  "home-nl": {
    hero: {
      eyebrow: "At-line analyse voor biologische processen",
      titleLead: "Weet wat er in uw proces gebeurt",
      titleAccent: "— terwijl u nog kunt ingrijpen.",
      subtitle:
        "Q‑Tector combineert kant-en-klare assay pods, een compacte reader en begeleide digitale workflows om vergelijkbare glucose- en sucroseresultaten te genereren, dicht bij de fermentor of bioreactor. Gebruik de data om runs te vergelijken, voedingsstrategieën te verfijnen en proceskennis van R&D naar productie mee te nemen.",
      focus: "Huidige analytische focus: glucose en sucrose in cultuurmedia",
      cta1: "Bekijk hoe Q‑Tector werkt",
      cta2: "Bespreek uw proces",
    },
    brand:
      "SG Papertronics ontwikkelt Q‑Tector, een compact at-line analyseplatform voor biologische processen. Beer‑o‑Meter is de eerste commerciële toepassing die op Q‑Tector-technologie is gebouwd. Daarnaast werken we samen met industriële partners om nieuwe assay-workflows te ontwikkelen en te valideren voor specifieke analyten en monstermatrices.",
  },
  "home-pl": {
    hero: {
      eyebrow: "Analityka at-line dla procesów biologicznych",
      titleLead: "Wiedz, co dzieje się w Twoim procesie",
      titleAccent: "— gdy jeszcze możesz zareagować.",
      subtitle:
        "Q‑Tector łączy gotowe do użycia assay pody, kompaktowy czytnik i prowadzone cyfrowe workflow, aby uzyskiwać porównywalne wyniki glukozy i sacharozy blisko fermentora lub bioreaktora. Wykorzystaj te dane, by porównywać przebiegi, dopracowywać strategie zasilania i przenosić wiedzę procesową z R&D do produkcji.",
      focus: "Obecny zakres analityczny: glukoza i sacharoza w podłożach hodowlanych",
      cta1: "Zobacz, jak działa Q‑Tector",
      cta2: "Omów swój proces",
    },
    brand:
      "SG Papertronics rozwija Q‑Tector — kompaktową platformę analityki at-line dla procesów biologicznych. Beer‑o‑Meter to pierwsze komercyjne zastosowanie zbudowane na technologii Q‑Tector. Współpracujemy również z partnerami przemysłowymi, aby opracowywać i walidować nowe workflow assayów dla konkretnych analitów i matryc próbek.",
  },
};

const commit = process.argv.includes("--commit");
const docs = await client.fetch(`*[_type=="homePage"]{_id, language, hero, intro}`);
const byId = new Map(docs.map((d) => [d._id, d]));

const tx = client.transaction();
for (const [id, next] of Object.entries(PATCH)) {
  const doc = byId.get(id);
  if (!doc) throw new Error(`Missing homePage document: ${id}`);
  console.log(`\n── ${id} (${doc.language})`);
  for (const [k, v] of Object.entries(next.hero)) {
    const before = doc.hero?.[k];
    if (before !== v) console.log(`  hero.${k}\n    - ${before ?? "(none)"}\n    + ${v}`);
  }
  if (doc.intro?.brand !== next.brand) console.log(`  intro.brand\n    - ${doc.intro?.brand ?? "(none)"}\n    + ${next.brand}`);
  tx.patch(id, {
    set: {
      // hero keeps no other fields, so a whole-object set is safe and complete
      hero: next.hero,
      "intro.brand": next.brand,
    },
  });
}

if (!commit) {
  console.log("\nDry run. Re-run with --commit to write.");
} else {
  await tx.commit();
  console.log("\nCommitted. Note: the public client uses useCdn:true + revalidate=300, so the live page lags briefly.");
}
