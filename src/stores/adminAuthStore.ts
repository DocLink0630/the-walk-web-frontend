import { create } from "zustand";
import {
  adminAuthHeaders,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/admin/token";
import type { AdminSession } from "@/types/admin";

interface AdminAuthState {
  token: string | null;
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
  token: typeof window !== "undefined" ? getAdminToken() : null,
  session: null,
  isLoading: false,
  error: null,

  setError: (error) => set({ error }),

  fetchSession: async () => {
    const token = getAdminToken();
    if (!token) {
      set({ session: null, token: null, isLoading: false });
      return false;
    }

    set({ isLoading: true, error: null, token });
    try {
      const res = await fetch("/api/admin/auth/me", {
        headers: adminAuthHeaders(),
      });
      if (!res.ok) {
        set({ session: null, token: null, isLoading: false });
        return false;
      }
      const data = await res.json();
      const session = parseSession(data);
      set({ session, token, isLoading: false });
      return !!session;
    } catch {
      set({ session: null, token: null, isLoading: false });
      return false;
    }
  },

  probeAdminAccess: async () => {
    try {
      const res = await fetch("/api/admin/users?limit=1&page=1", {
        headers: adminAuthHeaders(),
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
        body: JSON.stringify({ email, password }),
      });

      const loginData = (await loginRes.json()) as {
        access_token?: string;
        session?: unknown;
        hint?: string;
        message?: string;
        tokenHint?: { iss?: string; aud?: string | string[] };
      };

      if (!loginRes.ok) {
        let message =
          typeof loginData.message === "string"
            ? loginData.message
            : loginRes.status === 401
              ? "Invalid email or password"
              : loginRes.status === 502
                ? "Unable to reach the server"
                : "Login failed";
        if (loginData.tokenHint?.iss || loginData.tokenHint?.aud) {
          message += ` Token iss: ${loginData.tokenHint.iss ?? "—"}, aud: ${JSON.stringify(loginData.tokenHint.aud ?? "—")}.`;
        }
        if (loginData.hint) message += ` ${loginData.hint}`;
        set({ isLoading: false, error: message });
        return false;
      }

      if (!loginData.access_token) {
        set({
          isLoading: false,
          error: "Login succeeded but no access token was returned.",
        });
        return false;
      }

      setAdminToken(loginData.access_token);
      set({ token: loginData.access_token });

      let session = loginData.session ? parseSession(loginData.session) : null;
      if (!session) {
        const hasSession = await get().fetchSession();
        if (!hasSession) {
          clearAdminToken();
          const meMessage = await parseError(
            await fetch("/api/admin/auth/me", {
              headers: adminAuthHeaders(),
            }),
            "Could not load your session.",
          );
          set({
            token: null,
            isLoading: false,
            error: meMessage,
          });
          return false;
        }
        session = get().session;
      } else {
        set({ session, isLoading: false });
      }

      if (!session) {
        clearAdminToken();
        set({
          token: null,
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
          error: "You do not have permission to access the admin dashboard.",
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
    clearAdminToken();
    set({ session: null, token: null, error: null, isLoading: false });
  },

  reset: () => {
    clearAdminToken();
    set({ session: null, token: null, error: null, isLoading: false });
  },
}));
