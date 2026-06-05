import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  backendFetch,
  errorMessage,
  getBackendUrl,
} from "@/lib/admin/backend";
import {
  ADMIN_TOKEN_COOKIE,
  adminTokenCookieOptions,
} from "@/lib/admin/cookies";
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

  if (!result.access_token) {
    return NextResponse.json(
      {
        message:
          "Admin sign-in requires Auth0 authentication. Local-only login cannot access the admin dashboard.",
      },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_TOKEN_COOKIE,
    result.access_token,
    adminTokenCookieOptions(
      result.expires_in ? result.expires_in : undefined,
    ),
  );

  return NextResponse.json({
    ok: true,
    user: result.user ?? null,
  });
}
