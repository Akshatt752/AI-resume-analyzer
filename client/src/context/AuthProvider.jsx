import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { AuthContext } from "./auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we've checked whether a saved token is still valid
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  // Any 401 from a protected route means the token expired: sign the user out
  useEffect(() => {
    const id = api.interceptors.response.use(undefined, (err) => {
      const isAuthRoute = err.config?.url?.startsWith("/auth/");
      if (err.response?.status === 401 && !isAuthRoute) logout();
      return Promise.reject(err);
    });
    return () => api.interceptors.response.eject(id);
  }, [logout]);

  const saveSession = useCallback(({ token, user }) => {
    localStorage.setItem("token", token);
    setUser(user);
  }, []);

  const login = useCallback(
    async (email, password) => saveSession((await api.post("/auth/login", { email, password })).data),
    [saveSession]
  );

  const register = useCallback(
    async (name, email, password) =>
      saveSession((await api.post("/auth/register", { name, email, password })).data),
    [saveSession]
  );

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
