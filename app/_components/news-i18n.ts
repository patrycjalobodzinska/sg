import type { Locale } from "../i18n";

export type NewsChrome = {
  heroTitle: string;
  heroAccent: string;
  heroLead: string;
  listDesc: string;
  categoryDefault: string;
  readMore: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  allNews: string;
  comingSoon: string;
  articleCta: string;
};

export const NEWS_CHROME: Record<Locale, NewsChrome> = {
  en: {
    heroTitle: "News &",
    heroAccent: "updates",
    heroLead:
      "Product milestones, events, grants, partnerships and company announcements from SG Papertronics.",
    listDesc:
      "News and updates from SG Papertronics - Q‑Tector milestones, its Beer‑o‑Meter brewing application, events, grants, partnerships and company announcements.",
    categoryDefault: "Company",
    readMore: "Read the full story",
    ctaHeading: "Have an application in mind?",
    ctaBody:
      "Tell us your organism, process stage and target analyte, and we'll say whether an existing Q‑Tector workflow fits or an application-development path makes sense.",
    ctaButton: "Discuss your application",
    allNews: "All news",
    comingSoon: "Full article coming soon.",
    articleCta: "Talk to us about your process",
  },
  nl: {
    heroTitle: "Nieuws &",
    heroAccent: "updates",
    heroLead:
      "Productmijlpalen, evenementen, subsidies, samenwerkingen en bedrijfsnieuws van SG Papertronics.",
    listDesc:
      "Nieuws en updates van SG Papertronics - mijlpalen rond Q‑Tector, de Beer‑o‑Meter-brouwtoepassing, evenementen, subsidies, samenwerkingen en bedrijfsaankondigingen.",
    categoryDefault: "Bedrijf",
    readMore: "Lees het volledige verhaal",
    ctaHeading: "Heeft u een toepassing in gedachten?",
    ctaBody:
      "Vertel ons uw organisme, processtadium en doelanalyt, en wij zeggen of een bestaande Q‑Tector-workflow past of dat een applicatieontwikkelingstraject zinvol is.",
    ctaButton: "Bespreek uw toepassing",
    allNews: "Alle nieuws",
    comingSoon: "Volledig artikel binnenkort beschikbaar.",
    articleCta: "Praat met ons over jouw proces",
  },
  pl: {
    heroTitle: "Nowości i",
    heroAccent: "kamienie milowe",
    heroLead:
      "Kamienie milowe produktu, wydarzenia, granty, partnerstwa i ogłoszenia firmowe SG Papertronics.",
    listDesc:
      "Aktualności SG Papertronics - kamienie milowe Q‑Tectora, jego browarnicze zastosowanie Beer‑o‑Meter, wydarzenia, granty, partnerstwa i ogłoszenia firmowe.",
    categoryDefault: "Firma",
    readMore: "Przeczytaj całość",
    ctaHeading: "Masz na myśli konkretne zastosowanie?",
    ctaBody:
      "Napisz nam, z jakim organizmem pracujesz, na jakim etapie jest proces i jaki analit Cię interesuje - odpowiemy, czy pasuje istniejące workflow Q‑Tectora, czy raczej ma sens ścieżka rozwoju nowego zastosowania.",
    ctaButton: "Porozmawiajmy o zastosowaniu",
    allNews: "Wszystkie aktualności",
    comingSoon: "Pełny artykuł już wkrótce.",
    articleCta: "Porozmawiajmy o Twoim procesie",
  },
};
