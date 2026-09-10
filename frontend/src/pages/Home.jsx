import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { seoConfig } from "../utils/seoConfig";

export default function Home() {
  return (
    <>
      <SEO
        title={null}
        description="FarmFlow is simple farm management software for keeping crops, livestock, and daily farm tasks organized in one place — without spreadsheets or clutter."
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
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
        ]}
      />

      {/* HERO */}
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Simple farm management software</p>

          <h1>
            Manage your crops, livestock, and farm tasks in one place
          </h1>

          <p className="lede">
            FarmFlow is a simple farm management app for keeping your farm
            records organized. Track what's planted, manage livestock
            information, and stay on top of daily farm tasks without relying
            on scattered notebooks, spreadsheets, or sticky notes.
          </p>

          <div className="hero-ctas">
            <Link to="/login" className="btn btn-primary">
              Get started free
            </Link>

            <Link to="/features" className="btn btn-secondary">
              See how it works
            </Link>
          </div>
        </div>

        <div
          className="hero-rows"
          role="img"
          aria-label="Illustration of planted crop rows under the sun"
        >
          <div className="sun" />
          <div className="row" style={{ top: "20%" }} />
          <div className="row" style={{ top: "38%" }} />
          <div className="row" style={{ top: "56%" }} />
          <div className="row" style={{ top: "74%" }} />
        </div>
      </section>

      {/* WHAT IS FARM MANAGEMENT SOFTWARE */}
      <section
        className="section"
        aria-labelledby="what-is-heading"
      >
        <div className="container">
          <div className="section-head">
            <h2 id="what-is-heading">
              What is farm management software?
            </h2>

            <p>
              Farm management software helps farmers organize the information
              and everyday work involved in running a farm. Instead of
              keeping crop records, livestock information, and task lists in
              separate notebooks or spreadsheets, a farm management system
              brings those records together in one place.
            </p>

            <p>
              FarmFlow is designed around that simple idea. It gives small
              and mid-size farms a focused way to keep track of what is
              growing, what animals are on the farm, and what work needs to
              be completed.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section
        className="section section-alt"
        aria-labelledby="feature-overview-heading"
      >
        <div className="container">
          <div className="section-head">
            <h2 id="feature-overview-heading">
              Farm management in one simple system
            </h2>

            <p>
              FarmFlow focuses on the everyday records that matter most.
              Manage crops, livestock, and farm tasks from one organized
              farm management system instead of keeping information across
              different notebooks and files.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-item">
              <span className="mark">1</span>

              <h3>Crop management</h3>

              <p>
                Log what's planted where, track planting and harvest dates,
                and see crop status at a glance. Keep your crop records
                organized without digging through old notes. Read more on
                the <Link to="/crop-management">crop management page</Link>.
              </p>
            </div>

            <div className="feature-item">
              <span className="mark">2</span>

              <h3>Livestock management</h3>

              <p>
                Keep a record for every animal, including species, breed,
                age, and health status. FarmFlow keeps herd and flock
                information together so important livestock records don't
                get scattered across paper cards. See the{" "}
                <Link to="/livestock-management">
                  livestock management page
                </Link>
                .
              </p>
            </div>

            <div className="feature-item">
              <span className="mark">3</span>

              <h3>Farm task management</h3>

              <p>
                Turn the things you need to remember into an organized farm
                task list with due dates and completion status. Keep track
                of daily farm work and know what still needs to be done.
                Details on the <Link to="/farm-tasks">farm tasks page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FARM RECORD KEEPING */}
      <section
        className="section"
        aria-labelledby="record-keeping-heading"
      >
        <div className="container">
          <div className="section-head">
            <h2 id="record-keeping-heading">
              Keep your farm records organized
            </h2>

            <p>
              Good farm record keeping makes it easier to understand what is
              happening across your operation. FarmFlow gives you one place
              to record crop information, livestock details, and outstanding
              farm work.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-item">
              <h3>Know what's planted</h3>

              <p>
                Keep crop information and planting details organized so you
                can quickly see the current status of your crops.
              </p>
            </div>

            <div className="feature-item">
              <h3>Know your livestock</h3>

              <p>
                Keep important animal information together instead of
                relying on separate paper records for different animals.
              </p>
            </div>

            <div className="feature-item">
              <h3>Know what's next</h3>

              <p>
                Use farm tasks and due dates to keep track of work that
                needs attention instead of relying on memory alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="section section-alt"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container">
          <div className="section-head">
            <h2 id="how-it-works-heading">
              How FarmFlow works
            </h2>

            <p>
              Start organizing your farm records in three simple steps.
            </p>
          </div>

          <div className="how-steps">
            <div className="how-step">
              <div className="num">01</div>

              <h3>Create an account</h3>

              <p>
                Sign up with your email and start using FarmFlow without
                complicated onboarding or unnecessary setup.
              </p>
            </div>

            <div className="how-step">
              <div className="num">02</div>

              <h3>Add your farm records</h3>

              <p>
                Add your current crops, livestock, and open farm tasks.
                Getting your essential records organized takes minutes,
                not hours.
              </p>
            </div>

            <div className="how-step">
              <div className="num">03</div>

              <h3>Keep your records updated</h3>

              <p>
                Update crop, livestock, and task information as work
                happens so your farm management dashboard reflects the
                current state of your operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section
        className="section"
        aria-labelledby="who-its-for-heading"
      >
        <div className="container grid-2">
          <div>
            <h2 id="who-its-for-heading">
              Built for small and mid-size farms
            </h2>

            <p>
              FarmFlow is designed for farmers and farm operators who want a
              straightforward way to organize everyday farm information
              without adopting a complicated agricultural management
              platform.
            </p>

            <p>
              Whether you manage crops, livestock, or a combination of both,
              FarmFlow keeps the essential records and daily tasks together
              in one web application.
            </p>
          </div>

          <div className="card">
            <h3 className="mt-0">
              Focused instead of overloaded
            </h3>

            <p>
              FarmFlow intentionally focuses on practical farm
              record-keeping. It doesn't try to replace accounting
              software, equipment telemetry, or government compliance
              systems. It focuses on the everyday information that farmers
              need to keep organized.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        className="section section-alt"
        aria-labelledby="benefits-heading"
      >
        <div className="container grid-2">
          <div>
            <h2 id="benefits-heading">
              A simpler way to manage farm records
            </h2>

            <ul className="benefits-list">
              <li>
                Purpose-built records for crops, livestock, and farm tasks
                without formulas to maintain.
              </li>

              <li>
                One farm management dashboard instead of several
                disconnected spreadsheets and files.
              </li>

              <li>
                Keep your farm records private to your account and access
                them from any device with a browser.
              </li>

              <li>
                Nothing to install — FarmFlow runs as a web application.
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="mt-0">
              Organize your daily farm work
            </h3>

            <p>
              Keep your crop records, livestock information, and farm tasks
              together so you spend less time searching through notes and
              more time managing the work that matters.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>
                Ready to manage your farm in one place?
              </h2>

              <p>
                Create a free account and add your first crop, animal, or
                farm task in minutes.
              </p>
            </div>

            <Link to="/login" className="btn btn-primary">
              Get started free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}