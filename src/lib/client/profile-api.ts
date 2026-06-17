import { getClientToken } from "@/lib/client/token";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getClientToken();
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

export interface ClientOwnProfile {
  id: string;
  email: string;
  status: string;
  clientProfile?: {
    fullName?: string;
  } | null;
}

export async function fetchOwnClientProfile(): Promise<ClientOwnProfile | null> {
  try {
    const res = await fetch("/api/client/profile", {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function patchOwnClientProfile(
  fullName: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/client/profile", {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ fullName }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: body?.message ?? "Update failed" };
    return { ok: true };
  } catch {
    return { ok: false, message: "Network error" };
  }
}
