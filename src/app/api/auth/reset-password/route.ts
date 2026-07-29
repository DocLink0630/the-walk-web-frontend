import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  let body: { token?: string; newPassword?: string };
  try {
    body = (await request.json()) as { token?: string; newPassword?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.token?.trim() || !body.newPassword) {
    return NextResponse.json(
      { message: "Reset token and new password are required" },
      { status: 400 },
    );
  }

  const { status, data } = await backendFetch("/v1/auth/reset-password", {
    method: "POST",
    body: { token: body.token.trim(), newPassword: body.newPassword },
  });

  return NextResponse.json(
    data ?? { message: "Reset failed" },
    { status: status === 200 || status === 201 ? 200 : status },
  );
}
