import { Link } from "react-router-dom";
import SEO from "../components/SEO";

/**
 * IMPORTANT SEO caveat, documented fully in SEO.md > "404 behavior":
 * A client-side router can render this component, but the HTTP response
 * for the underlying document request is still whatever the web server
 * returned — usually 200 for an SPA fallback unless the host is
 * configured to return a real 404 status for unmatched paths. This
 * component gets the on-page signals right (noindex, clear messaging);
 * the server-level status code has to be configured separately at
 * deploy time.
 */
export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you were looking for doesn't exist. Return to the FarmFlow homepage to keep browsing."
        path="/404"
        noindex
      />
      <div className="container not-found">
        <p className="eyebrow">404</p>
        <h1>We couldn't find that page</h1>
        <p className="lede">
          The page you were looking for may have moved or no longer
          exists. Try one of these instead:
        </p>
        <div className="related-links">
          <Link to="/">Homepage</Link>
          <Link to="/features">Features</Link>
          <Link to="/crop-management">Crop management</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </>
  );
}
