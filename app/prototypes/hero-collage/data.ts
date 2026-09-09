/** Hero copy is the live EN deck copy, so the variants are judged on imagery. */
export const EYEBROW = "At-line analytics for biological processes";
export const TITLE_LEAD = "Know what is happening in your process";
export const TITLE_ACCENT = "- while you can still act.";
export const LEAD =
  "Q‑Tector combines ready-to-use assay pods, a compact reader and guided digital workflows to generate comparable glucose and sucrose results close to the fermenter or bioreactor.";
export const FOCUS = "Current analytical focus: glucose and sucrose in culture media";
export const CTA_1 = "See how Q‑Tector works";
export const CTA_2 = "Discuss your process";

/** Photographs.
 *
 *  `device` is our own studio shot of the reader, cropped in CSS to the control
 *  face — knob and display — so neither the Beer-o-Meter wordmark nor its glass
 *  mark is in frame: the home page is about Q-Tector, not the brewing
 *  application (audit ch. 1, ch. 10). `lab` is our
 *  own lab. Fields and fermenters are stock stand-ins for the photo session
 *  (ch. 10); they are here so the composition can be judged, not to ship. */
export const PHOTOS = {
  /** Ours, and the good one: the reader on a tank, shot from an angle where the
   *  Beer-o-Meter mark on the front face is not in view. No CSS crop needed. */
  device: "/assets/DC9FCB4B-0CCC-4CC8-A2F3-261DBF2B686B.jpeg",
  /** The four the client picked. Stock, until the photo session (audit ch. 10). */
  tanks: "/assets/pexels-theshuttervision-13655238.jpg",
  field: "/assets/pexels-anna-3014674-37775778.jpg",
  lab: "/assets/pexels-jorge-chan-515189442-24293768.jpg",
  /** Kept from the earlier set: the only frame with a person in it. */
  operator: "https://images.pexels.com/photos/5532992/pexels-photo-5532992.jpeg?auto=compress&cs=tinysrgb&w=1400",
} as const;

export const CAPTIONS = {
  device: "Q‑Tector, at the tank",
  lab: "Assay development",
  field: "Where the raw material starts",
  tanks: "Fermentation, at scale",
  operator: "On the tank floor",
} as const;

/** Second CTA and badge for the immersive variant. */
export const BADGE = "Glucose and sucrose, at the line";
