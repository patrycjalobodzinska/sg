import { defineArrayMember, defineField, defineType } from "sanity";

const str = (name: string, title: string) => defineField({ name, title, type: "string" });
const txt = (name: string, title: string, rows = 3) => defineField({ name, title, type: "text", rows });
const img = (name: string, title: string) => defineField({ name, title, type: "imageWithAlt" });
const cta = (name: string, title: string) => defineField({ name, title, type: "ctaButton" });
const seoField = defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" });

const pageGroups = [
  { name: "content", title: "Content", default: true },
  { name: "seo", title: "SEO" },
];

/* ============ HOME ============ */
// Landing images are hardcoded in the design template; only text + link labels
// are managed here. Structure mirrors app/_components/home-content.ts (HomeContent).
const titleCard = defineArrayMember({ type: "object", name: "card", fields: [str("title", "Title"), txt("text", "Text")], preview: { select: { title: "title" } } });
const numCol = defineArrayMember({ type: "object", name: "col", fields: [str("num", "Number"), str("title", "Title"), txt("text", "Text")], preview: { select: { title: "title", subtitle: "num" } } });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: pageGroups,
  fields: [
    defineField({ name: "nav", title: "Navigation labels", type: "object", group: "content", fields: [
      str("technology", "Technology"), str("applications", "Applications"), str("investors", "Investors"),
      str("news", "News"), str("about", "About"), str("contact", "Contact"), str("talk", "Talk-to-us button"),
    ]}),
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [
      str("eyebrow", "Eyebrow"), str("titleLead", "Title (lead)"), str("titleAccent", "Title (accent)"),
      txt("subtitle", "Subtitle"), str("focus", "Current analytical focus"),
      str("cta1", "Primary link label"), str("cta2", "Secondary link label"),
    ]}),
    defineField({ name: "intro", title: "Intro heading", type: "object", group: "content", fields: [str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("brand", "Brand architecture paragraph")] }),
    defineField({ name: "benefits", title: "Benefits (Why it matters)", type: "object", group: "content", fields: [
      str("badge", "Badge"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("subtitle", "Subtitle"),
      str("leadPre", "Lead card — before accent"), str("leadAccent", "Lead card — accent"), str("leadPost", "Lead card — after accent"),
      defineField({ name: "cards", title: "Cards", type: "array", of: [titleCard] }),
    ]}),
    defineField({ name: "explore", title: "Explore / CTA band", type: "object", group: "content", fields: [
      str("badge", "Badge"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("body", "Body"),
      str("cta1", "Primary link label"), str("cta2", "Secondary link label"), str("trust1", "Trust chip 1"),
    ]}),
    defineField({ name: "lifecycle", title: "Data lifecycle", type: "object", group: "content", fields: [
      str("badge", "Badge"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("subtitle", "Subtitle"),
      defineField({ name: "cols", title: "Columns", type: "array", of: [numCol] }),
    ]}),
    defineField({ name: "howWeWork", title: "How we work", type: "object", group: "content", fields: [
      str("eyebrow", "Eyebrow"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("subtitle", "Subtitle"),
      defineField({ name: "steps", title: "Steps", type: "array", of: [numCol] }),
      str("successEyebrow", "Customer success — eyebrow"), str("successHeading", "Customer success — heading"), txt("successBody", "Customer success — body"),
    ]}),
    defineField({ name: "partners", title: "Partners", type: "object", group: "content", fields: [
      str("heading", "Heading"), str("headingAccent", "Heading (accent)"),
      defineField({ name: "names", title: "Names", type: "array", of: [{ type: "string" }] }),
    ]}),
    defineField({ name: "contact", title: "Contact section", type: "object", group: "content", fields: [
      str("badge", "Badge"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), str("formSent", "Form success message"),
      defineField({ name: "ph", title: "Form placeholders", type: "object", fields: [str("name", "Name"), str("email", "Email"), str("message", "Message")] }),
      str("submit", "Submit button"), str("rightHeadingLine1", "Right panel heading line 1"), str("rightHeadingLine2", "Right panel heading line 2"),
      txt("rightBody", "Right panel body"), str("emailLabel", "Email label"), str("visitLabel", "Visit label"), str("visitValue", "Address"), str("beerLabel", "Beer-o-Meter label"),
    ]}),
    defineField({ name: "footer", title: "Footer", type: "object", group: "content", fields: [
      txt("tagline", "Tagline"), str("exploreTitle", "Explore column title"), str("companyTitle", "Company column title"),
      str("connectTitle", "Connect column title"), str("connectEmail", "Email link label"), str("connectLinkedIn", "LinkedIn link label"),
      str("copyright", "Copyright"), str("privacy", "Privacy label"), str("terms", "Terms label"),
    ]}),
    defineField({ name: "images", title: "Landing images", type: "object", group: "content", fields: [
      img("heroBg", "Hero background"),
      defineField({ name: "collage", title: "Explore collage (3)", type: "array", of: [defineArrayMember({ type: "imageWithAlt" })] }),
      defineField({ name: "lifecycle", title: "Data lifecycle (3)", type: "array", of: [defineArrayMember({ type: "imageWithAlt" })] }),
      img("banner", "How-we-work banner"),
    ]}),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

/* ============ TECHNOLOGY ============ */
export const technologyPage = defineType({
  name: "technologyPage",
  title: "Technology page",
  type: "document",
  groups: pageGroups,
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [str("title", "Title"), str("titleAccent", "Title (accent)"), txt("lead", "Lead"), txt("body1", "Body 1", 4), txt("body2", "Body 2"), img("image", "Image"), cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button")] }),
    defineField({ name: "steps", title: "How it works — steps", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "step", fields: [str("n", "Number"), str("title", "Title"), txt("text", "Text")], preview: { select: { title: "title", subtitle: "n" } } })] }),
    defineField({ name: "focus", title: "Current analytical focus", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), txt("body", "Body"), defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }), img("image", "Image")] }),
    defineField({ name: "builtForScale", title: "Built for scale-up", type: "object", group: "content", fields: [str("heading", "Heading"), txt("body1", "Body 1"), txt("body2", "Body 2")] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Technology page" }) },
});

