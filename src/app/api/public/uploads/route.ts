import { NextRequest, NextResponse } from "next/server";
import { backendApiUrl, getBackendUrl } from "@/lib/backend/url";

function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    return String((data as { message: unknown }).message);
  }
  return fallback;
}

/** Proxies POST /v1/public/uploads — returns { token } for floating files. */
export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  let body: ArrayBuffer;
  try {
    body = await request.arrayBuffer();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(backendApiUrl("/v1/public/uploads"), {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Backend unreachable";
    return NextResponse.json(
      { message: `Could not reach upload API (${detail}).` },
      { status: 502 },
    );
  }

  let responseBody: unknown;
  const responseText = await response.text();
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = { message: responseText };
    }
  } else {
    responseBody = { message: response.statusText || "Upload failed" };
  }

  if (!response.ok) {
    return NextResponse.json(
      responseBody ?? { message: errorMessage(responseBody, "Upload failed") },
      { status: response.status },
    );
  }

  return NextResponse.json(responseBody);
}
