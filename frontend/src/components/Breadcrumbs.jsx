import { Link } from "react-router-dom";
import { absoluteUrl } from "../utils/seoConfig";

/**
 * Renders a visible breadcrumb trail AND returns the matching
 * BreadcrumbList JSON-LD so the calling page can pass it into <SEO jsonLd>.
 * Keeping both in sync in one place avoids the visible trail and the
 * structured data ever disagreeing with each other.
 *
 * @param {Array<{label: string, path?: string}>} trail - Last item has no path (current page).
 */
export default function Breadcrumbs({ trail }) {
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        {trail.map((item, i) => (
          <li key={item.label}>
            {item.path && i !== trail.length - 1 ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  };
}
