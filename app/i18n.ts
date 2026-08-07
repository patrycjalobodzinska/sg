export const locales = ["en", "nl", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
// locales that live under a URL prefix (default locale stays at root)
export const prefixedLocales = locales.filter((l) => l !== defaultLocale);
export const localeLabel: Record<Locale, string> = { en: "EN", nl: "NL", pl: "PL" };

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Build a path for a locale. EN → as-is; NL/PL → prefixed. `path` is the
 *  locale-less path starting with "/" (e.g. "/technology", "/"). */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Absolute-path alternates map for <link rel="alternate" hreflang>. */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of locales) out[l] = localizedPath(path, l);
  out["x-default"] = localizedPath(path, defaultLocale);
  return out;
}

/** Strip a leading locale prefix from a pathname → { locale, path }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const seg = pathname.split("/").filter(Boolean);
  if (seg.length && isLocale(seg[0]) && seg[0] !== defaultLocale) {
    return { locale: seg[0] as Locale, path: "/" + seg.slice(1).join("/") };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
