import { urlFor } from "../../sanity/lib/image";

/** A photo the editor dropped into a rich-text body (news article or case
 *  study). The schema has always allowed them; nothing rendered them, so an
 *  inserted photo silently disappeared from the published page.
 *
 *  Width is the article measure, not the viewport: these sit in a text column,
 *  so a wider render would only be downscaled by the browser. The intrinsic
 *  size comes from Sanity's own metadata so the block does not shift while the
 *  image loads. */
type BodyImageValue = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
};

export default function BodyImage({ value }: { value: BodyImageValue }) {
  if (!value?.asset) return null;
  let src: string;
  try {
    src = urlFor(value).width(1400).fit("max").auto("format").url();
  } catch {
    return null;
  }
  return (
    <figure style={{ margin: "clamp(26px,3.4vw,38px) 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={value.alt ?? ""}
        loading="lazy"
        decoding="async"
        style={{ display: "block", width: "100%", height: "auto", borderRadius: 12, background: "#E7EAF0" }}
      />
      {value.caption ? (
        <figcaption style={{ margin: "10px 0 0", color: "#5A6275", fontSize: 14.5, lineHeight: 1.5 }}>{value.caption}</figcaption>
      ) : null}
    </figure>
  );
}
