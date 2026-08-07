// Canonical landing copy, extracted verbatim from the redesigned Claude Design
// markup. EN here is the source of truth *and* the safe fallback: the template
// renders from Sanity when present, falling back to these literals field-by-field
// so the homepage can never render empty. NL/PL come from Sanity.

export type HomeCard = { title: string; text: string };
export type HomeLifecycleCol = { num: string; title: string; text: string };
export type HomeStep = { num: string; title: string; text: string };

export type HomeContent = {
  nav: { technology: string; applications: string; investors: string; news: string; about: string; contact: string; talk: string };
  hero: { eyebrow: string; titleLead: string; titleAccent: string; subtitle: string; cta1: string; cta2: string };
  intro: { heading: string; headingAccent: string };
  benefits: {
    badge: string; heading: string; headingAccent: string; subtitle: string;
    leadPre: string; leadAccent: string; leadPost: string;
    cards: HomeCard[];
  };
  explore: {
    badge: string; heading: string; headingAccent: string; body: string;
    cta1: string; cta2: string; trust1: string; trust2: string;
  };
  lifecycle: { badge: string; heading: string; headingAccent: string; subtitle: string; cols: HomeLifecycleCol[] };
  howWeWork: {
    eyebrow: string; heading: string; headingAccent: string; subtitle: string; steps: HomeStep[];
    successEyebrow: string; successHeading: string; successBody: string;
  };
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
  };
  seo: { title: string; description: string };
  // Resolved image URLs. EN defaults are the literal design assets; getHome
  // overrides any that have a Sanity asset. Alts stay in the template.
  images: {
    heroBg: string;
    collage: [string, string, string];
    lifecycle: [string, string, string];
    banner: string;
  };
};

export const HOME_EN: HomeContent = {
  nav: { technology: "Technology", applications: "Applications", investors: "Investors", news: "News", about: "About", contact: "Contact", talk: "Talk to us" },
  hero: {
    eyebrow: "Process control for living processes",
    titleLead: "Process control for",
    titleAccent: "biotech and fermentation companies",
    subtitle: "Turn small samples into actionable process data - from development to production.",
    cta1: "Talk to us",
    cta2: "Explore Q‑Tector",
  },
  intro: { heading: "Q‑Tector is an at-line testing platform,", headingAccent: "built for living processes" },
  benefits: {
    badge: "Why it matters",
    heading: "Better decisions start with",
    headingAccent: "better process data",
    subtitle: "Q‑Tector brings guided at-line measurement closer to your process - so teams see the change as it happens.",
    leadPre: "Biological processes are dynamic - ",
    leadAccent: "Q‑Tector helps you follow the change",
    leadPost: " in a simple, repeatable way.",
    cards: [
      { title: "Make decisions earlier", text: "See what's happening during the process, not only after the batch is finished." },
      { title: "Reduce uncertainty", text: "Track key parameters across experiments, strains and conditions." },
      { title: "Support scale-up", text: "Build comparable datasets from R&D, pilot and production." },
      { title: "Analytics closer to production", text: "Guided at-line testing instead of delayed external analysis." },
      { title: "Knowledge from day one", text: "Collect data early, structure it and learn what drives performance." },
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
    trust2: "Result in <5 min · zero calibration",
  },
  lifecycle: {
    badge: "Data & analytics",
    heading: "From single measurements to",
    headingAccent: "scalable process intelligence",
    subtitle: "A single measurement is useful. A structured dataset is powerful.",
    cols: [
      { num: "01", title: "Analyze goals", text: "Understand the process and the goals you're chasing - then we propose a customised process-control setup to test." },
      { num: "02", title: "Pilot & test", text: "Piloting, testing and in-process analytics to validate the workflow on real runs." },
      { num: "03", title: "Roll out", text: "Roll the tested process out - with deeper, proactive analytics insights." },
    ],
  },
  howWeWork: {
    eyebrow: "How we work",
    heading: "A partner in",
    headingAccent: "process control",
    subtitle: "From your first question to a routine your team runs on its own - a few focused steps, one partner.",
    steps: [
      { num: "01", title: "Understand your process", text: "Organism, medium, process stage, goal and current workflow." },
      { num: "02", title: "Build the workflow", text: "Define the parameters that matter and turn them into a practical at-line workflow." },
      { num: "03", title: "Generate & act on data", text: "Structured data for trend analysis, comparison and reporting - ready to scale." },
    ],
    successEyebrow: "Customer success",
    successHeading: "Then it's yours to run",
    successBody: "Once the workflow is in place, your team keeps it running independently - with our support whenever the process evolves.",
  },
  partners: {
    heading: "Trusted by",
    headingAccent: "industry & research",
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
    beerLabel: "Beer-o-Meter",
  },
  footer: {
    tagline: "Actionable process data for biotech & fermentation - powered by Q‑Tector.",
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
    title: "SG Papertronics - Process control for biotech and fermentation",
    description: "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production.",
  },
  images: {
    heroBg: "/assets/newHero.JPG",
    collage: ["/assets/SGP-team.jpg", "/assets/SG-papertronics009b.jpg", "/assets/hero.webp"],
    lifecycle: [
      "https://images.pexels.com/photos/9574338/pexels-photo-9574338.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/8770737/pexels-photo-8770737.jpeg?auto=compress&cs=tinysrgb&w=900",
      "https://images.pexels.com/photos/5532674/pexels-photo-5532674.jpeg?auto=compress&cs=tinysrgb&w=900",
    ],
    banner: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
};
