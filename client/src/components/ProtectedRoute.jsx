import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader">Loading…</div>;
  if (!user) return <Navigate to={role === "ADMIN" ? "/admin/login" : "/login"} replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/application"} replace />;
  }

  return children;
}