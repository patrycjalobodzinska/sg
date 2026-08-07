"use client";

import { useEffect, useRef, useState } from "react";

/**
 * News grid that behaves as a static 3-up grid on desktop and a swipeable
 * carousel on mobile (the horizontal-snap styling lives in globals.css under
 * [data-newsgrid]). On mobile it adds prev/next arrows and pagination pills.
 */
export default function NewsCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setCount(track.children.length);

    const mq = window.matchMedia("(max-width:720px)");
    const applyMobile = () => setMobile(mq.matches);
    applyMobile();
    mq.addEventListener("change", applyMobile);

    const step = () => {
      const first = track.children[0] as HTMLElement | undefined;
      return first ? first.getBoundingClientRect().width + 24 : 1;
    };
    const onScroll = () =>
      setActive(Math.max(0, Math.round(track.scrollLeft / step())));
    track.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", applyMobile);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width + 24 : 0;
    const clamped = Math.max(0, Math.min(count - 1, i));
    track.scrollTo({ left: step * clamped, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        data-newsgrid="1"
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
      >
        {children}
      </div>

      {mobile && count > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            aria-label="Previous"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <div className="slider-dots">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                className={i === active ? "active" : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow"
            aria-label="Next"
            disabled={active >= count - 1}
            onClick={() => goTo(active + 1)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
