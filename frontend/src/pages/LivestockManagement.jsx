import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumbs, { breadcrumbJsonLd } from "../components/Breadcrumbs";

const TRAIL = [{ label: "Home", path: "/" }, { label: "Livestock Management" }];

export default function LivestockManagement() {
  return (
    <>
      <SEO
        title="Livestock Management Software"
        description="Keep a record for every animal on the farm — species, breed, age, and status — with FarmFlow's livestock management tools."
        path="/livestock-management"
        jsonLd={breadcrumbJsonLd(TRAIL)}
      />
      <Breadcrumbs trail={TRAIL} />

      <header className="page-head container">
        <p className="eyebrow">Livestock management</p>
        <h1>One record per animal, not one spreadsheet row you hope is current</h1>
        <p className="lede">
          Livestock management covers everything involved in keeping track
          of the animals on a farm — identification, breed and species
          details, age, and current status. FarmFlow keeps that
          information consistent and easy to update.
        </p>
      </header>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Why individual records matter</h2>
            <p>
              A herd or flock is really a collection of individuals, each
              with its own history. An identifier lets you tell animals
              apart at a glance, while breed, species, and age help with
              everything from feeding plans to sale decisions.
            </p>
            <p>
              Status is the field that changes most often — an animal might
              move between healthy, sick, pregnant, sold, or deceased over
              time. Having a single place to update that status means
              everyone working the farm sees the same information.
            </p>
          </div>
          <div className="card">
            <h3 className="mt-0">What FarmFlow tracks per animal</h3>
            <ul className="benefits-list">
              <li>Name or identifier</li>
              <li>Species</li>
              <li>Breed</li>
              <li>Age</li>
              <li>Status: healthy, sick, pregnant, sold, or deceased</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Livestock records alongside the rest of the farm</h2>
          <p style={{ maxWidth: "70ch" }}>
            Livestock decisions often connect to <Link to="/crop-management">crop and pasture planning</Link>{" "}
            and generate recurring items on the <Link to="/farm-tasks">farm task list</Link>{" "}
            — feeding, health checks, moving animals between pastures.
            Keeping livestock data in the same system as crops and tasks,
            as described on the <Link to="/features">features page</Link>,
            avoids re-entering the same information twice.
          </p>
        </div>
      </section>
    </>
  );
}
