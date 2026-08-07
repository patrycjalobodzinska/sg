// Complete the siteSettings singleton: fix PL diacritics, add localized nav-CTA
// label, a "Connect" footer column, copyright line and legal links. Nav + first
// two footer columns + tagline were already seeded (field-level i18n).
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
const token = process.env.SANITY_API_WRITE_TOKEN;
const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2025-02-19", token, useCdn: false });

// internationalized-array value builder
const i18n = (en, nl, pl) => [
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
  { _key: "nl", _type: "internationalizedArrayStringValue", value: nl },
  { _key: "pl", _type: "internationalizedArrayStringValue", value: pl },
];
const flink = (key, href, en, nl, pl) => ({ _key: key, _type: "footerLink", href, label: i18n(en, nl, pl) });

const id = "siteSettings";
const doc = await client.getDocument(id);
if (!doc) throw new Error("siteSettings doc not found");

// 1) fix PL diacritics on nav (Aktualnosci -> Aktualności) and tagline
const nav = (doc.nav || []).map((item) => ({
  ...item,
  label: (item.label || []).map((v) => (v._key === "pl" && v.value === "Aktualnosci" ? { ...v, value: "Aktualności" } : v)),
}));
const footerTagline = i18n(
  "Actionable process data for biotech & fermentation - powered by Q‑Tector.",
  "Bruikbare procesdata voor biotech & fermentatie - mogelijk gemaakt door Q‑Tector.",
  "Użyteczne dane procesowe dla biotechnologii i fermentacji - napędzane przez Q‑Tector."
);

// 2) fix any ASCII-Polish already in footer columns, then append the Connect column
const fixPl = (arr) => (arr || []).map((v) => {
  if (v._key !== "pl") return v;
  const map = { Aktualnosci: "Aktualności", Odkryj: "Odkryj" };
  return map[v.value] ? { ...v, value: map[v.value] } : v;
});
const footerColumns = (doc.footerColumns || []).map((col) => ({
  ...col,
  title: fixPl(col.title),
  links: (col.links || []).map((l) => ({ ...l, label: fixPl(l.label) })),
}));
if (!footerColumns.some((c) => c._key === "connect")) {
  footerColumns.push({
    _key: "connect",
    _type: "footerColumn",
    title: i18n("Connect", "Verbinden", "Kontakt"),
    links: [
      flink("web", "https://testmybeer.com", "testmybeer.com", "testmybeer.com", "testmybeer.com"),
      flink("mail", "mailto:contact@sgpapertronics.com", "Email", "E-mail", "E-mail"),
      flink("li", "/#top", "LinkedIn", "LinkedIn", "LinkedIn"),
    ],
  });
}

await client
  .patch(id)
  .set({
    nav,
    footerTagline,
    footerColumns,
    navCtaLabel: i18n("Talk to us", "Neem contact op", "Napisz do nas"),
    footerCopyright: i18n(
      "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
      "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
      "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL."
    ),
    legalLinks: [
      { _key: "privacy", _type: "legalLink", href: "/#top", label: i18n("Privacy", "Privacy", "Prywatność") },
      { _key: "terms", _type: "legalLink", href: "/#top", label: i18n("Terms", "Voorwaarden", "Regulamin") },
    ],
  })
  .commit();
console.log("siteSettings patched (nav diacritics, navCtaLabel, Connect column, copyright, legalLinks).");