/* ============ APPLICATIONS ============ */
export const applicationsPage = defineType({
  name: "applicationsPage",
  title: "Applications page",
  type: "document",
  groups: pageGroups,
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("title", "Title"), str("titleAccent", "Title (accent)"), txt("lead", "Lead"), img("image", "Image"), cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button")] }),
    defineField({ name: "categoriesEyebrow", title: "Categories — eyebrow", type: "string", group: "content" }),
    defineField({ name: "categoriesHeading", title: "Categories — heading", type: "string", group: "content" }),
    defineField({ name: "categories", title: "Categories", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "category", fields: [str("tag", "Tag"), str("title", "Title"), txt("text", "Text"), img("image", "Image"), defineField({ name: "points", title: "Points", type: "array", of: [{ type: "string" }] })], preview: { select: { title: "title", subtitle: "tag", media: "image" } } })] }),
    defineField({ name: "caseStudiesEyebrow", title: "Case studies — eyebrow", type: "string", group: "content" }),
    defineField({ name: "caseStudiesHeading", title: "Case studies — heading", type: "string", group: "content" }),
    defineField({ name: "caseStudies", title: "Case studies", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })] }),
    defineField({ name: "cta", title: "CTA band", type: "object", group: "content", fields: [str("heading", "Heading"), txt("body", "Body"), cta("button", "Button")] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Applications page" }) },
});

/* ============ INVESTORS ============ */
export const investorsPage = defineType({
  name: "investorsPage",
  title: "Investors page",
  type: "document",
  groups: pageGroups,
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [str("title", "Title"), str("titleAccent", "Title (accent)"), txt("body1", "Body 1"), txt("body2", "Body 2"), img("image", "Image"), cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button")] }),
    defineField({ name: "whyNow", title: "Why now", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), txt("body1", "Body 1"), txt("body2", "Body 2"), defineField({ name: "painPoints", title: "Pain points", type: "array", of: [{ type: "string" }] })] }),
    defineField({ name: "mission", title: "Mission band", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), str("headingAccent", "Heading (accent)"), txt("body", "Body")] }),
    defineField({ name: "platform", title: "The platform", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), txt("body", "Body"), defineField({ name: "features", title: "Features", type: "array", of: [{ type: "string" }] })] }),
    defineField({ name: "problem", title: "What we solve", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), txt("body", "Body")] }),
    defineField({ name: "benefits", title: "Customer benefits", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "b", fields: [str("tag", "Tag"), txt("text", "Text"), txt("benefit", "Benefit")], preview: { select: { title: "tag" } } })] }),
    defineField({ name: "marketEyebrow", title: "Market — eyebrow", type: "string", group: "content" }),
    defineField({ name: "marketHeading", title: "Market — heading", type: "string", group: "content" }),
    defineField({ name: "marketSubtitle", title: "Market — subtitle", type: "text", group: "content" }),
    defineField({ name: "market", title: "Market segments", type: "array", group: "content", of: [{ type: "string" }] }),
    defineField({ name: "seriesAEyebrow", title: "Series A — eyebrow", type: "string", group: "content" }),
    defineField({ name: "seriesAHeading", title: "Series A — heading", type: "string", group: "content" }),
    defineField({ name: "seriesA", title: "Series A focus", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "s", fields: [str("title", "Title"), txt("text", "Text")], preview: { select: { title: "title" } } })] }),
    defineField({ name: "thesisEyebrow", title: "Thesis — eyebrow", type: "string", group: "content" }),
    defineField({ name: "thesisHeading", title: "Thesis — heading", type: "string", group: "content" }),
    defineField({ name: "thesis", title: "Investment thesis", type: "array", group: "content", of: [{ type: "string" }] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Investors page" }) },
});

/* ============ ABOUT ============ */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: pageGroups,
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("title", "Title"), str("titleAccent", "Title (accent)"), txt("lead", "Lead"), img("image", "Image"), str("imageCaption", "Image caption"), cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button")] }),
    defineField({ name: "whyWeExist", title: "Why we exist", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), str("heading", "Heading"), txt("body1", "Body 1"), txt("body2", "Body 2"), img("image", "Image")] }),
    defineField({ name: "valuesEyebrow", title: "Values — eyebrow", type: "string", group: "content" }),
    defineField({ name: "valuesHeading", title: "Values — heading", type: "string", group: "content" }),
    defineField({ name: "values", title: "Values", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "v", fields: [str("title", "Title"), txt("text", "Text")], preview: { select: { title: "title" } } })] }),
    defineField({ name: "mission", title: "Mission band", type: "object", group: "content", fields: [str("eyebrow", "Eyebrow"), txt("lead", "Lead"), str("heading", "Heading"), str("headingAccent", "Heading (accent)")] }),
    defineField({ name: "partnersLabel", title: "Partners — label", type: "string", group: "content" }),
    defineField({ name: "partners", title: "Partners", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "partner" }] })] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
