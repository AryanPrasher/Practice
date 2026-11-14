import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name, avatarUrl: "/avatars/default.png" });

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
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
