import { NextRequest, NextResponse } from "next/server";
import { getClientBearerToken } from "@/lib/client/auth-request";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

type RouteContext = { params: Promise<{ storageFileId: string }> };


export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getClientBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { storageFileId } = await context.params;
  const { status, data } = await backendFetch(
    `/v1/users/me/media/${storageFileId}`,
    { method: "DELETE", token },
  );

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
