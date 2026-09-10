import type { Locale } from "../i18n";

/** The seven inquiry intents from the client audit (ch. 12). The `value` is the
 *  stable key used in the `?intent=` query param, the routed subject line and
 *  the CRM hand-off — never translate it.
 *
 *  "docs" replaced the audit's "product" (Q-Tector evaluation): picking it makes
 *  the server action email the requester the product documentation, so it is the
 *  one intent with a side effect beyond the inbox notification. A legacy
 *  ?intent=product link is not an intent any more and falls back to the default,
 *  which is deliberate — it must not silently become a document request. */
export const INTENTS = [
  "docs",
  "pilot",
  "assay",
  "sales",
  "partnership",
  "investor",
  "general",
] as const;
export type Intent = (typeof INTENTS)[number];

export function isIntent(v: unknown): v is Intent {
  return typeof v === "string" && (INTENTS as readonly string[]).includes(v);
}
export const DEFAULT_INTENT: Intent = "general";

export type ContactCopy = {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  lead: string;
  fields: {
    name: { label: string; hint?: string };
    email: { label: string; hint: string };
    company: { label: string };
    intent: { label: string };
    message: { label: string; hint: string };
  };
  intents: Record<Intent, string>;
  submit: string;
  privacy: { text: string; linkLabel: string };
  states: {
    sending: string;
    success: string;
    /** Shown instead of `success` only once the documentation really went out. */
    successDocs: string;
    error: string;
  };
  /** The documentation email itself, sent to the requester. */
  docEmail: { subject: string; greeting: string; body: string; linkLabel: string; signoff: string };
  errors: {
    name: string;
    email: string;
    company: string;
    intent: string;
    message: string;
    generic: string;
  };
  required: string;
};

// EN copy is taken verbatim from the client's copy deck (ch. 12,
// "PROPOSED FORM COPY" / "FORM STATES"). NL and PL are translations of it.
const EN: ContactCopy = {
  eyebrow: "Start a conversation",
  heading: "Tell us what",
  headingAccent: "you're working on",
  lead: "Share your organism, process stage, target analyte and the decision you need to make. We'll reply with a practical next step within one business day.",
  fields: {
    name: { label: "Full name" },
    email: { label: "Work email", hint: "We reply to this address only." },
    company: { label: "Company or organisation" },
    intent: { label: "What would you like to discuss?" },
    message: {
      label: "Your process or question",
      hint: "Include the organism, current process stage, sample matrix, target analyte and timeline, if known.",
    },
  },
  intents: {
    docs: "Request product documentation",
    pilot: "Pilot or application project",
    assay: "Custom analyte or assay development",
    sales: "Sales and pricing",
    partnership: "Research or commercial partnership",
    investor: "Investor relations",
    general: "General question",
  },
  submit: "Send inquiry",
  privacy: { text: "We'll use your details only to respond to your inquiry.", linkLabel: "Read our Privacy Notice." },
  states: {
    sending: "Sending…",
    success: "Thanks - your inquiry is on its way. We'll reply within one business day.",
    successDocs: "Thanks - the product documentation is on its way to your inbox. We'll follow up within one business day.",
    error: "We couldn't send your inquiry. Please try again or email contact@sgpapertronics.com.",
  },
  errors: {
    name: "Please enter your full name.",
    email: "Please enter a valid work email address.",
    company: "Please enter your company or organisation.",
    intent: "Please choose what you'd like to discuss.",
    message: "Please describe your process or question.",
    generic: "Please check the highlighted fields.",
  },
  required: "required",
  docEmail: {
    subject: "Q‑Tector product documentation",
    greeting: "Hi",
    body: "Thanks for your interest in Q‑Tector. The product documentation you requested is attached to this email.",
    linkLabel: "You can also download it here:",
    signoff: "If it raises questions about your own process - organism, stage, sample matrix, target analyte - just reply to this email and a person will answer.\n\nSG Papertronics\nBlauwborgje 31, 9747 AW Groningen, NL",
  },
};

