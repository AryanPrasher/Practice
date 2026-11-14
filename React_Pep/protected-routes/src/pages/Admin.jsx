import { useAuth } from "../context/AuthContext";

export default function Admin() {
    const { user } = useAuth();

    return (
        <div className="page">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name} – only admins can see this page.</p>

            <button onClick={logout}>
                Logout Securely
            </button>

        </div>

    );
}