import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const name = request.nextUrl.searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json({ message: "name is required" }, { status: 400 });
  }

  const { status, data } = await backendFetch("/v1/public/models/gallery", {
    searchParams: { name },
  });

  if (status === 404) {
    return NextResponse.json(data ?? { message: "Model not found" }, { status: 404 });
  }

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: "Failed to fetch model gallery" },
      { status: status === 502 ? 502 : status },
    );
  }

  return NextResponse.json(data);
}
