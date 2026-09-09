import Link from "next/link";
import ArrowUpRight from "@/app/_components/ArrowUpRight";
import { BADGE, CTA_1, CTA_2, FOCUS, LEAD, PHOTOS, TITLE_ACCENT, TITLE_LEAD } from "../data";

/** Axis: immersion. The whole hero is a wall of photographs — five frames in a
 *  mosaic — dimmed under a scrim, with the copy centred on top in white. */
export default function Immersive() {
  const wall = [
    { key: "device", src: PHOTOS.device, cls: "im-a" },
    { key: "field", src: PHOTOS.field, cls: "im-b" },
    { key: "tanks", src: PHOTOS.tanks, cls: "im-c" },
    { key: "lab", src: PHOTOS.lab, cls: "im-d" },
    { key: "operator", src: PHOTOS.operator, cls: "im-e" },
  ];

  return (
    <header className="im">
      <div className="im-wall" aria-hidden="true">
        {wall.map((w, i) => (
          <div key={w.key} className={w.cls} style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.src} alt="" loading={i > 1 ? "lazy" : undefined} />
          </div>
        ))}
      </div>
      <div className="im-scrim" aria-hidden="true" />

      <div className="im-inner">
        <p className="im-badge hc-rise">
          <span aria-hidden="true">◆</span> {BADGE}
        </p>
        <h1 className="im-title hc-rise" style={{ "--d": "70ms" } as React.CSSProperties}>
          {TITLE_LEAD} <em>{TITLE_ACCENT}</em>
        </h1>
        <p className="im-lead hc-rise" style={{ "--d": "140ms" } as React.CSSProperties}>
          {LEAD}
        </p>
        <div className="im-actions hc-rise" style={{ "--d": "200ms" } as React.CSSProperties}>
          <Link className="im-btn" href="/technology">
            {CTA_1} <ArrowUpRight />
          </Link>
          <Link className="im-btn im-btn--ghost" href={{ pathname: "/contact", query: { intent: "pilot" } }}>
            {CTA_2} <ArrowUpRight />
          </Link>
        </div>
        <p className="im-focus hc-rise" style={{ "--d": "260ms" } as React.CSSProperties}>
          {FOCUS}
        </p>
      </div>
    </header>
  );
}
