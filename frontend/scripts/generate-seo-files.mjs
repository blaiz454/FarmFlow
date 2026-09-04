/**
 * Generates public/robots.txt and public/sitemap.xml before every dev
 * server start and every production build.
 *
 * WHY generate these instead of hand-writing them once:
 * The site's canonical domain differs between localhost, staging, and
 * production (see VITE_SITE_URL in .env). Hand-written static files would
 * either hardcode localhost into a production build or need to be edited
 * by hand every deploy. Generating them from the same env var the app
 * uses for canonical/OG tags keeps everything in sync automatically.
 *
 * Only PUBLIC, indexable routes belong in the sitemap. Private/app routes
 * (/login, /dashboard, /crops, /livestock, /tasks, /settings, /profile)
 * are intentionally excluded — see SEO.md "Private page handling".
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load .env (if present) the same way Vite would, without pulling in Vite
// itself here since this script runs in plain Node, not the browser.
dotenv.config({ path: path.join(root, ".env") });

const SITE_URL = (process.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

const PUBLIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/features", changefreq: "monthly", priority: "0.8" },
  { path: "/crop-management", changefreq: "monthly", priority: "0.8" },
  { path: "/livestock-management", changefreq: "monthly", priority: "0.8" },
  { path: "/farm-tasks", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
];

const PRIVATE_PREFIXES = [
  "/login",
  "/dashboard",
  "/crops",
  "/livestock",
  "/tasks",
  "/settings",
  "/profile",
];

function buildSitemap() {
  const urls = PUBLIC_PAGES.map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
  const disallowLines = PRIVATE_PREFIXES.map((p) => `Disallow: ${p}`).join("\n");
  return `# FarmFlow robots.txt
# Public marketing/content pages are crawlable. Private application routes
# are disallowed here AND carry a <meta name="robots" content="noindex,nofollow">
# tag (see src/components/SEO.jsx), because robots.txt only blocks crawling —
# it does not reliably keep an already-linked URL out of the index. See
# SEO.md "Robots.txt vs meta robots vs canonical" for the full explanation.
User-agent: *
Allow: /
${disallowLines}

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(), "utf-8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobots(), "utf-8");

console.log(`[generate-seo-files] Wrote robots.txt and sitemap.xml for ${SITE_URL}`);
