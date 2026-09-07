// F/News items 2 and 3 from the audit (ch. 9).
//
//  2. author-job carried the literal name "jobgerjon" — a WordPress author slug
//     that came in through scripts/seed.mjs and was showing publicly under four
//     articles. Nobody's real name is recorded anywhere in the project (the team
//     data is still blocked on the client, D3), so rather than invent one the
//     byline becomes the company. Replace it with the person's name once known.
//
//  3. All six CBC26 documents shared one 236x213 cover — far smaller than the
//     1080x675 the rest use — so the two stories looked like the same post in
//     three languages. cbc26-relationships gives up its cover; the card and the
//     article both handle a missing image (neutral #EEF1F6 panel, and the
//     article drops the hero block and adds top margin instead).
//
// Usage: node scripts/patch-news-author-cover.mjs            (dry run)
//        node scripts/patch-news-author-cover.mjs --commit   (write)
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

const AUTHOR_ID = "author-job";
const AUTHOR_NAME = "SG Papertronics";
const DROP_COVER = [
  "newsArticle-cbc26-relationships-en",
  "newsArticle-cbc26-relationships-nl",
  "newsArticle-cbc26-relationships-pl",
];

const commit = process.argv.includes("--commit");
const tx = client.transaction();
let changes = 0;

const author = await client.fetch(`*[_id==$id][0]{_id, name}`, { id: AUTHOR_ID });
if (!author) throw new Error(`Missing author document: ${AUTHOR_ID}`);
console.log(`\n── ${author._id}`);
if (author.name === AUTHOR_NAME) {
  console.log("  name already set");
} else {
  changes++;
  console.log(`  name\n    - ${author.name}\n    + ${AUTHOR_NAME}`);
  tx.patch(author._id, { set: { name: AUTHOR_NAME } });
}

console.log("\n── duplicate CBC26 cover");
const docs = await client.fetch(`*[_id in $ids]{_id, "img": coverImage.asset._ref}`, { ids: DROP_COVER });
for (const id of DROP_COVER) {
  const d = docs.find((x) => x._id === id);
  if (!d) throw new Error(`Missing document: ${id}`);
  if (!d.img) {
    console.log(`  ${id}  already has no cover`);
    continue;
  }
  changes++;
  console.log(`  ${id}  → unset coverImage (was ${d.img.slice(-22)})`);
  tx.patch(id, { unset: ["coverImage"] });
}

if (!changes) {
  console.log("\nNothing to change — the dataset already matches.");
} else if (!commit) {
  console.log(`\n${changes} change(s). Dry run — re-run with --commit to write.`);
} else {
  await tx.commit();
  console.log(`\nCommitted ${changes} change(s).`);
}
