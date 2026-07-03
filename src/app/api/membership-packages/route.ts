import { NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function GET() {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const { status, data } = await backendFetch("/membership-packages");
  return NextResponse.json(data, { status });
}
