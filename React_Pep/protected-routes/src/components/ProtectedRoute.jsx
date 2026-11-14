import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { user } = useAuth();       // the SAME AuthContext from Practical 1
  const location = useLocation();

  if (!user) {
    // remember where the user WANTED to go, then send them to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="page"><h1>Access denied</h1></div>;
  }

  return <Outlet />;                // user is logged in - render the real page
}
