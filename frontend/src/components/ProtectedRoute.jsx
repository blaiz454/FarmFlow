import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps private routes. Redirects to /login (preserving where the user
 * was headed) when there's no authenticated session. Also see the
 * meta noindex,nofollow tag applied by useSEO on private pages —
 * authentication and search-engine indexing are handled by two
 * separate, complementary mechanisms, not one.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container section-tight">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
