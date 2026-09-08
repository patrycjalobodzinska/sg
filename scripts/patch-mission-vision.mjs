// Audit ch. 3 — mission, vision and positioning.
//
// The site had a mission ("make process control accessible, actionable and
// scalable") but no vision, no positioning statement and no short brand line.
// The audit supplies all of them in English; NL and PL below are translations
// of that copy, kept literal so the client can correct them in the Studio.
//
// Where each piece lands:
//   · positioning statement -> About hero lead
//   · mission               -> About mission band heading (replaces the old
//                              wording, which also carried "process control" —
//                              the phrase ch. 14 wants out of device copy)
//   · vision                -> new block under the mission
//   · short brand line      -> footer tagline (site settings + home doc)
//   · product promise       -> Technology hero lead
//
// Usage: node scripts/patch-mission-vision.mjs            (dry run)
//        node scripts/patch-mission-vision.mjs --commit   (write)
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
  en: {
    "hero.lead":
      "SG Papertronics makes frequent process measurement practical for teams working with biology. Our Q‑Tector platform combines guided at-line assays with connected data, helping teams learn earlier, act during the run and carry process knowledge from development to production.",
    "mission.heading": "To make frequent, actionable process measurement practical",
    "mission.headingAccent": "for every team developing and manufacturing with biology.",
    "mission.visionEyebrow": "Our vision",
    "mission.vision":
      "A future where biological production is guided by timely, comparable data - from the first experiment to every production run.",
  },
  nl: {
    "hero.lead":
      "SG Papertronics maakt frequent procesmeten praktisch voor teams die met biologie werken. Ons Q‑Tector-platform combineert begeleide at-line assays met verbonden data, zodat teams eerder leren, tijdens de run kunnen handelen en proceskennis meenemen van ontwikkeling naar productie.",
    "mission.heading": "Frequent en bruikbaar procesmeten praktisch maken",
    "mission.headingAccent": "voor elk team dat met biologie ontwikkelt en produceert.",
    "mission.visionEyebrow": "Onze visie",
    "mission.vision":
      "Een toekomst waarin biologische productie wordt gestuurd door tijdige, vergelijkbare data - van het eerste experiment tot elke productierun.",
  },
  pl: {
    "hero.lead":
      "SG Papertronics sprawia, że częsty pomiar procesu staje się praktyczny dla zespołów pracujących z biologią. Nasza platforma Q‑Tector łączy prowadzone assaye at-line z połączonymi danymi, dzięki czemu zespoły uczą się wcześniej, działają w trakcie przebiegu i przenoszą wiedzę procesową z rozwoju do produkcji.",
    "mission.heading": "Uczynić częsty, użyteczny pomiar procesu praktycznym",
    "mission.headingAccent": "dla każdego zespołu, który rozwija i produkuje z użyciem biologii.",
    "mission.visionEyebrow": "Nasza wizja",
    "mission.vision":
      "Przyszłość, w której produkcja biologiczna jest prowadzona przez aktualne, porównywalne dane - od pierwszego eksperymentu po każdy przebieg produkcyjny.",
  },
};

const TECHNOLOGY = {
  en: { "hero.lead": "Q‑Tector turns small process samples into comparable results close to the point of work, helping teams act during the run and learn across runs." },
  nl: { "hero.lead": "Q‑Tector zet kleine procesmonsters om in vergelijkbare resultaten dicht bij de werkplek, zodat teams tijdens de run kunnen handelen en over runs heen leren." },
  pl: { "hero.lead": "Q‑Tector zamienia małe próbki procesowe w porównywalne wyniki blisko miejsca pracy, dzięki czemu zespoły działają w trakcie przebiegu i uczą się między przebiegami." },
};

// Short brand line (audit ch. 3) — the footer tagline on every page.
const BRAND_LINE = {
  en: "Practical process analytics for living systems.",
  nl: "Praktische procesanalytiek voor levende systemen.",
  pl: "Praktyczna analityka procesowa dla żywych systemów.",
};

const commit = process.argv.includes("--commit");
const plan = [];

for (const [lang, fields] of Object.entries(ABOUT)) plan.push([`about-${lang}`, fields]);
for (const [lang, fields] of Object.entries(TECHNOLOGY)) plan.push([`technology-${lang}`, fields]);
for (const [lang, line] of Object.entries(BRAND_LINE)) plan.push([`home-${lang}`, { "footer.tagline": line }]);

for (const [id, fields] of plan) {
  console.log(`\n${id}`);
  for (const [k, v] of Object.entries(fields)) console.log(`  ${k}: ${v.slice(0, 90)}${v.length > 90 ? "…" : ""}`);
  if (commit) await client.patch(id).set(fields).commit();
}

// site-wide footer tagline (used by every subpage's footer)
const settings = await client.fetch(`*[_type=="siteSettings"][0]{_id}`);
const tagline = Object.entries(BRAND_LINE).map(([lang, value]) => ({
  _key: lang,
  _type: "internationalizedArrayTextValue",
  value,
}));
console.log(`\nsiteSettings.footerTagline -> "${BRAND_LINE.en}" (+ nl, pl)`);
if (commit) await client.patch(settings._id).set({ footerTagline: tagline }).commit();

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
