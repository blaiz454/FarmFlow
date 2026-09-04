# SEO.md — FarmFlow's SEO implementation, explained

This document exists to teach, not just to describe. For each mechanism
below you'll find **what** it does, **why** it exists, **when** it
matters, **what breaks without it**, and **how to test it yourself**.

FarmFlow is a React SPA built with Vite — a genuinely harder starting
point for SEO than a server-rendered site. That's intentional: the goal
of this project is to understand SEO under realistic constraints, not to
pretend the constraints don't exist.

---

## Contents

1. [Crawlability](#1-crawlability)
2. [Indexability](#2-indexability)
3. [Sitemap](#3-sitemap)
4. [Robots.txt](#4-robotstxt)
5. [Canonical URLs](#5-canonical-urls)
6. [Titles](#6-titles)
7. [Meta descriptions](#7-meta-descriptions)
8. [Headings](#8-headings)
9. [Internal linking](#9-internal-linking)
10. [Image SEO](#10-image-seo)
11. [Structured data](#11-structured-data)
12. [Open Graph](#12-open-graph)
13. [JavaScript SEO](#13-javascript-seo)
14. [Performance](#14-performance)
15. [Mobile](#15-mobile)
16. [Accessibility](#16-accessibility)
17. [Private page handling](#17-private-page-handling)
18. [404 behavior](#18-404-behavior)
19. [Deployment considerations](#19-deployment-considerations)
20. [Google Search Console setup](#20-google-search-console-setup)
21. [SEO testing checklist](#21-seo-testing-checklist)

---

## 1. Crawlability

**What:** Crawlability is whether a search engine's bot (Googlebot, etc.)
is *allowed and able* to fetch a URL at all.

**Why it exists:** A page can't be indexed if it's never fetched. Two
separate things affect this: (a) whether `robots.txt` permits the crawler
to request the URL, and (b) whether the URL is even discoverable — linked
from somewhere, or listed in a sitemap.

**When it matters:** Before anything else. Indexing, ranking, and rich
results are all downstream of a page actually being crawled.

**What happens if it's missing:** A page that's never linked to and never
in a sitemap may simply never be found, regardless of how good its
content or metadata is.

**How to test:**
- Google Search Console → URL Inspection → "Test Live URL" shows exactly
  what Googlebot fetched.
- `curl -A "Googlebot" https://yoursite.com/crop-management` to see the
  raw HTML a crawler receives.

---

## 2. Indexability

**What:** Indexability is whether a *successfully crawled* page is
allowed to be stored in the search index and shown in results.

**Why it's a separate concept from crawlability:** A crawler can fetch a
page (crawlable) but still be told not to index it (via
`<meta name="robots" content="noindex">`). Conversely, blocking crawling
via `robots.txt` does **not** guarantee a URL stays out of the index —
Google can still index a URL it was blocked from fetching if it finds the
URL linked from elsewhere, showing it with no description. This is why
FarmFlow uses **both** `robots.txt` and per-page meta robots tags for
private routes, rather than relying on either alone.

**Where this lives in the code:** `frontend/src/hooks/useSEO.js` sets
`<meta name="robots" content="index,follow">` on public pages and
`"noindex,nofollow"` on private ones, driven by the `noindex` prop each
page passes to `<SEO>`.

**How to test:**
- View page source (or Google Search Console → URL Inspection →
  "Indexing allowed?") and check the `robots` meta tag.
- Search `site:yoursite.com` on Google after the site has been live and
  crawled for a while — private routes should never appear.

---

## 3. Sitemap

**What:** `sitemap.xml` is a machine-readable list of URLs you want
search engines to know about, optionally with change frequency and
priority hints.

**Why it exists:** It's a direct hint to crawlers about what exists,
useful especially for JavaScript apps where links might otherwise only be
discoverable by executing the app's routing logic.

**How FarmFlow generates it:** `frontend/scripts/generate-seo-files.mjs`
runs before every `npm run dev` and `npm run build` and writes
`frontend/public/sitemap.xml` from a hardcoded list of **public** routes,
using `VITE_SITE_URL` as the domain. Private routes are never included.

**What happens if it's missing/wrong:** Missing isn't fatal — Google can
still discover pages via links — but a sitemap makes discovery faster and
more reliable, especially for a new site with few external backlinks.
A sitemap listing the *wrong* domain (e.g. `localhost` in production) is
actively harmful: submit it and Search Console will report every URL as
unreachable.

**How to test:**
- Open `/sitemap.xml` directly in a browser after running `npm run build`
  and serving `dist/`.
- Validate it's well-formed XML: `python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml')"`
- Confirm it does **not** include `/login`, `/dashboard`, `/crops`,
  `/livestock`, `/tasks`, `/settings`, or `/profile`.

---

## 4. Robots.txt

**What:** A plain-text file at the site root telling crawlers which paths
they may request.

**Why it exists:** To prevent crawlers from wasting time (and your
server's resources) on pages you don't want indexed, and to point them at
the sitemap.

**FarmFlow's approach:** Generated alongside the sitemap by
`generate-seo-files.mjs`. It allows everything by default and explicitly
disallows the seven private route prefixes, then points to the sitemap
URL.

```
User-agent: *
Allow: /
Disallow: /login
Disallow: /dashboard
Disallow: /crops
Disallow: /livestock
Disallow: /tasks
Disallow: /settings
Disallow: /profile

Sitemap: https://yoursite.com/sitemap.xml
```

**The important caveat (repeated from §2 on purpose):** `Disallow` stops
*crawling*, not *indexing*. If another site links to
`yoursite.com/dashboard`, Google can still show that URL in results (with
no snippet, since it was never fetched) even though robots.txt disallowed
it. That's exactly why every private page also sets its own
`noindex,nofollow` meta tag — robots.txt and meta robots solve different
halves of the problem.

**How to test:**
- Visit `/robots.txt` directly.
- Google Search Console has a robots.txt report under Settings.

---

## 5. Canonical URLs

**What:** `<link rel="canonical" href="...">` tells search engines the
"real" URL for a piece of content, when the same or similar content might
be reachable via more than one URL.

**Why it exists:** Prevents duplicate-content dilution — if
`/features` were somehow reachable via `/features?ref=nav` and
`/features/`, a canonical tag tells Google to treat all of them as one
page for ranking purposes.

**Where it lives in the code:** `useSEO.js` calls
`upsertLink("canonical", url)` on every route, where `url` is built from
`VITE_SITE_URL` + the route's path via `absoluteUrl()` in
`utils/seoConfig.js`. Because the domain is env-driven, canonical tags
automatically point at the right domain in dev vs. production — nothing
is hardcoded.

**How to test:** View source (or inspect the live DOM, since this is set
client-side — see §13) and confirm the `<link rel="canonical">` href
matches the current page's own URL, using the production domain.

---

## 6. Titles

**What:** The `<title>` element, shown as the clickable blue link text in
search results and the browser tab.

**Why it exists:** It's one of the strongest on-page ranking and
click-through signals. A generic or duplicate title wastes that signal.

**FarmFlow's approach:** Every page passes a `title` prop to `<SEO>`,
which `seoConfig.titleTemplate()` turns into `"<Page> | FarmFlow"` (or
just `"FarmFlow"` for the homepage). Titles are unique per page — compare
`"Crop Management Software | FarmFlow"` vs.
`"Livestock Management Software | FarmFlow"`.

**What happens if it's missing:** Google will synthesize its own title
from page content, which is unpredictable and often looks worse than a
deliberately written one.

**How to test:** Check the browser tab / `document.title` on every route,
and confirm no two public pages share a title.

---

## 7. Meta descriptions

**What:** `<meta name="description">` — the snippet Google *may* show
under the title in search results (it sometimes rewrites this itself, but
a good one improves the odds it's used, and always improves click-through
intent even when rewritten).

**FarmFlow's approach:** Every page passes a unique `description` prop to
`<SEO>`, written to actually describe that page's content, not a copy of
the homepage description with a word swapped.

**How to test:** Inspect `<meta name="description">` per route; confirm
each is unique and accurately describes that specific page.

---

## 8. Headings

**What:** The `<h1>`–`<h6>` hierarchy that structures a page's content.

**Why it exists:** Headings are both an accessibility signal (screen
readers build a navigable outline from them) and a moderate SEO signal —
they tell a crawler what a page and its sections are actually about.

**FarmFlow's approach:** Exactly one `<h1>` per page (the page's main
headline), with `<h2>`s for major sections and `<h3>`s for subsections
within those. Headings are never used purely for visual size — see
`index.css`, where heading *look* is controlled by CSS classes like
`.eyebrow`, not by picking a heading level for its font size.

**How to test:** Use a browser extension like "HeadingsMap" or run
`document.querySelectorAll('h1,h2,h3')` in the console on each public
page — confirm exactly one `h1` and a logical nesting order.

---

## 9. Internal linking

**What:** Links between your own pages.

**Why it exists:** Internal links help crawlers discover pages and
distribute "link equity" across the site; they also directly help real
users navigate.

**FarmFlow's approach:** Every public info page links to at least two
other relevant public pages using descriptive anchor text (e.g. "See the
livestock management page", never "click here"). The homepage links to
every major section; the footer links to all seven public pages from
every page on the site.

**How to test:** Click through the site checking that every public page
is reachable within 1–2 clicks from the homepage, and that anchor text
describes the destination.

---

## 10. Image SEO

**What:** Descriptive `alt` text, appropriate sizing, and efficient
formats for images.

**FarmFlow's approach:** The hero "illustration" and OG share image
(`public/og-default.svg`) are hand-built SVGs — no raster images to
optimize, which sidesteps most image-performance concerns for this small
project. The hero graphic uses `role="img"` with an `aria-label`
describing it, since it's built from CSS/SVG shapes rather than an `<img>`
tag. If you add real photos later (e.g. of actual crops or livestock),
give each a specific `alt` describing its content ("Rows of young corn
seedlings," not "image1.jpg" or "crops"), and use modern formats (WebP/
AVIF) with explicit `width`/`height` to prevent layout shift.

**How to test:** `document.querySelectorAll('img:not([alt])')` should
return an empty list on every page.

---

## 11. Structured data

**What:** JSON-LD script tags describing page content in a
machine-readable Schema.org vocabulary, enabling rich results.

**FarmFlow's approach:**
- **Homepage:** `Organization`, `WebSite`, and `SoftwareApplication`
  schemas (`src/pages/Home.jsx`) — accurate for what FarmFlow actually is.
- **Every public info page:** a `BreadcrumbList` schema generated from the
  same data that drives the visible breadcrumb trail
  (`src/components/Breadcrumbs.jsx`'s `breadcrumbJsonLd()`), so the
  visible UI and the structured data can never disagree.

No schema is added "for coverage" — each one describes something
genuinely true about the page it's on.

**How to test:**
- Google's [Rich Results Test](https://search.google.com/test/rich-results)
  against a deployed URL.
- Or paste the JSON-LD script content into
  [Schema.org's validator](https://validator.schema.org/).
- In the browser console: `document.querySelectorAll('script[type="application/ld+json"]')`.

---

## 12. Open Graph

**What:** `og:*` meta tags controlling how a link looks when shared on
Facebook, LinkedIn, Slack, iMessage, etc. Twitter/X-specific `twitter:*`
tags serve the same purpose for X's card renderer.

**FarmFlow's approach:** `useSEO.js` sets `og:title`, `og:description`,
`og:type`, `og:url`, `og:image`, `og:site_name`, `og:locale`, and the
matching `twitter:card`/`twitter:title`/`twitter:description`/
`twitter:image` tags on every route, using the page's own title/
description and a shared default share image
(`public/og-default.svg`) unless a page provides its own.

**How to test:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter/X Card Validator](https://cards-dev.twitter.com/validator)
- Or just paste the URL into a Slack message (in a private channel) and
  look at the unfurl preview.

---

## 13. JavaScript SEO

This is the section that matters most for a project like this, so it's
worth being unusually explicit.

**The core problem:** FarmFlow is a client-rendered single-page app.
When a browser (or crawler) requests `/crop-management`, the *initial*
HTML response is the same generic `index.html` for every route — an
almost-empty `<div id="root"></div>` plus a `<script>` tag. The actual
`<h1>`, paragraph text, and title for that specific page only exist after
JavaScript downloads, executes, and React renders the matching component.
Meta tags set by `useSEO.js` (title, description, canonical, OG,
JSON-LD) are similarly **not present in the raw HTML** — they're inserted
into `document.head` by a `useEffect` after mount.

**Does this actually break indexing?** Not necessarily, but it adds risk
and delay, for a specific reason: Googlebot's rendering happens in two
waves. First it crawls the raw HTML (fast, cheap, happens immediately).
Content and tags that only exist after JavaScript runs are picked up in a
*second*, separate rendering pass that uses spare compute capacity and
can lag the initial crawl by anywhere from seconds to weeks depending on
Google's queue. Other crawlers (Bing, and almost all non-search link
previewers like Slack/iMessage) render JavaScript far less reliably than
Google does, or not at all.

**What FarmFlow does about it, given the CSR constraint:**
1. Every public route is a real, unique, directly-loadable URL (React
   Router's `<Route path="...">`), not a client-only view switch behind a
   single URL — so once rendering *does* happen, each URL has genuinely
   distinct content to index. See §19 for why the hosting config has to
   cooperate with this.
2. `useSEO.js` sets metadata as early as possible (on mount, synchronously
   in a `useEffect`, not after a data fetch) so the rendering pass sees
   final tags as soon as possible.
3. `index.html` ships a real fallback `<title>` and `<meta
   name="description">` for the instant before JS runs, so the very
   first, unrendered HTML isn't completely contentless.

**What FarmFlow does *not* do, and why that's a documented trade-off, not
an oversight:** It does not implement server-side rendering (SSR) or
static prerendering. Frameworks like Next.js, Remix, or a prerendering
plugin (e.g. `vite-plugin-ssr`, or a build-time prerender step) would
produce full HTML per route with zero JavaScript-execution dependency,
which is strictly better for both SEO and initial load performance. That
was left out here specifically so this project stays small enough to
read end to end — but if you take one thing from this file, it's that a
real production marketing site that cares about SEO should
seriously consider SSR or prerendering instead of pure CSR.

**How to test what a crawler actually sees:**
- Google Search Console → URL Inspection → "View Crawled Page" → check
  both the "HTML" tab (what was fetched) and the rendered screenshot
  (what Google saw after executing JS).
- `curl https://yoursite.com/crop-management` and look at the raw
  response — you'll see the same generic shell HTML for every route,
  confirming the CSR limitation directly.
- Disable JavaScript in your browser's dev tools and reload a page — you
  should still see the `<noscript>` message from `index.html`, not a
  blank screen with no explanation.

---

## 14. Performance

**What FarmFlow does:**
- **Code splitting:** `vite.config.js` splits `react`/`react-dom`/
  `react-router-dom` into a separate `vendor` chunk from app code, so
  browsers can cache the rarely-changing vendor bundle independently of
  app updates.
- **No heavy dependencies:** no CSS framework, no animation library, no
  icon font — plain CSS keeps the shipped JS/CSS small.
- **System + Google Fonts with `display=swap`:** `index.html` preconnects
  to Google Fonts and loads them with `display=swap`, so text renders
  immediately in a fallback font rather than staying invisible while
  fonts load (this avoids a common CLS/LCP hit).
- **SVG instead of raster images** for the hero graphic and OG image —
  tiny file size, infinitely scalable, no separate mobile/desktop
  variants needed.

**Core Web Vitals this affects:**
- **LCP** (Largest Contentful Paint): kept low by minimal JS, `swap` font
  loading, and no large hero images to wait for.
- **CLS** (Cumulative Layout Shift): avoided by reserving space via CSS
  (`aspect-ratio` on the hero graphic) rather than letting images/fonts
  pop in and reflow the page.
- **INP** (Interaction to Next Paint): kept low simply by not shipping
  much JavaScript — there's little work competing for the main thread.

**How to test:**
- Chrome DevTools → Lighthouse tab → run a Performance audit against a
  production build (`npm run build && npm run preview`), not the dev
  server (dev builds are intentionally unoptimized).
- [PageSpeed Insights](https://pagespeed.web.dev/) against a deployed URL
  for real Core Web Vitals field data (once enough real traffic exists)
  vs. lab data.

---

## 15. Mobile

**What FarmFlow does:** Every layout in `index.css` uses CSS Grid with a
`@media (max-width: ...)` fallback to a single column, from the hero
section down to the private app's sidebar (which collapses to a
horizontal scrollable nav on small screens). Tap targets (`.btn`, nav
links) use generous padding. `index.html` sets
`<meta name="viewport" content="width=device-width, initial-scale=1">`,
without which mobile browsers would render the site zoomed out as a
desktop layout.

**How to test:**
- Chrome DevTools → Device Toolbar (Ctrl/Cmd+Shift+M) → test at a few
  common widths (375px, 768px, 1024px).
- Google's [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly).

---

## 16. Accessibility

**What FarmFlow does:** Semantic elements (`<header>`, `<nav>`, `<main>`,
`<footer>`, `<article>`) instead of generic `<div>`s wherever they apply;
every form input has an associated `<label>`; a visible focus ring
(`:focus-visible` in `index.css`) instead of `outline: none`; the mobile
nav toggle uses `aria-expanded`/`aria-controls`; the hero's decorative CSS
illustration is exposed to assistive tech via `role="img"` +
`aria-label` rather than being silently skipped or read as noise.

This is treated as engineering quality, not an SEO trick — though the two
overlap heavily in practice (a page a screen reader can navigate cleanly
is usually also a page a crawler can parse cleanly).

**How to test:**
- Keyboard-only navigation: unplug your mouse and tab through an entire
  page — every interactive element should be reachable and show a visible
  focus state.
- Chrome DevTools → Lighthouse → Accessibility audit.
- Browser extension: axe DevTools.

---

## 17. Private page handling

**What:** `/login`, `/dashboard`, `/crops`, `/livestock`, `/tasks`,
`/settings`, `/profile` should never appear in search results.

**How FarmFlow enforces this with multiple, independent layers** (so that
no single missed setting leaks a private page into the index):

1. **`robots.txt`** disallows crawling all seven path prefixes (§4).
2. **`<meta name="robots" content="noindex,nofollow">`** on every private
   page via the `noindex` prop passed to `<SEO>` (§2) — this is the layer
   that actually prevents indexing even if a URL gets crawled anyway.
3. **Authentication** (`ProtectedRoute.jsx`) redirects unauthenticated
   visitors to `/login` before they ever see real data — this is an
   access-control mechanism, not an SEO one, but it means even a crawler
   that ignored robots.txt and noindex would see a login form, not farm
   data.
4. **Not listed in `sitemap.xml`** (§3) — no active hint pointing crawlers
   at these URLs at all.

**How to test:** Confirm all four independently: check `/robots.txt`,
inspect the rendered `<meta name="robots">` on each private route, try
visiting `/dashboard` in a private/incognito window (should redirect to
`/login`), and confirm private paths are absent from `/sitemap.xml`.

---

## 18. 404 behavior

**What:** What happens when someone requests a URL that doesn't exist.

**The SPA-specific catch:** `NotFound.jsx` renders a proper, helpful "not
found" UI with a clear `<h1>`, `noindex` meta tag, and links back into
the site — but React Router matching a wildcard route and *rendering* a
404-looking component is not the same as the **HTTP response** carrying a
`404` status code. By default, most static hosts serve `index.html` (and
therefore, after JS runs, this NotFound component) with an HTTP `200`
status for any unmatched path — a "soft 404." Search engines discourage
soft 404s because a `200` status tells them the page is valid and worth
indexing, even though its content says otherwise.

**The fix requires host-level configuration**, not just app code — see
§19's SPA fallback discussion. Some hosts (e.g. Netlify, via a rule with
an explicit status code) let you configure the fallback to return `404`
directly; others always return `200` for the SPA fallback, in which case
the honest options are (a) accept the soft-404 for a small project like
this, or (b) move to SSR/prerendering (§13) where the server can return a
real per-route status code.

**How to test:**
```bash
curl -I https://yoursite.com/this-page-does-not-exist
```
Check the `HTTP/…` status line in the response.

---

## 19. Deployment considerations

**SPA fallback is mandatory.** Because React Router owns client-side
routing, a direct request to `https://yoursite.com/crop-management` must
be served `index.html` by the host (which then boots React, which then
matches the route and renders `CropManagement`) — otherwise the host's
web server looks for a literal file/folder at that path, finds nothing,
and 404s before React ever loads. README.md §11 has host-specific
configuration snippets (Netlify `_redirects`, Vercel `vercel.json`).

**`VITE_SITE_URL` must be a real build-time environment variable on the
host**, not left at its `localhost` default — otherwise canonical tags,
Open Graph URLs, robots.txt, and the sitemap will all point at
`localhost` in production, which is actively wrong rather than merely
suboptimal.

**CORS must be configured to match** the deployed frontend's real origin
in the backend's `CORS_ORIGINS`, or the deployed frontend simply won't be
able to call the API.

---

## 20. Google Search Console setup

Search Console is free and is how you find out what Google actually sees
and indexes, rather than guessing.

1. **Verify the domain** at [search.google.com/search-console](https://search.google.com/search-console).
   Domain-level verification (via a DNS TXT record) is recommended — it
   covers all subdomains/protocols in one step. URL-prefix verification
   (via an HTML file, meta tag, or Google Analytics) works too if DNS
   access isn't available.
2. **Submit the sitemap:** Search Console → Sitemaps → enter `sitemap.xml`
   (Search Console will resolve it against your verified domain) → Submit.
3. **Inspect a URL:** the URL Inspection tool (search bar at the top of
   Search Console) shows crawl status, indexing status, the raw fetched
   HTML, and a rendered screenshot — the single most useful debugging
   tool for everything in §13.
4. **Request indexing:** from the URL Inspection result for a specific
   URL, "Request Indexing" asks Google to (re)crawl that URL sooner than
   it otherwise would. Useful after a meaningful content change, not
   something to do repeatedly for the same URL.
5. **Monitor indexing:** Search Console → Pages report shows which URLs
   are indexed vs. excluded, and *why* excluded pages were excluded
   (noindex tag, crawled-not-indexed, duplicate content, etc.).
6. **Monitor search performance:** the Performance report shows real
   impressions, clicks, average position, and the actual queries people
   used to find your pages — this is the ground-truth feedback loop for
   whether your titles/descriptions/content are working.
7. **Diagnose indexing issues:** cross-reference the Pages report against
   `sitemap.xml` — any submitted URL not showing as indexed has a reason
   listed next to it in the report.

**Important honesty note:** submitting a sitemap does **not** guarantee
indexing. It's a strong hint, not a command — Google independently
decides whether a page is worth indexing based on content quality,
duplication, and site-wide signals.

---

## 21. SEO testing checklist

Run through this after any significant change, and definitely before a
production deploy.

- [ ] Homepage `<title>` is unique, descriptive, and not "React App"
- [ ] Every public page has a unique `<meta name="description">`
- [ ] Every public page has a `<link rel="canonical">` pointing at itself
      on the production domain
- [ ] Every public page's `<meta name="robots">` reads `index,follow`
- [ ] Every private page's `<meta name="robots">` reads `noindex,nofollow`
- [ ] `/robots.txt` loads, allows public paths, disallows all seven
      private path prefixes, and links to `/sitemap.xml`
- [ ] `/sitemap.xml` is valid XML and contains exactly the 7 public URLs
      — no private routes
- [ ] JSON-LD on the homepage and every public info page validates in
      the [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Open Graph tags render correctly in the Facebook Sharing Debugger
      and a Slack/iMessage unfurl
- [ ] Every public page has exactly one `<h1>`, with a logical
      `h2`/`h3` structure under it
- [ ] Every `<img>` has meaningful `alt` text (or empty `alt=""` if
      purely decorative)
- [ ] Internal links use descriptive anchor text, never "click here"
- [ ] Visiting `/some-fake-url` shows the NotFound page content, with a
      `noindex` tag, and (after host configuration) a real `404` HTTP
      status
- [ ] Direct URL access (typing `/about` straight into the address bar,
      not navigating via a link) loads the correct page, both in dev and
      against a production build via `npm run preview`
- [ ] Mobile layout (375px width) has no horizontal scrolling and all
      text/buttons are usable
- [ ] Lighthouse Performance, Accessibility, Best Practices, and SEO
      scores all reviewed against a production build (not dev server)
