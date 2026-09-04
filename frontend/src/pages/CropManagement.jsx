import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumbs, { breadcrumbJsonLd } from "../components/Breadcrumbs";

const TRAIL = [{ label: "Home", path: "/" }, { label: "Crop Management" }];

export default function CropManagement() {
  return (
    <>
      <SEO
        title="Crop Management Software"
        description="Track what you've planted, where, and when it's expected to be harvested. FarmFlow's crop management tools keep planting records in one searchable place."
        path="/crop-management"
        jsonLd={breadcrumbJsonLd(TRAIL)}
      />
      <Breadcrumbs trail={TRAIL} />

      <header className="page-head container">
        <p className="eyebrow">Crop management</p>
        <h1>Keep planting records in one place, not scattered notes</h1>
        <p className="lede">
          Crop management is the practice of tracking what's planted,
          where, and how it's progressing toward harvest. FarmFlow gives
          that record a permanent, searchable home.
        </p>
      </header>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>What counts as crop record-keeping</h2>
            <p>
              At a minimum, useful crop records answer four questions: what
              was planted, how much area it covers, when it went in the
              ground, and when it's expected to come out. Add a status —
              planned, planted, growing, or harvested — and you have enough
              information to plan the rest of the season around it.
            </p>
            <p>
              Without a system, this information tends to live in a mix of
              memory, paper notes, and old text messages. That works until
              a season gets busy, at which point details get missed or
              contradicted by someone else's version of events.
            </p>
          </div>
          <div className="card">
            <h3 className="mt-0">What FarmFlow tracks per crop</h3>
            <ul className="benefits-list">
              <li>Crop name and type</li>
              <li>Planted area</li>
              <li>Planting date</li>
              <li>Expected harvest date</li>
              <li>Status: planned, planted, growing, or harvested</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>How this fits with the rest of the farm</h2>
          <p style={{ maxWidth: "70ch" }}>
            Crop records rarely exist in isolation — a planting decision
            often affects <Link to="/livestock-management">grazing rotations</Link>{" "}
            or shows up as a line item on the <Link to="/farm-tasks">farm task list</Link>{" "}
            (planting day, spraying, harvest prep). Keeping all three record
            types in the same system, as covered on the{" "}
            <Link to="/features">features page</Link>, means updates to one
            don't get lost relative to the others.
          </p>
        </div>
      </section>
    </>
  );
}
