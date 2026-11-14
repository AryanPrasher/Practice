import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <h1>This is Profile page</h1>
      <p>Welcome, {user.name}! This page is only visible to logged-in users.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}