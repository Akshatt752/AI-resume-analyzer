import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { PageSpinner } from "./Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
