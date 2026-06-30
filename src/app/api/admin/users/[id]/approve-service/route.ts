import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { rate?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.rate?.trim()) {
    return NextResponse.json({ message: "rate is required" }, { status: 400 });
  }

  const { status, data } = await backendFetch(`/v1/users/approve-service/${id}`, {
    method: "POST",
    token,
    body: { rate: body.rate.trim() },
  });

  if (status !== 200 && status !== 201) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to approve service provider") },
      { status },
    );
  }

  return NextResponse.json(data);
}
