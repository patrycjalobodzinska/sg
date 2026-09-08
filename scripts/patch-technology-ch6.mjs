// Audit ch. 6 — Technology page, everything that does not need client data.
//
//   · hero      -> the audit's platform paragraph; the second, redundant
//                  paragraph is dropped
//   · focus     -> "Current glucose and sucrose workflows". The old heading
//                  ("Quick glucose & sucrose monitoring") carried an informal
//                  speed claim, and the old body promised "additional sugars and
//                  metabolites on request" — ch. 14 allows only "can be evaluated
//                  for co-development"
//   · step 05   -> "release" removed as a decision type. Release decisions need a
//                  confirmed intended use and validation we do not claim (ch. 6,
//                  ch. 14). It was live in all three locales.
//
// Still missing after this, and blocked on the client: the technical
// specification table (analyte x matrix x status x intended use, range, CV,
// sample volume, time to result, prep, throughput, calibration, data export).
//
// Usage: node scripts/patch-technology-ch6.mjs            (dry run)
//        node scripts/patch-technology-ch6.mjs --commit   (write)
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

const CONTENT = {
  en: {
    "hero.body1":
      "Q‑Tector combines a compact reader, ready-to-use assay pods, QR-guided instructions and connected result storage. Run process-relevant measurements close to your fermenter or bioreactor - without waiting for a central laboratory.",
    "focus.heading": "Current glucose and sucrose workflows",
    "focus.body":
      "Q‑Tector is currently focused on glucose and sucrose monitoring in culture media. Typical applications include fermentation development, media optimisation, feed-strategy work and production monitoring.",
    "steps[4].text":
      "Use the result to support feeding, process timing, formulation, stabilisation or troubleshooting decisions.",
  },
  nl: {
    "hero.body1":
      "Q‑Tector combineert een compacte reader, kant-en-klare assay-pods, QR-gestuurde instructies en verbonden opslag van resultaten. Voer procesrelevante metingen uit dicht bij uw fermentor of bioreactor - zonder te wachten op een centraal laboratorium.",
    "focus.heading": "Huidige glucose- en sucroseworkflows",
    "focus.body":
      "Q‑Tector richt zich op dit moment op glucose- en sucrosemonitoring in kweekmedia. Typische toepassingen zijn fermentatieontwikkeling, mediaoptimalisatie, voedingsstrategie en productiemonitoring.",
    "steps[4].text":
      "Gebruik het resultaat voor beslissingen over voeding, timing, formulering, stabilisatie of probleemoplossing.",
  },
  pl: {
    "hero.body1":
      "Q‑Tector łączy kompaktowy czytnik, gotowe do użycia pody assay, instrukcje prowadzone kodem QR i połączony zapis wyników. Wykonuj pomiary istotne dla procesu blisko fermentora lub bioreaktora - bez czekania na laboratorium centralne.",
    "focus.heading": "Obecne workflow dla glukozy i sacharozy",
    "focus.body":
      "Q‑Tector koncentruje się obecnie na pomiarze glukozy i sacharozy w podłożach hodowlanych. Typowe zastosowania to rozwój fermentacji, optymalizacja podłoży, praca nad strategią zasilania i monitoring produkcji.",
    "steps[4].text":
      "Wykorzystaj wynik do decyzji o zasilaniu, czasie procesu, formulacji, stabilizacji lub diagnostyce.",
  },
};

const commit = process.argv.includes("--commit");

for (const [lang, fields] of Object.entries(CONTENT)) {
  const id = `technology-${lang}`;
  console.log(`\n${id}`);
  for (const [k, v] of Object.entries(fields)) console.log(`  ${k}: ${v.slice(0, 88)}${v.length > 88 ? "…" : ""}`);
  console.log("  hero.body2: (unset)");
  if (commit) await client.patch(id).set(fields).unset(["hero.body2"]).commit();
}

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
