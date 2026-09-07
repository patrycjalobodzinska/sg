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
