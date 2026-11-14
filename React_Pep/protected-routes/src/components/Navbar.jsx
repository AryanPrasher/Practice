import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">MyApp</span>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div>
        <Link to="/profile">Profile</Link>
      </div>
      <Avatar />  {/* Avatar reads the user itself - Navbar never touches "user" */}
    </nav>
  );
}
