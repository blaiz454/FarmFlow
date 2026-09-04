import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const EMPTY_FORM = { identifier: "", species: "", breed: "", age: "", status: "healthy" };
const STATUS_OPTIONS = ["healthy", "sick", "pregnant", "sold", "deceased"];

export default function Livestock() {
  const { token } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setAnimals(await api.get("/api/livestock", token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function startEdit(animal) {
    setEditingId(animal.id);
    setForm({
      identifier: animal.identifier,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      status: animal.status,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setError("");
    try {
      if (editingId) {
        await api.put(`/api/livestock/${editingId}`, form, token);
      } else {
        await api.post("/api/livestock", form, token);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err.message);
      if (err.fields) setFieldErrors(err.fields);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this animal record?")) return;
    try {
      await api.del(`/api/livestock/${id}`, token);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <SEO title="Livestock" description="Manage your livestock records." path="/livestock" noindex />

      <div className="app-topbar">
        <h1 style={{ marginBottom: 0 }}>Livestock</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 className="mt-0">{editingId ? "Edit animal" : "Add an animal"}</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="identifier">Name / identifier</label>
              <input id="identifier" name="identifier" value={form.identifier} onChange={handleChange} required />
              {fieldErrors.identifier && <p className="form-error">{fieldErrors.identifier}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="species">Species</label>
              <input id="species" name="species" value={form.species} onChange={handleChange} required placeholder="e.g. Cattle, Sheep" />
              {fieldErrors.species && <p className="form-error">{fieldErrors.species}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="breed">Breed</label>
              <input id="breed" name="breed" value={form.breed} onChange={handleChange} required />
              {fieldErrors.breed && <p className="form-error">{fieldErrors.breed}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="age">Age (years)</label>
              <input id="age" name="age" type="number" step="0.1" value={form.age} onChange={handleChange} required />
              {fieldErrors.age && <p className="form-error">{fieldErrors.age}</p>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add animal"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p>Loading livestock…</p>
      ) : animals.length === 0 ? (
        <div className="empty-state">No animals yet. Add your first one above.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => (
                <tr key={a.id}>
                  <td>{a.identifier}</td>
                  <td>{a.species}</td>
                  <td>{a.breed}</td>
                  <td>{a.age}</td>
                  <td><span className="badge">{a.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => startEdit(a)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
