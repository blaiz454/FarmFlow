import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumbs, { breadcrumbJsonLd } from "../components/Breadcrumbs";

const TRAIL = [{ label: "Home", path: "/" }, { label: "About" }];

export default function About() {
  return (
    <>
      <SEO
        title="About FarmFlow"
        description="Learn what FarmFlow is, who it's built for, and the thinking behind keeping it deliberately small and focused on crops, livestock, and farm tasks."
        path="/about"
        jsonLd={breadcrumbJsonLd(TRAIL)}
      />
      <Breadcrumbs trail={TRAIL} />

      <header className="page-head container">
        <p className="eyebrow">About</p>
        <h1>A small, focused tool for everyday farm record-keeping</h1>
        <p className="lede">
          FarmFlow exists to solve one problem well: giving a farm a single,
          reliable place to record what's growing, what's grazing, and
          what still needs to get done.
        </p>
      </header>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Why FarmFlow is small on purpose</h2>
            <p>
              A lot of farm software tries to cover accounting, equipment
              tracking, weather forecasting, and compliance reporting all at
              once. That breadth is useful for large operations, but it
              also means a lot of setup and a learning curve before the
              software pays for itself.
            </p>
            <p>
              FarmFlow takes the opposite approach. It covers three record
              types — <Link to="/crop-management">crops</Link>,{" "}
              <Link to="/livestock-management">livestock</Link>, and{" "}
              <Link to="/farm-tasks">farm tasks</Link> — and does them
              well, so a new user can be productive within a few minutes of
              signing up.
            </p>
          </div>
          <div className="card">
            <h3 className="mt-0">Who FarmFlow is for</h3>
            <p>
              Small and mid-size farms, hobby farms, and anyone managing
              crops or animals who wants something more structured than a
              notebook but doesn't need an enterprise agriculture platform.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>What FarmFlow does not try to be</h2>
          <p style={{ maxWidth: "70ch" }}>
            FarmFlow doesn't handle payroll, equipment maintenance
            schedules, satellite imagery, or financial reporting. Those are
            real needs, but bundling them into a small tool tends to make
            the tool worse at its core job. FarmFlow stays focused so the
            parts it does cover stay simple to use.
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            Curious what's actually included? See the full{" "}
            <Link to="/features">features overview</Link>, or go straight to{" "}
            <Link to="/contact">get in touch</Link> with questions.
          </p>
        </div>
      </section>
    </>
  );
}
