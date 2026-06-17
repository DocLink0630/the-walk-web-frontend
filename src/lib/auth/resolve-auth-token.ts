import { backendFetch } from "@/lib/backend/fetch";
import { decodeJwtPayload, isJwt } from "@/lib/admin/jwt-debug";

export interface AuthLoginResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
}

export interface VerifiedAuthToken {
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

async function verifyTokenWithMe(
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
          ? "Your session token was rejected. Please sign in again."
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

export async function resolveWorkingAuthToken(
  login: AuthLoginResponse,
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
          "Sign-in requires Auth0 authentication. Please try again or contact support.",
        status: 401,
      },
    };
  }

  let lastFailure: TokenVerifyFailure | null = null;

  for (const { token, label } of candidates) {
    const result = await verifyTokenWithMe(token, label);
    if (result.ok) {
      return { ok: true, token, session: result.session };
    }
    lastFailure = result.failure;
  }

  return { ok: false, failure: lastFailure! };
}
