import { useState } from "react";
import SEO from "../components/SEO";
import Breadcrumbs, { breadcrumbJsonLd } from "../components/Breadcrumbs";

const TRAIL = [{ label: "Home", path: "/" }, { label: "Contact" }];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // This is a demo form for the learning project — there is no backend
    // endpoint wired up for it yet. In a real deployment this would POST
    // to a small `/api/contact` route or a third-party form service.
    setSubmitted(true);
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Questions about FarmFlow? Get in touch using the contact form on this page."
        path="/contact"
        jsonLd={breadcrumbJsonLd(TRAIL)}
      />
      <Breadcrumbs trail={TRAIL} />

      <header className="page-head container">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lede">
          Questions about how FarmFlow tracks crops, livestock, or tasks?
          Send a message below.
        </p>
      </header>

      <section className="section">
        <div className="container" style={{ maxWidth: "34rem" }}>
          {submitted ? (
            <div className="alert alert-success">
              Thanks — your message has been noted. This demo form doesn't
              send email yet, but a real deployment would route it to the
              FarmFlow team.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Send message</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
