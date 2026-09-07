// Plan B2 + B4 — collapse the duplicated home sections in Sanity to match the
// restructured template (audit ch. 5, copy deck "PROPOSED WEBSITE COPY (EN)").
//
// B2: "Q-Tector statement" + "Why it matters" were two blocks making the same
//     promise, plus five near-identical cards. Now one section, four cards.
//     `intro` keeps only the brand paragraph, which renders inside it.
// B4: "Data & analytics" + "How we work" + "Customer success" told the same
//     story three times. Now one section: three stage columns, a closing line,
//     then a four-step collaboration flow and a "Discuss a pilot" CTA.
//
// This migration is REQUIRED, not cosmetic: the flow needs four steps and the
// dataset holds three. (sanity/lib/home.ts now pads short arrays from the EN
// fallback so a stale dataset degrades instead of throwing, but the copy would
// be a mix of old and new until this runs.)
//
// EN is the copy deck verbatim; NL and PL are translations of it.
//
// Usage: node scripts/patch-home-merge-sections.mjs            (dry run)
//        node scripts/patch-home-merge-sections.mjs --commit   (write)
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

const card = (title, text) => ({ _type: "card", _key: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24), title, text });
const col = (num, title, text) => ({ _type: "col", _key: `s${num}`, num, title, text });

const PATCH = {
  "home-en": {
    "benefits.heading": "Measure during the run,",
    "benefits.headingAccent": "not after the opportunity to act.",
    "benefits.subtitle": "Biological processes can change faster than laboratory feedback arrives.",
    "benefits.leadPre": "Q‑Tector brings guided testing close to the fermenter, bioreactor or production line, ",
    "benefits.leadAccent": "giving teams process-relevant results while a run is still active",
    "benefits.leadPost": ".",
    "benefits.cards": [
      card("Optimise media and feeds", "Compare substrate consumption across strains, media and feed strategies."),
      card("Transfer knowledge across scale", "Use one repeatable measurement workflow from development to pilot and production."),
      card("Investigate deviations sooner", "Add process data while there is still time to understand and respond."),
      card("Build comparable process histories", "Store, trend and export results across experiments, runs and batches."),
    ],
    "lifecycle.heading": "One measurement workflow",
    "lifecycle.headingAccent": "from first experiment to production",
    "lifecycle.cols": [
      col("01", "R&D - Learn", "Compare strains, media and conditions with frequent measurements."),
      col("02", "Pilot - Validate", "Test the workflow on representative runs and define how results support process decisions."),
      col("03", "Production - Standardise", "Use the validated routine to monitor trends, compare batches and support troubleshooting."),
    ],
    "lifecycle.closing": "Each result becomes part of structured process data that can be reviewed, compared and exported.",
    "howWeWork.heading": "Start with your process question",
    "howWeWork.steps": [
      col("01", "Define the question", "Define the organism, matrix, analyte and decision."),
      col("02", "Assess the fit", "Assess assay and workflow fit."),
      col("03", "Validate the method", "Validate the method on real samples and runs."),
      col("04", "Move into routine use", "Move the workflow into routine use."),
    ],
    "howWeWork.cta": "Discuss a pilot",
  },
  "home-nl": {
    "benefits.heading": "Meet tijdens de run,",
    "benefits.headingAccent": "niet nadat het moment om te handelen voorbij is.",
    "benefits.subtitle": "Biologische processen kunnen sneller veranderen dan laboratoriumfeedback arriveert.",
    "benefits.leadPre": "Q‑Tector brengt begeleide metingen dicht bij de fermentor, bioreactor of productielijn, ",
    "benefits.leadAccent": "zodat teams procesrelevante resultaten krijgen terwijl een run nog loopt",
    "benefits.leadPost": ".",
    "benefits.cards": [
      card("Optimaliseer media en voeding", "Vergelijk substraatverbruik tussen stammen, media en voedingsstrategieën."),
      card("Draag kennis over tussen schaalniveaus", "Gebruik één herhaalbare meetworkflow van ontwikkeling naar pilot en productie."),
      card("Onderzoek afwijkingen eerder", "Voeg procesdata toe zolang er nog tijd is om te begrijpen en te reageren."),
      card("Bouw vergelijkbare processhistories op", "Sla resultaten op, volg trends en exporteer ze over experimenten, runs en batches."),
    ],
    "lifecycle.heading": "Één meetworkflow",
    "lifecycle.headingAccent": "van eerste experiment tot productie",
    "lifecycle.cols": [
      col("01", "R&D - Leren", "Vergelijk stammen, media en condities met frequente metingen."),
      col("02", "Pilot - Valideren", "Test de workflow op representatieve runs en bepaal hoe resultaten procesbeslissingen ondersteunen."),
      col("03", "Productie - Standaardiseren", "Gebruik de gevalideerde routine om trends te monitoren, batches te vergelijken en troubleshooting te ondersteunen."),
    ],
    "lifecycle.closing": "Elk resultaat wordt onderdeel van gestructureerde procesdata die kan worden bekeken, vergeleken en geëxporteerd.",
    "howWeWork.heading": "Begin met uw procesvraag",
    "howWeWork.steps": [
      col("01", "Definieer de vraag", "Definieer het organisme, de matrix, de analyt en de beslissing."),
      col("02", "Beoordeel de fit", "Beoordeel of assay en workflow passen."),
      col("03", "Valideer de methode", "Valideer de methode op echte monsters en runs."),
      col("04", "Ga over op routinegebruik", "Breng de workflow naar routinematig gebruik."),
    ],
    "howWeWork.cta": "Bespreek een pilot",
  },
  "home-pl": {
    "benefits.heading": "Mierz w trakcie przebiegu,",
    "benefits.headingAccent": "nie po tym, jak minie moment na reakcję.",
    "benefits.subtitle": "Procesy biologiczne mogą zmieniać się szybciej, niż docierają wyniki z laboratorium.",
    "benefits.leadPre": "Q‑Tector przybliża prowadzone pomiary do fermentora, bioreaktora lub linii produkcyjnej, ",
    "benefits.leadAccent": "dzięki czemu zespoły otrzymują istotne procesowo wyniki, gdy przebieg jeszcze trwa",
    "benefits.leadPost": ".",
    "benefits.cards": [
      card("Optymalizuj podłoża i zasilanie", "Porównuj zużycie substratu między szczepami, podłożami i strategiami zasilania."),
      card("Przenoś wiedzę między skalami", "Korzystaj z jednego powtarzalnego workflow pomiarowego - od rozwoju przez pilotaż do produkcji."),
      card("Badaj odchylenia szybciej", "Dodawaj dane procesowe, póki jest jeszcze czas, by zrozumieć je i zareagować."),
      card("Buduj porównywalne historie procesu", "Zapisuj wyniki, analizuj trendy i eksportuj je z eksperymentów, przebiegów i partii."),
    ],
    "lifecycle.heading": "Jedno workflow pomiarowe",
    "lifecycle.headingAccent": "od pierwszego eksperymentu do produkcji",
    "lifecycle.cols": [
      col("01", "R&D - Nauka", "Porównuj szczepy, podłoża i warunki dzięki częstym pomiarom."),
      col("02", "Pilotaż - Walidacja", "Przetestuj workflow na reprezentatywnych przebiegach i określ, jak wyniki wspierają decyzje procesowe."),
      col("03", "Produkcja - Standaryzacja", "Wykorzystuj zwalidowaną rutynę do monitorowania trendów, porównywania partii i wsparcia diagnostyki."),
    ],
    "lifecycle.closing": "Każdy wynik staje się częścią ustrukturyzowanych danych procesowych, które można przeglądać, porównywać i eksportować.",
    "howWeWork.heading": "Zacznij od swojego pytania procesowego",
    "howWeWork.steps": [
      col("01", "Zdefiniuj pytanie", "Określ organizm, matrycę, analit i decyzję."),
      col("02", "Oceń dopasowanie", "Oceń dopasowanie assayu i workflow."),
      col("03", "Zwaliduj metodę", "Zwaliduj metodę na rzeczywistych próbkach i przebiegach."),
      col("04", "Przejdź do rutynowego użycia", "Wprowadź workflow do rutynowego użycia."),
    ],
    "howWeWork.cta": "Omów pilotaż",
  },
};

