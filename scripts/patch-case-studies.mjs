// Audit ch. 7 — case studies get their own pages.
//
// The audit asks every story to state: problem, analyte, sample matrix,
// workflow, measurable result, project status, partner and next milestone, and
// to be reachable by a link. The schema now carries all of it; this script
//   1. gives the three existing case studies a slug, so each has a page,
//   2. fills the Beer-o-Meter story with the facts we can state today - no
//      numbers, no status, no quote: those are the client's to supply,
//   3. creates ONE fully filled example as a Sanity *draft*, so the client can
//      see every section populated in the Studio without a word of invented
//      copy ever reaching the public site.
//
// Usage: node scripts/patch-case-studies.mjs            (dry run)
//        node scripts/patch-case-studies.mjs --commit   (write)
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

const commit = process.argv.includes("--commit");
const slug = (current) => ({ _type: "slug", current });

// 1 + 3. Slugs and the read-more link for every existing case study.
const SLUGS = { beer: "beer-o-meter", ferment: "media-and-feed-monitoring", agri: "potatosense" };

for (const [key, value] of Object.entries(SLUGS)) {
  for (const lang of ["en", "nl", "pl"]) {
    const id = `caseStudy-${key}-${lang}`;
    console.log(`${id}: slug=${value}, link=/case-studies/${value}`);
    if (commit) await client.patch(id).set({ slug: slug(value), link: `/case-studies/${value}` }).commit();
  }
}

// 2. Beer-o-Meter: only what is true today. Status, result, quote and next
//    milestone stay empty until the client fills them in.
const BEER = {
  en: {
    problem: "A brewery needs to know where a fermentation stands while it is still running. Sending samples to an external laboratory answers the question after the decision has been made.",
    analyte: "Sugars",
    sampleMatrix: "Wort and beer",
    workflow: "An operator draws a small sample at the tank, runs a ready-to-use assay pod through the guided workflow, and the result is added to the batch history.",
    relationship: "Commercial application",
  },
  nl: {
    problem: "Een brouwerij wil weten waar een fermentatie staat terwijl die nog loopt. Monsters naar een extern laboratorium sturen geeft pas antwoord nadat de beslissing al genomen is.",
    analyte: "Suikers",
    sampleMatrix: "Wort en bier",
    workflow: "Een operator neemt een klein monster bij de tank, doorloopt met een kant-en-klare assay-pod de begeleide workflow, en het resultaat wordt aan de batchhistorie toegevoegd.",
    relationship: "Commerciële toepassing",
  },
  pl: {
    problem: "Browar potrzebuje wiedzieć, na jakim etapie jest fermentacja, gdy ta jeszcze trwa. Wysyłka próbek do laboratorium zewnętrznego daje odpowiedź już po podjęciu decyzji.",
    analyte: "Cukry",
    sampleMatrix: "Brzeczka i piwo",
    workflow: "Operator pobiera małą próbkę przy tanku, wykonuje gotowy pod assay w prowadzonym przebiegu, a wynik dopisuje się do historii warki.",
    relationship: "Zastosowanie komercyjne",
  },
};

for (const [lang, fields] of Object.entries(BEER)) {
  const id = `caseStudy-beer-${lang}`;
  console.log(`\n${id}: problem / analyte / sampleMatrix / workflow / relationship`);
  if (commit) await client.patch(id).set(fields).commit();
}

// 4. The template. A DRAFT: visible and editable in the Studio, never published,
//    so none of this example copy can reach a visitor by accident.
const TEMPLATE = {
  _id: "drafts.caseStudy-template-en",
  _type: "caseStudy",
  language: "en",
  title: "Example: how a case study should read (replace before publishing)",
  slug: slug("example-case-study"),
  tag: "Precision fermentation",
  relationship: "Pilot partner",
  status: "In validation",
  description:
    "One-paragraph summary shown on the card and under the title: who ran what, and what changed. Keep it to two sentences.",
  problem:
    "State the process question in the customer's words: what decision was being made blind, and what it cost to wait for the laboratory.",
  analyte: "Glucose",
  sampleMatrix: "Aqueous culture medium, fed-batch",
  workflow:
    "How the measurement is actually taken: who draws the sample, how often, which assay pod, where the result lands and who reads it.",
  result:
    "One measurable outcome - example: feed decisions taken during the run instead of the next morning. Replace with a real, agreed figure.",
  quote:
    "One or two sentences from the person who ran the process. Get it approved in writing before publishing.",
  quoteAuthor: "Name, role, company (example)",
  partner: "Partner or customer name, once cleared",
  nextMilestone: "What happens next: extended validation, second site, additional analyte.",
  seo: {
    title: "Example case study - SG Papertronics",
    description: "Template document. Duplicate it, fill in the fields and publish.",
  },
};

console.log(`\n${TEMPLATE._id}: full example, stays a draft (not published)`);
if (commit) await client.createOrReplace(TEMPLATE);

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
