"use client";

import { useEffect, useRef } from "react";
import markup from "./_landing-markup";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];

    // Always open at the top: stop the browser restoring a scrolled position on
    // refresh (which would leave the first content tucked under the fixed nav).
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      cleanups.push(() => {
        history.scrollRestoration = prev;
      });
    }
    if (!window.location.hash) window.scrollTo(0, 0);

    // ---- style-hover / style-focus (design-composer attributes) ----
    const applyDecl = (el: HTMLElement, decl: string) => {
      decl.split(";").forEach((rule) => {
        const idx = rule.indexOf(":");
        if (idx === -1) return;
        const prop = rule.slice(0, idx).trim();
        const val = rule.slice(idx + 1).trim();
        if (prop) el.style.setProperty(prop, val);
      });
    };
    const wire = (attr: string, onEvt: string, offEvt: string) => {
      root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
        const decl = el.getAttribute(attr) || "";
        const original = el.getAttribute("style") || "";
        const on = () => applyDecl(el, decl);
        const off = () => el.setAttribute("style", original);
        el.addEventListener(onEvt, on);
        el.addEventListener(offEvt, off);
        cleanups.push(() => {
          el.removeEventListener(onEvt, on);
          el.removeEventListener(offEvt, off);
        });
      });
    };
    wire("style-hover", "mouseenter", "mouseleave");
    wire("style-focus", "focus", "blur");

    // ---- hero corner covers ----
    // Paint the page background over each rounded corner so no sub-pixel of the
    // hero image can ever leak past the mask, whatever the browser does with
    // compositing/anti-aliasing at the radius.
    const parallax = root.querySelector<HTMLElement>("[data-parallax]");
    const maskEl = parallax?.parentElement;
    if (maskEl) {
      const R = 30;
      const corners: Array<[string, string]> = [
        ["top:0;left:0", "100% 100%"],
        ["top:0;right:0", "0% 100%"],
        ["bottom:0;left:0", "100% 0%"],
        ["bottom:0;right:0", "0% 0%"],
      ];
      corners.forEach(([pos, at]) => {
        const c = document.createElement("div");
        c.setAttribute("aria-hidden", "true");
        c.style.cssText =
          `position:absolute;${pos};width:${R}px;height:${R}px;z-index:5;` +
          `pointer-events:none;` +
          `background:radial-gradient(circle ${R}px at ${at}, transparent ${R - 1}px, #EFF1F5 ${R - 0.3}px)`;
        maskEl.appendChild(c);
      });
    }

    // ---- sticky nav: translucent over hero, solid on scroll + hero parallax ----
    const nav = root.querySelector<HTMLElement>("[data-nav]");
    const onScroll = () => {
      const solid = window.scrollY > 40;
      if (nav) {
        nav.style.background = solid
          ? "rgba(239,241,245,.92)"
          : "rgba(239,241,245,.82)";
        nav.style.boxShadow = solid ? "0 6px 24px rgba(20,26,48,.06)" : "none";
      }
      if (parallax)
        parallax.style.transform =
          window.scrollY > 0 ? `translateY(${window.scrollY * 0.18}px)` : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // ---- mobile menu toggle ----
    const burger = root.querySelector<HTMLElement>("[data-nav-burger]");
    if (nav && burger) {
      const toggle = () =>
        nav.setAttribute(
          "data-open",
          nav.getAttribute("data-open") === "1" ? "0" : "1"
        );
      burger.addEventListener("click", toggle);
      const closers = root.querySelectorAll<HTMLElement>("[data-nl]");
      const close = () => nav.setAttribute("data-open", "0");
      closers.forEach((a) => a.addEventListener("click", close));
      cleanups.push(() => {
        burger.removeEventListener("click", toggle);
        closers.forEach((a) => a.removeEventListener("click", close));
      });
    }

    // ---- reveal / scroll animations (replay every time a section re-enters view) ----
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Fire a callback once, the first time an element scrolls into view.
    const once = (
      el: Element,
      cb: () => void,
      opts: IntersectionObserverInit
    ) => {
      if (typeof IntersectionObserver === "undefined") {
        cb();
        return;
      }
      const o = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            cb();
            o.disconnect();
          }
        });
      }, opts);
      o.observe(el);
      cleanups.push(() => o.disconnect());
    };

    // Section cards stay visible at all times — no appearance/reveal animation.
    // Only the small, targeted in-section animations below run (count-up, the
    // "How we work" line, the pilot-scale bars) plus the hover tilt.

    // ---- count-up numbers (re-runs each time they enter view) ----
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      if (!target) return;
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      el.textContent = "0";
      let raf = 0;
      const run = () => {
        cancelAnimationFrame(raf);
        const dur = 1300;
        let start = 0;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
          else el.textContent = String(target);
        };
        raf = requestAnimationFrame(step);
      };
      once(el, run, { threshold: 0.6 });
      cleanups.push(() => cancelAnimationFrame(raf));
    });

    // ---- "How we work" progress line draws in (replays on re-entry) ----
    const stepline = root.querySelector<HTMLElement>("[data-stepline]");
    if (stepline) {
      if (reduceMotion) stepline.style.transform = "scaleX(1)";
      else
        once(stepline, () => (stepline.style.transform = "scaleX(1)"), {
          threshold: 0.3,
        });
    }

    // ---- pilot-scale bars grow from the baseline (replays on re-entry) ----
    root.querySelectorAll<HTMLElement>("[data-bars]").forEach((wrap) => {
      const bars = Array.from(wrap.children) as HTMLElement[];
      const targets = bars.map((b) => b.style.height);
      if (reduceMotion) return;
      bars.forEach((b, i) => {
        b.style.transition = "height .8s cubic-bezier(.2,.7,.2,1)";
        b.style.transitionDelay = `${i * 90}ms`;
        b.style.height = "0%";
      });
      once(wrap, () => bars.forEach((b, i) => (b.style.height = targets[i])), {
        threshold: 0.4,
      });
    });

    // ---- 3D tilt on cards (skip touch + reduced-motion + cards with an existing hover) ----
    if (!reduceMotion && !window.matchMedia("(hover: none)").matches) {
      root.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
        if (card.hasAttribute("style-hover")) return;
        // no tilt in the "See how we solve problems" (projects) section
        if (card.closest("#projects")) return;
        card.style.transformStyle = "preserve-3d";
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transition = "transform .08s linear";
          card.style.transform =
            `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) ` +
            `rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
        };
        const onLeave = () => {
          card.style.transition = "transform .45s cubic-bezier(.2,.7,.2,1)";
          card.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    // ---- contact form ----
    const form = root.querySelector<HTMLFormElement>("[data-form]");
    const sent = root.querySelector<HTMLElement>("[data-form-sent]");
    if (form && sent) {
      const submit = (e: Event) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        form.style.display = "none";
        sent.style.display = "block";
      };
      form.addEventListener("submit", submit);
      cleanups.push(() => form.removeEventListener("submit", submit));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: markup }} />;
}
