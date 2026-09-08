import type { StructureResolver } from "sanity/structure";

// Base-language (English) document ids for the singletons; the language
// switcher on each document navigates to its NL / PL translations.
const pageItem = (
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  baseId: string
) =>
  S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(baseId));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              pageItem(S, "Home", "homePage", "home-en"),
              pageItem(S, "Technology", "technologyPage", "technology-en"),
              pageItem(S, "Applications", "applicationsPage", "applications-en"),
              pageItem(S, "Investors", "investorsPage", "investors-en"),
              pageItem(S, "About", "aboutPage", "about-en"),
              pageItem(S, "Privacy", "privacyPage", "privacy-en"),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("newsArticle").title("News"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.divider(),
      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("author").title("Authors"),
    ]);
