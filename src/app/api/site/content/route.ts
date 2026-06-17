import { NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function GET() {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      {
        hiddenEventIds: [],
        hiddenGalleryIds: [],
        events: [],
        galleryItems: [],
        galleryOrder: [],
      },
      { status: 200 },
    );
  }

  const { status, data } = await backendFetch("/v1/public/site-content");
  return NextResponse.json(data ?? {}, { status });
}
