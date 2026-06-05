import { backendFetch } from "@/lib/admin/backend";
import { decodeJwtPayload, isJwt } from "@/lib/admin/jwt-debug";
import type { LoginResponse } from "@/types/admin";

export interface VerifiedAdminToken {
  token: string;
  session: unknown;
}

export interface TokenVerifyFailure {
  message: string;
  status: number;
  detail?: unknown;
  tokenHint?: {
    type: "access_token" | "id_token";
    isJwt: boolean;
    iss?: string;
    aud?: string | string[];
  };
}

export async function verifyAdminTokenWithMe(
  token: string,
  label: "access_token" | "id_token",
): Promise<
  | { ok: true; session: unknown }
  | { ok: false; failure: TokenVerifyFailure }
> {
  const { status, data } = await backendFetch("/v1/auth/me", { token });

  if (status === 200) {
    return { ok: true, session: data };
  }

  const claims = decodeJwtPayload(token);
  return {
    ok: false,
    failure: {
      message:
        status === 401
          ? "The API rejected your Auth0 token on GET /v1/auth/me."
          : `Session check failed (${status}).`,
      status,
      detail: data,
      tokenHint: {
        type: label,
        isJwt: isJwt(token),
        iss: claims?.iss,
        aud: claims?.aud,
      },
    },
  };
}

export async function resolveWorkingAdminToken(
  login: LoginResponse,
): Promise<
  | { ok: true; token: string; session: unknown }
  | { ok: false; failure: TokenVerifyFailure }
> {
  const candidates: { token: string; label: "access_token" | "id_token" }[] = [];

  if (login.access_token) {
    candidates.push({ token: login.access_token, label: "access_token" });
  }
  if (login.id_token && login.id_token !== login.access_token) {
    candidates.push({ token: login.id_token, label: "id_token" });
  }

  if (candidates.length === 0) {
    return {
      ok: false,
      failure: {
        message:
          "Admin sign-in requires Auth0 authentication. Local-only login cannot access the admin dashboard.",
        status: 401,
      },
    };
  }

  let lastFailure: TokenVerifyFailure | null = null;

  for (const { token, label } of candidates) {
    const result = await verifyAdminTokenWithMe(token, label);
    if (result.ok) {
      return { ok: true, token, session: result.session };
    }
    lastFailure = result.failure;
  }

  return { ok: false, failure: lastFailure! };
}
