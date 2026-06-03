import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/* Guards authenticated routes. Redirects to /join (remembering where the user
   was headed) when not logged in. Waits out the auth-restore loading state. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-bg">
        <div className="w-9 h-9 rounded-full border-2 border-border border-t-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/join" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
