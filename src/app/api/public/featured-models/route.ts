import { NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function GET() {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const { status, data } = await backendFetch("/v1/public/featured-models");

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: "Failed to fetch featured models" },
      { status: status === 502 ? 502 : status },
    );
  }

  return NextResponse.json(data);
}
