import type { NextRequest } from "next/server";

export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  return token || null;
}
