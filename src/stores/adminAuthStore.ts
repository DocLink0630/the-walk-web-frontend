import { create } from "zustand";
import type { AdminSession } from "@/types/admin";

interface AdminAuthState {
  session: AdminSession | null;
  isLoading: boolean;
  error: string | null;

  setError: (error: string | null) => void;
  fetchSession: () => Promise<boolean>;
  probeAdminAccess: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
}

function parseSession(data: unknown): AdminSession | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const email = typeof d.email === "string" ? d.email : null;
  const roles = Array.isArray(d.roles) ? (d.roles as AdminSession["roles"]) : [];
  const status = typeof d.status === "string" ? (d.status as AdminSession["status"]) : null;
  if (!email || !status) return null;
  return {
    email,
    roles,
    status,
    auth0UserId: typeof d.auth0UserId === "string" ? d.auth0UserId : undefined,
    internalUserId:
      typeof d.internalUserId === "string" ? d.internalUserId : undefined,
  };
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message: unknown }).message;
      if (typeof msg === "string") return msg;
      if (Array.isArray(msg)) return msg.join(", ");
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  session: null,
  isLoading: false,
  error: null,

  setError: (error) => set({ error }),

  fetchSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/admin/auth/me", { credentials: "include" });
      if (!res.ok) {
        set({ session: null, isLoading: false });
        return false;
      }
      const data = await res.json();
      const session = parseSession(data);
      set({ session, isLoading: false });
      return !!session;
    } catch {
      set({ session: null, isLoading: false });
      return false;
    }
  },

  probeAdminAccess: async () => {
    try {
      const res = await fetch("/api/admin/users?limit=1&page=1", {
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const loginRes = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const message = await parseError(
          loginRes,
          loginRes.status === 401
            ? "Invalid email or password"
            : loginRes.status === 502
              ? "Unable to reach the server"
              : "Login failed",
        );
        set({ isLoading: false, error: message });
        return false;
      }

      const hasSession = await get().fetchSession();
      if (!hasSession) {
        await fetch("/api/admin/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        set({
          isLoading: false,
          error: "Could not load your session. Please try again.",
        });
        return false;
      }

      const canAdmin = await get().probeAdminAccess();
      if (!canAdmin) {
        await get().logout();
        set({
          isLoading: false,
          error:
            "You do not have permission to access the admin dashboard.",
        });
        return false;
      }

      set({ isLoading: false, error: null });
      return true;
    } catch {
      set({
        isLoading: false,
        error: "Unable to connect to the server. Please try again.",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
    set({ session: null, error: null, isLoading: false });
  },

  reset: () => set({ session: null, error: null, isLoading: false }),
}));
