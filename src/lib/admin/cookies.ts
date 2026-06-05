import { ADMIN_TOKEN_COOKIE } from "./backend";

export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function adminTokenCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAge ?? ADMIN_COOKIE_MAX_AGE,
  };
}

export { ADMIN_TOKEN_COOKIE };
