import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

type RouteContext = { params: Promise<{ id: string; storageFileId: string }> };

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

  const { id, storageFileId } = await context.params;

  const { status, data } = await backendFetch(
    `/v1/users/${id}/media/${storageFileId}`,
    { method: "DELETE", token },
  );

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to delete media") },
      { status },
    );
  }

  return NextResponse.json(data);
}
