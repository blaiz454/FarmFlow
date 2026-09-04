import SEO from "../components/SEO";

export default function Settings() {
  return (
    <>
      <SEO title="Settings" description="Your FarmFlow account settings." path="/settings" noindex />

      <div className="app-topbar">
        <h1 style={{ marginBottom: 0 }}>Settings</h1>
      </div>

      <div className="card" style={{ maxWidth: "30rem" }}>
        <h3 className="mt-0">Account settings</h3>
        <p className="text-muted">
          This is a placeholder settings screen for the learning project —
          a real deployment would add things like password change,
          notification preferences, or unit preferences (acres vs.
          hectares) here.
        </p>
      </div>
    </>
  );
}
