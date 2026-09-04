import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const EMPTY_FORM = {
  name: "",
  type: "",
  area: "",
  planting_date: "",
  expected_harvest_date: "",
  status: "planned",
};

const STATUS_OPTIONS = ["planned", "planted", "growing", "harvested"];

export default function Crops() {
  const { token } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setCrops(await api.get("/api/crops", token));
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

  function startEdit(crop) {
    setEditingId(crop.id);
    setForm({
      name: crop.name,
      type: crop.type,
      area: crop.area,
      planting_date: crop.planting_date,
      expected_harvest_date: crop.expected_harvest_date,
      status: crop.status,
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
        await api.put(`/api/crops/${editingId}`, form, token);
      } else {
        await api.post("/api/crops", form, token);
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
    if (!window.confirm("Delete this crop record?")) return;
    try {
      await api.del(`/api/crops/${id}`, token);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <SEO title="Crops" description="Manage your crop records." path="/crops" noindex />

      <div className="app-topbar">
        <h1 style={{ marginBottom: 0 }}>Crops</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 className="mt-0">{editingId ? "Edit crop" : "Add a crop"}</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
              {fieldErrors.name && <p className="form-error">{fieldErrors.name}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="type">Type</label>
              <input id="type" name="type" value={form.type} onChange={handleChange} required placeholder="e.g. Corn, Wheat" />
              {fieldErrors.type && <p className="form-error">{fieldErrors.type}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="area">Area (acres)</label>
              <input id="area" name="area" type="number" step="0.1" value={form.area} onChange={handleChange} required />
              {fieldErrors.area && <p className="form-error">{fieldErrors.area}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="planting_date">Planting date</label>
              <input id="planting_date" name="planting_date" type="date" value={form.planting_date} onChange={handleChange} required />
              {fieldErrors.planting_date && <p className="form-error">{fieldErrors.planting_date}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="expected_harvest_date">Expected harvest date</label>
              <input id="expected_harvest_date" name="expected_harvest_date" type="date" value={form.expected_harvest_date} onChange={handleChange} required />
              {fieldErrors.expected_harvest_date && <p className="form-error">{fieldErrors.expected_harvest_date}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add crop"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p>Loading crops…</p>
      ) : crops.length === 0 ? (
        <div className="empty-state">No crops yet. Add your first one above.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Area</th>
                <th>Planted</th>
                <th>Expected harvest</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.type}</td>
                  <td>{c.area}</td>
                  <td>{c.planting_date}</td>
                  <td>{c.expected_harvest_date}</td>
                  <td><span className="badge">{c.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => startEdit(c)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
