/** Fallback privacy notice.
 *
 *  The live text is edited in Sanity (Pages -> Privacy, rich text). This literal
 *  is what renders until a document exists, and what NL/PL fall back to when the
 *  translation is still empty — the page must never be an empty legal page.
 *
 *  It describes only what the site actually does today: the contact form, email
 *  correspondence and hosting logs. There is no analytics section because no
 *  analytics is installed; add that paragraph in Sanity in the same deploy that
 *  turns tracking on, not before. Legal review is the client's.
 */

export type PrivacySection = { heading: string; paragraphs: string[] };

export const PRIVACY_CHROME = {
  en: { title: "Privacy Notice", updated: "Last updated" },
  nl: { title: "Privacyverklaring", updated: "Laatst bijgewerkt" },
  pl: { title: "Polityka prywatności", updated: "Ostatnia aktualizacja" },
} as const;

export const PRIVACY_UPDATED = "2026-09-07";

export const PRIVACY_EN: PrivacySection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "SG Papertronics B.V., Blauwborgje 31, 9747 AW Groningen, the Netherlands, is responsible for the personal data described in this notice. You can reach us at contact@sgpapertronics.com.",
      "This notice explains what personal data we handle when you use sgpapertronics.com or contact us, why we handle it and what rights you have.",
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "Contact form: your name, work email address, company or organisation, the type of inquiry you select and the message you write. You decide what to put in the message.",
      "Correspondence: the emails you send us and our replies.",
      "Technical logs: our hosting provider records the usual server data, such as IP address, browser type and the page requested, so that pages can be delivered and the site kept secure.",
    ],
  },
  {
    heading: "Why we use it, and on what basis",
    paragraphs: [
      "To answer your inquiry and, where relevant, to prepare or perform an agreement with you or your organisation.",
      "To operate, secure and improve the website, which is our legitimate interest.",
      "We do not use your data for automated decision-making, and we do not sell it.",
    ],
  },
  {
    heading: "Who else sees it",
    paragraphs: [
      "Service providers that host the website, store its content and deliver our email process the data on our instructions and may not use it for their own purposes.",
      "We share data with others only where the law requires it.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep an inquiry for as long as we need it to answer you and to keep a record of our business contacts, and delete it when that reason ends. Server logs are kept for a short period for security and troubleshooting.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "The website does not use advertising or tracking cookies. Any storage in your browser is what is needed to display the pages you request.",
      "Analytics runs only if you accept it. When you first arrive we ask, nothing is measured until you say yes, and you can change your mind at any time through “Cookie settings” at the bottom of any page.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask us for a copy of your personal data, and ask us to correct, delete or restrict it. You can object to processing based on our legitimate interest, and ask to receive your data in a portable form.",
      "Write to contact@sgpapertronics.com and we will respond within one month. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "We update this notice when the way we handle personal data changes. The date above shows the current version.",
    ],
  },
];
