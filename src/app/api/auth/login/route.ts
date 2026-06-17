import { NextRequest, NextResponse } from "next/server";
import { resolveWorkingAuthToken } from "@/lib/auth/resolve-auth-token";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

interface LoginUser {
  id: string;
  email: string;
  roles?: string[];
  status?: string;
  clientProfile?: { fullName?: string };
}

interface LoginResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  user?: LoginUser;
  message?: string;
}

function loginUserFromSession(
  session: unknown,
  fallback?: LoginUser,
): LoginUser | null {
  if (session && typeof session === "object" && "id" in session && "email" in session) {
    const s = session as LoginUser;
    return {
      id: String(s.id),
      email: String(s.email),
      roles: s.roles,
      status: s.status,
      clientProfile: s.clientProfile,
    };
  }
  return fallback ?? null;
}

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
  const verified = await resolveWorkingAuthToken(result);

  if (!verified.ok) {
    const { failure } = verified;
    return NextResponse.json(
      {
        message: failure.message,
        detail: failure.detail,
        tokenHint: failure.tokenHint,
      },
      { status: failure.status === 401 ? 401 : 502 },
    );
  }

  const user = loginUserFromSession(verified.session, result.user);
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    access_token: verified.token,
    expires_in: result.expires_in ?? null,
    user,
  });
}
