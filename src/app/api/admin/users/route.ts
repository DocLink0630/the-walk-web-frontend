import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/cookies";

export async function GET(request: NextRequest) {
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

  const { searchParams } = request.nextUrl;
  const roles = searchParams.get("roles");

  const { status, data } = await backendFetch("/v1/users", {
    token,
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      roles: roles ?? undefined,
    },
  });

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to fetch users") },
      { status },
    );
  }

  return NextResponse.json(data);
}
