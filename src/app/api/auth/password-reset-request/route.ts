import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const { status, data } = await backendFetch("/v1/auth/password-reset-request", {
    method: "POST",
    body: { email },
  });

  return NextResponse.json(
    data ?? { message: "Request failed" },
    { status: status === 200 ? 200 : status },
  );
}
