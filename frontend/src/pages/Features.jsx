import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumbs, { breadcrumbJsonLd } from "../components/Breadcrumbs";

const TRAIL = [{ label: "Home", path: "/" }, { label: "Features" }];

export default function Features() {
  return (
    <>
      <SEO
        title="Farm Management Features"
        description="See what's included in FarmFlow: crop tracking, livestock records, farm task management, and a private dashboard for every farm account."
        path="/features"
        jsonLd={breadcrumbJsonLd(TRAIL)}
      />
      <Breadcrumbs trail={TRAIL} />

      <header className="page-head container">
        <p className="eyebrow">Features</p>
        <h1>Everything included in FarmFlow</h1>
        <p className="lede">
          A complete look at what you get with a FarmFlow account — no
          hidden tiers or add-on modules.
        </p>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            <article className="feature-item">
              <h3><Link to="/crop-management">Crop management</Link></h3>
              <p>
                Record crop name, type, planted area, planting date,
                expected harvest date, and current status. Update status as
                a crop moves from planned to harvested.
              </p>
            </article>
            <article className="feature-item">
              <h3><Link to="/livestock-management">Livestock management</Link></h3>
              <p>
                Track each animal by identifier, species, breed, and age,
                with a status field for health or lifecycle stage — from
                healthy to sold.
              </p>
            </article>
            <article className="feature-item">
              <h3><Link to="/farm-tasks">Farm task tracking</Link></h3>
              <p>
                Create tasks with a title, description, and due date, then
                mark them complete as work gets done. A simple list beats a
                sticky note that falls off the wall.
              </p>
            </article>
            <article className="feature-item">
              <h3>Private dashboard</h3>
              <p>
                Every account gets a private dashboard summarizing crops,
                livestock, and open tasks at a glance after logging in.
              </p>
            </article>
            <article className="feature-item">
              <h3>Account security</h3>
              <p>
                Passwords are hashed before storage and every farm record
                is scoped to the account that created it — one user never
                sees another's data.
              </p>
            </article>
            <article className="feature-item">
              <h3>Works on any device</h3>
              <p>
                FarmFlow is a responsive web application, so the same
                account works whether you're at a desk or checking a task
                list from a phone in the field.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>See it on your own farm's data</h2>
              <p>Create a free account and add your first crop, animal, or task.</p>
            </div>
            <Link to="/login" className="btn btn-primary">Get started free</Link>
          </div>
        </div>
      </section>
    </>
  );
}
