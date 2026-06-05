import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookies";

export async function GET() {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { status, data } = await backendFetch("/v1/auth/me", { token });

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to fetch session") },
      { status },
    );
  }

  return NextResponse.json(data);
}
