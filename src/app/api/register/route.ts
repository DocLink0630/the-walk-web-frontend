import { NextRequest, NextResponse } from "next/server";
import { backendApiUrl, getBackendUrl } from "@/lib/backend/url";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let targetUrl: string;
  try {
    targetUrl = backendApiUrl("/v1/auth/register");
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
    return NextResponse.json(
      { message: "Invalid form data" },
      { status: 400 },
    );
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
      // Registration includes images — allow longer upstream time
      signal: AbortSignal.timeout(300_000),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Backend unreachable";
    return NextResponse.json(
      {
        message: `Could not reach the registration API (${detail}). Check BACKEND_URL and that the backend is running.`,
      },
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
    responseBody = { message: response.statusText || "Unknown error" };
  }

  return NextResponse.json(responseBody, { status: response.status });
}
