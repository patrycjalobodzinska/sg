import { localizedPath, type Locale } from "../i18n";
import type { Intent } from "./contact-content";

/** Where a contact CTA sends the reader (audit ch. 12).
 *
 *  Every CTA on the site routes through here so that no two buttons can quietly
 *  end up in the same undifferentiated inbox: the intent preselects the form's
 *  subject, and source_page / source_cta / vertical travel with it so a reply can
 *  be written against the context the reader was actually in.
 *
 *  Before this existed the subpages linked to the homepage's #contact anchor,
 *  which skipped the intent-aware form entirely. */
export function contactUrl(opts: {
  lang: Locale;
  intent: Intent;
  /** Page the CTA sits on, e.g. "technology". */
  sourcePage: string;
  /** Which CTA on that page, e.g. "hero-primary". */
  sourceCta: string;
  /** Optional process/customer type the CTA is scoped to. */
  vertical?: string;
}): string {
  const params = new URLSearchParams({
    intent: opts.intent,
    source_page: opts.sourcePage,
    source_cta: opts.sourceCta,
    locale: opts.lang,
  });
  if (opts.vertical) params.set("vertical", opts.vertical);
  return `${localizedPath("/contact", opts.lang)}?${params.toString()}`;
}
