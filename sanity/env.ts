// Public Sanity config. projectId/dataset are NOT secrets — they ship in the
// client bundle via NEXT_PUBLIC_* — so we default to the known values when the
// env vars aren't set (e.g. a deploy platform without them configured). Env
// vars still take precedence. The write token is never here: it stays env-only
// and is only used by the seed scripts.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gjwqtsg5";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
