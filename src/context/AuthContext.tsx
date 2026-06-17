"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  buildClientSession,
  clearClientSession,
  getClientSession,
  setClientSession,
  type ClientSession,
} from "@/lib/client/session";
import { clearClientToken, getClientToken, setClientToken } from "@/lib/client/token";
import type { UserRole, UserStatus } from "@/types/admin";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  status: UserStatus;
  type: "client";
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string; isModel?: boolean; isClient?: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  isClient: boolean;
  isModel: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(session: ClientSession): User {
  return {
    id: session.id,
    email: session.email,
    name: session.name,
    roles: session.roles,
    status: session.status,
    type: "client",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session: ClientSession) => {
    setClientSession(session);
    setUser(toUser(session));
  }, []);

  useEffect(() => {
    async function restore() {
      const stored = getClientSession();
      const token = getClientToken();

      if (!stored || !token) {
        if (stored || token) {
          clearClientToken();
          clearClientSession();
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = (await res.json()) as {
            id: string;
            email: string;
            roles?: UserRole[];
            status?: ClientSession["status"];
            clientProfile?: { fullName?: string };
          };
          applySession(buildClientSession(data));
          setIsLoading(false);
          return;
        }
      } catch {
        // Clear invalid session below
      }

      clearClientToken();
      clearClientSession();
      setUser(null);
      setIsLoading(false);
    }

    void restore();
  }, [applySession]);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ ok: boolean; message?: string; isModel?: boolean; isClient?: boolean }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as {
        access_token?: string | null;
        message?: string;
        user?: {
          id: string;
          email: string;
          roles?: UserRole[];
          status?: ClientSession["status"];
          clientProfile?: { fullName?: string };
        };
      };

      if (!res.ok) {
        return {
          ok: false,
          message: data.message ?? "Invalid email or password.",
        };
      }

      if (!data.access_token || !data.user) {
        return {
          ok: false,
          message: data.message ?? "Sign-in succeeded but no session token was issued.",
        };
      }

      setClientToken(data.access_token);
      applySession(buildClientSession(data.user));
      const userIsModel = data.user.roles?.includes("MODEL") ?? false;
      const userIsClient = data.user.roles?.includes("CORPORATE_CLIENT") ?? false;
      return { ok: true, isModel: userIsModel, isClient: userIsClient };
    } catch {
      return { ok: false, message: "Unable to sign in. Please try again." };
    }
  };

  const logout = () => {
    clearClientToken();
    clearClientSession();
    setUser(null);
  };

  const isClient =
    !!user?.roles?.includes("CORPORATE_CLIENT") || user?.type === "client";

  const isModel = !!user?.roles?.includes("MODEL");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && !!getClientToken(),
        isClient,
        isModel,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
