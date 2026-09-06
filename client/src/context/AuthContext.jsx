import { createContext, useContext, useEffect, useState } from "react";
import { api, setTokens, clearTokens } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!localStorage.getItem("accessToken")) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();

    const onExpired = () => setUser(null);
    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, []);

  const login = async (path, credentials) => {
    const response = await api.post(path, credentials);
    setTokens(response.data);
    setUser(response.data.user);
    return response.data;
  };

  const register = async credentials => {
    const response = await api.post("/auth/customer/register", credentials);
    setTokens(response.data);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      if (user) await api.post("/auth/logout");
    } catch {}
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}