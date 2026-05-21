import { useCallback, useEffect, useState, type ReactNode } from "react";
import { DirectusClient, type Me } from "../api/directus";
import { AuthContext, type AuthStatus } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<Me | null>(null);

  const loadUser = useCallback(async () => {
    const me = await DirectusClient.getInstance().getMe();
    setUser(me);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const client = DirectusClient.getInstance();
      try {
        await client.refresh();
        if (cancelled) return;
        await loadUser();
      } catch {
        if (cancelled) return;
        setUser(null);
        setStatus("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const client = DirectusClient.getInstance();
      await client.login(email, password);
      await loadUser();
    },
    [loadUser],
  );

  const logout = useCallback(async () => {
    const client = DirectusClient.getInstance();
    try {
      await client.logout();
    } finally {
      await client.setToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
