import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const APP_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/crops", label: "Crops" },
  { to: "/livestock", label: "Livestock" },
  { to: "/tasks", label: "Tasks" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await logout();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <NavLink to="/" className="brand">
          Farm<span>Flow</span>
        </NavLink>
        <nav>
          {APP_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="signout" onClick={handleSignOut}>
          {user ? `Sign out (${user.name})` : "Sign out"}
        </button>
      </aside>
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
