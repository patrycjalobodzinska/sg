// Audit ch. 14 + ch. 9 — "process control" was still live on Investors.
//
// The claim register bans the phrase wherever it describes what the company or
// the device does; the earlier sweep only covered the code, and the Investors
// hero and mission line live in Sanity. Both said "process control" in EN, NL
// and PL. The hero now uses the audit's own ch. 9 heading, and the mission line
// matches the mission agreed in ch. 3.
//
// Usage: node scripts/patch-investors-claims.mjs            (dry run)
//        node scripts/patch-investors-claims.mjs --commit   (write)
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
    "hero.title": "Building the accessible process-analytics layer",
    "hero.titleAccent": "for biological manufacturing",
    "mission.heading": "Make frequent, actionable process measurement practical",
    "mission.headingAccent": "for every team developing and manufacturing with biology",
    marketHeading: "Process measurement is becoming a bottleneck for biological production",
    "problem.body": "Without frequent process data, teams may only discover deviations after a batch is finished. Q‑Tector helps teams move from delayed analysis to at-line measurement that supports process decisions.",
    "whyNow.heading": "Biological production is scaling - process measurement isn't keeping up",
  },
  nl: {
    "hero.title": "Wij bouwen de toegankelijke procesanalytische laag",
    "hero.titleAccent": "voor biologische productie",
    "mission.heading": "Frequent en bruikbaar procesmeten praktisch maken",
    "mission.headingAccent": "voor elk team dat met biologie ontwikkelt en produceert",
    marketHeading: "Procesmeten wordt een knelpunt voor biologische productie",
    "problem.body": "Zonder frequente procesdata ontdekken teams afwijkingen pas na afloop van een batch. Q‑Tector helpt teams van vertraagde analyse naar at-line metingen die procesbeslissingen ondersteunen.",
    "whyNow.heading": "Biologische productie schaalt op - procesmeten houdt geen gelijke tred",
  },
  pl: {
    "hero.title": "Budujemy dostępną warstwę analityki procesowej",
    "hero.titleAccent": "dla produkcji biologicznej",
    "mission.heading": "Uczynić częsty, użyteczny pomiar procesu praktycznym",
    "mission.headingAccent": "dla każdego zespołu, który rozwija i produkuje z użyciem biologii",
    marketHeading: "Pomiar procesu staje się wąskim gardłem produkcji biologicznej",
    "problem.body": "Bez częstych danych procesowych zespoły wykrywają odchylenia dopiero po zakończeniu serii. Q‑Tector przenosi je z opóźnionej analizy do pomiaru at-line, który wspiera decyzje procesowe.",
    "whyNow.heading": "Produkcja biologiczna się skaluje - pomiar procesu nie nadąża",
  },
};

const commit = process.argv.includes("--commit");
for (const [lang, fields] of Object.entries(CONTENT)) {
  const id = `investors-${lang}`;
  console.log(`\n${id}`);
  for (const [k, v] of Object.entries(fields)) console.log(`  ${k}: ${v}`);
  if (commit) await client.patch(id).set(fields).commit();
}
console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
