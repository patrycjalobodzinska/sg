import HeroCopy from "../HeroCopy";
import { PHOTOS } from "../data";

/** Axis: a hard split. Copy owns a dark half at full bleed, photographs own the
 *  other — no text over an image, no gradient doing the work. */
export default function Split() {
  const tiles = [
    { key: "device", src: PHOTOS.device, cls: "sp-big", alt: "The Q‑Tector reader standing on a fermentation tank" },
    { key: "field", src: PHOTOS.field, cls: "", alt: "Rows of a green crop field" },
    { key: "tanks", src: PHOTOS.tanks, cls: "", alt: "Stainless fermentation tanks outside a brewery at night" },
  ];

  return (
    <header className="sp">
      <div className="sp-copy">
        <HeroCopy onDark />
      </div>
      <div className="sp-grid">
        {tiles.map((t, i) => (
          <figure key={t.key} className={t.cls} style={{ "--d": `${120 + i * 90}ms` } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.src} alt={t.alt} loading={i > 1 ? "lazy" : undefined} />
          </figure>
        ))}
      </div>
    </header>
  );
}
