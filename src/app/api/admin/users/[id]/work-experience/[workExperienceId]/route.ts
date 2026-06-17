import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

type RouteContext = {
  params: Promise<{ id: string; workExperienceId: string }>;
};

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

  const { id, workExperienceId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { status, data } = await backendFetch(
    `/v1/users/${id}/work-experience/${workExperienceId}`,
    { method: "PATCH", token, body },
  );

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to update work experience") },
      { status },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

  const { id, workExperienceId } = await context.params;

  const { status, data } = await backendFetch(
    `/v1/users/${id}/work-experience/${workExperienceId}`,
    { method: "DELETE", token },
  );

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to delete work experience") },
      { status },
    );
  }

  return NextResponse.json(data);
}
