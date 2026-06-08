const TOKEN_KEY = "walk_client_access_token";

export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setClientToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearClientToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}
