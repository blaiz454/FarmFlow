/**
 * Centralized SEO defaults. Every page-level SEO call falls back to these
 * values, so the site name, default share image, etc. only need to change
 * in one place. See SEO.md for how each field is used.
 */

// Falls back to localhost in dev if VITE_SITE_URL isn't set, but a real
// deploy MUST set VITE_SITE_URL — see frontend/.env.example.
const SITE_URL = (import.meta.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

export const seoConfig = {
  siteName: "FarmFlow",
  siteUrl: SITE_URL,
  defaultTitle: "FarmFlow — Simple Farm Management Software",
  titleTemplate: (title) => (title ? `${title} | FarmFlow` : "FarmFlow"),
  defaultDescription:
    "FarmFlow is a lightweight farm management application for tracking crops, livestock, and daily farm tasks in one place.",
  defaultImage: `${SITE_URL}/og-default.svg`,
  twitterHandle: "@farmflowapp",
  locale: "en_US",
};

export function absoluteUrl(pathname = "/") {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
