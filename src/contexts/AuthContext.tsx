import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { account } from "@/integrations/appwrite/client";
import { ID } from "appwrite";
import type { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then((u) => { setUser(u); setLoading(false); })
      .catch(() => { setUser(null); setLoading(false); });
  }, []);

  const signIn = async (email: string, password: string) => {
    // Delete any existing session first to prevent "session already active" error
    try { await account.deleteSession("current"); } catch { /* no active session, ok */ }
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name || undefined);
    try { await account.deleteSession("current"); } catch { /* no active session, ok */ }
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
  };

  const signOut = async () => {
    try { await account.deleteSession("current"); } catch { /* session already gone */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
