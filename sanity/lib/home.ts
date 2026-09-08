import { client } from "./client";
import { urlFor } from "./image";
import { HOME_EN, type HomeContent } from "../../app/_components/home-content";
import { defaultLocale, type Locale } from "../../app/i18n";

const FIELDS = `
  nav, hero, intro, benefits, explore, lifecycle, howWeWork, contact, footer, seo, images,
  partners{
    heading, headingAccent,
    "items": items[]->{
      title, tag, relationship, status, "text": description, result, quote, quoteAuthor, link, image
    }
  }
`;

// build a CDN URL from a Sanity image object, or null if there's no asset
function imgUrl(src: unknown, w: number): string | null {
  try {
    return src && (src as { asset?: unknown }).asset ? urlFor(src).width(w).auto("format").url() : null;
  } catch {
    return null;
  }
}

type RawImages = {
  heroBg?: unknown;
  lifecycle?: unknown[];
};

// resolve Sanity image refs → URLs, falling back to the EN literal defaults
function resolveImages(raw: RawImages | undefined): HomeContent["images"] {
  const d = HOME_EN.images;
  if (!raw) return d;
  const life = raw.lifecycle ?? [];
  return {
    heroBg: imgUrl(raw.heroBg, 2400) ?? d.heroBg,
    lifecycle: [
      imgUrl(life[0], 900) ?? d.lifecycle[0],
      imgUrl(life[1], 900) ?? d.lifecycle[1],
      imgUrl(life[2], 900) ?? d.lifecycle[2],
    ],
  };
}

// Deep-merge a (partial, untyped) Sanity value over an EN fallback so the
// landing never renders an empty field. Arrays are merged element-by-element
// against the fallback so a translated item missing a sub-field still fills in.
function merge<T>(fallback: T, src: unknown): T {
  if (src === undefined || src === null) return fallback;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(src) || src.length === 0) return fallback;
    const fb = fallback as unknown[];
    const merged = src.map((item, i) => (i < fb.length ? merge(fb[i], item) : item));
    // A dataset that still holds fewer items than the code expects must not
    // shorten the array — the template indexes fixed positions.
    return (merged.length < fb.length
      ? [...merged, ...fb.slice(merged.length)]
      : merged) as unknown as T;
  }
  if (typeof fallback === "object" && fallback !== null) {
    if (typeof src !== "object" || Array.isArray(src)) return fallback;
    const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
    for (const k of Object.keys(fallback as Record<string, unknown>)) {
      out[k] = merge((fallback as Record<string, unknown>)[k], (src as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  // scalar: ignore empty strings so a blank field falls back to EN
  if (typeof src === "string" && src.trim() === "") return fallback;
  return src as T;
}

type RawCard = Record<string, unknown> & { image?: unknown };
type RawPartners = { heading?: string; headingAccent?: string; items?: RawCard[] };

/** Cards come back with a Sanity image ref; the template only wants a URL, and an
 *  absent image simply means the card renders without one. */
function resolveCards(items: RawCard[] | undefined) {
  if (!items?.length) return undefined;
  return items.map((item) => ({ ...item, image: imgUrl(item.image, 900) ?? "" }));
}

export async function getHome(lang: Locale = defaultLocale): Promise<HomeContent> {
  let doc: Partial<HomeContent> | null = null;
  try {
    doc = await client.fetch(
      `*[_type=="homePage" && language==$lang][0]{${FIELDS}}`,
      { lang }
    );
  } catch {
    doc = null;
  }
  // Merge text fields over EN; resolve images separately (they're asset refs,
  // not URL strings, so they must not go through the string merge).
  const rawImages = (doc as { images?: RawImages } | null)?.images;
  // Proof cards carry an image ref, not a URL — resolve before the string merge.
  const partners = (doc as { partners?: RawPartners } | null)?.partners;
  const src = doc
    ? { ...doc, images: undefined, partners: partners ? { ...partners, items: resolveCards(partners.items) } : undefined }
    : null;
  const merged = merge(HOME_EN, src);
  merged.images = resolveImages(rawImages);
  return merged;
}
