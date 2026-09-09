import HeroCopy from "../HeroCopy";
import { PHOTOS } from "../data";

/** Axis: editorial contact sheet. Copy holds a calm panel on the left; four
 *  photographs of deliberately unequal height sit beside it — the tank hall
 *  full height, the reader over the lab bench, and the field running the full
 *  height of the last column. */
export default function Editorial() {
  return (
    <header className="ed">
      <div className="ed-copy">
        <HeroCopy />
      </div>

      <div className="ed-grid">
        <figure className="ed-hero" style={{ "--d": "80ms" } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.tanks} alt="Stainless fermentation tanks outside a brewery at night" />
        </figure>

        <div className="ed-col">
          <figure className="ed-device" style={{ "--d": "160ms", flex: "1.15" } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS.device} alt="The Q‑Tector reader standing on a fermentation tank" />
          </figure>
          <figure style={{ "--d": "240ms", flex: "0.85" } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS.lab} alt="A microscope and sample racks on a laboratory bench" />
          </figure>
        </div>

        <figure className="ed-tall" style={{ "--d": "320ms" } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.field} alt="Rows of a green crop field" />
        </figure>
      </div>
    </header>
  );
}
