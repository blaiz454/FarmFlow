import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/features", label: "Features" },
  { to: "/crop-management", label: "Crop Management" },
  { to: "/livestock-management", label: "Livestock Management" },
  { to: "/farm-tasks", label: "Farm Tasks" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand">
          Farm<span>Flow</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="main-nav" className={`main-nav${open ? " open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to={isAuthenticated ? "/dashboard" : "/login"} className="btn btn-primary" onClick={() => setOpen(false)}>
            {isAuthenticated ? "Dashboard" : "Log In"}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
