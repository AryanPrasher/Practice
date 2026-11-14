import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <h1>This is Dashboard</h1>
      <p>Welcome, {user.name}! This page is only visible to logged-in users.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
