import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  // read any previously-logged-in user from localStorage on first load,
  // so a page refresh (or closing/reopening the tab) keeps them logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// a small custom hook so every component can just call useAuth()
export const useAuth = () => useContext(AuthContext);