// Fields whose sections no longer exist, plus the badges and the how-we-work
// banner image, none of which the template ever rendered.
const UNSET = [
  "intro.heading",
  "intro.headingAccent",
  "benefits.badge",
  "lifecycle.badge",
  "lifecycle.subtitle",
  "howWeWork.headingAccent",
  "howWeWork.subtitle",
  "howWeWork.successEyebrow",
  "howWeWork.successHeading",
  "howWeWork.successBody",
  "images.banner",
];

function at(doc, p) {
  return p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), doc);
}
const brief = (v) =>
  Array.isArray(v)
    ? `[${v.length}] ${v.map((x) => x?.title ?? x).join(" · ")}`
    : String(v);

const docs = await client.fetch(`*[_type=="homePage"]{_id, language, intro, benefits, lifecycle, howWeWork, images}`);
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
    if (JSON.stringify(before) === JSON.stringify(v)) continue;
    changes++;
    console.log(`  ${p}\n    - ${brief(before)}\n    + ${brief(v)}`);
  }
  for (const p of UNSET) {
    if (at(doc, p) === undefined) continue;
    changes++;
    console.log(`  ${p}  → unset (was: ${brief(at(doc, p)).slice(0, 60)})`);
  }
  tx.patch(id, { set: next, unset: UNSET });
}

if (!changes) {
  console.log("\nNothing to change — the dataset already matches the template.");
} else if (!commit) {
  console.log(`\n${changes} field(s) to change. Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} field(s). The public client uses useCdn:true + revalidate=300, so the live page lags briefly.`);
}
