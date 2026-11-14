import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Welcome to My Website</h1>
      {user ? (
        <p>
          You are logged in as <strong>{user.name}</strong>. Visit the{" "}
          <Link to="/dashboard">Dashboard</Link>.
        </p>
      ) : (
        <p>
          You are logged out. Try going straight to{" "}
          <Link to="/dashboard">/dashboard</Link> – you should be redirected to{" "}
          <Link to="/login">/login</Link> first.
        </p>
      )}
    </div>
  );
}
