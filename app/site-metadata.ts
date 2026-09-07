import type { Metadata } from "next";

export const SITE_TITLE =
  "SG Papertronics - At-line process monitoring for biotech and fermentation";
export const SITE_DESC =
  "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.";

const OG_IMAGE = {
  url: "/assets/og-cover.jpg",
  width: 1200,
  height: 630,
  alt: "SG Papertronics - Q‑Tector at-line testing platform",
};

/** Base metadata shared by every root layout. Pages override per route. */
export const siteMetadata: Metadata = {
  metadataBase: new URL("https://sgpapertronics.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | SG Papertronics",
  },
  description: SITE_DESC,
  // app/icon.png and app/apple-icon.png are auto-detected by Next for favicons
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://sgpapertronics.com",
    siteName: "SG Papertronics",
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE.url],
  },
};
