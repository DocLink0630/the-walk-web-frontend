import { resolveWorkingAuthToken } from "@/lib/auth/resolve-auth-token";
import type { LoginResponse } from "@/types/admin";

export type { TokenVerifyFailure, VerifiedAuthToken } from "@/lib/auth/resolve-auth-token";

export async function resolveWorkingAdminToken(
  login: LoginResponse,
): Promise<
  | { ok: true; token: string; session: unknown }
  | { ok: false; failure: import("@/lib/auth/resolve-auth-token").TokenVerifyFailure }
> {
  return resolveWorkingAuthToken(login);
}
