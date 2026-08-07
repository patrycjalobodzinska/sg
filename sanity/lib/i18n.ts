// Supported content languages. English is the default / base language.
export const languages = [
  { id: "en", title: "English" },
  { id: "nl", title: "Nederlands" },
  { id: "pl", title: "Polski" },
] as const;

export type LanguageId = (typeof languages)[number]["id"];

export const baseLanguage = languages[0];
export const languageIds = languages.map((l) => l.id) as LanguageId[];

// Document types translated at the document level (one document per language,
// linked via translation metadata). UI strings in siteSettings use field-level
// (internationalized arrays) instead.
export const translatedTypes = [
  "homePage",
  "technologyPage",
  "applicationsPage",
  "investorsPage",
  "aboutPage",
  "newsArticle",
  "caseStudy",
];
