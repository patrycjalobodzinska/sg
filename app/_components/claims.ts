/**
 * Claim register — audit ch. 14, single source of truth.
 *
 * The audit found the same risky wording repeated across five files, so a fix in
 * one place left the others live. Every page now imports the approved phrasing
 * from here instead of restating it.
 *
 * Two rules:
 *   1. Anything in `BLOCKED` must not reach a page until the client confirms the
 *      scope named in its comment (see `docs/audit-open-questions.md`).
 *   2. New copy uses `TERMS`. If a claim is not here, it has not been cleared.
 *
 * The live NL/PL strings sit in Sanity, not in this file. `scripts/` carries the
 * migration that mirrors these decisions into the dataset — change both together.
 */

/** Wording the audit cleared for publication. */
export const TERMS = {
  /** What the device does. Never "process control" — that promises closed-loop
   *  actuation the platform does not perform (audit ch. 6, 14). */
  measurement: "at-line measurement",
  monitoring: "process monitoring",
  decisionSupport: "decision support",

  /** What the data layer delivers today: storage, trends, comparison, export.
   *  Not "process intelligence" until B4 says the platform does more. */
  processData: "structured process data",

  /** Replaces "see the change as it happens", which implied continuous online
   *  sensing. At-line sampling shows change between samples, not live. */
  duringRun: "see what is changing during the run",

  /** Replaces "Trusted by", which asserted a customer relationship for names
   *  that may be research collaborators or consortium members. Per-name
   *  relationship type and logo consent stay blocked on B5. */
  partnersHeading: "Selected customers and research collaborators",

  /** The decision the result supports. Never "release decisions" — that needs
   *  validation and an intended use we do not claim (B3). */
  processDecisions: "support process decisions",

  /** Assay scope wording for the applications page. */
  coDevelopment: "Additional analytes and matrices can be evaluated for co-development",
} as const;

/**
 * "Process control" is still allowed in exactly one context: the company
 * mission ("make process control accessible, actionable and scalable"). There
 * it names an ambition, not a device capability. Anywhere it describes what
 * Q‑Tector does, use `TERMS.measurement` / `.monitoring` / `.decisionSupport`.
 */
export const MISSION_PROCESS_CONTROL =
  "make process control accessible, actionable and scalable";

/**
 * Claims held back pending client confirmation. Keep the target wording here so
 * that publishing is a one-line change once the answer lands — but do not wire
 * these into any page yet.
 */
export const BLOCKED = {
  /** B1 + B2. Cleared only for the assays the client names, and the copy must
   *  say which. Until then the home page carries no speed/calibration claim. */
  speedAndCalibration:
    "Results in under five minutes · No user calibration required for supported assays",
} as const;
