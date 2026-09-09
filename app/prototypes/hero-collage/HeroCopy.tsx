import Link from "next/link";
import ArrowUpRight from "@/app/_components/ArrowUpRight";
import { CTA_1, CTA_2, EYEBROW, FOCUS, LEAD, TITLE_ACCENT, TITLE_LEAD } from "./data";

/** The hero copy block, identical in all three variants so the comparison is
 *  about the imagery and nothing else. */
export default function HeroCopy({ delay = 0, onDark = false }: { delay?: number; onDark?: boolean }) {
  const d = (n: number) => ({ "--d": `${delay + n}ms` }) as React.CSSProperties;
  return (
    <div className={onDark ? "hc-onDark" : undefined}>
      <p className="hc-eyebrow hc-rise" style={d(0)}>
        {EYEBROW}
      </p>
      <h1 className="hc-title hc-rise" style={d(60)}>
        {TITLE_LEAD} <span>{TITLE_ACCENT}</span>
      </h1>
      <div className="hc-card hc-rise" style={d(140)}>
        <p>{LEAD}</p>
        <p className="hc-focus">
          <i aria-hidden="true" /> {FOCUS}
        </p>
      </div>
      <div className="hc-actions hc-rise" style={d(200)}>
        <Link className="hc-btn" href="/technology">
          {CTA_1} <ArrowUpRight />
        </Link>
        <Link className="hc-btn hc-btn--ghost" href={{ pathname: "/contact", query: { intent: "pilot" } }}>
          {CTA_2} <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
}
