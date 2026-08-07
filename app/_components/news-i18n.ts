import type { Locale } from "../i18n";

export type NewsChrome = {
  heroTitle: string;
  heroAccent: string;
  heroLead: string;
  listDesc: string;
  categoryDefault: string;
  by: (author: string) => string;
  readStory: string;
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
      "News and updates from SG Papertronics - Beer-o-Meter and Q‑Tector milestones, events, grants, partnerships and company announcements.",
    categoryDefault: "News",
    by: (a) => `By ${a}`,
    readStory: "Read the full story",
    readMore: "Read more",
    ctaHeading: "Want the latest from SG Papertronics?",
    ctaBody:
      "Talk to us about Q‑Tector, pilots and partnerships - we'll keep you posted on releases and milestones.",
    ctaButton: "Get in touch",
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
      "Nieuws en updates van SG Papertronics - mijlpalen rond Beer-o-Meter en Q‑Tector, evenementen, subsidies, samenwerkingen en bedrijfsaankondigingen.",
    categoryDefault: "Nieuws",
    by: (a) => `Door ${a}`,
    readStory: "Lees het volledige verhaal",
    readMore: "Lees meer",
    ctaHeading: "Wil je het laatste nieuws van SG Papertronics?",
    ctaBody:
      "Praat met ons over Q‑Tector, pilots en samenwerkingen - we houden je op de hoogte van releases en mijlpalen.",
    ctaButton: "Neem contact op",
    allNews: "Alle nieuws",
    comingSoon: "Volledig artikel binnenkort beschikbaar.",
    articleCta: "Praat met ons over jouw proces",
  },
  pl: {
    heroTitle: "Aktualności i",
    heroAccent: "nowości",
    heroLead:
      "Kamienie milowe produktów, wydarzenia, granty, partnerstwa i ogłoszenia firmowe SG Papertronics.",
    listDesc:
      "Aktualności i nowości SG Papertronics - kamienie milowe Beer-o-Meter i Q‑Tector, wydarzenia, granty, partnerstwa i ogłoszenia firmowe.",
    categoryDefault: "Aktualności",
    by: (a) => `Autor: ${a}`,
    readStory: "Przeczytaj całą historię",
    readMore: "Czytaj dalej",
    ctaHeading: "Chcesz być na bieżąco z SG Papertronics?",
    ctaBody:
      "Porozmawiaj z nami o Q‑Tector, pilotażach i partnerstwach - będziemy informować o premierach i kamieniach milowych.",
    ctaButton: "Skontaktuj się",
    allNews: "Wszystkie aktualności",
    comingSoon: "Pełny artykuł już wkrótce.",
    articleCta: "Porozmawiaj z nami o swoim procesie",
  },
};
