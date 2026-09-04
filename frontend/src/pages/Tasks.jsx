import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const EMPTY_FORM = { title: "", description: "", due_date: "", status: "pending" };
const STATUS_OPTIONS = ["pending", "in_progress", "complete"];

export default function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setTasks(await api.get("/api/tasks", token));
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

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date,
      status: task.status,
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
        await api.put(`/api/tasks/${editingId}`, form, token);
      } else {
        await api.post("/api/tasks", form, token);
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

  async function handleComplete(id) {
    try {
      await api.patch(`/api/tasks/${id}/complete`, {}, token);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.del(`/api/tasks/${id}`, token);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <SEO title="Tasks" description="Manage your farm task list." path="/tasks" noindex />

      <div className="app-topbar">
        <h1 style={{ marginBottom: 0 }}>Farm tasks</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 className="mt-0">{editingId ? "Edit task" : "Add a task"}</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} required />
              {fieldErrors.title && <p className="form-error">{fieldErrors.title}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="due_date">Due date</label>
              <input id="due_date" name="due_date" type="date" value={form.due_date} onChange={handleChange} required />
              {fieldErrors.due_date && <p className="form-error">{fieldErrors.due_date}</p>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add task"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p>Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first one above.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.due_date}</td>
                  <td>
                    <span className={`badge ${t.status === "complete" ? "" : "badge-accent"}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {t.status !== "complete" && (
                        <button onClick={() => handleComplete(t.id)}>Mark complete</button>
                      )}
                      <button onClick={() => startEdit(t)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(t.id)}>Delete</button>
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
