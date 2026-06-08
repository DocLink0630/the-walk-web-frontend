import { NextRequest, NextResponse } from "next/server";
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

  if (!result.user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    access_token: result.access_token ?? null,
    expires_in: result.expires_in ?? null,
    user: result.user,
  });
}
