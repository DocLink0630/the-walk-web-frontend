import { NextRequest, NextResponse } from "next/server";
import { getClientBearerToken } from "@/lib/client/auth-request";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { generateInquiryModelsPdf } from "@/lib/pdf/generate-pdf";
import type { InquiryModelsPdfData } from "@/lib/pdf/types";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getClientBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { id } = await context.params;
  const { status, data } = await backendFetch(`/v1/inquiries/${id}/export`, { token });

  if (status !== 200 || !data || typeof data !== "object") {
    return NextResponse.json(
      data ?? { message: "Failed to load inquiry export data" },
      { status: status === 200 ? 500 : status },
    );
  }

  try {
    const { buffer, filename } = await generateInquiryModelsPdf(data as InquiryModelsPdfData);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
