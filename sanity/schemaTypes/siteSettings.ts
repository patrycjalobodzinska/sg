import { defineArrayMember, defineField, defineType } from "sanity";

// UI strings use field-level i18n (internationalizedArrayString/Text),
// registered by sanity-plugin-internationalized-array in sanity.config.ts.

const navItem = defineArrayMember({
  type: "object",
  name: "navItem",
  fields: [
    defineField({ name: "label", title: "Label", type: "internationalizedArrayString" }),
    defineField({ name: "href", title: "Link", type: "string", description: "/technology, #contact, or full URL" }),
  ],
  preview: { select: { items: "label", subtitle: "href" }, prepare: ({ items, subtitle }) => ({ title: items?.[0]?.value || "(label)", subtitle }) },
});

const footerColumn = defineArrayMember({
  type: "object",
  name: "footerColumn",
  fields: [
    defineField({ name: "title", title: "Column title", type: "internationalizedArrayString" }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerLink",
          fields: [
            defineField({ name: "label", title: "Label", type: "internationalizedArrayString" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: { select: { items: "label", subtitle: "href" }, prepare: ({ items, subtitle }) => ({ title: items?.[0]?.value || "(label)", subtitle }) },
        }),
      ],
    }),
  ],
  preview: { select: { items: "title" }, prepare: ({ items }) => ({ title: items?.[0]?.value || "Column" }) },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "nav", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Internal label", type: "string", initialValue: "Site settings", readOnly: true, group: "brand" }),
    defineField({ name: "logo", title: "Logo (wordmark)", type: "image", group: "brand" }),
    defineField({ name: "logoOnDark", title: "Logo for dark backgrounds", type: "image", group: "brand", description: "Optional light/white version used over the dark hero." }),
    defineField({ name: "ogImage", title: "Favicon / share image", type: "image", group: "brand", description: "Square emblem used as favicon and social share image." }),

    defineField({ name: "nav", title: "Main navigation", type: "array", of: [navItem], group: "nav" }),
    defineField({ name: "navCta", title: "Nav button", type: "ctaButton", group: "nav", description: "Href + style; the label is localized in “Nav button label” below." }),
    defineField({ name: "navCtaLabel", title: "Nav button label", type: "internationalizedArrayString", group: "nav" }),

    defineField({ name: "footerTagline", title: "Footer tagline", type: "internationalizedArrayText", group: "footer" }),
    defineField({ name: "footerColumns", title: "Footer columns", type: "array", of: [footerColumn], group: "footer" }),
    defineField({ name: "footerCopyright", title: "Footer copyright line", type: "internationalizedArrayString", group: "footer" }),
    defineField({
      name: "legalLinks",
      title: "Legal links (Privacy / Terms)",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalLink",
          fields: [
            defineField({ name: "label", title: "Label", type: "internationalizedArrayString" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: { select: { items: "label", subtitle: "href" }, prepare: ({ items, subtitle }) => ({ title: items?.[0]?.value || "(label)", subtitle }) },
        }),
      ],
    }),

    defineField({ name: "contactEmail", title: "Contact email", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Address", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      title: "Social / external links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),

    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),

    defineField({
      name: "news",
      title: "News section UI",
      type: "object",
      group: "nav",
      description: "Labels for the news list & article pages.",
      fields: [
        defineField({ name: "heroTitle", title: "Hero title", type: "internationalizedArrayString" }),
        defineField({ name: "heroAccent", title: "Hero title (accent)", type: "internationalizedArrayString" }),
        defineField({ name: "heroLead", title: "Hero lead", type: "internationalizedArrayText" }),
        defineField({ name: "listDesc", title: "List meta description", type: "internationalizedArrayText" }),
        defineField({ name: "categoryDefault", title: "Default category label", type: "internationalizedArrayString" }),
        defineField({ name: "readMore", title: "Read-article link label", type: "internationalizedArrayString" }),
        defineField({ name: "ctaHeading", title: "CTA heading", type: "internationalizedArrayString" }),
        defineField({ name: "ctaBody", title: "CTA body", type: "internationalizedArrayText" }),
        defineField({ name: "ctaButton", title: "CTA button", type: "internationalizedArrayString" }),
        defineField({ name: "allNews", title: "“All news” back link", type: "internationalizedArrayString" }),
        defineField({ name: "comingSoon", title: "Empty body message", type: "internationalizedArrayString" }),
        defineField({ name: "articleCta", title: "Article footer CTA", type: "internationalizedArrayString" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
