const STORAGE_KEY = "admin_access_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function adminAuthHeaders(
  extra: Record<string, string> = {},
): Record<string, string> {
  const token = getAdminToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}
