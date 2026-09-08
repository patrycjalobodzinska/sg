// Audit ch. 8 — the About hero copy.
//
// The page opened with "About SG Papertronics" and a paragraph borrowed from the
// positioning statement (ch. 3). The audit gives this page its own headline,
// paragraph and CTA; ch. 3's positioning says nearly the same thing and now lives
// where it belongs - in the page description and on the mission band.
//
//   headline -> "We bring practical process analytics closer to biological production."
//   body     -> the audit's paragraph, verbatim
//   CTA      -> "Meet Q‑Tector" (technology), with "Talk to us" as the secondary
//
// Usage: node scripts/patch-about-hero.mjs            (dry run)
//        node scripts/patch-about-hero.mjs --commit   (write)
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
    "hero.title": "We bring practical process analytics",
    "hero.titleAccent": "closer to biological production.",
    "hero.lead":
      "SG Papertronics develops compact analytical technology for teams working with fermentation, biotech and other living processes. Our Q‑Tector platform combines guided at-line assays with connected data so teams can learn earlier, act sooner and scale with clearer evidence.",
    "hero.primaryCta.label": "Meet Q‑Tector",
    "hero.secondaryCta.label": "Talk to us",
    "hero.imageCaption": "The team · Groningen",
  },
  nl: {
    "hero.title": "Wij brengen praktische procesanalytiek",
    "hero.titleAccent": "dichter bij biologische productie.",
    "hero.lead":
      "SG Papertronics ontwikkelt compacte analytische technologie voor teams die werken met fermentatie, biotech en andere levende processen. Ons Q‑Tector-platform combineert begeleide at-line assays met verbonden data, zodat teams eerder leren, sneller handelen en opschalen met duidelijker bewijs.",
    "hero.primaryCta.label": "Maak kennis met Q‑Tector",
    "hero.secondaryCta.label": "Neem contact op",
    "hero.imageCaption": "Het team · Groningen",
  },
  pl: {
    "hero.title": "Przybliżamy praktyczną analitykę procesową",
    "hero.titleAccent": "do produkcji biologicznej.",
    "hero.lead":
      "SG Papertronics tworzy kompaktową technologię analityczną dla zespołów pracujących z fermentacją, biotechnologią i innymi żywymi procesami. Nasza platforma Q‑Tector łączy prowadzone assaye at-line z połączonymi danymi, dzięki czemu zespoły uczą się wcześniej, działają szybciej i skalują na mocniejszych dowodach.",
    "hero.primaryCta.label": "Poznaj Q‑Tector",
    "hero.secondaryCta.label": "Napisz do nas",
    "hero.imageCaption": "Zespół · Groningen",
  },
};

const commit = process.argv.includes("--commit");
for (const [lang, fields] of Object.entries(CONTENT)) {
  console.log(`\nabout-${lang}`);
  for (const [k, v] of Object.entries(fields)) console.log(`  ${k}: ${v.slice(0, 90)}${v.length > 90 ? "…" : ""}`);
  if (commit) await client.patch(`about-${lang}`).set(fields).commit();
}
console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
