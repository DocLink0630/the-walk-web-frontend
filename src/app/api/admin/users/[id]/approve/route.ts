import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
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

  let body: { rate?: string; tier?: string; talents?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.rate?.trim() || !body.tier || !body.talents?.trim()) {
    return NextResponse.json(
      { message: "rate, tier, and talents are required" },
      { status: 400 },
    );
  }

  const { status, data } = await backendFetch(`/v1/users/approve/${id}`, {
    method: "POST",
    token,
    body: {
      rate: body.rate.trim(),
      tier: body.tier,
      talents: body.talents.trim(),
    },
  });

  if (status !== 200 && status !== 201) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to approve model") },
      { status },
    );
  }

  return NextResponse.json(data);
}
