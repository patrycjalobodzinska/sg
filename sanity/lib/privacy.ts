import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";
import { defaultLocale } from "../../app/i18n";

export type PrivacyDoc = {
  title?: string;
  updated?: string;
  body?: PortableTextBlock[];
  /** true when the body is served from EN because the localized doc has none */
  bodyFallback?: boolean;
} | null;

const FIELDS = `title, updated, body`;

/** The privacy notice, with an EN fallback: a half-translated legal page is
 *  worse than an English one, so NL/PL fall back to the EN body. */
export async function getPrivacy(lang: string): Promise<PrivacyDoc> {
  try {
    const doc = await client.fetch<PrivacyDoc>(
      `*[_type=="privacyPage" && language==$lang][0]{${FIELDS}}`,
      { lang }
    );
    if (doc?.body?.length) return doc;
    if (lang === defaultLocale) return doc;
    const en = await client.fetch<PrivacyDoc>(
      `*[_type=="privacyPage" && language==$lang][0]{${FIELDS}}`,
      { lang: defaultLocale }
    );
    if (!en?.body?.length) return doc;
    return { ...(doc ?? {}), body: en.body, updated: doc?.updated ?? en.updated, bodyFallback: true };
  } catch {
    return null;
  }
}
