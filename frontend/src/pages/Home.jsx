import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { seoConfig } from "../utils/seoConfig";

export default function Home() {
  return (
    <>
      <SEO
        title={null}
        description="FarmFlow is a lightweight farm management application for tracking crops, livestock, and daily farm tasks in one place — no spreadsheets, no clutter."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
            description: seoConfig.defaultDescription,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FarmFlow",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: seoConfig.defaultDescription,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        ]}
      />

      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Farm management, simplified</p>
          <h1>Run your crops, livestock, and farm tasks from one screen</h1>
          <p className="lede">
            FarmFlow replaces the mix of notebooks, spreadsheets, and sticky
            notes that most small farms rely on with a single, focused place
            to track what's planted, what's grazing, and what still needs
            doing today.
          </p>
          <div className="hero-ctas">
            <Link to="/login" className="btn btn-primary">Get started free</Link>
            <Link to="/features" className="btn btn-secondary">See how it works</Link>
          </div>
        </div>
        <div className="hero-rows" role="img" aria-label="Illustration of planted crop rows under the sun">
          <div className="sun" />
          <div className="row" style={{ top: "20%" }} />
          <div className="row" style={{ top: "38%" }} />
          <div className="row" style={{ top: "56%" }} />
          <div className="row" style={{ top: "74%" }} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="feature-overview-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="feature-overview-heading">Three parts of farm work, one system</h2>
            <p>
              Most farm management tools either try to do everything or do
              almost nothing. FarmFlow focuses on the three records that
              change the most day to day.
            </p>
          </div>
          <div className="grid-3">
            <div className="feature-item">
              <span className="mark">1</span>
              <h3>Crops</h3>
              <p>
                Log what's planted where, track planting and harvest dates,
                and see status at a glance without digging through old
                notes. Read more on the <Link to="/crop-management">crop management page</Link>.
              </p>
            </div>
            <div className="feature-item">
              <span className="mark">2</span>
              <h3>Livestock</h3>
              <p>
                Keep a record for every animal — species, breed, age, and
                health status — so herd or flock information isn't
                scattered across paper cards. See the <Link to="/livestock-management">livestock management page</Link>.
              </p>
            </div>
            <div className="feature-item">
              <span className="mark">3</span>
              <h3>Farm tasks</h3>
              <p>
                Turn "things I need to remember" into a real task list with
                due dates and completion status. Details on the <Link to="/farm-tasks">farm tasks page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-it-works-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="how-it-works-heading">How it works</h2>
            <p>Three steps from signing up to having your farm's records in one place.</p>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <div className="num">01</div>
              <h3>Create an account</h3>
              <p>Sign up with your email — no farm size minimums or long onboarding forms.</p>
            </div>
            <div className="how-step">
              <div className="num">02</div>
              <h3>Add your records</h3>
              <p>Enter your current crops, livestock, and any open tasks. It takes minutes, not hours.</p>
            </div>
            <div className="how-step">
              <div className="num">03</div>
              <h3>Keep it updated</h3>
              <p>Update statuses as work happens, so your dashboard always reflects the real state of the farm.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="benefits-heading">
        <div className="container grid-2">
          <div>
            <h2 id="benefits-heading">Why farms use FarmFlow instead of a spreadsheet</h2>
            <ul className="benefits-list">
              <li>Purpose-built fields for crops, livestock, and tasks — no formulas to maintain.</li>
              <li>One dashboard instead of several disconnected files.</li>
              <li>Records are private to your account and accessible from any device with a browser.</li>
              <li>Nothing to install — it runs as a web application.</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="mt-0">Built for small and mid-size operations</h3>
            <p>
              FarmFlow is intentionally small in scope. It doesn't try to
              replace accounting software, equipment telemetry, or
              government compliance systems — it focuses on the daily
              record-keeping that every farm needs regardless of size.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Ready to see your farm in one place?</h2>
              <p>Create a free account and add your first crop, animal, or task in minutes.</p>
            </div>
            <Link to="/login" className="btn btn-primary">Get started free</Link>
          </div>
        </div>
      </section>
    </>
  );
}
