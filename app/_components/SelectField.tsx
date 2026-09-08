"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  invalid?: boolean;
  describedBy?: string;
  labelledBy?: string;
};

/** A listbox that looks the same in every browser — the native control renders
 *  as a grey OS widget that ignores the form's radii, type and focus ring.
 *
 *  Behaves like a select: click or Enter/Space opens it, arrows and Home/End
 *  move, typing jumps to a label, Enter picks, Escape and outside clicks close,
 *  focus returns to the button. The chosen value travels in a hidden input, so
 *  the server action receives exactly what a <select name> would have sent.
 *  Without JavaScript this widget never mounts: ContactForm keeps a real
 *  <select> in <noscript>. */
export default function SelectField({ id, name, value, onChange, options, invalid, describedBy, labelledBy }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const listId = useId();

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(i: number) {
    const option = options[i];
    if (!option) return;
    onChange(option.value);
    setActive(i);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = options.length - 1;
    if (e.key === "Escape") {
      if (open) { e.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
      return;
    }
    if (e.key === "Tab") { setOpen(false); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else setOpen(true);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      const next =
        e.key === "Home" ? 0
        : e.key === "End" ? last
        : e.key === "ArrowDown" ? Math.min(last, active + 1)
        : Math.max(0, active - 1);
      setActive(next);
      return;
    }
    // type-ahead, the way a native select behaves
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      typed.current = { text: now - typed.current.at > 700 ? e.key : typed.current.text + e.key, at: now };
      const match = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text.toLowerCase()));
      if (match >= 0) {
        setActive(match);
        if (!open) choose(match);
      }
    }
  }

  return (
    <div className="cf-select" data-open={open ? "" : undefined}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        ref={buttonRef}
        className="cf-select-button"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span>{selected?.label}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          ref={listRef}
          className="cf-select-list"
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onKeyDown}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              data-active={i === active ? "true" : undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <span>{o.label}</span>
              {o.value === value ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
