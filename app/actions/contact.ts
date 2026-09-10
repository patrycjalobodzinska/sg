"use server";

import { headers } from "next/headers";
import { CONTACT_COPY, DEFAULT_INTENT, isIntent, type Intent } from "../_components/contact-content";
import { defaultLocale, isLocale, type Locale } from "../i18n";
import { getProductDoc } from "../../sanity/lib/settings";
import type { ContactState } from "../_components/contact-state";


const INBOX = process.env.CONTACT_INBOX || "contact@sgpapertronics.com";
const FROM = process.env.CONTACT_FROM || "SG Papertronics website <website@sgpapertronics.com>";

// Deliberately permissive: the point is to reject obvious typos, not to police
// address syntax. Real verification happens when we reply.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Route the inquiry to a subject line the sales inbox can filter on. */
const SUBJECT: Record<Intent, string> = {
  docs: "Product documentation request",
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
type Attachment = { filename: string; path: string };

async function deliver(
  subject: string,
  body: string,
  replyTo: string,
  opts: { to?: string; attachments?: Attachment[] } = {}
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = opts.to ?? INBOX;
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
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: replyTo,
        subject,
        text: body,
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      }),
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

/**
 * Email the requester the product documentation. Returns true only when Resend
 * accepted it, because the form's confirmation is allowed to mention the
 * document only if it actually went out.
 *
 * Not configured yet is the normal case, not an error: until the client uploads
 * the PDF in Studio (Site settings → Contact → Product documentation) this
 * returns false, the sales inbox still receives the request, and the visitor is
 * told only that we will reply. Failing to send must never turn a delivered
 * inquiry into an error either - the request did reach a human.
 */
async function sendDocumentation(to: string, name: string, locale: Locale): Promise<boolean> {
  const doc = await getProductDoc(locale);
  if (!doc) {
    console.warn("[contact] documentation requested but none is configured — request forwarded to the inbox only:", { to, locale });
    return false;
  }
  const c = CONTACT_COPY[locale].docEmail;
  const firstName = name.split(/\s+/)[0] || name;
  const body = [
    `${c.greeting} ${firstName},`,
    "",
    c.body,
    "",
    `${c.linkLabel} ${doc.url}`,
    "",
    c.signoff,
  ].join("\n");
  return deliver(c.subject, body, INBOX, {
    to,
    attachments: [{ filename: doc.filename, path: doc.url }],
  });
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
  const vertical = str(formData, "vertical");
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
    ...(vertical ? [`Vertical:     ${vertical}`] : []),
    `Source page:  ${sourcePage}`,
    `Source CTA:   ${sourceCta}`,
    `Referer:      ${h.get("referer") ?? "—"}`,
    `Received:     ${new Date().toISOString()}`,
  ].join("\n");

  const ok = await deliver(`[${SUBJECT[intent]}] ${company} — ${name}`, body, email);
  if (!ok) return { status: "error", message: t.states.error };

  // The one intent with a side effect beyond the inbox. Deliberately after the
  // inbox notification and deliberately non-fatal: if the document cannot go
  // out, the inquiry still succeeded and the confirmation simply omits any
  // mention of documentation instead of promising a file nobody sent.
  const docsSent = intent === "docs" ? await sendDocumentation(email, name, locale) : false;

  return { status: "success", docsSent };
}
