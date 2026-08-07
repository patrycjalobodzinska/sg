import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";

import { projectId, dataset, apiVersion } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { languages } from "./sanity/lib/i18n";

const supportedLanguages = languages.map((l) => ({ id: l.id, title: l.title }));

// Document types translated at the document level (must exist in the schema).
const i18nDocumentTypes = [
  "homePage",
  "technologyPage",
  "applicationsPage",
  "investorsPage",
  "aboutPage",
  "newsArticle",
  "caseStudy",
];

export default defineConfig({
  name: "default",
  title: "SG Papertronics",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: i18nDocumentTypes,
    }),
    internationalizedArray({
      languages: supportedLanguages,
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text"],
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
