import type { UserRole, UserStatus } from "@/types/admin";

const SESSION_KEY = "walk_client_session";

export interface ClientSession {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  status: UserStatus;
}

export function getClientSession(): ClientSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClientSession;
  } catch {
    return null;
  }
}

export function setClientSession(session: ClientSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearClientSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function buildClientSession(user: {
  id: string;
  email: string;
  roles?: UserRole[];
  status?: UserStatus;
  clientProfile?: { fullName?: string };
}): ClientSession {
  return {
    id: user.id,
    email: user.email,
    name: user.clientProfile?.fullName ?? user.email.split("@")[0],
    roles: user.roles ?? ["CORPORATE_CLIENT"],
    status: user.status ?? "ACTIVE",
  };
}
