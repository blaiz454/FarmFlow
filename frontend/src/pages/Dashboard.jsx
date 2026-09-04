import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [c, l, t] = await Promise.all([
          api.get("/api/crops", token),
          api.get("/api/livestock", token),
          api.get("/api/tasks", token),
        ]);
        if (!cancelled) {
          setCrops(c);
          setLivestock(l);
          setTasks(t);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const openTasks = tasks.filter((t) => t.status !== "complete");

  return (
    <>
      <SEO title="Dashboard" description="Your FarmFlow dashboard." path="/dashboard" noindex />

      <div className="app-topbar">
        <div>
          <h1 style={{ marginBottom: "0.2em" }}>Welcome back{user ? `, ${user.name}` : ""}</h1>
          <p className="text-muted mt-0">Here's what's on the farm right now.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading dashboard…</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="value">{crops.length}</div>
              <div className="label">Crops tracked</div>
            </div>
            <div className="stat-card">
              <div className="value">{livestock.length}</div>
              <div className="label">Animals tracked</div>
            </div>
            <div className="stat-card">
              <div className="value">{openTasks.length}</div>
              <div className="label">Open tasks</div>
            </div>
            <div className="stat-card">
              <div className="value">{tasks.length - openTasks.length}</div>
              <div className="label">Completed tasks</div>
            </div>
          </div>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div className="card">
              <h3 className="mt-0">Recent crops</h3>
              {crops.length === 0 ? (
                <p className="text-muted">No crops yet. <Link to="/crops">Add your first crop</Link>.</p>
              ) : (
                <ul className="benefits-list">
                  {crops.slice(0, 5).map((c) => (
                    <li key={c.id}>{c.name} — <span className="badge">{c.status}</span></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card">
              <h3 className="mt-0">Open tasks</h3>
              {openTasks.length === 0 ? (
                <p className="text-muted">Nothing pending. <Link to="/tasks">Add a task</Link>.</p>
              ) : (
                <ul className="benefits-list">
                  {openTasks.slice(0, 5).map((t) => (
                    <li key={t.id}>{t.title} — due {t.due_date}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
