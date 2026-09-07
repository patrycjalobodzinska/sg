// Plan B3 (audit ch. 5) — the "Explore what we can do" section.
//
// The old headline said nothing, and the team photo beside it said nothing
// about the product. New headline and CTA come from the copy deck, and the
// photo collage is replaced by the flow the audit asks for:
//
//   Sample → Guided assay → Quantitative result → Trend → Process decision
//
// Rendered as a real list with inline icons rather than one flat SVG, so the
// labels stay translatable and a screen reader reads five steps.
//
// The step names are the audit's. The notes paraphrase its own at-line
// definition (ch. 6) and deliberately carry no speed or calibration claim —
// that wording is still blocked (claims.ts BLOCKED, open question B1/B2).
//
// images.collage is unset: those three photos have no slot left on the page.
//
// Usage: node scripts/patch-explore-flow.mjs            (dry run)
//        node scripts/patch-explore-flow.mjs --commit   (write)
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

const step = (num, label, note) => ({ _type: "step", _key: `f${num}`, num, label, note });

const PATCH = {
  "home-en": {
    "explore.heading": "Is Q‑Tector a fit",
    "explore.headingAccent": "for your process?",
    "explore.body":
      "Tell us what you are producing, what you need to measure and which decision the result should support. We will determine whether an existing Q‑Tector workflow fits - or whether an application-development path makes sense.",
    "explore.cta1": "Request a process-fit review",
    "explore.flow": [
      step("01", "Sample", "An operator draws a small sample from the running process."),
      step("02", "Guided assay", "A ready-to-use assay pod, run through QR-guided steps."),
      step("03", "Quantitative result", "A comparable glucose or sucrose value for that sample."),
      step("04", "Trend", "The value joins the run's process history, next to earlier samples."),
      step("05", "Process decision", "Feed, timing or escalation - decided while the run is still active."),
    ],
  },
  "home-nl": {
    "explore.heading": "Past Q‑Tector bij",
    "explore.headingAccent": "uw proces?",
    "explore.body":
      "Vertel ons wat u produceert, wat u moet meten en welke beslissing het resultaat moet ondersteunen. Wij bepalen of een bestaande Q‑Tector-workflow past - of dat een applicatieontwikkelingstraject zinvol is.",
    "explore.cta1": "Vraag een process-fit review aan",
    "explore.flow": [
      step("01", "Monster", "Een operator neemt een klein monster uit het lopende proces."),
      step("02", "Begeleide assay", "Een kant-en-klare assay pod, doorlopen via QR-begeleide stappen."),
      step("03", "Kwantitatief resultaat", "Een vergelijkbare glucose- of sucrosewaarde voor dat monster."),
      step("04", "Trend", "De waarde komt in de processhistorie van de run, naast eerdere monsters."),
      step("05", "Procesbeslissing", "Voeding, timing of escalatie - besloten terwijl de run nog loopt."),
    ],
  },
  "home-pl": {
    "explore.heading": "Czy Q‑Tector pasuje",
    "explore.headingAccent": "do Twojego procesu?",
    "explore.body":
      "Napisz nam, co produkujesz, co musisz mierzyć i jaką decyzję ma wspierać wynik. Ustalimy, czy pasuje istniejące workflow Q‑Tector - czy sensowna jest ścieżka rozwoju zastosowania.",
    "explore.cta1": "Poproś o przegląd dopasowania procesu",
    "explore.flow": [
      step("01", "Próbka", "Operator pobiera małą próbkę z trwającego procesu."),
      step("02", "Prowadzony assay", "Gotowy do użycia assay pod, prowadzony krok po kroku przez kod QR."),
      step("03", "Wynik liczbowy", "Porównywalna wartość glukozy lub sacharozy dla tej próbki."),
      step("04", "Trend", "Wartość dołącza do historii procesu tego przebiegu, obok wcześniejszych próbek."),
      step("05", "Decyzja procesowa", "Zasilanie, czas lub eskalacja - decyzja, gdy przebieg jeszcze trwa."),
    ],
  },
};

const UNSET = ["images.collage", "explore.badge"];

const at = (doc, p) => p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), doc);
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v).sort().map((k) => `${k}:${stable(v[k])}`).join(",")}}`;
  }
  return JSON.stringify(v);
}
const brief = (v) =>
  Array.isArray(v) ? `[${v.length}] ${v.map((x) => x?.label ?? x?.alt ?? "img").join(" → ")}` : String(v);

const docs = await client.fetch(`*[_type=="homePage"]{_id, language, explore, images}`);
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
    if (stable(before) === stable(v)) continue;
    changes++;
    console.log(`  ${p}\n    - ${brief(before)}\n    + ${brief(v)}`);
  }
  for (const p of UNSET) {
    if (at(doc, p) === undefined) continue;
    changes++;
    console.log(`  ${p}  → unset (${brief(at(doc, p))})`);
  }
  tx.patch(id, { set: next, unset: UNSET });
}

if (!changes) {
  console.log("\nNothing to change — the dataset already matches.");
} else if (!commit) {
  console.log(`\n${changes} field(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} field(s).`);
}
