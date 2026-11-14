import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading profile details...</div>;
  }

  return (
    <div>
      <div>
        
        <div>
          <div>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email || "No email provided"}</p>
        </div>

        <div>
          <div>
            <span>Account Status: </span>
            <span>Active</span>
          </div>
          <p>
            Welcome back! This is your personal dashboard. Only logged-in users can view this page.
          </p>
        </div>

        <div>
          <button onClick={logout}>
            Logout Securely
          </button>
        </div>

      </div>
    </div>
  );
}