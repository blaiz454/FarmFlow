import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
      if (err.fields) setErrors(err.fields);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/*
        Private/auth pages are marked noindex,nofollow — there's no
        content here worth ranking, and a login form is not a page you
        want appearing in search results for the site's brand terms.
        See SEO.md > "Private page handling".
      */}
      <SEO title="Log In" description="Log in to your FarmFlow account." path="/login" noindex />

      <div className="auth-shell">
        <div className="auth-card card">
          <div className="auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          </div>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {mode === "register" && (
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
            )}
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p style={{ marginTop: "1.25rem", fontSize: "0.9rem" }}>
            <Link to="/">← Back to FarmFlow</Link>
          </p>
        </div>
      </div>
    </>
  );
}
