// Canonical landing copy, extracted verbatim from the redesigned Claude Design
// markup. EN here is the source of truth *and* the safe fallback: the template
// renders from Sanity when present, falling back to these literals field-by-field
// so the homepage can never render empty. NL/PL come from Sanity.
//
// Wording the audit flagged comes from ./claims.ts — do not restate it here.

import { TERMS } from "./claims";

export type HomeCard = { title: string; text: string };
export type HomeLifecycleCol = { num: string; title: string; text: string };
export type HomeStep = { num: string; title: string; text: string };

export type HomeContent = {
  nav: { technology: string; applications: string; investors: string; news: string; about: string; contact: string; talk: string };
  /** `focus` is the audit's "current analytical focus" line (ch. 5, P0): the one
   *  hard product fact, kept above the fold. */
  hero: { eyebrow: string; titleLead: string; titleAccent: string; subtitle: string; focus: string; cta1: string; cta2: string };
  /** `brand` states the SG Papertronics -> Q-Tector -> Beer-o-Meter hierarchy
   *  verbatim from the audit (ch. 2, P0) so the reader never has to infer it. */
  /** Only the brand paragraph survives: the intro's own headline duplicated the
   *  section below it, so the two were merged (audit ch. 5, plan B2). */
  intro: { brand: string };
  benefits: {
    heading: string; headingAccent: string; subtitle: string;
    leadPre: string; leadAccent: string; leadPost: string;
    cards: HomeCard[];
  };
  explore: {
    badge: string; heading: string; headingAccent: string; body: string;
    cta1: string; cta2: string; trust1: string;
  };
  /** "Data & analytics", "How we work" and "Customer success" all described the
   *  same path, so they are one section now: three lifecycle columns, a closing
   *  line, then the collaboration flow (audit ch. 5, plan B4). */
  lifecycle: { heading: string; headingAccent: string; cols: HomeLifecycleCol[]; closing: string };
  howWeWork: { eyebrow: string; heading: string; steps: HomeStep[]; cta: string };
  partners: { heading: string; headingAccent: string; names: string[] };
  contact: {
    badge: string; heading: string; headingAccent: string; formSent: string;
    ph: { name: string; email: string; message: string }; submit: string;
    rightHeadingLine1: string; rightHeadingLine2: string; rightBody: string;
    emailLabel: string; visitLabel: string; visitValue: string; beerLabel: string;
  };
  footer: {
    tagline: string; exploreTitle: string; companyTitle: string; connectTitle: string;
    connectEmail: string; connectLinkedIn: string; copyright: string; privacy: string; terms: string;
    /** Real destinations. Empty = not supplied yet by the client, in which
     *  case the link is omitted rather than shipped pointing at "#top". */
    linkedInHref?: string; privacyHref?: string; termsHref?: string;
  };
  seo: { title: string; description: string };
  // Resolved image URLs. EN defaults are the literal design assets; getHome
  // overrides any that have a Sanity asset. Alts stay in the template.
  images: {
    heroBg: string;
    collage: [string, string, string];
    lifecycle: [string, string, string];
  };
};

