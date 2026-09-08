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
export type HomeFlowStep = { label: string };
/** A card in the proof band. Only `title` is required: the same shape carries a
 *  full case study and a bare partner, so the section can hold both (audit ch. 5).
 *  Empty strings mean "not supplied" and simply drop out of the render. */
export type HomeShowcaseCard = {
  title: string;
  tag: string;
  relationship: string;
  status: string;
  text: string;
  result: string;
  quote: string;
  quoteAuthor: string;
  link: string;
  image: string;
};

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
    heading: string; headingAccent: string; body: string;
    cta1: string;
    /** Sample → Guided assay → Quantitative result → Trend → Process decision.
     *  Replaces the team photo, which said nothing about the product (audit
     *  ch. 5, plan B3). */
    flow: HomeFlowStep[];
  };
  /** "Data & analytics", "How we work" and "Customer success" all described the
   *  same path, so they are one section now: three lifecycle columns, a closing
   *  line, then the collaboration flow (audit ch. 5, plan B4). */
  lifecycle: { heading: string; headingAccent: string; cols: HomeLifecycleCol[]; closing: string };
  howWeWork: { eyebrow: string; heading: string; steps: HomeStep[]; cta: string };
  partners: { heading: string; headingAccent: string; items: HomeShowcaseCard[] };
  contact: {
    badge: string; heading: string; headingAccent: string; formSent: string;
    ph: { name: string; email: string; message: string }; submit: string;
    rightHeadingLine1: string; rightHeadingLine2: string; rightBody: string;
    emailLabel: string; visitLabel: string; visitValue: string; beerLabel: string;
  };
  footer: {
    tagline: string; exploreTitle: string; companyTitle: string; connectTitle: string;
    connectEmail: string; connectLinkedIn: string; copyright: string; privacy: string;
    /** The company page. Privacy points at the site's own /privacy route, so it
     *  needs no field; Terms is gone until there is a document to link to. */
    linkedInHref?: string;
  };
  seo: { title: string; description: string };
  // Resolved image URLs. EN defaults are the literal design assets; getHome
  // overrides any that have a Sanity asset. Alts stay in the template.
  images: {
    heroBg: string;
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
    heading: "Is Q‑Tector a fit",
    headingAccent: "for your process?",
    body: "Tell us what you are producing, what you need to measure and which decision the result should support. We will determine whether an existing Q‑Tector workflow fits - or whether an application-development path makes sense.",
    cta1: "Request a process-fit review",
    // The five step names are the audit's copy deck (ch. 5) and nothing else:
    // the notes we had written under them were our own paraphrase, and this
    // section carries only copy the deck approves.
    flow: [
      { label: "Sample" },
      { label: "Guided assay" },
      { label: "Quantitative result" },
      { label: "Trend" },
      { label: "Process decision" },
    ],
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
    // Fallback only: the live cards are picked in Sanity. Status, result and
    // quote stay empty until the client supplies them (audit ch. 5 blockers).
    items: [
      { title: "Beer-o-Meter: brewing quality control", tag: "Brewing", relationship: "Commercial application", status: "", text: "The first commercial application of Q‑Tector - at-line testing close to the tank, built for breweries.", result: "", quote: "", quoteAuthor: "", link: "/applications", image: "/assets/beerometer-1080x675.jpeg" },
      { title: "Media & feed monitoring across runs", tag: "Precision fermentation", relationship: "", status: "", text: "Tracking glucose and sucrose in culture media so teams can compare feed strategies and act during the run.", result: "", quote: "", quoteAuthor: "", link: "/applications", image: "" },
      { title: "PotatoSense - Fascinating / ISPT", tag: "Agri-food", relationship: "Application-development collaboration", status: "", text: "Applying Q‑Tector measurement workflows to agri-food process questions through a regional innovation collaboration.", result: "", quote: "", quoteAuthor: "", link: "/applications", image: "" },
    ],
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
    // Short brand line from the audit's copy deck (ch. 3).
    tagline: "Practical process analytics for living systems.",
    exploreTitle: "Explore",
    companyTitle: "Company",
    connectTitle: "Connect",
    connectEmail: "Email",
    connectLinkedIn: "LinkedIn",
    copyright: "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
    privacy: "Privacy",
    linkedInHref: "https://pl.linkedin.com/company/sg-papertronics-b-v",
  },
  seo: {
    title: "SG Papertronics - At-line process monitoring for biotech and fermentation",
    description: "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.",
  },
  images: {
    heroBg: "/assets/hero-chrome.png",
    lifecycle: [
      "https://images.pexels.com/photos/9574338/pexels-photo-9574338.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/8770737/pexels-photo-8770737.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/5532674/pexels-photo-5532674.jpeg?auto=compress&cs=tinysrgb&w=900",
    ],
  },
};
