"use client";

import { useEffect, useRef } from "react";

export default function LandingClient({ markup }: { markup: string }) {
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
        c.className = "hero-corner";
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
      // Sticky header: transparent over the hero at the top, solid frosted bar
      // once the page starts scrolling.
      if (nav)
        nav.setAttribute("data-scrolled", window.scrollY > 24 ? "1" : "0");
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

    // ---- scroll-appear elements ([data-appear] / [data-introline]) ----
    const appearEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-appear],[data-introline]")
    );
    if (appearEls.length) {
      if (reduceMotion || typeof IntersectionObserver === "undefined") {
        appearEls.forEach((el) => el.classList.add("in"));
      } else {
        const ao = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) =>
              e.target.classList.toggle("in", e.isIntersecting)
            );
          },
          { threshold: 0.2 }
        );
        appearEls.forEach((el) => ao.observe(el));
        cleanups.push(() => ao.disconnect());
      }
    }

    // Section cards stay visible at all times - no appearance/reveal animation.
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
        // no tilt in the projects or "Better decisions" (benefits) sections
        if (card.closest("#projects")) return;
        if (card.closest("[data-benefitgrid]")) return;
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

    // ---- mobile: full-bleed sliders with pagination dots ----
    if (window.matchMedia("(max-width:720px)").matches) {
      const sliderSel =
        "[data-benefitgrid],[data-appgrid],[data-newsgrid],[data-bento-a]";
      root.querySelectorAll<HTMLElement>(sliderSel).forEach((slider) => {
        const section = slider.closest("section");
        const pad = section
          ? parseFloat(getComputedStyle(section).paddingLeft) || 0
          : 0;
        const gap = 14;
        // Full-bleed track (cancel the section's side padding) but keep a gutter:
        // internal padding insets the first/last card, gap spaces the cards.
        slider.style.marginLeft = `-${pad}px`;
        slider.style.marginRight = `-${pad}px`;
        slider.style.paddingLeft = `${pad}px`;
        slider.style.paddingRight = `${pad}px`;
        slider.style.scrollPaddingLeft = `${pad}px`;
        slider.style.gap = `${gap}px`;
        const cards = Array.from(slider.children) as HTMLElement[];
        cards.forEach((c) => {
          c.style.flex = "0 0 82%";
          c.style.scrollSnapAlign = "start";
        });
        if (cards.length < 2) return;

        const step = () => cards[0].getBoundingClientRect().width + gap;

        const dots = document.createElement("div");
        dots.className = "slider-dots";
        cards.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", `Go to slide ${i + 1}`);
          b.addEventListener("click", () =>
            slider.scrollTo({ left: step() * i, behavior: "smooth" })
          );
          dots.appendChild(b);
        });
        slider.after(dots);

        const update = () => {
          const idx = Math.min(
            cards.length - 1,
            Math.max(0, Math.round(slider.scrollLeft / step()))
          );
          Array.from(dots.children).forEach((d, i) =>
            (d as HTMLElement).classList.toggle("active", i === idx)
          );
        };
        update();
        slider.addEventListener("scroll", update, { passive: true });
        cleanups.push(() => {
          slider.removeEventListener("scroll", update);
          dots.remove();
        });
      });
    }

    // ---- mobile: pagination dots for the "Better decisions" card carousel ----
    // This slider flattens its bento columns via display:contents, so the actual
    // slides are the grandchildren, not the direct children - handle it separately.
    if (window.matchMedia("(max-width:720px)").matches) {
      root.querySelectorAll<HTMLElement>("[data-benefrow]").forEach((slider) => {
        const slides = Array.from(
          slider.querySelectorAll<HTMLElement>(":scope > * > *")
        );
        if (slides.length < 2) return;
        const gap = 12;
        const step = () => slides[0].getBoundingClientRect().width + gap;

        const dots = document.createElement("div");
        dots.className = "slider-dots";
        slides.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", `Go to slide ${i + 1}`);
          b.addEventListener("click", () =>
            slider.scrollTo({ left: step() * i, behavior: "smooth" })
          );
          dots.appendChild(b);
        });
        slider.after(dots);

        const update = () => {
          const idx = Math.min(
            slides.length - 1,
            Math.max(0, Math.round(slider.scrollLeft / step()))
          );
          Array.from(dots.children).forEach((d, i) =>
            (d as HTMLElement).classList.toggle("active", i === idx)
          );
        };
        update();
        slider.addEventListener("scroll", update, { passive: true });
        cleanups.push(() => {
          slider.removeEventListener("scroll", update);
          dots.remove();
        });
      });
    }

    // ---- tilted stacked-card deck for the "Explore what we can do" collage.
    // Cards sit one on top of another, fanned out to the sides at alternating
    // angles; a sideways drag flicks the front card to the back (dots mirror
    // the order). MOBILE ONLY — on desktop the collage stays as its static grid.
    if (window.matchMedia("(max-width:720px)").matches) {
      const deck = root.querySelector<HTMLElement>("[data-explore-collage]");
      const cards = deck ? (Array.from(deck.children) as HTMLElement[]) : [];
      if (deck && cards.length > 1) {
        const rot = [-4, 6, -9, 3];
        let order = cards.map((_, i) => i); // front → back

        const layout = () => {
          // on phones the front photo is enlarged and the peeking side cards
          // are pulled in tighter and scaled down harder so they stay small
          const mobile = window.matchMedia("(max-width:640px)").matches;
          const xOff = mobile ? [0, 30, -30, 0] : [0, 40, -40, 0];
          const scaleStep = mobile ? 0.14 : 0.05;
          order.forEach((cardIdx, depth) => {
            const c = cards[cardIdx];
            c.style.zIndex = String(cards.length - depth);
            c.style.opacity = depth > 2 ? "0" : "1";
            c.style.pointerEvents = depth === 0 ? "auto" : "none";
            c.style.transform =
              `translateX(${xOff[depth] ?? 0}px) translateY(${depth * 8}px) ` +
              `scale(${1 - depth * scaleStep}) rotate(${rot[depth % rot.length]}deg)`;
            c.style.boxShadow =
              depth === 0
                ? "0 26px 60px rgba(0,0,0,.5)"
                : "0 18px 40px rgba(0,0,0,.38)";
          });
        };
        layout();

        const dots = document.createElement("div");
        dots.className = "slider-dots";
        const syncDots = () =>
          Array.from(dots.children).forEach((d, i) =>
            (d as HTMLElement).classList.toggle("active", order[0] === i)
          );
        cards.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", `Show image ${i + 1}`);
          b.addEventListener("click", () => {
            while (order[0] !== i) order.push(order.shift()!);
            layout();
            syncDots();
          });
          dots.appendChild(b);
        });
        deck.after(dots);
        syncDots();

        let startX = 0;
        let startY = 0;
        let dragging = false;
        let decided = false;
        let horiz = false;
        const front = () => cards[order[0]];

        const onDown = (e: PointerEvent) => {
          dragging = true;
          decided = false;
          horiz = false;
          startX = e.clientX;
          startY = e.clientY;
          try {
            deck.setPointerCapture(e.pointerId);
          } catch {}
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (!decided) {
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            decided = true;
            horiz = Math.abs(dx) > Math.abs(dy);
          }
          if (!horiz) return;
          e.preventDefault();
          deck.classList.add("dragging");
          front().style.transform =
            `translateX(${dx}px) translateY(${(-Math.abs(dx) * 0.05).toFixed(1)}px) ` +
            `rotate(${(dx / 16).toFixed(2)}deg)`;
        };
        const onUp = (e: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          deck.classList.remove("dragging");
          const dx = e.clientX - startX;
          if (horiz && Math.abs(dx) > 55) {
            if (dx < 0) order.push(order.shift()!); // swipe left → next
            else order.unshift(order.pop()!); // swipe right → previous
          }
          layout();
          syncDots();
        };
        deck.addEventListener("pointerdown", onDown);
        deck.addEventListener("pointermove", onMove);
        deck.addEventListener("pointerup", onUp);
        deck.addEventListener("pointercancel", onUp);
        cleanups.push(() => {
          deck.removeEventListener("pointerdown", onDown);
          deck.removeEventListener("pointermove", onMove);
          deck.removeEventListener("pointerup", onUp);
          deck.removeEventListener("pointercancel", onUp);
          dots.remove();
        });
      }
    }

    // ---- "How we work" scroll-driven timeline (axis + progress line) ----
    const stepwrap = root.querySelector<HTMLElement>("[data-stepwrap]");
    if (stepwrap && window.matchMedia("(max-width:720px)").matches) {
      const steps = Array.from(
        stepwrap.querySelectorAll<HTMLElement>("[data-step]")
      );
      const circles = steps.map((s) => s.querySelector("span") as HTMLElement);
      if (steps.length && circles.every(Boolean)) {
        const axis = document.createElement("div");
        axis.className = "tl-axis";
        axis.setAttribute("aria-hidden", "true");
        const fill = document.createElement("div");
        fill.className = "tl-fill";
        axis.appendChild(fill);
        stepwrap.insertBefore(axis, stepwrap.firstChild);

        const position = () => {
          const w = stepwrap.getBoundingClientRect();
          const f = circles[0].getBoundingClientRect();
          const l = circles[circles.length - 1].getBoundingClientRect();
          axis.style.left = `${f.left - w.left + f.width / 2 - 1}px`;
          axis.style.top = `${f.top - w.top + f.height / 2}px`;
          axis.style.height = `${l.top - f.top}px`;
        };
        const activate = () => {
          const a = axis.getBoundingClientRect();
          const bottom = a.top + ((parseFloat(fill.style.height) || 0) / 100) * a.height;
          circles.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            steps[i].classList.toggle("active", r.top + r.height / 2 <= bottom + 4);
          });
        };

        if (reduceMotion) {
          position();
          fill.style.height = "100%";
          steps.forEach((s) => s.classList.add("active"));
        } else {
          const update = () => {
            position();
            const a = axis.getBoundingClientRect();
            const trigger = window.innerHeight * 0.6;
            let p = (trigger - a.top) / (a.height || 1);
            p = Math.max(0, Math.min(1, p));
            fill.style.height = `${p * 100}%`;
            activate();
          };
          update();
          window.addEventListener("scroll", update, { passive: true });
          window.addEventListener("resize", update, { passive: true });
          cleanups.push(() => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
          });
        }
        cleanups.push(() => axis.remove());
      }
    }

    // ---- "Trusted by" auto-scrolling marquee ----
    const partners = root.querySelector<HTMLElement>("[data-partners]");
    if (partners && !partners.querySelector(".marquee-wrap")) {
      const items = Array.from(partners.children) as HTMLElement[];
      // autoplay carousel on every width (seamless marquee)
      if (items.length > 1) {
        const wrap = document.createElement("div");
        wrap.className = "marquee-wrap";
        items.forEach((it) => wrap.appendChild(it));
        items.forEach((it) => {
          const c = it.cloneNode(true) as HTMLElement;
          c.setAttribute("aria-hidden", "true");
          c.setAttribute("data-clone", "1");
          wrap.appendChild(c);
        });
        partners.style.display = "block";
        partners.style.gap = "";
        partners.style.justifyContent = "";
        partners.style.flexWrap = "";
        partners.classList.add("marquee");
        partners.appendChild(wrap);
      }
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
  }, [markup]);

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: markup }} />;
}
