import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Overrides the page title in Google / browser tab. ~60 chars.",
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Shown in Google results. ~150–160 chars.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Used when the page is shared (Google / LinkedIn / etc.).",
    }),
  ],
});

export const ctaButton = defineType({
  name: "ctaButton",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path (e.g. /technology), anchor (#contact) or full URL.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: { list: [
        { title: "Primary (filled)", value: "primary" },
        { title: "Ghost (outline)", value: "ghost" },
        { title: "Text link", value: "link" },
      ], layout: "radio" },
      initialValue: "primary",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for accessibility & SEO.",
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});
