"use server";

import { headers } from "next/headers";
import { CONTACT_COPY, DEFAULT_INTENT, isIntent, type Intent } from "../_components/contact-content";
import { defaultLocale, isLocale, type Locale } from "../i18n";
import type { ContactState } from "../_components/contact-state";


const INBOX = process.env.CONTACT_INBOX || "contact@sgpapertronics.com";
const FROM = process.env.CONTACT_FROM || "SG Papertronics website <website@sgpapertronics.com>";

// Deliberately permissive: the point is to reject obvious typos, not to police
// address syntax. Real verification happens when we reply.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Route the inquiry to a subject line the sales inbox can filter on. */
const SUBJECT: Record<Intent, string> = {
  product: "Q‑Tector evaluation",
  pilot: "Pilot / application project",
  assay: "Custom assay development",
  sales: "Sales and pricing",
  partnership: "Partnership",
  investor: "Investor relations",
  general: "General question",
};

/**
 * Deliver the inquiry. Returns false if it was NOT delivered — the caller must
 * then surface an error, never a success message. Silently dropping an inquiry
 * while telling the sender it was sent is the one outcome this must never have.
 */
async function deliver(subject: string, body: string, replyTo: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Unconfigured is a deployment fault, not a user error: log loudly and fail
    // closed so the visitor is told to email us directly.
    console.error("[contact] RESEND_API_KEY is not set — inquiry NOT delivered:", { subject, replyTo });
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [INBOX], reply_to: replyTo, subject, text: body }),
    });
    if (!res.ok) {
      console.error("[contact] delivery failed", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] delivery threw", err);
    return false;
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const localeRaw = str(formData, "locale");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const t = CONTACT_COPY[locale];

  // Honeypot: a real browser leaves this hidden field empty. Answer with the
  // success state so a bot has no signal to tune against.
  if (str(formData, "website")) return { status: "success" };

  const name = str(formData, "name");
  const email = str(formData, "email");
  const company = str(formData, "company");
  const intentRaw = str(formData, "intent");
  const message = str(formData, "message");

  const fieldErrors: NonNullable<ContactState["fieldErrors"]> = {};
  if (name.length < 2) fieldErrors.name = t.errors.name;
  if (!EMAIL_RE.test(email)) fieldErrors.email = t.errors.email;
  if (company.length < 2) fieldErrors.company = t.errors.company;
  if (!isIntent(intentRaw)) fieldErrors.intent = t.errors.intent;
  if (message.length < 10) fieldErrors.message = t.errors.message;
  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors, message: t.errors.generic };
  }

  const intent: Intent = isIntent(intentRaw) ? intentRaw : DEFAULT_INTENT;

  // Context the audit asks us to preserve end-to-end (ch. 4): which page and
  // which CTA started the conversation, and in which language.
  const sourcePage = str(formData, "source_page") || "/";
  const sourceCta = str(formData, "source_cta") || "contact-section";
  const h = await headers();

  const body = [
    `Intent:       ${intent} (${t.intents[intent]})`,
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Organisation: ${company}`,
    "",
    message,
    "",
    "—",
    `Locale:       ${locale}`,
    `Source page:  ${sourcePage}`,
    `Source CTA:   ${sourceCta}`,
    `Referer:      ${h.get("referer") ?? "—"}`,
    `Received:     ${new Date().toISOString()}`,
  ].join("\n");

  const ok = await deliver(`[${SUBJECT[intent]}] ${company} — ${name}`, body, email);
  return ok ? { status: "success" } : { status: "error", message: t.states.error };
}
