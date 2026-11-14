import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <span className="logo">MyApp</span>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <Avatar />  {/* Avatar reads the user itself - Navbar never touches "user" */}
    </nav>
  );
}
