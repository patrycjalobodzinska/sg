// Team changes: Ruby, Hubert and Anna Maria Lis come off the About page.
//
// Only the references on about-{en,nl,pl} are removed. The three teamMember
// documents stay in the Studio, unlisted: nothing renders them once they are
// off the page, and keeping them means a mistake here is one drag away from
// being undone. Delete them in the Studio when you are sure.
//
// Alex takes Ruby's place (R&D Scientist) and is added in the Studio, since we
// hold neither the full name nor a portrait.
//
// Usage: node scripts/update-team.mjs            (dry run)
//        node scripts/update-team.mjs --commit   (write)
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

const DROP = ["teamMember-ruby", "teamMember-hubert", "teamMember-anna"];
const commit = process.argv.includes("--commit");

for (const lang of ["en", "nl", "pl"]) {
  const id = `about-${lang}`;
  const team = (await client.fetch(`*[_id==$id][0].team`, { id })) ?? [];
  const kept = team.filter((r) => !DROP.includes(r._ref));
  console.log(`${id}: ${team.length} -> ${kept.length} (${team.length - kept.length} removed)`);
  if (commit) await client.patch(id).set({ team: kept }).commit();
}

console.log(commit ? "\nWritten." : "\nDry run. Re-run with --commit to write.");
