import { useEffect } from "react";
import { seoConfig, absoluteUrl } from "../utils/seoConfig";
import { setTitle, upsertMeta, upsertLink, setJsonLd, removeJsonLd } from "../utils/headTags";

/**
 * Applies per-route SEO metadata to document.head on mount / whenever the
 * inputs change, and removes anything page-specific on unmount so the
 * next route starts clean.
 *
 * This is a CLIENT-SIDE mechanism — it runs after React mounts, not
 * before. That's an important limitation for a Vite SPA; read
 * SEO.md > "JavaScript SEO" for why it's still worth doing and what
 * its limits are compared to server-side rendering.
 *
 * @param {Object} opts
 * @param {string} opts.title - Page-specific title (without the site suffix).
 * @param {string} opts.description - Page-specific meta description.
 * @param {string} opts.path - Route path, e.g. "/crop-management".
 * @param {boolean} [opts.noindex=false] - True for private/app routes.
 * @param {string} [opts.image] - Absolute URL of a share image.
 * @param {string} [opts.type="website"] - Open Graph type.
 * @param {Array<Object>} [opts.jsonLd] - One or more Schema.org objects to emit as JSON-LD.
 */
export function useSEO({
  title,
  description,
  path,
  noindex = false,
  image,
  type = "website",
  jsonLd = [],
}) {
  useEffect(() => {
    const fullTitle = seoConfig.titleTemplate(title);
    const desc = description || seoConfig.defaultDescription;
    const url = absoluteUrl(path);
    const shareImage = image || seoConfig.defaultImage;

    setTitle(fullTitle);
    upsertMeta("name", "description", desc);

    // Crawling vs indexing: robots.txt (see public/robots.txt) tells
    // crawlers which URLs they may REQUEST. This meta tag tells a crawler
    // that DID fetch the page whether it may be INDEXED. Both are needed —
    // see SEO.md for the full breakdown.
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex,nofollow" : "index,follow"
    );

    upsertLink("canonical", url);

    // Open Graph (Facebook, LinkedIn, Slack unfurls, etc.)
    upsertMeta("property", "og:site_name", seoConfig.siteName);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", shareImage);
    upsertMeta("property", "og:locale", seoConfig.locale);

    // Twitter / X card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", shareImage);
    if (seoConfig.twitterHandle) {
      upsertMeta("name", "twitter:site", seoConfig.twitterHandle);
    }

    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    schemas.forEach((schema, i) => {
      if (schema) setJsonLd(`page-${i}`, schema);
    });

    return () => {
      schemas.forEach((_, i) => removeJsonLd(`page-${i}`));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, noindex, image, type, JSON.stringify(jsonLd)]);
}
