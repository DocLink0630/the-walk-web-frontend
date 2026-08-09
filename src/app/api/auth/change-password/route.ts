import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { NextRequest, NextResponse } from "next/server";
import { getClientBearerToken } from "@/lib/client/auth-request";


export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getClientBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = (await request.json()) as { currentPassword?: string; newPassword?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json(
      { message: "Current and new password are required" },
      { status: 400 },
    );
  }

  const { status, data } = await backendFetch("/v1/auth/change-password", {
    method: "POST",
    token,
    body: {
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    },
  });

  return NextResponse.json(
    data ?? { message: "Password change failed" },
    { status: status === 200 || status === 201 ? 200 : status },
  );
}