export const HOME_EN: HomeContent = {
  nav: { technology: "Technology", applications: "Applications", investors: "Investors", news: "News", about: "About", contact: "Contact", talk: "Talk to us" },
  // Hero + brand copy below is the audit copy deck (ch. 2 and ch. 5) verbatim.
  // NOT YET PUBLISHABLE (audit ch. 14, "Warunek publikacji"): once the client
  // confirms it per assay, append to `subtitle`:
  //   "Results in under five minutes. No user calibration required for supported assays."
  hero: {
    eyebrow: "At-line analytics for biological processes",
    titleLead: "Know what is happening in your process",
    titleAccent: "- while you can still act.",
    subtitle:
      "Q‑Tector combines ready-to-use assay pods, a compact reader and guided digital workflows to generate comparable glucose and sucrose results close to the fermenter or bioreactor. Use the data to compare runs, refine feed strategies and carry process knowledge from R&D to production.",
    focus: "Current analytical focus: glucose and sucrose in culture media",
    cta1: "See how Q‑Tector works",
    cta2: "Discuss your process",
  },
  intro: {
    brand:
      "SG Papertronics develops Q‑Tector, a compact at-line analytics platform for biological processes. Beer‑o‑Meter is the first commercial application built on Q‑Tector technology. We also work with industry partners to develop and validate new assay workflows for specific analytes and sample matrices.",
  },
  benefits: {
    heading: "Measure during the run,",
    headingAccent: "not after the opportunity to act.",
    subtitle: "Biological processes can change faster than laboratory feedback arrives.",
    leadPre: "Q‑Tector brings guided testing close to the fermenter, bioreactor or production line, ",
    leadAccent: "giving teams process-relevant results while a run is still active",
    leadPost: ".",
    cards: [
      { title: "Optimise media and feeds", text: "Compare substrate consumption across strains, media and feed strategies." },
      { title: "Transfer knowledge across scale", text: "Use one repeatable measurement workflow from development to pilot and production." },
      { title: "Investigate deviations sooner", text: "Add process data while there is still time to understand and respond." },
      { title: "Build comparable process histories", text: "Store, trend and export results across experiments, runs and batches." },
    ],
  },
  explore: {
    badge: "Let's explore together",
    heading: "Explore what",
    headingAccent: "we can do",
    body: "Tell us your organism, process stage and goal - we'll show where Q‑Tector fits and how fast you can start. From the first sample to a running at-line routine.",
    cta1: "Talk to us",
    cta2: "See the technology",
    trust1: "Reply within 1 business day",
  },
  lifecycle: {
    heading: "One measurement workflow",
    headingAccent: "from first experiment to production",
    cols: [
      { num: "01", title: "R&D - Learn", text: "Compare strains, media and conditions with frequent measurements." },
      { num: "02", title: "Pilot - Validate", text: "Test the workflow on representative runs and define how results support process decisions." },
      { num: "03", title: "Production - Standardise", text: "Use the validated routine to monitor trends, compare batches and support troubleshooting." },
    ],
    closing: `Each result becomes part of ${TERMS.processData} that can be reviewed, compared and exported.`,
  },
  howWeWork: {
    eyebrow: "How we work",
    heading: "Start with your process question",
    steps: [
      { num: "01", title: "Define the question", text: "Define the organism, matrix, analyte and decision." },
      { num: "02", title: "Assess the fit", text: "Assess assay and workflow fit." },
      { num: "03", title: "Validate the method", text: "Validate the method on real samples and runs." },
      { num: "04", title: "Move into routine use", text: "Move the workflow into routine use." },
    ],
    cta: "Discuss a pilot",
  },
  partners: {
    heading: "Selected customers",
    headingAccent: "and research collaborators",
    names: ["Bioclear Earth", "Fascinating", "University of Groningen", "Hanze UAS", "ISPT"],
  },
  contact: {
    badge: "Contact",
    heading: "Bring control closer to your",
    headingAccent: "biology",
    formSent: "Thanks - we'll be in touch shortly. ✓",
    ph: { name: "Name", email: "Email", message: "Message" },
    submit: "Send message",
    rightHeadingLine1: "Let's talk about",
    rightHeadingLine2: "your process.",
    rightBody: "Tell us your organism, process stage and goal - we'll suggest where Q‑Tector fits.",
    emailLabel: "Email",
    visitLabel: "Visit us",
    visitValue: "Blauwborgje 31, 9747 AW Groningen, NL",
    beerLabel: "Beer-o-Meter - brewing application of Q‑Tector",
  },
  footer: {
    tagline: "Q‑Tector is our at-line analytics platform for biotech and fermentation; Beer‑o‑Meter is its first commercial application.",
    exploreTitle: "Explore",
    companyTitle: "Company",
    connectTitle: "Connect",
    connectEmail: "Email",
    connectLinkedIn: "LinkedIn",
    copyright: "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
    privacy: "Privacy",
    terms: "Terms",
  },
  seo: {
    title: "SG Papertronics - At-line process monitoring for biotech and fermentation",
    description: "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.",
  },
  images: {
    heroBg: "/assets/hero-chrome.png",
    collage: ["/assets/SGP-team.jpg", "/assets/SG-papertronics009b.jpg", "/assets/hero.webp"],
    lifecycle: [
      "https://images.pexels.com/photos/9574338/pexels-photo-9574338.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/8770737/pexels-photo-8770737.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/5532674/pexels-photo-5532674.jpeg?auto=compress&cs=tinysrgb&w=900",
    ],
  },
};
