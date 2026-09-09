"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";
import Editorial from "./variants/Editorial";
import Immersive from "./variants/Immersive";
import Split from "./variants/Split";

const VARIANTS = [
  { name: "Editorial", Component: Editorial },
  { name: "Immersive", Component: Immersive },
  { name: "Split", Component: Split },
] as const;

export default function Harness() {
  const [current, setCurrent] = useState(0);
  const [mountKey, setMountKey] = useState(0);
  const [ready, setReady] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });

  const remount = useCallback(() => setMountKey((k) => k + 1), []);

  const select = useCallback(
    (i: number) => {
      if (i < 0 || i >= VARIANTS.length) return;
      setCurrent(i);
      remount();
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(i + 1));
      window.history.replaceState(null, "", url);
    },
    [remount],
  );

  /* Selection persists across reload via ?v=N, falling back to variant 1. Read
     after mount: the server renders variant 1, so setting it during render
     would be a hydration mismatch. */
  useEffect(() => {
    const v = parseInt(new URLSearchParams(window.location.search).get("v") ?? "", 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v >= 1 && v <= VARIANTS.length) setCurrent(v - 1);
  }, []);

  const measure = useCallback(() => {
    const el = itemRefs.current[current];
    if (el) setHighlight({ left: el.offsetLeft, width: el.offsetWidth });
  }, [current]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* The slide is enabled only after first paint, so load doesn't animate. */
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) select(num - 1);
      else if (e.key === "ArrowRight") select((current + 1) % VARIANTS.length);
      else if (e.key === "ArrowLeft") select((current - 1 + VARIANTS.length) % VARIANTS.length);
      else if (e.key === "r" || e.key === "R") remount();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, select, remount]);

  const Variant = VARIANTS[current].Component;

  return (
    <div className="hc-page">
      <Variant key={mountKey} />

      {/* the section that follows the hero on the live page, so the seam is judged */}
      <section className="hc-next">
        <span>↓ next section — Measure during the run</span>
        <h2>
          Measure during the run, <em>not after the opportunity to act.</em>
        </h2>
      </section>

      <nav className="proto-picker" aria-label="Prototype variants" {...(ready ? { "data-ready": "" } : {})}>
        <span
          className="proto-picker-highlight"
          aria-hidden="true"
          style={{ width: highlight.width, transform: `translateX(${highlight.left}px)` }}
        />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="proto-picker-item"
            onClick={() => select(i)}
            {...(i === current ? { "data-active": "", "aria-current": "true" as const } : {})}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={remount}>
          ↻
        </button>
      </nav>
    </div>
  );
}
