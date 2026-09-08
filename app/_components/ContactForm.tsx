"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import SelectField from "./SelectField";
import { submitContact } from "../actions/contact";
import { CONTACT_INITIAL_STATE } from "./contact-state";
import { INTENTS, type ContactCopy, type Intent } from "./contact-content";
import type { Locale } from "../i18n";

type Props = {
  lang: Locale;
  t: ContactCopy;
  /** Preselected inquiry type, e.g. from /contact?intent=pilot. */
  intent: Intent;
  /** Page the conversation started on, carried through to the inbox. */
  sourcePage: string;
  sourceCta: string;
  vertical?: string;
  privacyHref?: string;
};

export default function ContactForm({ lang, t, intent, sourcePage, sourceCta, vertical, privacyHref }: Props) {
  const [state, formAction, pending] = useActionState(submitContact, CONTACT_INITIAL_STATE);
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const errId = (n: string) => `${uid}-${n}-err`;
  const hintId = (n: string) => `${uid}-${n}-hint`;
  const firstErrorRef = useRef<string | null>(null);
  const [intentValue, setIntentValue] = useState<Intent>(intent);

  const fe = state.fieldErrors ?? {};

  // Move focus to the first field the server rejected, so a keyboard or screen
  // reader user lands on the problem instead of hunting for it.
  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    const first = (["name", "email", "company", "intent", "message"] as const).find((k) => state.fieldErrors?.[k]);
    if (!first || firstErrorRef.current === first + state.message) return;
    firstErrorRef.current = first + state.message;
    document.getElementById(id(first))?.focus();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === "success") {
    return (
      <div className="cf-success" role="status">
        {t.states.success}
      </div>
    );
  }

  const describedBy = (n: string, hasHint: boolean) =>
    [hasHint ? hintId(n) : null, fe[n as keyof typeof fe] ? errId(n) : null].filter(Boolean).join(" ") || undefined;

  return (
    <form action={formAction} className="cf" noValidate>
      {/* Context the sales inbox needs; not user-editable. */}
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="source_page" value={sourcePage} />
      <input type="hidden" name="source_cta" value={sourceCta} />
      {vertical && <input type="hidden" name="vertical" value={vertical} />}
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="cf-hp" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="cf-field">
        <label htmlFor={id("name")}>
          {t.fields.name.label} <span className="cf-req">({t.required})</span>
        </label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={fe.name ? true : undefined}
          aria-describedby={describedBy("name", false)}
        />
        {fe.name && <p id={errId("name")} className="cf-err">{fe.name}</p>}
      </div>

      <div className="cf-field">
        <label htmlFor={id("email")}>
          {t.fields.email.label} <span className="cf-req">({t.required})</span>
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={fe.email ? true : undefined}
          aria-describedby={describedBy("email", true)}
        />
        <p id={hintId("email")} className="cf-hint">{t.fields.email.hint}</p>
        {fe.email && <p id={errId("email")} className="cf-err">{fe.email}</p>}
      </div>

      <div className="cf-field">
        <label htmlFor={id("company")}>
          {t.fields.company.label} <span className="cf-req">({t.required})</span>
        </label>
        <input
          id={id("company")}
          name="company"
          type="text"
          autoComplete="organization"
          required
          aria-invalid={fe.company ? true : undefined}
          aria-describedby={describedBy("company", false)}
        />
        {fe.company && <p id={errId("company")} className="cf-err">{fe.company}</p>}
      </div>

      <div className="cf-field">
        <label htmlFor={id("intent")}>
          {t.fields.intent.label} <span className="cf-req">({t.required})</span>
        </label>
        <SelectField
          id={id("intent")}
          name="intent"
          value={intentValue}
          onChange={(v) => setIntentValue(v as Intent)}
          options={INTENTS.map((v) => ({ value: v, label: t.intents[v] }))}
          invalid={Boolean(fe.intent)}
          describedBy={describedBy("intent", false)}
        />
        {/* Scripting off: the custom listbox never mounts, so ship the real
            control for those visitors instead of a dead button. */}
        <noscript>
          <style>{`.cf-select{display:none}`}</style>
          <select name="intent" defaultValue={intent} required aria-label={t.fields.intent.label}>
            {INTENTS.map((v) => (
              <option key={v} value={v}>
                {t.intents[v]}
              </option>
            ))}
          </select>
        </noscript>
        {fe.intent && <p id={errId("intent")} className="cf-err">{fe.intent}</p>}
      </div>

      <div className="cf-field">
        <label htmlFor={id("message")}>
          {t.fields.message.label} <span className="cf-req">({t.required})</span>
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          required
          aria-invalid={fe.message ? true : undefined}
          aria-describedby={describedBy("message", true)}
        />
        <p id={hintId("message")} className="cf-hint">{t.fields.message.hint}</p>
        {fe.message && <p id={errId("message")} className="cf-err">{fe.message}</p>}
      </div>

      <button type="submit" className="cf-submit sheen" disabled={pending}>
        {pending ? t.states.sending : t.submit}
      </button>

      {/* Single live region for both the pending and the failure state. */}
      <p className="cf-status" role="status" aria-live="polite">
        {pending ? t.states.sending : state.status === "error" ? state.message : ""}
      </p>

      <p className="cf-privacy">
        {t.privacy.text}{" "}
        {privacyHref ? <a href={privacyHref}>{t.privacy.linkLabel}</a> : null}
      </p>
    </form>
  );
}
