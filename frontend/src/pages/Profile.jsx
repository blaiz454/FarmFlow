import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="Profile" description="Your FarmFlow account profile." path="/profile" noindex />

      <div className="app-topbar">
        <h1 style={{ marginBottom: 0 }}>Profile</h1>
      </div>

      <div className="card" style={{ maxWidth: "30rem" }}>
        <div className="form-field">
          <label>Name</label>
          <p className="mt-0">{user?.name}</p>
        </div>
        <div className="form-field">
          <label>Email</label>
          <p className="mt-0">{user?.email}</p>
        </div>
        <p className="text-muted" style={{ fontSize: "0.88rem" }}>
          Editing your name or email isn't wired up in this learning build
          yet — the API is there (see the users collection in the backend)
          but the form isn't. A good next feature to add.
        </p>
      </div>
    </>
  );
}
