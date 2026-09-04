/**
 * Small DOM helpers for writing <head> tags from React.
 *
 * We manipulate document.head directly instead of pulling in a library
 * like react-helmet, per the "avoid unnecessary dependencies" goal for
 * this project — a handful of setAttribute calls is all this needs.
 *
 * Every tag we create is marked with data-managed-by="farmflow-seo" so
 * we can find and clean up exactly the tags we own, and never touch
 * tags that were hand-written in index.html (like the base <title>).
 */

const MANAGED_ATTR = "data-managed-by";
const MANAGED_VALUE = "farmflow-seo";

export function setTitle(title) {
  document.title = title;
}

export function upsertMeta(selectorAttr, selectorValue, content) {
  let el = document.head.querySelector(`meta[${selectorAttr}="${selectorValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(selectorAttr, selectorValue);
    el.setAttribute(MANAGED_ATTR, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_ATTR, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function setJsonLd(id, data) {
  const scriptId = `jsonld-${id}`;
  let el = document.getElementById(scriptId);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = scriptId;
    el.setAttribute(MANAGED_ATTR, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function removeJsonLd(id) {
  const el = document.getElementById(`jsonld-${id}`);
  if (el) el.remove();
}
