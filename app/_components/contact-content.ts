import type { Locale } from "../i18n";

/** The seven inquiry intents from the client audit (ch. 12). The `value` is the
 *  stable key used in the `?intent=` query param, the routed subject line and
 *  the CRM hand-off — never translate it. */
export const INTENTS = [
  "product",
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
  states: { sending: string; success: string; error: string };
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
    product: "Evaluate Q‑Tector",
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
    product: "Q‑Tector beoordelen",
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
    product: "Ocena Q‑Tectora",
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
};

export const CONTACT_COPY: Record<Locale, ContactCopy> = { en: EN, nl: NL, pl: PL };
