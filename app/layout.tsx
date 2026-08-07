import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_TITLE = "SG Papertronics - Process control for biotech and fermentation";
const SITE_DESC =
  "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.";

const OG_IMAGE = {
  url: "/assets/og-cover.jpg",
  width: 1200,
  height: 630,
  alt: "SG Papertronics - Q‑Tector at-line testing platform",
};

export const metadata: Metadata = {
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

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SG Papertronics",
  url: "https://sgpapertronics.com",
  logo: "https://sgpapertronics.com/assets/SGPT_logo.png",
  description: SITE_DESC,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Blauwborgje 31",
    postalCode: "9747 AW",
    addressLocality: "Groningen",
    addressCountry: "NL",
  },
  sameAs: ["https://testmybeer.com"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
