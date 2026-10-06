import { NextRequest, NextResponse } from "next/server";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/backend/fetch";

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  let body: { email?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.email || typeof body.email !== "string") {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const { status, data } = await backendFetch("/v1/auth/check-email", {
    method: "POST",
    body: {
      email: body.email.trim(),
      ...(body.role ? { role: body.role } : {}),
    },
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Unable to check email availability") },
      { status: status === 502 ? 502 : status },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
