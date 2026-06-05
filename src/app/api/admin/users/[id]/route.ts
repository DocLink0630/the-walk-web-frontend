import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status) {
    return NextResponse.json({ message: "status is required" }, { status: 400 });
  }

  const { status, data } = await backendFetch(`/v1/users/${id}`, {
    method: "PATCH",
    token,
    body: { status: body.status },
  });

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to update user") },
      { status },
    );
  }

  return NextResponse.json(data);
}
