import type { SchemaTypeDefinition } from "sanity";
import { seo, ctaButton, imageWithAlt } from "./objects";
import { author, partner, caseStudy, newsArticle } from "./documents";
import { siteSettings } from "./siteSettings";
import { homePage, technologyPage, applicationsPage, investorsPage, aboutPage } from "./pages";

export const schemaTypes: SchemaTypeDefinition[] = [
  // shared objects
  seo,
  ctaButton,
  imageWithAlt,
  // singletons
  siteSettings,
  // page singletons
  homePage,
  technologyPage,
  applicationsPage,
  investorsPage,
  aboutPage,
  // collections
  newsArticle,
  caseStudy,
  partner,
  author,
];
