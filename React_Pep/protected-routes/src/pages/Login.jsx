import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// two fixed demo accounts, so the admin-role check can actually be tested
const DEMO_ACCOUNTS = [
  { name: "Bob", role: "user", avatarUrl: "/avatars/default.png" },
  { name: "Alice", role: "admin", avatarUrl: "/avatars/default.png" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (account) => {
    login(account);
    const redirectTo = location.state?.from?.pathname ?? "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="page">
      <h1>This is Login</h1>
      {location.state?.from && (
        <p className="hint">
          You tried to visit <code>{location.state.from.pathname}</code> – log in to continue.
        </p>
      )}
      <p>Pick a demo account:</p>
      <div className="demo-accounts">
        {DEMO_ACCOUNTS.map((account) => (
          <button key={account.name} onClick={() => handleLogin(account)}>
            Login as {account.name} ({account.role})
          </button>
        ))}
      </div>
    </div>
  );
}