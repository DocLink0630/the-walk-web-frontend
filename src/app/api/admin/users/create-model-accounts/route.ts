import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

export async function POST(request: NextRequest) {
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

  let body: { userIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !Array.isArray(body.userIds) ||
    body.userIds.length === 0 ||
    !body.userIds.every((id) => typeof id === "string" && id.trim().length > 0)
  ) {
    return NextResponse.json(
      { message: "userIds must be a non-empty array of strings" },
      { status: 400 },
    );
  }

  const userIds = body.userIds.map((id) => id.trim());

  const { status, data } = await backendFetch("/v1/users/create-model-accounts", {
    method: "POST",
    token,
    body: { userIds },
  });

  if (status !== 200 && status !== 201) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to create model accounts") },
      { status },
    );
  }

  return NextResponse.json(data);
}
