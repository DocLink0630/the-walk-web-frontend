import { NextRequest, NextResponse } from "next/server";
import { resolveWorkingAdminToken } from "@/lib/admin/verify-admin-token";
import { backendFetch, getBackendUrl } from "@/lib/admin/backend";
import type { LoginResponse } from "@/types/admin";

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const { status, data } = await backendFetch("/v1/auth/login", {
    method: "POST",
    body: { email: body.email, password: body.password },
  });

  if (status !== 200 && status !== 201) {
    return NextResponse.json(
      data ?? { message: "Login failed" },
      { status: status === 502 ? 502 : status === 401 ? 401 : status },
    );
  }

  const result = data as LoginResponse;
  const verified = await resolveWorkingAdminToken(result);

  if (!verified.ok) {
    const { failure } = verified;
    return NextResponse.json(
      {
        message: failure.message,
        detail: failure.detail,
        tokenHint: failure.tokenHint,
        hint:
          "Backend must validate the Auth0 token on GET /v1/auth/me. Ask dev to align AUTH0_AUDIENCE and AUTH0_ISSUER_BASE_URL (trailing slash) with the token iss/aud.",
      },
      { status: failure.status === 401 ? 401 : 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    access_token: verified.token,
    expires_in: result.expires_in ?? null,
    session: verified.session,
    user: result.user ?? null,
  });
}
