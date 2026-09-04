import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand" style={{ fontSize: "1.15rem" }}>
              Farm<span>Flow</span>
            </Link>
            <p style={{ marginTop: "0.75rem", maxWidth: "34ch" }}>
              A small, focused farm management application for tracking
              crops, livestock, and daily tasks — built as a hands-on
              full-stack and SEO learning project.
            </p>
          </div>
          <div>
            <h4>Learn about FarmFlow</h4>
            <ul>
              <li><Link to="/about">About FarmFlow</Link></li>
              <li><Link to="/features">Features overview</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Farm management</h4>
            <ul>
              <li><Link to="/crop-management">Crop management</Link></li>
              <li><Link to="/livestock-management">Livestock management</Link></li>
              <li><Link to="/farm-tasks">Farm task tracking</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="mt-0">© {year} FarmFlow. A learning project — not a commercial product.</p>
        </div>
      </div>
    </footer>
  );
}