const NL: ContactCopy = {
  eyebrow: "Start een gesprek",
  heading: "Vertel ons waar",
  headingAccent: "u aan werkt",
  lead: "Deel uw organisme, processtadium, doelanalyt en de beslissing die u moet nemen. Wij reageren binnen één werkdag met een concrete vervolgstap.",
  fields: {
    name: { label: "Volledige naam" },
    email: { label: "Zakelijk e‑mailadres", hint: "Wij antwoorden uitsluitend op dit adres." },
    company: { label: "Bedrijf of organisatie" },
    intent: { label: "Waarover wilt u spreken?" },
    message: {
      label: "Uw proces of vraag",
      hint: "Vermeld indien bekend het organisme, het huidige processtadium, de monstermatrix, het doelanalyt en de tijdlijn.",
    },
  },
  intents: {
    docs: "Productdocumentatie aanvragen",
    pilot: "Pilot- of toepassingsproject",
    assay: "Ontwikkeling van een specifiek analyt of assay",
    sales: "Verkoop en prijzen",
    partnership: "Onderzoeks- of commercieel partnerschap",
    investor: "Investor relations",
    general: "Algemene vraag",
  },
  submit: "Verstuur aanvraag",
  privacy: { text: "Wij gebruiken uw gegevens uitsluitend om op uw aanvraag te reageren.", linkLabel: "Lees onze privacyverklaring." },
  states: {
    sending: "Versturen…",
    success: "Bedankt - uw aanvraag is onderweg. Wij reageren binnen één werkdag.",
    successDocs: "Bedankt - de productdocumentatie is onderweg naar uw inbox. Wij nemen binnen één werkdag contact op.",
    error: "Uw aanvraag kon niet worden verzonden. Probeer het opnieuw of mail naar contact@sgpapertronics.com.",
  },
  errors: {
    name: "Vul uw volledige naam in.",
    email: "Vul een geldig zakelijk e‑mailadres in.",
    company: "Vul uw bedrijf of organisatie in.",
    intent: "Kies waarover u wilt spreken.",
    message: "Beschrijf uw proces of vraag.",
    generic: "Controleer de gemarkeerde velden.",
  },
  required: "verplicht",
  docEmail: {
    subject: "Q‑Tector productdocumentatie",
    greeting: "Hallo",
    body: "Bedankt voor uw interesse in Q‑Tector. De aangevraagde productdocumentatie vindt u in de bijlage van deze e-mail.",
    linkLabel: "U kunt het document ook hier downloaden:",
    signoff: "Roept het vragen op over uw eigen proces - organisme, processtadium, monstermatrix, doelanalyt? Antwoord dan gewoon op deze e-mail; een mens leest mee.\n\nSG Papertronics\nBlauwborgje 31, 9747 AW Groningen, NL",
  },
};

const PL: ContactCopy = {
  eyebrow: "Rozpocznij rozmowę",
  heading: "Napisz, nad czym",
  headingAccent: "pracujesz",
  lead: "Podaj organizm, etap procesu, oznaczany analit oraz decyzję, którą musisz podjąć. Odpowiemy konkretnym następnym krokiem w ciągu jednego dnia roboczego.",
  fields: {
    name: { label: "Imię i nazwisko" },
    email: { label: "Służbowy e‑mail", hint: "Odpowiadamy wyłącznie na ten adres." },
    company: { label: "Firma lub organizacja" },
    intent: { label: "Czego ma dotyczyć rozmowa?" },
    message: {
      label: "Twój proces lub pytanie",
      hint: "Podaj - jeśli je znasz - organizm, obecny etap procesu, matrycę próbki, oznaczany analit i horyzont czasowy.",
    },
  },
  intents: {
    docs: "Poproś o dokumentację produktu",
    pilot: "Projekt pilotażowy lub wdrożeniowy",
    assay: "Rozwój własnego analitu lub testu",
    sales: "Sprzedaż i cennik",
    partnership: "Współpraca badawcza lub komercyjna",
    investor: "Relacje inwestorskie",
    general: "Pytanie ogólne",
  },
  submit: "Wyślij zapytanie",
  privacy: { text: "Twoich danych użyjemy wyłącznie po to, aby odpowiedzieć na zapytanie.", linkLabel: "Przeczytaj informację o prywatności." },
  states: {
    sending: "Wysyłanie…",
    success: "Dziękujemy - zapytanie zostało wysłane. Odpowiemy w ciągu jednego dnia roboczego.",
    successDocs: "Dziękujemy - dokumentacja produktu jest już w drodze na Twój adres. Odezwiemy się dodatkowo w ciągu jednego dnia roboczego.",
    error: "Nie udało się wysłać zapytania. Spróbuj ponownie lub napisz na contact@sgpapertronics.com.",
  },
  errors: {
    name: "Podaj imię i nazwisko.",
    email: "Podaj poprawny służbowy adres e‑mail.",
    company: "Podaj firmę lub organizację.",
    intent: "Wybierz, czego ma dotyczyć rozmowa.",
    message: "Opisz swój proces lub pytanie.",
    generic: "Sprawdź zaznaczone pola.",
  },
  required: "wymagane",
  docEmail: {
    subject: "Dokumentacja produktu Q‑Tector",
    greeting: "Cześć",
    body: "Dziękujemy za zainteresowanie Q‑Tectorem. Dokumentację produktu, o którą prosiłaś lub prosiłeś, znajdziesz w załączniku do tej wiadomości.",
    linkLabel: "Możesz ją też pobrać tutaj:",
    signoff: "Jeśli po lekturze pojawią się pytania o Twój własny proces - organizm, etap, matrycę próbki, oznaczany analit - odpisz na tę wiadomość, odpowie Ci człowiek.\n\nSG Papertronics\nBlauwborgje 31, 9747 AW Groningen, NL",
  },
};

export const CONTACT_COPY: Record<Locale, ContactCopy> = { en: EN, nl: NL, pl: PL };
