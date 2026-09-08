import { defineArrayMember, defineField, defineType } from "sanity";

/* ---------- Author ---------- */
/** No longer referenced by newsArticle — bylines were removed from the news
 *  section entirely. Kept registered so the four existing author documents stay
 *  reachable in the Studio, and so restoring bylines is a code change rather
 *  than a data re-entry. */
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
  ],
});

/* ---------- Partner ---------- */
export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "url", title: "Website", type: "url" }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});

/* ---------- Case study (translated) ---------- */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "tag", title: "Tag / category", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({ name: "link", title: "Read-more link", type: "string", description: "Optional path or URL." }),
    // Everything below is optional: the same card also carries a partner or a
    // consortium member, where only a name and a relationship type are known.
    defineField({ name: "relationship", title: "Relationship", type: "string", description: "Customer, pilot partner, research collaborator, consortium member…" }),
    defineField({ name: "status", title: "Status", type: "string", description: "Commercially validated, In validation, In application development…" }),
    defineField({ name: "result", title: "Result", type: "string", description: "One measurable outcome, e.g. “2 h faster feed decisions”." }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
    defineField({ name: "quoteAuthor", title: "Quote — name and role", type: "string" }),
    // The structure the audit asks every story to state (ch. 7). All optional:
    // a card can stay a card until someone has the facts for the full page.
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, description: "Gives the case study its own page at /case-studies/<slug>. Use the same slug in every language." }),
    defineField({ name: "problem", title: "Problem", type: "text", rows: 3, group: "story" }),
    defineField({ name: "analyte", title: "Analyte", type: "string", group: "story" }),
    defineField({ name: "sampleMatrix", title: "Sample matrix", type: "string", group: "story" }),
    defineField({ name: "workflow", title: "Workflow", type: "text", rows: 3, group: "story" }),
    defineField({ name: "partner", title: "Partner", type: "string", group: "story" }),
    defineField({ name: "nextMilestone", title: "Next milestone", type: "string", group: "story" }),
    defineField({ name: "body", title: "Full story (optional)", type: "array", of: [defineArrayMember({ type: "block" })], group: "story" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "story" }),
  ],
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "story", title: "Full story" },
  ],
  preview: { select: { title: "title", subtitle: "tag", media: "image", lang: "language" }, prepare: ({ title, subtitle, media, lang }) => ({ title, subtitle: [lang?.toUpperCase(), subtitle].filter(Boolean).join(" · "), media }) },
});

/* ---------- News article (translated) ---------- */
export const newsArticle = defineType({
  name: "newsArticle",
  title: "News article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta & SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "date", group: "content", validation: (r) => r.required() }),
    defineField({ name: "category", title: "Category", type: "string", group: "content", description: "New posts use the audit's five (ch. 9), in this document's language: Customer results · Q-Tector product · Application development · Partnerships · Company. The pre-2026 archive keeps its own historical labels (Grant, Award, Investment, Event, Recognition) — do not retro-fit them." }),
    defineField({ name: "coverImage", title: "Cover image", type: "imageWithAlt", group: "content" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, group: "content", description: "Short summary shown on the news grid." }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "imageWithAlt" }),
      ],
    }),
    defineField({ name: "externalUrl", title: "External article URL", type: "url", group: "meta", description: "If set, the card links to this URL (used for legacy/imported posts)." }),
    defineField({ name: "featured", title: "Featured", type: "boolean", group: "meta", initialValue: false }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "meta" }),
  ],
  orderings: [
    { name: "dateDesc", title: "Newest first", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "date", media: "coverImage", lang: "language" },
    prepare: ({ title, date, media, lang }) => ({ title, subtitle: [lang?.toUpperCase(), date].filter(Boolean).join(" · "), media }),
  },
});

/* ---------- Team member (not translated: names and photos are the same in
   every language; the role and bio are plain strings the client can localise
   by hand if they ever want to) ---------- */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
    // The audit asks for a short competence line and a LinkedIn profile per
    // person (ch. 8). Both stay empty until the client supplies them; the card
    // simply omits what is missing.
    defineField({ name: "bio", title: "Short competences", type: "text", rows: 3, description: "One or two lines: what this person does and what they bring." }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers come first." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
